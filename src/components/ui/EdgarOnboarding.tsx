import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Bot, Sparkles } from 'lucide-react';
import { LS_NAME_KEY } from '../../lib/edgarThemes';

interface EdgarOnboardingProps {
  onComplete: (name: string) => void;
}

export function EdgarOnboarding({ onComplete }: EdgarOnboardingProps) {
  const [nameInput, setNameInput] = useState('');
  const [shaking, setShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus after mount animation
    const t = setTimeout(() => inputRef.current?.focus(), 600);
    return () => clearTimeout(t);
  }, []);

  const submit = (name: string) => {
    const trimmed = name.trim();
    const finalName = trimmed || '';
    try { localStorage.setItem(LS_NAME_KEY, finalName); } catch { /* ignore */ }
    onComplete(finalName);
  };

  const handleContinue = () => {
    if (!nameInput.trim()) {
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      return;
    }
    submit(nameInput);
  };

  const handleSkip = () => submit('');

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleContinue();
    if (e.key === 'Escape') handleSkip();
  };

  return (
    <motion.div
      key="onboarding"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="absolute inset-0 flex flex-col items-center justify-center p-6 z-20"
      style={{ background: 'var(--eg-bg-solid, #1e1b4b)' }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'var(--eg-blob1, rgba(139,92,246,0.3))' }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'var(--eg-blob2, rgba(99,102,241,0.25))' }}
      />

      <motion.div
        initial={{ scale: 0.8, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1, type: 'spring', bounce: 0.35 }}
        className="w-full max-w-sm relative z-10"
        style={{ fontFamily: 'var(--eg-font, Inter, sans-serif)' }}
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <motion.div
            animate={{ rotate: [0, -5, 5, -3, 3, 0] }}
            transition={{ duration: 1.2, delay: 0.6, ease: 'easeInOut' }}
            className="w-16 h-16 flex items-center justify-center text-3xl"
            style={{
              background: 'var(--eg-surface, rgba(255,255,255,0.1))',
              border: '1px solid var(--eg-border, rgba(255,255,255,0.2))',
              borderRadius: 'var(--eg-radius, 1.25rem)',
              boxShadow: 'var(--eg-shadow, none)',
            }}
          >
            <Bot className="w-8 h-8" style={{ color: 'var(--eg-accent, #a78bfa)' }} />
          </motion.div>
        </div>

        {/* Card */}
        <div
          className="p-7 w-full"
          style={{
            background: 'var(--eg-surface, rgba(255,255,255,0.08))',
            border: '1px solid var(--eg-border, rgba(255,255,255,0.18))',
            borderRadius: 'var(--eg-radius, 1.25rem)',
            boxShadow: 'var(--eg-shadow, none)',
            backdropFilter: 'var(--eg-backdrop, blur(16px))',
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4" style={{ color: 'var(--eg-accent, #a78bfa)' }} />
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--eg-accent, #a78bfa)' }}>
              Edgar AI
            </span>
          </div>
          <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--eg-text, #f1f5f9)' }}>
            Hi, I'm Edgar AI 👋
          </h2>
          <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--eg-text-muted, rgba(241,245,249,0.55))' }}>
            What should I call you? I'll personalize your experience.
          </p>

          {/* Input */}
          <motion.div
            animate={shaking ? { x: [-8, 8, -6, 6, -4, 4, 0] } : { x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <input
              ref={inputRef}
              type="text"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Your name..."
              maxLength={32}
              className="w-full px-4 py-3 text-sm mb-3 outline-none transition-all"
              style={{
                background: 'var(--eg-input, rgba(255,255,255,0.06))',
                border: '1px solid var(--eg-border, rgba(255,255,255,0.2))',
                borderRadius: 'var(--eg-radius-sm, 0.75rem)',
                color: 'var(--eg-text, #f1f5f9)',
                fontFamily: 'var(--eg-font, Inter, sans-serif)',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
              }}
            />
          </motion.div>

          {/* Continue button */}
          <button
            onClick={handleContinue}
            className="w-full py-3 text-sm font-bold tracking-wide transition-all duration-200 active:scale-95"
            style={{
              background: 'var(--eg-accent, #a78bfa)',
              color: 'var(--eg-accent-text, #fff)',
              borderRadius: 'var(--eg-radius-sm, 0.75rem)',
              border: '1px solid var(--eg-border, transparent)',
              boxShadow: 'var(--eg-shadow-btn, none)',
              fontFamily: 'var(--eg-font, Inter, sans-serif)',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--eg-accent-hover, #8b5cf6)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--eg-accent, #a78bfa)')}
          >
            Continue →
          </button>

          {/* Skip */}
          <button
            onClick={handleSkip}
            className="w-full mt-3 py-2 text-xs transition-all"
            style={{
              color: 'var(--eg-text-muted, rgba(241,245,249,0.45))',
              background: 'transparent',
              border: 'none',
              fontFamily: 'var(--eg-font, Inter, sans-serif)',
            }}
          >
            Just show me the chat →
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
