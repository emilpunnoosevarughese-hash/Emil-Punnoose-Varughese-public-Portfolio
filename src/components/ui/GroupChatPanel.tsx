import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, MessageCircle, Hash, Smile } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const MEMBERS = [
  { id: 1, name: 'Emil', avatar: '/logo.png', role: 'Admin', status: 'online' },
  { id: 2, name: 'Alex Dev', avatar: '', role: 'Member', status: 'online' },
  { id: 3, name: 'Sara UI', avatar: '', role: 'Member', status: 'idle' },
  { id: 4, name: 'John QA', avatar: '', role: 'Member', status: 'offline' },
];

const INIT_MESSAGES = [
  { id: 1, userId: 2, name: 'Alex Dev', text: 'Hey team! Great work on the new portfolio design 🔥', time: '9:10 AM' },
  { id: 2, userId: 3, name: 'Sara UI', text: 'The neumorphic navbar looks insane!', time: '9:12 AM' },
  { id: 3, userId: 1, name: 'Emil', text: 'Thanks! Working on more updates soon 🚀', time: '9:15 AM' },
];

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function getStatusColor(status: string) {
  if (status === 'online') return 'bg-green-500';
  if (status === 'idle') return 'bg-yellow-400';
  return 'bg-gray-400';
}

function getAvatarColor(id: number) {
  const colors = ['from-violet-500 to-purple-600', 'from-blue-500 to-cyan-500', 'from-rose-500 to-pink-500', 'from-emerald-500 to-teal-500'];
  return colors[id % colors.length];
}

export function GroupChatPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INIT_MESSAGES);
  const [input, setInput] = useState('');
  const [unread, setUnread] = useState(2);
  const { theme } = useTheme();
  const isDark = theme === 'dark' || theme === 'midnight';
  const panelRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setUnread(0);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, {
      id: Date.now(),
      userId: 1,
      name: 'Emil',
      text: input.trim(),
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    }]);
    setInput('');
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-lg transition-colors ${isDark ? 'text-[var(--color-text-primary)] hover:bg-white/5' : 'text-[var(--color-text-primary)] hover:bg-black/5'}`}
        title="Group Chat"
      >
        <MessageCircle className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
            {unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`absolute right-0 top-full mt-2 w-80 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col border glass-effect ${
              isDark ? 'border-white/10' : 'border-white/50'
            }`}
            style={{ height: '400px' }}
          >
            {/* Header */}
            <div className={`flex items-center gap-3 px-4 py-3 border-b ${isDark ? 'border-white/10' : 'border-black/5'}`}>
              <div className="relative">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Hash className="w-4 h-4 text-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[var(--color-background)]" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-sm text-[var(--color-text-primary)]">Team Channel</div>
                <div className="text-xs text-[var(--color-text-muted)]">
                  {MEMBERS.filter(m => m.status === 'online').length} online · {MEMBERS.length} members
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Online members strip */}
            <div className={`flex items-center gap-2 px-4 py-2 border-b ${isDark ? 'border-white/5' : 'border-black/5'}`}>
              {MEMBERS.filter(m => m.status === 'online').map(m => (
                <div key={m.id} className="relative" title={m.name}>
                  {m.avatar ? (
                    <img src={m.avatar} className="w-6 h-6 rounded-full object-cover ring-2 ring-[var(--color-background)]" alt={m.name} />
                  ) : (
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${getAvatarColor(m.id)} flex items-center justify-center text-[9px] text-white font-bold ring-2 ring-[var(--color-background)]`}>
                      {getInitials(m.name)}
                    </div>
                  )}
                  <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 ${getStatusColor(m.status)} rounded-full border border-[var(--color-background)]`} />
                </div>
              ))}
              <span className="text-[10px] text-[var(--color-text-muted)] ml-1">Active now</span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.map(msg => {
                const isMe = msg.userId === 1;
                const member = MEMBERS.find(m => m.id === msg.userId);
                return (
                  <div key={msg.id} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                    {!isMe && (
                      member?.avatar ? (
                        <img src={member.avatar} className="w-6 h-6 rounded-full object-cover flex-shrink-0 mt-0.5" alt={msg.name} />
                      ) : (
                        <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${getAvatarColor(msg.userId)} flex items-center justify-center text-[9px] text-white font-bold flex-shrink-0 mt-0.5`}>
                          {getInitials(msg.name)}
                        </div>
                      )
                    )}
                    <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
                      {!isMe && <span className="text-[10px] font-semibold text-[var(--color-text-muted)] ml-1">{msg.name}</span>}
                      <div className={`px-3 py-1.5 rounded-2xl text-sm leading-snug ${
                        isMe
                          ? 'bg-primary text-white rounded-tr-sm'
                          : isDark
                            ? 'bg-white/10 text-[var(--color-text-primary)] rounded-tl-sm'
                            : 'bg-black/5 text-[var(--color-text-primary)] rounded-tl-sm'
                      }`}>
                        {msg.text}
                      </div>
                      <span className="text-[9px] text-[var(--color-text-muted)] mx-1">{msg.time}</span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className={`px-3 py-2 border-t ${isDark ? 'border-white/10' : 'border-black/5'}`}>
              <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
                <Smile className="w-4 h-4 text-[var(--color-text-muted)] flex-shrink-0" />
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Message team..."
                  className="flex-1 bg-transparent text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="w-6 h-6 bg-primary rounded-full flex items-center justify-center disabled:opacity-30 transition-opacity"
                >
                  <Send className="w-3 h-3 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
