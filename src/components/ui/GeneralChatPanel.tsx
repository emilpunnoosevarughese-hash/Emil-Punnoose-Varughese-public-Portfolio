import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageCircle, Settings, Check } from 'lucide-react';

interface GeneralChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  senderName: string;
  senderColor: string;
  content: string;
  timestamp: Date;
  isSelf?: boolean;
}

const AVATAR_COLORS = [
  { id: 'blue', value: 'bg-blue-500' },
  { id: 'cyan', value: 'bg-cyan-500' },
  { id: 'sky', value: 'bg-sky-500' },
  { id: 'primary', value: 'bg-primary' },
  { id: 'success', value: 'bg-success' },
  { id: 'emerald', value: 'bg-emerald-500' },
  { id: 'teal', value: 'bg-teal-500' },
  { id: 'purple', value: 'bg-purple-500' },
  { id: 'violet', value: 'bg-violet-500' },
  { id: 'fuchsia', value: 'bg-fuchsia-500' },
  { id: 'pink', value: 'bg-pink-500' },
  { id: 'rose', value: 'bg-rose-500' },
  { id: 'orange', value: 'bg-orange-500' },
  { id: 'amber', value: 'bg-amber-500' },
  { id: 'yellow', value: 'bg-yellow-500' },
  { id: 'red', value: 'bg-red-500' },
];

const INITIAL_MESSAGES: ChatMessage[] = [
  { id: '1', senderName: 'Emil', senderColor: 'bg-primary', content: 'Welcome to the #general chat!', timestamp: new Date(Date.now() - 3600000) },
  { id: '2', senderName: 'Zain', senderColor: 'bg-blue-500', content: 'Awesome portfolio design! 🔥', timestamp: new Date(Date.now() - 1800000) },
  { id: '3', senderName: 'Sarah', senderColor: 'bg-purple-500', content: 'Love the new dark mode toggle.', timestamp: new Date(Date.now() - 600000) },
];

