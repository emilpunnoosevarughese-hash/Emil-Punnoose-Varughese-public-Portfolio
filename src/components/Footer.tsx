import { Github, Twitter, Linkedin } from './ui/SocialIcons';
import { ArrowUp, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import secondBanner from '../assets/images/secondbanner.webp';

export function Footer() {
  const { theme } = useTheme();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative mt-24 pt-20 pb-10 border-t border-[var(--color-border)] overflow-hidden bg-[var(--color-surface)]/20">
      {/* Subtle Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1920px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          <div className="md:col-span-2">
            <Link to="/" className="inline-flex items-center space-x-3 group mb-4">
              <img src="/logo.png" alt="EdgeFX Logo" className="h-10 w-10 rounded-full object-cover transition-transform group-hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.1)]" />
              <span className="font-display font-bold text-[var(--color-text-primary)] text-xl tracking-wide group-hover:text-primary transition-colors">@emilpunnoosevarughese</span>
            </Link>
            <p className="text-[var(--color-text-muted)] text-lg max-w-sm mb-6 text-balance">
              Building intelligent interfaces and robust automation systems for the next generation of the web.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="p-2 rounded-full glass-effect hover:bg-white/10 hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-full glass-effect hover:bg-white/10 hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-full glass-effect hover:bg-white/10 hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-full glass-effect hover:bg-white/10 hover:text-primary transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="font-bold text-[var(--color-text-primary)] mb-4 uppercase tracking-wider text-sm">Navigation</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-[var(--color-text-muted)] hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/ai-chat" className="text-[var(--color-text-muted)] hover:text-primary transition-colors">AI Assistant</Link></li>
              <li><Link to="/tutorials" className="text-[var(--color-text-muted)] hover:text-primary transition-colors">Tutorials</Link></li>
              <li><a href="#" className="text-[var(--color-text-muted)] hover:text-primary transition-colors">Projects</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-bold text-[var(--color-text-primary)] mb-4 uppercase tracking-wider text-sm">Connect</h4>
            <ul className="space-y-3">
              <li><a href="https://www.instagram.com/emilpunnoosevarughese/" target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-muted)] hover:text-primary transition-colors">Instagram (Main)</a></li>
              <li><a href="https://www.instagram.com/edgefx___/" target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-muted)] hover:text-primary transition-colors">Instagram (Editing)</a></li>
              <li><a href="https://t.me/emilpunnoose" target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-muted)] hover:text-primary transition-colors">Hire Me</a></li>
              <li><Link to="/resume" className="text-[var(--color-text-muted)] hover:text-primary transition-colors">Resume</Link></li>
            </ul>
          </div>
        </div>
        
        {/* New Banner in Footer */}
        <div className="mb-16">
          <img src={secondBanner} alt="Second Banner" className="w-full rounded-2xl shadow-2xl border border-white/5 object-cover" />
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[var(--color-border)] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[var(--color-text-muted)]">
            © {new Date().getFullYear()} Emil Punnoose Varughese. All rights reserved.
          </p>
          
          <div className="flex items-center space-x-6">
            {/* Build Info */}
            <div className="flex items-center space-x-2 text-xs font-mono text-[var(--color-text-muted)] bg-[var(--color-surface)] px-3 py-1 rounded-full border border-[var(--color-border)]">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>v7.0.0</span>
              <span className="opacity-50">|</span>
              <span className="capitalize">{theme}</span>
            </div>

            {/* Back to Top */}
            <button 
              onClick={scrollToTop}
              className="group flex items-center space-x-2 text-sm text-[var(--color-text-muted)] hover:text-primary transition-colors"
            >
              <span>Back to top</span>
              <div className="p-1.5 rounded-full glass-effect group-hover:bg-primary/20 transition-colors">
                <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
