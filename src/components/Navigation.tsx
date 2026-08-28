import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Home, MessageSquare, BookOpen, DollarSign, Menu, X, FileText, Send, Bell, LogOut, LogIn, Cpu } from 'lucide-react';
import { ThemeToggle } from './ui/ThemeToggle';
import { PaletteToggle } from './ui/PaletteToggle';
import { NavbarCalendar } from './ui/NavbarCalendar';
import { GroupChatPanel } from './ui/GroupChatPanel';
import { GroupProfilePanel } from './ui/GroupProfilePanel';
import { useTheme } from '../contexts/ThemeContext';
import { db, auth } from '../lib/firebase';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';

export function Navigation({ isAiChatLayout = false }: { isAiChatLayout?: boolean }) {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isGroupChatJoined, setIsGroupChatJoined] = useState(() => localStorage.getItem('group_chat_joined') === 'true');
  const [dismissedJoinChat, setDismissedJoinChat] = useState(() => localStorage.getItem('dismissed_join_chat') === 'true');
  const { theme } = useTheme();
  const isDark = theme === 'dark' || theme === 'midnight';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      const newNotifications: any[] = [];
      
      // 1. Fetch Chat Notifications
      const sentIds = JSON.parse(localStorage.getItem('sent_message_ids') || '[]');
      for (const id of sentIds) {
        if (id.startsWith('local-')) {
          const localMsgs = JSON.parse(localStorage.getItem('admin_messages') || '[]');
          const idx = parseInt(id.split('-')[1]);
          const msg = localMsgs[idx];
          if (msg && msg.replyText && msg.readByCustomer === false) {
            newNotifications.push({ id, type: 'chat', ...msg });
          }
        } else if (db) {
          try {
            const docRef = doc(db, 'messages', id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const data = docSnap.data();
              if (data.replyText && data.readByCustomer === false) {
                newNotifications.push({ id, type: 'chat', ...data });
              }
            }
          } catch (e) {
            console.error("Error fetching notification:", e);
          }
        }
      }
      
      // 2. Fetch Ad Notifications
      if (auth.currentUser && db) {
        try {
          const q = query(
            collection(db, 'ads'),
            where('advertiser_id', '==', auth.currentUser.uid),
            where('notification_read', '==', false)
          );
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            newNotifications.push({ id: doc.id, type: 'ad_update', ...doc.data() });
          });
        } catch (e) {
          console.error("Error fetching ad notifications:", e);
          // If composite index is missing, fallback to client-side filter
          try {
            const q = query(collection(db, 'ads'), where('advertiser_id', '==', auth.currentUser.uid));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
              const data = doc.data();
              if (data.notification_read === false && (data.review_status === 'APPROVED' || data.review_status === 'REJECTED')) {
                newNotifications.push({ id: doc.id, type: 'ad_update', ...data });
              }
            });
          } catch (err) {
            console.error("Fallback ad notification fetch failed", err);
          }
        }
      }
      
      setNotifications(newNotifications);
    };

    fetchNotifications();
    
    // Periodically check
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const [isHidden, setIsHidden] = useState(false);

  const markAsRead = async (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    
    if (id.startsWith('local-')) {
      const localMsgs = JSON.parse(localStorage.getItem('admin_messages') || '[]');
      const idx = parseInt(id.split('-')[1]);
      if (localMsgs[idx]) {
        localMsgs[idx].readByCustomer = true;
        localStorage.setItem('admin_messages', JSON.stringify(localMsgs));
      }
    } else if (db) {
      const docRef = doc(db, 'messages', id);
      await updateDoc(docRef, {
        readByCustomer: true
      });
    }
  };

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);

    const previous = scrollY.getPrevious() || 0;
    const scrollPosition = latest + window.innerHeight;
    const documentHeight = document.body.offsetHeight;

    // Always show immediately at the top
    if (latest <= 50) {
      setIsHidden(false);
      return;
    }
    
    // Always hide immediately in the Contact section
    if (scrollPosition >= documentHeight - 800) {
      setIsHidden(true);
      return;
    }

    // Hide on scroll down, show on scroll up
    if (latest > previous && latest > 150) {
      setIsHidden(true);
    } else if (latest < previous) {
      setIsHidden(false);
    }
  });

  const links = [
    { name: 'Portfolio', path: '/', icon: Home },
    { name: 'AI Chat', path: '/ai-chat', icon: MessageSquare },
    { name: 'Tutorials', path: '/tutorials', icon: BookOpen },
    { name: 'SpecLab', path: '/speclab', icon: Cpu },
    { name: 'Ads', path: '/ads', icon: DollarSign },
  ];

  return (
    <motion.header
      initial={{ y: "-100%" }}
      animate={{ y: isHidden ? "-100%" : 0, opacity: isHidden ? 0 : 1 }}
      transition={{ duration: 0 }}
      className={`${isAiChatLayout ? 'absolute' : 'fixed'} top-0 inset-x-0 z-50 transition-none pointer-events-none flex justify-center pt-2`}
    >
      <div className="relative w-full max-w-[85rem] mx-auto px-4 sm:px-6 pointer-events-none flex items-center justify-center gap-3">
        {/* Outside left: User Avatar */}
        {(!isAiChatLayout && user && (location.pathname.startsWith('/ads') || location.pathname.startsWith('/tutorials'))) && (
          <div className="pointer-events-auto flex items-center flex-shrink-0 relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="relative p-0.5 rounded-full bg-gradient-to-tr from-primary to-green-500 hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,102,255,0.3)]"
            >
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-[3px] border-[var(--color-background)]" />
              {user.photoURL ? (
                <img src={user.photoURL} alt="User" className="w-10 h-10 rounded-full border-2 border-[var(--color-background)] object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[var(--color-background)] flex items-center justify-center text-sm font-bold text-[var(--color-text-primary)] border-2 border-transparent">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
              )}
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  style={{ transformOrigin: 'top left' }}
                  className="absolute top-full left-0 mt-3 w-48 glass-effect rounded-xl shadow-2xl overflow-hidden border border-[var(--color-border)] z-50"
                >
                  <div className="p-3 border-b border-[var(--color-border)]">
                    <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Signed in as</p>
                    <p className="text-sm font-bold text-[var(--color-text-primary)] truncate">{user.email}</p>
                  </div>
                  <button 
                    onClick={() => {
                      signOut(auth);
                      setShowUserMenu(false);
                      if (location.pathname.startsWith('/ads/create') || location.pathname.startsWith('/ads/dashboard')) {
                        window.location.href = '/ads';
                      }
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-[var(--color-surface)] transition-colors flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <motion.div 
          layout
          transition={{ type: "spring", stiffness: 400, damping: 40 }}
          className={`pointer-events-auto rounded-full flex items-center w-full flex-1 justify-between ${scrolled || isAiChatLayout ? 'h-14 px-4' : 'h-16 px-6'} ${
          isDark 
            ? 'bg-[#181a20] border border-white/5 shadow-[-5px_-5px_15px_rgba(255,255,255,0.02),_5px_5px_15px_rgba(0,0,0,0.6)]' 
            : 'bg-[#e0e5ec] border border-white/40 shadow-[-5px_-5px_15px_rgba(255,255,255,1),_5px_5px_15px_rgba(163,177,198,0.5)]'
        }`}
      >
        
        {/* Logo */}
        <motion.div layout className="flex-shrink-0">
          <Link to="/about" className="flex items-center space-x-3 group">
            <img src="/logo.png" alt="EdgeFX Logo" className="h-8 w-8 rounded-full object-cover transition-transform group-hover:scale-105 shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
          </Link>
        </motion.div>

        {/* Desktop Links */}
        <AnimatePresence>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="hidden lg:flex items-center space-x-1 bg-[var(--color-surface)]/30 p-1 rounded-full border border-[var(--color-border)] whitespace-nowrap flex-shrink-0"
            >
              {links.map((link) => {
                const isActive = location.pathname === link.path;
                const Icon = link.icon;
                
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors z-10 flex items-center space-x-2 ${
                      isActive ? 'text-white' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute inset-0 bg-primary rounded-full shadow-[0_0_15px_rgba(0,102,255,0.4)]"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center">
                      <Icon className="w-4 h-4 mr-1.5" />
                      {link.name}
                    </span>
                  </Link>
                );
              })}
            </motion.div>
        </AnimatePresence>

        {/* Right Actions */}
        <motion.div layout className="hidden lg:flex items-center space-x-2 relative">
                <div className="hidden xl:block">
                  <NavbarCalendar />
                </div>



                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] rounded-lg transition-colors relative"
                  >
                    <Bell className="w-5 h-5" />
                    {(notifications.length > 0 || (!isGroupChatJoined && !dismissedJoinChat)) && (
                      <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border-2 border-[var(--color-background)]"></span>
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-80 glass-effect rounded-xl shadow-2xl p-4 flex flex-col space-y-3 z-50 border border-[var(--color-border)]"
                      >
                        <h3 className="font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2">Notifications</h3>
                        {(notifications.length === 0 && (isGroupChatJoined || dismissedJoinChat)) ? (
                          <p className="text-sm text-[var(--color-text-muted)] py-4 text-center">No new notifications</p>
                        ) : (
                          <div className="max-h-60 overflow-y-auto space-y-2">
                            {(!isGroupChatJoined && !dismissedJoinChat) && (
                              <div className={`rounded-xl p-4 text-sm relative border transition-all ${
                                isDark 
                                  ? 'bg-[#181a20] border-white/5 shadow-[inset_-2px_-2px_5px_rgba(255,255,255,0.02),inset_2px_2px_5px_rgba(0,0,0,0.5)]' 
                                  : 'bg-[#e0e5ec] border-black/5 shadow-[inset_-2px_-2px_5px_rgba(255,255,255,1),inset_2px_2px_5px_rgba(163,177,198,0.5)]'
                              }`}>
                                <div className="flex items-center space-x-3 mb-3">
                                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                                    <MessageSquare className="w-5 h-5 text-primary" />
                                  </div>
                                  <div>
                                    <p className="font-black text-[var(--color-text-primary)] tracking-wide">Community Chat</p>
                                    <p className="text-xs text-primary font-medium">New Feature</p>
                                  </div>
                                </div>
                                <p className="text-[var(--color-text-muted)] mb-4 leading-relaxed font-medium">
                                  Would you like to join our general community chat and connect with others?
                                </p>
                                <div className="flex gap-3">
                                  <button 
                                    onClick={() => {
                                      setIsGroupChatJoined(true);
                                      setDismissedJoinChat(true);
                                      localStorage.setItem('group_chat_joined', 'true');
                                      localStorage.setItem('dismissed_join_chat', 'true');
                                    }}
                                    className="flex-1 py-2 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg font-bold text-xs hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(0,102,255,0.4)]"
                                  >
                                    Join Now
                                  </button>
                                  <button 
                                    onClick={() => {
                                      setDismissedJoinChat(true);
                                      localStorage.setItem('dismissed_join_chat', 'true');
                                    }}
                                    className={`flex-1 py-2 rounded-lg font-bold text-xs transition-colors ${
                                      isDark 
                                        ? 'bg-[#22242a] text-gray-400 hover:text-white border border-white/5' 
                                        : 'bg-[#d1d9e6] text-gray-500 hover:text-gray-800 border border-black/5'
                                    }`}
                                  >
                                    Dismiss
                                  </button>
                                </div>
                              </div>
                            )}
                            
                            {notifications.map(n => (
                              <div key={n.id} className="bg-[var(--color-background)] rounded-lg p-3 text-sm relative pr-8">
                                {n.type === 'ad_update' ? (
                                  <>
                                    <p className="font-semibold text-primary mb-1">Ad Campaign Update:</p>
                                    <p className="text-[var(--color-text-primary)]">Your ad "{n.title}" is now <strong className={n.review_status === 'APPROVED' ? 'text-success' : 'text-red-500'}>{n.review_status}</strong>.</p>
                                  </>
                                ) : (
                                  <>
                                    <p className="font-semibold text-primary mb-1">Reply to your message:</p>
                                    <p className="text-[var(--color-text-primary)] line-clamp-3">{n.replyText}</p>
                                  </>
                                )}
                                <button 
                                  onClick={async () => {
                                    if (n.type === 'ad_update') {
                                      setNotifications(prev => prev.filter(notif => notif.id !== n.id));
                                      await updateDoc(doc(db, 'ads', n.id), { notification_read: true });
                                    } else {
                                      markAsRead(n.id);
                                    }
                                  }}
                                  className="absolute top-2 right-2 text-[var(--color-text-muted)] hover:text-red-500 transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <PaletteToggle />
                <ThemeToggle />
                <div className="h-6 w-px bg-[var(--color-border)] mx-1" />
                <Link to="/resume" className="premium-button premium-button-secondary px-4 py-2 text-sm flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Resume</span>
                </Link>

          <motion.div layout className="flex-shrink-0">
            <div className={`relative rounded-full p-[2px] group transition-all duration-300 ${
                isDark 
                  ? 'shadow-[-3px_-3px_8px_rgba(255,255,255,0.03),_3px_3px_8px_rgba(0,0,0,0.6)] hover:shadow-none'
                  : 'shadow-[-3px_-3px_8px_rgba(255,255,255,1),_3px_3px_8px_rgba(163,177,198,0.5)] hover:shadow-none'
            }`}>
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <div className="absolute inset-[-150%] bg-[conic-gradient(from_0deg_at_50%_50%,#00dfd8_0%,#a855f7_33%,#ff0080_66%,#00dfd8_100%)] animate-[spin_3s_linear_infinite]" />
              </div>
              <a 
                href="https://t.me/emilpunnoose" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`relative z-10 flex items-center space-x-2 px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap border-none ${
                  isDark 
                    ? 'bg-[#181a20] text-white group-hover:shadow-[inset_-2px_-2px_5px_rgba(255,255,255,0.03),inset_2px_2px_5px_rgba(0,0,0,0.6)]'
                    : 'bg-[#e0e5ec] text-black group-hover:shadow-[inset_-2px_-2px_5px_rgba(255,255,255,1),inset_2px_2px_5px_rgba(163,177,198,0.5)]'
                }`}
              >
                <span>Hire Me</span>
                <Send className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </motion.div>


        {/* Mobile Toggle */}
        <div className="flex lg:hidden items-center space-x-2">
          <PaletteToggle />
          <ThemeToggle />
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[var(--color-text-primary)] focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.div>

      {/* Outside right icons */}
      <AnimatePresence>
        <div className="pointer-events-auto hidden lg:flex items-center space-x-3 flex-shrink-0">
          {isGroupChatJoined && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="flex items-center space-x-3"
            >
              <div className={`rounded-full border shadow-lg ${isDark ? 'border-white/5 bg-[#181a20]' : 'border-black/5 bg-[#e0e5ec]'}`}>
                <GroupChatPanel />
              </div>
              <div className={`rounded-full border shadow-lg ${isDark ? 'border-white/5 bg-[#181a20]' : 'border-black/5 bg-[#e0e5ec]'}`}>
                <GroupProfilePanel />
              </div>
            </motion.div>
          )}

          {/* Login Button */}
          {(!isAiChatLayout && !user && (location.pathname.startsWith('/ads') || location.pathname.startsWith('/tutorials'))) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <button 
                onClick={() => window.dispatchEvent(new Event('open-login-modal'))}
                className="flex items-center gap-2 px-4 py-2 rounded-full glass-effect border border-primary/30 text-primary text-sm font-bold hover:bg-primary/10 transition-colors shadow-[0_0_10px_rgba(0,102,255,0.15)]"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </button>
            </motion.div>
          )}
        </div>
      </AnimatePresence>
    </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-20 inset-x-4 bg-[var(--color-background)]/95 backdrop-blur-2xl border border-[var(--color-border)] rounded-2xl p-4 flex flex-col space-y-2 shadow-[0_20px_40px_rgba(0,0,0,0.4)] lg:hidden pointer-events-auto z-[60]"
          >
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center p-4 rounded-xl transition-colors ${
                    isActive 
                      ? 'bg-primary/20 text-primary border border-primary/30' 
                      : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span className="font-semibold">{link.name}</span>
                </Link>
              );
            })}
            
            <div className="h-px w-full bg-[var(--color-border)] my-2" />
            
            <div className="grid grid-cols-2 gap-2">
              <Link to="/resume" className="flex justify-center items-center p-3 rounded-xl glass-effect text-[var(--color-text-primary)] font-medium">
                <FileText className="w-4 h-4 mr-2" /> Resume
              </Link>
              <div className={`relative rounded-xl p-[2px] group transition-all duration-300 w-full ${
                  isDark 
                    ? 'shadow-[-3px_-3px_8px_rgba(255,255,255,0.03),_3px_3px_8px_rgba(0,0,0,0.6)] hover:shadow-none'
                    : 'shadow-[-3px_-3px_8px_rgba(255,255,255,1),_3px_3px_8px_rgba(163,177,198,0.5)] hover:shadow-none'
              }`}>
                <div className="absolute inset-0 rounded-xl overflow-hidden">
                  <div className="absolute inset-[-150%] bg-[conic-gradient(from_0deg_at_50%_50%,#00dfd8_0%,#a855f7_33%,#ff0080_66%,#00dfd8_100%)] animate-[spin_3s_linear_infinite]" />
                </div>
                <a 
                  href="https://t.me/emilpunnoose" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`relative w-full z-10 flex justify-center items-center p-3 rounded-xl font-bold transition-all duration-300 border-none ${
                    isDark 
                      ? 'bg-[#181a20] text-white group-hover:shadow-[inset_-2px_-2px_5px_rgba(255,255,255,0.03),inset_2px_2px_5px_rgba(0,0,0,0.6)]'
                      : 'bg-[#e0e5ec] text-black group-hover:shadow-[inset_-2px_-2px_5px_rgba(255,255,255,1),inset_2px_2px_5px_rgba(163,177,198,0.5)]'
                  }`}
                >
                  Hire Me <Send className="w-4 h-4 ml-2" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
