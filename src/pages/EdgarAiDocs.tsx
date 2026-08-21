import { motion } from 'framer-motion';
import { ArrowLeft, Cpu, CheckCircle, BrainCircuit, MessageSquare, Zap, Network } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

export function EdgarAiDocs() {
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
            <BrainCircuit className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--color-text-primary)] mb-4 tracking-tight">
            Edgar AI 2.0 <span className="text-primary">Docs</span>
          </h1>
          <p className="text-lg md:text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto leading-relaxed">
            The foundation of next-generation artificial intelligence. A sophisticated conversational search and interaction engine built for speed and precision.
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
            <Cpu className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">Lead Developer</h3>
            <p className="text-[var(--color-text-muted)] leading-relaxed">
              Engineered and designed by <strong className="text-[var(--color-text-primary)]">Emil</strong>. The Edgar AI Foundation focuses on highly-optimized natural language processing, dynamic conversation contexts, and unparalleled user experience.
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
                <CheckCircle className="w-5 h-5 text-green-500" /> Natural Language Search
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                Process complex human queries with advanced tokenization. Edgar understands context rather than just keyword matching, providing superior search results.
              </p>
            </div>
            
            <div className="bg-[var(--color-surface)]/50 border border-[var(--color-border)] rounded-2xl p-6 hover:bg-[var(--color-surface)] transition-all">
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" /> Persistent Context
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                Seamlessly remember conversation history. The AI maintains an intelligent memory buffer that allows for follow-up questions and conversational chaining.
              </p>
            </div>

            <div className="bg-[var(--color-surface)]/50 border border-[var(--color-border)] rounded-2xl p-6 hover:bg-[var(--color-surface)] transition-all">
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" /> Real-time Streaming
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                Tokens are streamed in real-time to the user interface, minimizing perceived latency and providing a fluid, human-like interaction experience.
              </p>
            </div>

            <div className="bg-[var(--color-surface)]/50 border border-[var(--color-border)] rounded-2xl p-6 hover:bg-[var(--color-surface)] transition-all">
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" /> Deep Analytics
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                Every query is analyzed for sentiment, intent, and complexity, allowing the Edgar AI engine to continually self-optimize and learn over time.
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
              <MessageSquare className="w-4 h-4 text-blue-400" /> React & TypeScript
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm font-medium text-[var(--color-text-primary)]">
              <Zap className="w-4 h-4 text-cyan-400" /> Edge Compute
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm font-medium text-[var(--color-text-primary)]">
              <Network className="w-4 h-4 text-purple-400" /> Neural Architecture
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
            href="/ai-chat"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:shadow-primary/50 hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 text-lg"
          >
            <BrainCircuit className="w-5 h-5" />
            Launch Edgar AI
          </a>
        </motion.div>

      </div>
    </div>
  );
}
