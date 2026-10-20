import React, { useState, useEffect } from 'react';
import { useDB, getItems, putItem } from '../hooks/useDB';
import { Send, Search, MoreVertical, Phone, Video, UserPlus } from 'lucide-react';
import { cn } from '../../utils/cn';

const ChatWindow = ({ activeChat, onBack }: { activeChat: any, onBack: () => void }) => {
  const db = useDB();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const loadMessages = async () => {
      if (!db || !activeChat) return;
      const allMessages = await getItems(db, 'messages');
      const chatMessages = allMessages.filter(m => m.conversationId === activeChat.id);
      setMessages(chatMessages.sort((a, b) => a.timestamp - b.timestamp));
    };
    loadMessages();
  }, [db, activeChat]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !db || !activeChat) return;

    const newMsg = {
      id: `m${Date.now()}`,
      conversationId: activeChat.id,
      senderId: 'u1', // Mock current user
      content: message,
      timestamp: Date.now(),
    };

    await putItem(db, 'messages', newMsg);
    setMessage('');
    // In a real app, we'd trigger a re-fetch or update state
    const all = await getItems(db, 'messages');
    setMessages(all.filter(m => m.conversationId === activeChat.id).sort((a, b) => a.timestamp - b.timestamp));
  };

  return (
    <div className="flex flex-col h-full">
      <header className="h-16 bg-veyra-charcoal border-b border-white/10 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="md:hidden p-2 hover:bg-white/5 rounded-full text-veyra-textMuted">
            ←
          </button>
          <div className="w-10 h-10 rounded-full bg-veyra-accentBlue overflow-hidden">
            <img src={activeChat.avatar} alt={activeChat.name} />
          </div>
          <div>
            <h3 className="font-bold text-sm">{activeChat.name}</h3>
            <span className="text-[10px] text-green-500 font-medium">Online (Local)</span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-veyra-textMuted">
          <button className="p-2 hover:bg-white/5 rounded-full"><Phone size={18} /></button>
          <button className="p-2 hover:bg-white/5 rounded-full"><Video size={18} /></button>
          <button className="p-2 hover:bg-white/5 rounded-full"><MoreVertical size={18} /></button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black/20">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-veyra-textMuted text-sm italic">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map(m => (
            <div key={m.id} className={cn("flex flex-col max-w-[80%]", m.senderId === 'u1' ? "ml-auto items-end" : "mr-auto items-start")}>
              <div className={cn(
                "px-4 py-2 rounded-2xl text-sm",
                m.senderId === 'u1' ? "bg-veyra-accentBlue text-white rounded-tr-none" : "glass-panel text-white rounded-tl-none"
              )}>
                {m.content}
              </div>
              <span className="text-[10px] text-veyra-textMuted mt-1">
                {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))
        )}
      </div>

      <form onSubmit={sendMessage} className="p-4 bg-veyra-charcoal border-t border-white/10 flex gap-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-veyra-darkgray border border-white/10 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-veyra-accentBlue"
        />
        <button type="submit" className="bg-veyra-accentBlue p-2 rounded-full text-white hover:bg-blue-600 transition-colors">
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export const Messaging = () => {
  const [activeChat, setActiveChat] = useState<any>(null);
  const demoChats = [
    { id: 'c1', name: 'Sarah Sky', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
    { id: 'c2', name: 'Mike Beats', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike' },
  ];

  return (
    <div className="h-full flex overflow-hidden bg-veyra-black">
      <div className={cn("w-full md:w-80 border-r border-white/10 flex flex-col", activeChat && "hidden md:flex")}>
        <div className="p-4 border-b border-white/10">
          <h1 className="text-2xl font-bold mb-4">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-veyra-textMuted" size={16} />
            <input
              type="text"
              placeholder="Search chats..."
              className="w-full bg-veyra-darkgray border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {demoChats.map(chat => (
            <div
              key={chat.id}
              onClick={() => setActiveChat(chat)}
              className={cn(
                "p-4 flex items-center gap-3 cursor-pointer transition-colors",
                activeChat?.id === chat.id ? "bg-veyra-accentBlue/20 border-r-4 border-veyra-accentBlue" : "hover:bg-white/5"
              )}
            >
              <div className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden shrink-0">
                <img src={chat.avatar} alt={chat.name} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-sm truncate">{chat.name}</span>
                  <span className="text-[10px] text-veyra-textMuted">12:45 PM</span>
                </div>
                <p className="text-xs text-veyra-textMuted truncate">Hey! How is Veyra going?</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={cn("flex-1", !activeChat && "hidden md:flex")}>
        {activeChat ? (
          <ChatWindow activeChat={activeChat} onBack={() => setActiveChat(null)} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-veyra-textMuted p-8 text-center">
            <MessageSquare size={64} className="mb-4 opacity-20" />
            <h2 className="text-xl font-bold mb-2">Your Messages</h2>
            <p className="text-sm max-w-xs">Select a conversation from the left to start chatting locally.</p>
          </div>
        )}
      </div>
    </div>
  );
};

function MessageSquare({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>;
}
