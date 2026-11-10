import { mockChats } from '../data/mockChats';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export const chatService = {
  async getConversations(userId) {
    await delay(150);
    return mockChats.filter((c) => c.participants.includes(userId));
  },

  async getMessages(conversationId) {
    await delay(100);
    return mockChats.find((c) => c.id === conversationId)?.messages ?? [];
  },

  async sendMessage(conversationId, senderId, text) {
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
    const conv = mockChats.find((c) => c.id === conversationId);
    if (!conv) return;
    conv.messages.forEach((m) => { if (m.senderId !== userId) m.read = true; });
  },

  // No-op in mock mode — no realtime needed
  subscribeToConversation(_conversationId, _onNewMessage) {
    return () => {};
  },
};
