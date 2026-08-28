import { Github, WhatsApp } from '../ui/SocialIcons';
import { motion } from 'framer-motion';
import { MapPin, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import mainProfileLight from '../../assets/images/profile/firstimagelight.webp';
import { useTheme } from '../../contexts/ThemeContext';

interface HeroProps {
  profileData: any;
}

export function Hero({ profileData }: HeroProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || theme === 'midnight';

  const scrollToNext = () => {
    window.scrollTo({ top: window.innerHeight - 100, behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-start md:justify-center pt-32 md:pt-24 pb-12 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 md:mt-0 mt-[15vh]">
        <img 
          src={isDark ? profileData.images?.main : mainProfileLight} 
          alt="Hero Background" 
          className={`w-full h-full object-contain object-bottom md:object-right opacity-80 transition-opacity duration-500 ${isDark ? '' : 'mix-blend-multiply'}`}
        />
        {/* Gradient mask for the bottom to fade the image out */}
        <div className="absolute inset-x-0 bottom-0 h-[10%] bg-gradient-to-t from-[var(--color-background)] to-transparent pointer-events-none" />
      </div>

      <div className="max-w-[1920px] mx-auto px-6 w-full relative z-10 pointer-events-none">
        <div className="max-w-3xl pointer-events-auto">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Status Badge */}
            <div className="inline-flex items-center space-x-2 mb-8">
              <span className="inline-block overflow-hidden whitespace-nowrap text-[11px] tracking-[0.3em] uppercase text-[var(--color-text-primary)]/60 font-mono" style={{ width: '32ch' }}>
                ✦ Available for work
              </span>
            </div>

            <div className="mb-4">
              <span className="block text-2xl sm:text-3xl text-[var(--color-text-muted)] font-bold tracking-tight mb-2">Hello, I'm</span>
              <h1 className="font-display uppercase font-black leading-[0.85] tracking-[-0.04em] text-[11vw] sm:text-[12vw] md:text-[9vw] lg:text-[7.5rem] cursor-pointer transition-all duration-500 origin-left flex flex-col drop-shadow-[0_0_30px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_0_30px_rgba(255,255,255,0.15)] group">
                <span className="bg-gradient-to-br from-gray-900 via-gray-700 to-gray-500 dark:from-white dark:via-gray-200 dark:to-gray-500 bg-clip-text text-transparent group-hover:from-primary group-hover:to-accent dark:group-hover:from-white dark:group-hover:to-primary transition-all duration-500">
                  EMIL<br className="md:hidden" /> PUNNOOSE
                </span>
                <span className="text-primary text-[9vw] sm:text-[10vw] md:text-[6vw] lg:text-[5rem] tracking-[-0.02em] opacity-90 group-hover:opacity-100 transition-opacity">VARUGHESE</span>
              </h1>
            </div>

            {/* Animated Typing Role */}
            <div className="h-10 sm:h-12 lg:h-14 mb-6">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gradient inline-block typing-effect pr-2">
                AI & Full-Stack Developer
              </h2>
            </div>

            {/* Bio with custom serif styling */}
            <p className="text-lg md:text-xl text-[var(--color-text-muted)] max-w-xl mb-10 text-balance leading-relaxed font-serif">
              Turning creative ideas into interactive and <span className="text-[var(--color-text-primary)] font-bold">high-quality web experiences.</span>
            </p>

            <div className="flex flex-wrap gap-4 items-center">
              <Link to="/about" className="premium-button px-8 py-3 flex items-center border border-gray-900/20 dark:border-white/20 text-sm tracking-widest font-bold uppercase text-[var(--color-text-primary)] hover:bg-[var(--color-text-primary)] hover:text-[var(--color-background)] hover:scale-105 transition-all">
                ABOUT ME
              </Link>

              <div className="flex items-center space-x-2 ml-2">
                <a href="#" className="p-4 rounded-full glass-effect text-[var(--color-text-primary)] hover:text-[#25D366] transition-colors hover:scale-110 group">
                  <WhatsApp className="w-5 h-5" />
                </a>
                <a href="#" className="p-4 rounded-full glass-effect text-[var(--color-text-primary)] hover:text-primary transition-colors hover:scale-110">
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div className="mt-12 flex items-center space-x-6 text-sm text-[var(--color-text-muted)] font-mono">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-primary" />
                {profileData.location || "Earth"}
              </div>
              <div className="w-1 h-1 rounded-full bg-[var(--color-border)]" />
              <div>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} Local Time</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.button 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        onClick={scrollToNext}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 p-2 text-[var(--color-text-muted)] hover:text-primary transition-colors animate-bounce"
        aria-label="Scroll down"
      >
        <ChevronDown className="w-6 h-6" />
      </motion.button>
    </section>
  );
}
