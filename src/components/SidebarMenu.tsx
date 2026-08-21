import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, MessageSquare, BookOpen, DollarSign, Menu, X, FileText, Send, Bell, LogOut, LogIn, Cpu, User } from 'lucide-react';
import { ThemeToggle } from './ui/ThemeToggle';
import { PaletteToggle } from './ui/PaletteToggle';
import { useTheme } from '../contexts/ThemeContext';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';

export function SidebarMenu({ isAiChatLayout = false }: { isAiChatLayout?: boolean }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  
  const { theme } = useTheme();
  // We use black for the sidebar as requested
  const isDark = theme === 'dark' || theme === 'midnight';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Use exact icons from the image or close matches
  const links = [
    { name: 'HOME', path: '/', icon: Home },
    { name: 'ABOUT', path: '/about', icon: BookOpen },
    { name: 'TEAM', path: '/ai-chat', icon: User },
    { name: 'PORTFOLIO', path: '/speclab', icon: FileText },
    { name: 'CONTACT', path: '/resume', icon: MessageSquare },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#212121] z-50 flex items-center justify-between px-4 border-b border-white/10 shadow-lg">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-black flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
            </div>
          </div>
          <span className="text-white font-bold tracking-widest">MENU</span>
        </Link>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white p-2">
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Desktop Sidebar & Mobile Menu Container */}
      <motion.nav 
        className={\ixed top-0 left-0 h-full bg-[#212121] z-40 transition-transform duration-300 w-[260px] flex flex-col \\}
      >
        {/* Yin Yang Logo Area */}
        <div className="h-40 flex items-center justify-center pt-8">
          <div className="w-24 h-24 rounded-full bg-white relative overflow-hidden flex shadow-2xl border-4 border-white/10">
            {/* Left black half */}
            <div className="w-1/2 h-full bg-[#212121] absolute left-0 top-0"></div>
            {/* Top black circle */}
            <div className="w-12 h-12 rounded-full bg-[#212121] absolute top-0 left-1/4 flex items-center justify-center">
               <div className="w-3 h-3 rounded-full bg-white"></div>
            </div>
            {/* Bottom white circle */}
            <div className="w-12 h-12 rounded-full bg-white absolute bottom-0 left-1/4 flex items-center justify-center">
               <div className="w-3 h-3 rounded-full bg-[#212121]"></div>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="flex-1 mt-12 pl-6 flex flex-col gap-2">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;
            
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={\group flex items-center gap-4 py-4 pl-6 transition-all duration-300 \\}
              >
                <Icon className={\w-5 h-5 \\} />
                <span className={\ont-bold tracking-widest text-sm \\}>
                  {link.name}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="p-6 pb-8 space-y-4">
          <div className="flex items-center justify-center gap-4">
             <ThemeToggle />
             <PaletteToggle />
          </div>
          {user ? (
            <button 
              onClick={() => signOut(auth)}
              className="w-full flex justify-center items-center gap-2 py-2 text-white/50 hover:text-white transition-colors text-sm font-bold"
            >
              <LogOut className="w-4 h-4" /> LOGOUT
            </button>
          ) : (
             <button 
              onClick={() => window.dispatchEvent(new Event('open-login-modal'))}
              className="w-full flex justify-center items-center gap-2 py-2 text-white/50 hover:text-white transition-colors text-sm font-bold"
            >
              <LogIn className="w-4 h-4" /> LOGIN
            </button>
          )}
        </div>
      </motion.nav>

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}