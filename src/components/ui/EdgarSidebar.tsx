import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sidebar as SidebarIcon, Edit, MessageSquare, Folder, User, Bot, Settings, Globe, HelpCircle, Download, Info, LogOut, Check, ChevronUp, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { auth } from '../../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';

interface EdgarSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onNewChat: () => void;
  onSelectPrompt: (prompt: string) => void;
  userName: string;
  onOpenSettings?: () => void;
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
}

export function EdgarSidebar({ isOpen, onToggle, onNewChat, onSelectPrompt, userName, onOpenSettings, selectedLanguage, onLanguageChange }: EdgarSidebarProps) {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark' || theme === 'midnight';
  
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState<'main' | 'language'>('main');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
        setActiveSubMenu('main');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const pinnedItems = [
    { name: 'About Emil', icon: User, prompt: 'Tell me about Emil and his background' },
    { name: 'Portfolio Overview', icon: Folder, prompt: 'Give me an overview of his portfolio' },
    { name: 'AI Projects', icon: Bot, prompt: 'What AI and ML projects has he built?' },
    { name: 'How to hire him', icon: MessageSquare, prompt: 'How can I contact or hire Emil?' },
  ];

  const projectItems = [
    { name: 'QuizReward', icon: Folder, prompt: 'Tell me about QuizReward' },
    { name: 'Rent Book Pro', icon: Folder, prompt: 'Tell me about Rent Book Pro' },
    { name: 'SPEC', icon: Folder, prompt: 'Tell me about SPEC' },
    { name: 'WhatsApp CRM', icon: Folder, prompt: 'Tell me about the WhatsApp CRM' },
    { name: 'Mech Game', icon: Folder, prompt: 'Tell me about the Mech Game' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ 
          width: isOpen ? 260 : 0,
          opacity: isOpen ? 1 : 0
        }}
        className={`fixed md:relative top-0 left-0 h-full z-40 flex flex-col overflow-hidden ${isOpen ? 'w-[260px]' : 'w-0'} ${isDark ? 'bg-[#171717]' : 'bg-[#f9f9f9] border-r border-gray-200'}`}
        style={{ transition: 'width 0.3s ease' }}
      >
        <div className={`w-[260px] flex flex-col h-full shrink-0 ${isDark ? 'bg-[#171717]' : 'bg-[#f9f9f9]'}`}>
          {/* Top Bar */}
          <div className="flex items-center justify-between p-3 h-14 shrink-0 mt-2">
            <div className={`font-bold text-[17px] tracking-tight ml-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Edgar AI
            </div>
            <div className="flex items-center gap-1">
              <button className={`p-2 rounded-md transition-colors ${isDark ? 'hover:bg-white/10 text-white/70 hover:text-white' : 'hover:bg-black/5 text-gray-500 hover:text-gray-900'}`}>
                <Search className="w-[18px] h-[18px]" />
              </button>
              <button 
                onClick={onToggle}
                className={`p-2 rounded-md transition-colors ${isDark ? 'hover:bg-white/10 text-white/70 hover:text-white' : 'hover:bg-black/5 text-gray-500 hover:text-gray-900'}`}
              >
                <SidebarIcon className="w-[18px] h-[18px]" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-5 no-scrollbar">
            
            {/* New Chat Button */}
            <button 
              onClick={onNewChat}
              className={`w-full flex items-center gap-3 p-2.5 mt-1 rounded-xl transition-colors text-[14px] shadow-sm ${isDark ? 'bg-[#212121] hover:bg-[#2f2f2f] text-white/90' : 'bg-white hover:bg-gray-100 text-gray-900 border border-gray-200'}`}
            >
              <Edit className="w-4 h-4 ml-1" />
              <span className="font-medium">New chat</span>
            </button>

            {/* Pinned Section */}
            <div className="mt-6">
              <div className={`text-[12px] font-semibold mb-1 px-2 ${isDark ? 'text-white/50' : 'text-gray-500'}`}>Pinned</div>
              <div className="space-y-0.5 mt-1">
                {pinnedItems.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      onSelectPrompt(item.prompt);
                      if (window.innerWidth < 768) onToggle();
                    }}
                    className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors text-[14px] text-left group ${isDark ? 'hover:bg-[#212121] text-white/80 hover:text-white' : 'hover:bg-gray-200 text-gray-700 hover:text-gray-900'}`}
                  >
                    <item.icon className="w-4 h-4 shrink-0 opacity-70" />
                    <span className="truncate flex-1 font-medium">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Projects Section */}
            <div className="mt-6 pb-2">
              <div className={`text-[12px] font-semibold mb-1 px-2 ${isDark ? 'text-white/50' : 'text-gray-500'}`}>Projects</div>
              <div className="space-y-0.5 mt-1">
                {projectItems.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      onSelectPrompt(item.prompt);
                      if (window.innerWidth < 768) onToggle();
                    }}
                    className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors text-[14px] text-left group ${isDark ? 'hover:bg-[#212121] text-white/80 hover:text-white' : 'hover:bg-gray-200 text-gray-700 hover:text-gray-900'}`}
                  >
                    <item.icon className="w-4 h-4 shrink-0 opacity-70" />
                    <span className="truncate flex-1 font-medium">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Profile */}
          <div className="p-3 shrink-0 relative" ref={menuRef}>
            
            {/* Dropdown Menu */}
            <AnimatePresence>
              {isProfileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className={`absolute bottom-full left-3 w-[240px] mb-2 rounded-xl border shadow-2xl overflow-hidden py-1.5 z-50 ${isDark ? 'bg-[#2f2f2f] border-white/10' : 'bg-white border-gray-200'}`}
                >
                  {activeSubMenu === 'main' ? (
                    <div className="flex flex-col">
                      <button 
                        onClick={() => {
                          if (onOpenSettings) onOpenSettings();
                          setIsProfileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 text-[14px] transition-colors ${isDark ? 'hover:bg-white/10 text-white/90' : 'hover:bg-gray-100 text-gray-800'}`}
                      >
                        <div className="flex items-center gap-3"><Settings className="w-4 h-4 opacity-70"/>Settings</div>
                        <span className={`text-[11px] ${isDark ? 'text-white/40' : 'text-gray-400'}`}>Ctrl+⇧+,</span>
                      </button>
                      
                      <button onClick={() => setActiveSubMenu('language')} className={`w-full flex items-center justify-between px-3 py-2.5 text-[14px] transition-colors ${isDark ? 'hover:bg-white/10 text-white/90' : 'hover:bg-gray-100 text-gray-800'}`}>
                        <div className="flex items-center gap-3"><Globe className="w-4 h-4 opacity-70"/>Language</div>
                        <div className={`text-[11px] font-mono ${isDark ? 'text-white/40' : 'text-gray-400'}`}>{'>'}</div>
                      </button>
                      
                      <button 
                        onClick={() => {
                          navigate('/');
                          setTimeout(() => {
                            const el = document.getElementById('contact');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }, 100);
                          setIsProfileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-[14px] transition-colors ${isDark ? 'hover:bg-white/10 text-white/90' : 'hover:bg-gray-100 text-gray-800'}`}
                      >
                        <HelpCircle className="w-4 h-4 opacity-70"/>Get help
                      </button>

                      <div className={`h-px my-1.5 mx-3 ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />

                      <button className={`w-full flex items-center gap-3 px-3 py-2.5 text-[14px] transition-colors ${isDark ? 'hover:bg-white/10 text-white/90' : 'hover:bg-gray-100 text-gray-800'}`}>
                        <Download className="w-4 h-4 opacity-70"/>Get apps and extensions
                      </button>
                      <button className={`w-full flex items-center justify-between px-3 py-2.5 text-[14px] transition-colors ${isDark ? 'hover:bg-white/10 text-white/90' : 'hover:bg-gray-100 text-gray-800'}`}>
                        <div className="flex items-center gap-3"><Info className="w-4 h-4 opacity-70"/>Learn more</div>
                        <div className={`text-[11px] font-mono ${isDark ? 'text-white/40' : 'text-gray-400'}`}>{'>'}</div>
                      </button>

                      <div className={`h-px my-1.5 mx-3 ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />

                      {user ? (
                        <button 
                          onClick={() => {
                            signOut(auth);
                            setIsProfileMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 text-[14px] transition-colors ${isDark ? 'hover:bg-white/10 text-red-400' : 'hover:bg-red-50 text-red-600'}`}
                        >
                          <LogOut className="w-4 h-4 opacity-70"/>Log out
                        </button>
                      ) : (
                        <button 
                          onClick={() => {
                            window.dispatchEvent(new Event('open-login-modal'));
                            setIsProfileMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 text-[14px] font-semibold transition-colors ${isDark ? 'hover:bg-white/10 text-blue-400' : 'hover:bg-blue-50 text-blue-600'}`}
                        >
                          <LogOut className="w-4 h-4 opacity-70 rotate-180"/>Log in
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <button onClick={() => setActiveSubMenu('main')} className={`w-full flex items-center gap-3 px-3 py-2.5 text-[14px] font-medium transition-colors border-b ${isDark ? 'hover:bg-white/10 text-white/90 border-white/10' : 'hover:bg-gray-100 text-gray-800 border-gray-100'}`}>
                        <div className="font-mono">{'<'}</div> Back
                      </button>
                      <div className="max-h-[260px] overflow-y-auto no-scrollbar py-1">
                        {[
                          'English (United States)', 'Français (France)', 'Deutsch (Deutschland)', 
                          'हिन्दी (भारत)', 'മലയാളം (Malayalam)', 'Indonesia (Indonesia)', 'Italiano (Italia)', 
                          '日本語 (日本)', '한국어(대한민국)', 'Português (Brasil)', 
                          'Español (Latinoamérica)', 'Español (España)'
                        ].map((lang, idx) => (
                          <button 
                            key={idx} 
                            onClick={() => {
                              onLanguageChange(lang);
                              setIsProfileMenuOpen(false);
                              setActiveSubMenu('main');
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 text-[13px] transition-colors ${isDark ? 'hover:bg-white/10 text-white/90' : 'hover:bg-gray-100 text-gray-800'}`}
                          >
                            {lang}
                            {lang === selectedLanguage && <Check className="w-4 h-4 text-blue-500" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Profile Button */}
            <button 
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className={`w-full flex items-center justify-between p-2 rounded-xl transition-colors text-left group ${isDark ? 'hover:bg-[#212121]' : 'hover:bg-gray-200'}`}
            >
              <div className="flex items-center gap-2.5 min-w-0 relative">
                {user ? (
                  <>
                    <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[var(--color-background)] z-10" />
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="User" className="w-8 h-8 rounded-full border border-black/10 object-cover shrink-0" />
                    ) : (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[13px] shrink-0 ${isDark ? 'bg-[#333333] text-white' : 'bg-gray-300 text-gray-700'}`}>
                        {user.email?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </>
                ) : (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[13px] shrink-0 ${isDark ? 'bg-[#333333] text-white' : 'bg-gray-300 text-gray-700'}`}>
                    {userName ? userName.charAt(0).toUpperCase() : 'EP'}
                  </div>
                )}
                <div className="flex flex-col min-w-0 justify-center">
                  <span className={`text-[14px] font-medium truncate ${isDark ? 'text-white/90' : 'text-gray-900'}`}>
                    {user ? user.email : (userName || 'Emil Punnoose')}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center shrink-0">
                <div className={`flex flex-col -space-y-1.5 ml-1.5 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                  <ChevronUp className="w-3 h-3" />
                  <ChevronDown className="w-3 h-3" />
                </div>
              </div>
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
