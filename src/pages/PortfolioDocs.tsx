import { motion } from 'framer-motion';
import { ArrowLeft, Code, Layers, Layout, Zap, Smartphone, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

export function PortfolioDocs() {
  useEffect(() => {
    window.scrollTo(0, 0); // Ensure page starts at top
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-background)] relative pt-24 pb-24 overflow-hidden">
      
      {/* Back Button */}
      <div className="absolute top-8 left-4 sm:left-8 z-50">
        <Link 
          to="/"
          className="flex items-center space-x-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] px-4 py-2 rounded-full glass-effect border border-[var(--color-border)] transition-all duration-300 hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium tracking-wider uppercase hidden sm:inline">Back to Portfolio</span>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-primary/10 rounded-2xl mb-6 ring-1 ring-primary/20">
            <Layout className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--color-text-primary)] mb-4 tracking-tight">
            Portfolio <span className="text-primary">Docs</span>
          </h1>
          <p className="text-lg md:text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto leading-relaxed">
            The architecture and design philosophy behind this premium digital portfolio. Engineered for performance, aesthetics, and user experience.
          </p>
        </motion.div>

        {/* Developer Note */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 flex items-start gap-4 sm:gap-6 shadow-xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] -z-10 group-hover:bg-primary/20 transition-all duration-500" />
          <div className="p-3 bg-primary/10 rounded-xl shrink-0">
            <Code className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">Designed by Emil</h3>
            <p className="text-[var(--color-text-muted)] leading-relaxed">
              This portfolio is built using a modern React & Vite stack. It leverages custom CSS variables for theme switching, Framer Motion for fluid animations, and a component-based architecture for maximum reusability.
            </p>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-8 flex items-center gap-3">
            <span className="w-8 h-[2px] bg-primary rounded-full"></span>
            Key Architecture
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[var(--color-surface)]/50 border border-[var(--color-border)] rounded-2xl p-6 hover:bg-[var(--color-surface)] transition-all">
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-500" /> Glassmorphism UI
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                Utilizes backdrop-filter blurs and semi-transparent surfaces to create depth and hierarchy, giving the interface a premium, modern feel.
              </p>
            </div>
            
            <div className="bg-[var(--color-surface)]/50 border border-[var(--color-border)] rounded-2xl p-6 hover:bg-[var(--color-surface)] transition-all">
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" /> Framer Motion
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                Every page transition, hover state, and scroll reveal is powered by Framer Motion, ensuring butter-smooth 60fps animations across devices.
              </p>
            </div>

            <div className="bg-[var(--color-surface)]/50 border border-[var(--color-border)] rounded-2xl p-6 hover:bg-[var(--color-surface)] transition-all">
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                <Search className="w-5 h-5 text-purple-500" /> SEO Optimized
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                Structured semantic HTML, dynamic meta tags, and fast load times ensure that the portfolio is easily discoverable by search engines.
              </p>
            </div>

            <div className="bg-[var(--color-surface)]/50 border border-[var(--color-border)] rounded-2xl p-6 hover:bg-[var(--color-surface)] transition-all">
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-pink-500" /> Fully Responsive
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                Built with a mobile-first approach using Tailwind CSS. The grid layouts and typography automatically scale to provide a flawless experience on phones, tablets, and desktops.
              </p>
            </div>
          </div>
        </motion.div>

        {/* View Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 flex justify-center"
        >
          <a
            href="/"
            className="px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:shadow-primary/50 hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 text-lg"
          >
            <Layout className="w-5 h-5" />
            View Portfolio Home
          </a>
        </motion.div>

      </div>
    </div>
  );
}
