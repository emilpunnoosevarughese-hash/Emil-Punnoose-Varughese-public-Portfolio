import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, CheckCircle, Smartphone, Server, Code, Database } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

export function RentBookDocs() {
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
            <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--color-text-primary)] mb-4 tracking-tight">
            Rent Book Pro <span className="text-primary">Docs</span>
          </h1>
          <p className="text-lg md:text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto leading-relaxed">
            A comprehensive property and tenant management application engineered to automate rent collections, track revenue, and manage deployments seamlessly.
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
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">Lead Developer</h3>
            <p className="text-[var(--color-text-muted)] leading-relaxed">
              Designed and developed by <strong className="text-[var(--color-text-primary)]">Emil</strong>. The architecture focuses on performance, scalability, and a premium mobile-first user experience.
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
            Core Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[var(--color-surface)]/50 border border-[var(--color-border)] rounded-2xl p-6 hover:bg-[var(--color-surface)] transition-all">
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" /> Dashboard Analytics
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                Real-time tracking of active deployments, pending returns, and late returns. Instantly view critical action items to maintain optimal operational efficiency.
              </p>
            </div>
            
            <div className="bg-[var(--color-surface)]/50 border border-[var(--color-border)] rounded-2xl p-6 hover:bg-[var(--color-surface)] transition-all">
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" /> Financial Tracking
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                Monitor booked revenue and pending payments. The system clearly labels accounts awaiting collection, simplifying the rent recovery process.
              </p>
            </div>

            <div className="bg-[var(--color-surface)]/50 border border-[var(--color-border)] rounded-2xl p-6 hover:bg-[var(--color-surface)] transition-all">
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" /> Customer Management
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                Maintain a centralized database of active and registered customers, making it easy to track tenant history and current lease status.
              </p>
            </div>

            <div className="bg-[var(--color-surface)]/50 border border-[var(--color-border)] rounded-2xl p-6 hover:bg-[var(--color-surface)] transition-all">
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" /> Mobile-First Design
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                A fully responsive, app-like interface that provides property managers with full control directly from their smartphone or tablet.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-8 flex items-center gap-3">
            <span className="w-8 h-[2px] bg-primary rounded-full"></span>
            Technology Stack
          </h2>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm font-medium text-[var(--color-text-primary)]">
              <Code className="w-4 h-4 text-blue-400" /> React & TypeScript
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm font-medium text-[var(--color-text-primary)]">
              <Smartphone className="w-4 h-4 text-cyan-400" /> Tailwind CSS
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm font-medium text-[var(--color-text-primary)]">
              <Server className="w-4 h-4 text-yellow-400" /> Vite Bundler
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm font-medium text-[var(--color-text-primary)]">
              <Database className="w-4 h-4 text-purple-400" /> Framer Motion
            </div>
          </div>
        </motion.div>

        {/* View App Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 flex justify-center"
        >
          <a
            href="/rent-book-pro/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:shadow-primary/50 hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 text-lg"
          >
            <Smartphone className="w-5 h-5" />
            Launch Web View
          </a>
        </motion.div>

      </div>
    </div>
  );
}
