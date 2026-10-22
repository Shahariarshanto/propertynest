import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { chatService } from '../services/chatService';
import { useAuth } from './AuthContext';

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState({}); // { [convId]: Message[] }
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  // Load conversations when user logs in
  useEffect(() => {
    if (!currentUser) {
      setConversations([]);
      setMessages({});
      setActiveConvId(null);
      return;
    }
    chatService.getConversations(currentUser.id).then(setConversations);
  }, [currentUser]);

  // Load messages when active conversation changes
  useEffect(() => {
    if (!activeConvId) return;
    if (!messages[activeConvId]) {
      chatService.getMessages(activeConvId).then((msgs) => {
        setMessages((prev) => ({ ...prev, [activeConvId]: msgs }));
      });
    }
    // Mark as read
    if (currentUser) chatService.markRead(activeConvId, currentUser.id);

    // Subscribe to realtime messages (Supabase Realtime)
    const unsubscribe = chatService.subscribeToConversation(activeConvId, (newMsg) => {
      setMessages((prev) => {
        const list = prev[activeConvId] || [];
        if (list.some((m) => m.id === newMsg.id)) return prev;
        return {
          ...prev,
          [activeConvId]: [...list, newMsg],
        };
      });
    });

    return () => unsubscribe();
  }, [activeConvId]); // eslint-disable-line react-hooks/exhaustive-deps

  const startChat = useCallback(
    async (ownerId, propertyId, propertyTitle) => {
      if (!currentUser) return;
      setChatLoading(true);
      try {
        const conv = await chatService.startConversation(
          currentUser.id,
          ownerId,
          propertyId,
          propertyTitle
        );
        setConversations((prev) =>
          prev.find((c) => c.id === conv.id) ? prev : [conv, ...prev]
        );
        setActiveConvId(conv.id);
        setIsChatOpen(true);
        const msgs = await chatService.getMessages(conv.id);
        setMessages((prev) => ({ ...prev, [conv.id]: msgs }));
      } finally {
        setChatLoading(false);
      }
    },
    [currentUser]
  );

  const sendMessage = useCallback(
    async (text) => {
      if (!activeConvId || !currentUser || !text.trim()) return;
      const msg = await chatService.sendMessage(activeConvId, currentUser.id, text);
      setMessages((prev) => ({
        ...prev,
        [activeConvId]: [...(prev[activeConvId] ?? []), msg],
      }));
      // Update last message in conversation list
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConvId ? { ...c, lastMessage: msg } : c
        )
      );
    },
    [activeConvId, currentUser]
  );

  const unreadCount = conversations.reduce((acc, c) => {
    const msgs = messages[c.id] ?? [];
    return acc + msgs.filter((m) => !m.read && m.senderId !== currentUser?.id).length;
  }, 0);

  const openChat = useCallback((convId) => {
    setActiveConvId(convId);
    setIsChatOpen(true);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConvId,
        setActiveConvId,
        messages,
        startChat,
        sendMessage,
        isChatOpen,
        setIsChatOpen,
        chatLoading,
        unreadCount,
        openChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
};
