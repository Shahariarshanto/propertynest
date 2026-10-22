import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockChats } from '../data/mockChats';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export const chatService = {
  async getConversations(userId) {
    if (isSupabaseConfigured && userId) {
      try {
        const { data: participations, error: partErr } = await supabase
          .from('conversation_participants')
          .select('conversation_id')
          .eq('user_id', userId);

        if (partErr) throw partErr;
        const convIds = (participations || []).map((p) => p.conversation_id);

        if (convIds.length === 0) return [];

        const { data: convs, error: convErr } = await supabase
          .from('conversations')
          .select(`
            id,
            property_id,
            properties (
              title
            ),
            conversation_participants (
              user_id
            )
          `)
          .in('id', convIds);

        if (convErr) throw convErr;

        return (convs || []).map((c) => ({
          id: c.id,
          propertyId: c.property_id,
          propertyTitle: c.properties?.title || 'Property',
          participants: (c.conversation_participants || []).map((cp) => cp.user_id),
        }));
      } catch (err) {
        console.warn('Supabase getConversations error:', err);
      }
    }

    await delay(150);
    return mockChats.filter((c) => c.participants.includes(userId));
  },

  async getMessages(conversationId) {
    if (isSupabaseConfigured && conversationId) {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        return (data || []).map((m) => ({
          id: m.id,
          senderId: m.sender_id,
          text: m.text,
          timestamp: m.created_at,
          read: m.is_read,
        }));
      } catch (err) {
        console.warn('Supabase getMessages error:', err);
      }
    }

    await delay(100);
    return mockChats.find((c) => c.id === conversationId)?.messages ?? [];
  },

  async sendMessage(conversationId, senderId, text) {
    if (isSupabaseConfigured && conversationId) {
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            conversation_id: conversationId,
            sender_id: senderId,
            text: text.trim(),
            is_read: false,
          },
        ])
        .select()
        .single();

      if (error) throw new Error(error.message);
      return {
        id: data.id,
        senderId: data.sender_id,
        text: data.text,
        timestamp: data.created_at,
        read: data.is_read,
      };
    }

    await delay(150);
    const conv = mockChats.find((c) => c.id === conversationId);
    if (!conv) throw new Error('Conversation not found');
    const msg = {
      id: `m_${Date.now()}`,
      senderId,
      text: text.trim(),
      timestamp: new Date().toISOString(),
      read: false,
    };
    conv.messages.push(msg);
    return msg;
  },

  async startConversation(renterId, ownerId, propertyId, propertyTitle) {
    if (isSupabaseConfigured && renterId && ownerId) {
      try {
        // Check existing
        const { data: existingConvs } = await supabase
          .from('conversations')
          .select(`
            id,
            property_id,
            conversation_participants (user_id)
          `)
          .eq('property_id', propertyId);

        const match = existingConvs?.find((c) => {
          const uids = c.conversation_participants.map((p) => p.user_id);
          return uids.includes(renterId) && uids.includes(ownerId);
        });

        if (match) {
          return {
            id: match.id,
            propertyId,
            propertyTitle,
            participants: [renterId, ownerId],
          };
        }

        // Create new conversation
        const { data: newConv, error: createErr } = await supabase
          .from('conversations')
          .insert([{ property_id: propertyId }])
          .select()
          .single();

        if (createErr) throw createErr;

        // Add participants
        await supabase.from('conversation_participants').insert([
          { conversation_id: newConv.id, user_id: renterId },
          { conversation_id: newConv.id, user_id: ownerId },
        ]);

        return {
          id: newConv.id,
          propertyId,
          propertyTitle,
          participants: [renterId, ownerId],
        };
      } catch (err) {
        console.warn('Supabase startConversation error:', err);
      }
    }

    await delay(150);
    const existing = mockChats.find(
      (c) =>
        c.propertyId === propertyId &&
        c.participants.includes(renterId) &&
        c.participants.includes(ownerId)
    );
    if (existing) return existing;
    const newConv = {
      id: `c_${Date.now()}`,
      propertyId,
      propertyTitle,
      participants: [renterId, ownerId],
      messages: [],
    };
    mockChats.push(newConv);
    return newConv;
  },

  async markRead(conversationId, userId) {
    if (isSupabaseConfigured && conversationId) {
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', userId);
      return;
    }

    const conv = mockChats.find((c) => c.id === conversationId);
    if (!conv) return;
    conv.messages.forEach((m) => {
      if (m.senderId !== userId) m.read = true;
    });
  },

  // Realtime subscription helper
  subscribeToConversation(conversationId, onNewMessage) {
    if (!isSupabaseConfigured || !conversationId) return () => {};

    const channel = supabase
      .channel(`chat_${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const m = payload.new;
          onNewMessage({
            id: m.id,
            senderId: m.sender_id,
            text: m.text,
            timestamp: m.created_at,
            read: m.is_read,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
};