export function GeneralChatPanel({ isOpen, onClose }: GeneralChatPanelProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'profile'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [userName, setUserName] = useState('Guest');
  const [userColor, setUserColor] = useState('bg-blue-500');
  const [activeUsersCount, setActiveUsersCount] = useState(12);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load profile from local storage
  useEffect(() => {
    const savedName = localStorage.getItem('chat_user_name');
    const savedColor = localStorage.getItem('chat_user_color');
    if (savedName) setUserName(savedName);
    if (savedColor) setUserColor(savedColor);

    // Simulate active users fluctuating
    const interval = setInterval(() => {
      setActiveUsersCount(prev => {
        const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        return Math.max(5, Math.min(25, prev + change));
      });
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Save profile
  const saveProfile = (name: string, color: string) => {
    setUserName(name);
    setUserColor(color);
    localStorage.setItem('chat_user_name', name);
    localStorage.setItem('chat_user_color', color);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && activeTab === 'chat') {
      scrollToBottom();
    }
  }, [messages, isOpen, activeTab]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderName: userName,
      senderColor: userColor,
      content: inputValue.trim(),
      timestamp: new Date(),
      isSelf: true
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');

    // Simulate a reply occasionally
    if (Math.random() > 0.5) {
      setTimeout(() => {
        const replyMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          senderName: 'Visitor_' + Math.floor(Math.random() * 1000),
          senderColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)].value,
          content: ['Cool!', 'I agree', 'Nice one', 'Haha 😄', 'That makes sense'][Math.floor(Math.random() * 5)],
          timestamp: new Date()
        };
        setMessages(prev => [...prev, replyMessage]);
      }, 2000 + Math.random() * 2000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Transparent Overlay for click-outside */}
          <div
            className="fixed inset-0 z-[100]"
            onClick={onClose}
          />

          {/* Small Box Panel */}
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute top-[120%] right-0 w-[calc(100vw-2rem)] sm:w-[380px] h-[500px] max-h-[75vh] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.5)] z-[101] flex flex-col overflow-hidden glass-effect"
          >
            {/* Header */}
            <div className="h-16 border-b border-[var(--color-border)] px-4 flex items-center justify-between shrink-0 bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="font-bold text-[var(--color-text-primary)] text-sm">#general</h2>
                  <div className="flex items-center text-[10px] text-[var(--color-text-muted)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse mr-1.5" />
                    {activeUsersCount} online now
                  </div>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-[var(--color-text-muted)] hover:text-white rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[var(--color-border)] shrink-0">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
                  activeTab === 'chat' ? 'text-primary border-b-2 border-primary' : 'text-[var(--color-text-muted)] hover:text-white'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                Live Chat
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
                  activeTab === 'profile' ? 'text-primary border-b-2 border-primary' : 'text-[var(--color-text-muted)] hover:text-white'
                }`}
              >
                <Settings className="w-4 h-4" />
                Profile
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden relative">
              
              {/* CHAT TAB */}
              <AnimatePresence mode="wait">
                {activeTab === 'chat' && (
                  <motion.div 
                    key="chat"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="absolute inset-0 flex flex-col"
                  >
                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                      {messages.map((msg) => (
                        <div key={msg.id} className={`flex gap-3 ${msg.isSelf ? 'flex-row-reverse' : ''}`}>
                          <div className={`w-8 h-8 rounded-full ${msg.senderColor} shrink-0 flex items-center justify-center text-white font-bold text-xs shadow-md`}>
                            {msg.senderName.charAt(0).toUpperCase()}
                          </div>
                          <div className={`flex flex-col ${msg.isSelf ? 'items-end' : 'items-start'} max-w-[75%]`}>
                            <div className="flex items-baseline gap-2 mb-1">
                              <span className="text-xs font-bold text-[var(--color-text-primary)]">{msg.senderName}</span>
                              <span className="text-[9px] text-[var(--color-text-muted)]">
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <div className={`p-3 rounded-2xl text-sm shadow-sm ${
                              msg.isSelf 
                                ? 'bg-primary text-white rounded-tr-none' 
                                : 'bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-tl-none'
                            }`}>
                              {msg.content}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
                      <form onSubmit={handleSend} className="relative">
                        <input
                          type="text"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder="Type a message..."
                          className="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-full pl-4 pr-12 py-3 focus:outline-none focus:border-primary transition-colors text-sm"
                        />
                        <button
                          type="submit"
                          disabled={!inputValue.trim()}
                          className="absolute right-1.5 top-1.5 bottom-1.5 w-9 bg-primary text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/80 transition-colors shadow-md"
                        >
                          <Send className="w-4 h-4 ml-0.5" />
                        </button>
                      </form>
                    </div>
                  </motion.div>
                )}

                {/* PROFILE TAB */}
                {activeTab === 'profile' && (
                  <motion.div 
                    key="profile"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="absolute inset-0 overflow-y-auto p-6"
                  >
                    <div className="flex flex-col items-center mb-8">
                      <div className="relative mb-4">
                        <div className={`w-24 h-24 rounded-full ${userColor} flex items-center justify-center text-white font-black text-3xl shadow-xl border-4 border-[var(--color-surface)] ring-2 ring-[var(--color-border)]`}>
                          {userName ? userName.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div className="absolute bottom-0 right-0 w-6 h-6 bg-success rounded-full border-2 border-[var(--color-surface)]" />
                      </div>
                      <h3 className="text-xl font-bold text-[var(--color-text-primary)]">{userName}</h3>
                      <p className="text-xs text-[var(--color-text-muted)]">Active in #general</p>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
                          Display Name
                        </label>
                        <input
                          type="text"
                          value={userName}
                          onChange={(e) => saveProfile(e.target.value, userColor)}
                          className="w-full bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-sm"
                          maxLength={20}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
                          Avatar Accent Color
                        </label>
                        <div className="grid grid-cols-4 gap-3">
                          {AVATAR_COLORS.map((color) => (
                            <button
                              key={color.id}
                              onClick={() => saveProfile(userName, color.value)}
                              className={`aspect-square rounded-xl ${color.value} flex items-center justify-center transition-all ${
                                userColor === color.value ? 'ring-2 ring-offset-2 ring-offset-[var(--color-surface)] ring-primary scale-110' : 'hover:scale-105 opacity-80 hover:opacity-100'
                              }`}
                            >
                              {userColor === color.value && <Check className="w-5 h-5 text-white drop-shadow-md" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
