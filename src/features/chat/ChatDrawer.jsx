import { useState, useRef, useEffect } from 'react';
import { Drawer } from '../../components/Drawer';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { propertyService } from '../../services/propertyService';
import { Send, ArrowLeft, MessageSquare } from 'lucide-react';
import { mockProperties } from '../../data/mockProperties';

/** Find property title from id */
const getPropTitle = (propId) => mockProperties.find(p => p.id === propId)?.title ?? 'Property';

export function ChatDrawer() {
  const { isChatOpen, setIsChatOpen, conversations, activeConvId, setActiveConvId,
    messages, sendMessage } = useChat();
  const { currentUser } = useAuth();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeConvId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    await sendMessage(input);
    setInput('');
  };

  const activeConv = conversations.find(c => c.id === activeConvId);
  const activeMessages = activeConvId ? (messages[activeConvId] ?? []) : [];
  const otherUserId = activeConv?.participants?.find(id => id !== currentUser?.id);
  const otherUser = otherUserId ? userService.getUserById(otherUserId) : null;

  return (
    <Drawer
      isOpen={isChatOpen}
      onClose={() => setIsChatOpen(false)}
      title={activeConvId ? (
        <div className="flex items-center gap-2">
          <button onClick={() => setActiveConvId(null)} className="p-1 rounded-lg hover:bg-gray-100">
            <ArrowLeft size={16} />
          </button>
          <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-xs font-bold text-brand-700">
            {otherUser?.name?.charAt(0) ?? '?'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{otherUser?.name ?? 'User'}</p>
            <p className="text-xs text-gray-400 truncate">{getPropTitle(activeConv?.propertyId)}</p>
          </div>
        </div>
      ) : '💬 Messages'}
      side="right"
      width="w-full sm:w-96"
    >
      {!activeConvId ? (
        // Conversation list
        <div className="flex flex-col h-full">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <MessageSquare size={48} className="text-gray-200 mb-4" />
              <p className="text-gray-500 font-medium">No conversations yet</p>
              <p className="text-xs text-gray-400 mt-1">Start a chat from any property page</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {conversations.map(conv => {
                const otherUid = conv.participants.find(id => id !== currentUser?.id);
                const other = otherUid ? userService.getUserById(otherUid) : null;
                const convMsgs = messages[conv.id] ?? [];
                const lastMsg = convMsgs[convMsgs.length - 1];
                const unread = convMsgs.filter(m => !m.read && m.senderId !== currentUser?.id).length;

                return (
                  <button key={conv.id}
                    onClick={() => setActiveConvId(conv.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left">
                    <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center font-bold text-brand-700 text-sm flex-shrink-0">
                      {other?.name?.charAt(0) ?? '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-800 truncate">{other?.name ?? 'User'}</p>
                        {unread > 0 && (
                          <span className="flex-shrink-0 ml-2 w-5 h-5 bg-brand-500 text-white text-xs rounded-full flex items-center justify-center">{unread}</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 truncate">{getPropTitle(conv.propertyId)}</p>
                      {lastMsg && (
                        <p className="text-xs text-gray-500 truncate mt-0.5">{lastMsg.text}</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        // Message thread
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {activeMessages.length === 0 && (
              <p className="text-center text-xs text-gray-400 py-8">No messages yet. Say hello! 👋</p>
            )}
            {activeMessages.map(msg => {
              const isMe = msg.senderId === currentUser?.id;
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  {!isMe && (
                    <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 mr-2 flex-shrink-0 self-end">
                      {otherUser?.name?.charAt(0) ?? '?'}
                    </div>
                  )}
                  <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                    isMe
                      ? 'bg-brand-500 text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                  }`}>
                    <p>{msg.text}</p>
                    <p className={`text-[10px] mt-1 ${isMe ? 'text-brand-100' : 'text-gray-400'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="flex items-center gap-2 px-4 py-3 border-t border-gray-100 flex-shrink-0">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
            <button type="submit" disabled={!input.trim()}
              className="p-2.5 bg-brand-500 text-white rounded-xl hover:bg-brand-600 disabled:opacity-40 transition-all">
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </Drawer>
  );
}
