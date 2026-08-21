import { motion } from 'framer-motion';
import { ArrowLeft, Wallet, ShieldCheck, Database, Award, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

export function QuizRewardDocs() {
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
          <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-orange-500/10 rounded-2xl mb-6 ring-1 ring-orange-500/20">
            <Award className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--color-text-primary)] mb-4 tracking-tight">
            QuizReward <span className="text-orange-500">API Docs</span>
          </h1>
          <p className="text-lg md:text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto leading-relaxed">
            Gamified learning and reward platform architecture. Explore the backend API contract that powers secure transactions and gameplay.
          </p>
        </motion.div>

        {/* Developer Note */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 flex items-start gap-4 sm:gap-6 shadow-xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-[50px] -z-10 group-hover:bg-orange-500/20 transition-all duration-500" />
          <div className="p-3 bg-orange-500/10 rounded-xl shrink-0">
            <ShieldCheck className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">Secure Backend Architecture</h3>
            <p className="text-[var(--color-text-muted)] leading-relaxed">
              Designed with security-first principles by <strong className="text-[var(--color-text-primary)]">Emil</strong>. The platform uses a central ledger system for wallet transactions, idempotency keys for ad rewards, and JWT authentication.
            </p>
          </div>
        </motion.div>

        {/* API Sections */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="space-y-8"
        >
          <div className="bg-[var(--color-surface)]/50 border border-[var(--color-border)] rounded-2xl p-6">
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-orange-500" /> Authentication
            </h3>
            <div className="bg-black/30 rounded-lg p-4 font-mono text-sm text-[var(--color-text-muted)] mb-4">
              Authorization: Bearer &lt;JWT_TOKEN&gt;
            </div>
            <ul className="space-y-3 text-sm text-[var(--color-text-muted)]">
              <li><strong className="text-green-400">POST</strong> /auth/login</li>
              <li><strong className="text-green-400">POST</strong> /auth/refresh</li>
              <li><strong className="text-blue-400">GET</strong> /me <span className="opacity-50">- Returns user details & balances</span></li>
            </ul>
          </div>

          <div className="bg-[var(--color-surface)]/50 border border-[var(--color-border)] rounded-2xl p-6">
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-orange-500" /> Quiz Core & Gameplay
            </h3>
            <ul className="space-y-3 text-sm text-[var(--color-text-muted)]">
              <li><strong className="text-blue-400">GET</strong> /categories</li>
              <li><strong className="text-blue-400">GET</strong> /subjects?category_id=1</li>
              <li><strong className="text-blue-400">GET</strong> /questions?topic_id=1&limit=10</li>
              <li><strong className="text-green-400">POST</strong> /quiz/start <span className="opacity-50">- Body: {`{ "type": "topic", "topic_id": 1 }`}</span></li>
              <li><strong className="text-green-400">POST</strong> /quiz/answer <span className="opacity-50">- Validates response time & answer</span></li>
              <li><strong className="text-green-400">POST</strong> /quiz/finish <span className="opacity-50">- Mints coins based on score</span></li>
            </ul>
          </div>

          <div className="bg-[var(--color-surface)]/50 border border-[var(--color-border)] rounded-2xl p-6">
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-3">
              <Wallet className="w-6 h-6 text-orange-500" /> Wallet & Transactions
            </h3>
            <ul className="space-y-3 text-sm text-[var(--color-text-muted)]">
              <li><strong className="text-blue-400">GET</strong> /wallet <span className="opacity-50">- Fetch coin & cash balance</span></li>
              <li><strong className="text-blue-400">GET</strong> /wallet/ledger <span className="opacity-50">- Transaction history</span></li>
              <li><strong className="text-green-400">POST</strong> /wallet/withdrawal-request <span className="opacity-50">- Convert coins to INR</span></li>
              <li><strong className="text-green-400">POST</strong> /ads/reward-claim <span className="opacity-50">- Idempotent ad-watching reward</span></li>
            </ul>
          </div>

          <div className="bg-[var(--color-surface)]/50 border border-[var(--color-border)] rounded-2xl p-6">
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-3">
              <Database className="w-6 h-6 text-orange-500" /> Administrative & Webhooks
            </h3>
            <ul className="space-y-3 text-sm text-[var(--color-text-muted)]">
              <li><strong className="text-yellow-400">ADMIN</strong> /admin/dashboard</li>
              <li><strong className="text-yellow-400">ADMIN</strong> /admin/fraud-events <span className="opacity-50">- Check for anomaly detections</span></li>
              <li><strong className="text-yellow-400">ADMIN</strong> /admin/withdrawals/:id/approve</li>
              <li><strong className="text-purple-400">HOOK</strong> /webhooks/payout-provider <span className="opacity-50">- Async payout callbacks</span></li>
            </ul>
          </div>
        </motion.div>

        {/* View App Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 flex justify-center"
        >
          <a
            href="/quizreward/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-orange-500 text-white font-bold rounded-xl shadow-lg hover:shadow-orange-500/50 hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 text-lg"
          >
            <Award className="w-5 h-5" />
            Launch QuizReward Demo
          </a>
        </motion.div>

      </div>
    </div>
  );
}
