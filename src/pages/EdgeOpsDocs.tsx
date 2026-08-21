import { motion } from 'framer-motion';
import { ArrowLeft, Box, LayoutPanelLeft, Code2, Wrench, Settings2, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

export function EdgeOpsDocs() {
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
          <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-teal-500/10 rounded-2xl mb-6 ring-1 ring-teal-500/20">
            <Box className="w-8 h-8 sm:w-10 sm:h-10 text-teal-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--color-text-primary)] mb-4 tracking-tight">
            EdgeOPS <span className="text-teal-500">Docs</span>
          </h1>
          <p className="text-lg md:text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto leading-relaxed">
            The ultimate browser productivity workspace. Replacing dozens of scattered extensions with a single, highly-optimized, premium Manifest V3 architecture.
          </p>
        </motion.div>

        {/* Developer Note */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 flex items-start gap-4 sm:gap-6 shadow-xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 blur-[50px] -z-10 group-hover:bg-teal-500/20 transition-all duration-500" />
          <div className="p-3 bg-teal-500/10 rounded-xl shrink-0">
            <Code2 className="w-6 h-6 text-teal-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">Engineered by Emil</h3>
            <p className="text-[var(--color-text-muted)] leading-relaxed">
              EdgeOPS utilizes cutting-edge web technologies including React 19, Vite, and Tailwind CSS. Leveraging Chrome's new Side Panel API and local IndexedDB storage, it provides a seamless, secure, offline-first experience right inside your browser.
            </p>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-8 flex items-center gap-3">
            <span className="w-8 h-[2px] bg-teal-500 rounded-full"></span>
            Core Architecture
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[var(--color-surface)]/50 border border-[var(--color-border)] rounded-2xl p-6 hover:bg-[var(--color-surface)] transition-all">
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                <LayoutPanelLeft className="w-5 h-5 text-teal-500" /> Manifest V3 Side Panel
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                Fully integrates with Chrome's modern Side Panel API for persistent, distraction-free tooling that stays with you across tabs.
              </p>
            </div>
            
            <div className="bg-[var(--color-surface)]/50 border border-[var(--color-border)] rounded-2xl p-6 hover:bg-[var(--color-surface)] transition-all">
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-500" /> Offline First & Private
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                Zero backend dependencies. All parsing, encoding, formatting, and data generation happens entirely locally in your browser to guarantee privacy.
              </p>
            </div>

            <div className="bg-[var(--color-surface)]/50 border border-[var(--color-border)] rounded-2xl p-6 hover:bg-[var(--color-surface)] transition-all">
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-orange-500" /> Extensive Tooling
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                Combines dozens of micro-tools into one premium UI: JSON formatters, JWT decoders, Base64 conversion, Pomodoro timers, and much more.
              </p>
            </div>

            <div className="bg-[var(--color-surface)]/50 border border-[var(--color-border)] rounded-2xl p-6 hover:bg-[var(--color-surface)] transition-all">
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-pink-500" /> Shadcn & Tailwind
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                Pixel-perfect UI built with a unified design system. Supports full dark/light mode themes, customizable accents, and glassmorphic overlays.
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
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-teal-500 text-white font-bold rounded-xl shadow-lg hover:shadow-teal-500/50 hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 text-lg"
          >
            <Code2 className="w-5 h-5" />
            View Source Code
          </a>
        </motion.div>

      </div>
    </div>
  );
}
