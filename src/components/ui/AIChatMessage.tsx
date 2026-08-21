import { motion } from 'framer-motion';
import { Bot, User, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ChatMessage } from '../../lib/chatLogic';

interface AIChatMessageProps {
  message: ChatMessage;
  onSuggestionClick?: (suggestion: string) => void;
}

export function AIChatMessage({ message, onSuggestionClick }: AIChatMessageProps) {
  const isAi = message.role === 'ai';
  const navigate = useNavigate();

  // Parse **bold** markdown and line breaks for AI messages
  const renderContent = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} style={{ color: 'var(--eg-accent, #a78bfa)', fontWeight: 700 }}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part.split('\n').map((line, j, arr) => (
        <span key={`${i}-${j}`}>
          {line}
          {j < arr.length - 1 && <br />}
        </span>
      ));
    });
  };

  const handleCTA = () => {
    if (!message.cta) return;
    const { href } = message.cta;
    // Internal route vs external URL
    if (href.startsWith('http')) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      navigate(href);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className={`flex w-full mb-5 ${isAi ? 'justify-start' : 'justify-end'}`}
    >
      <div className={`flex max-w-[88%] md:max-w-[78%] ${isAi ? 'flex-row' : 'flex-row-reverse mr-2 sm:mr-4 md:mr-8'}`}>

        {/* Avatar */}
        <div className={`shrink-0 flex items-end ${isAi ? 'mr-2.5' : 'ml-2.5'}`}>
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{
              background: isAi ? 'var(--eg-surface, rgba(255,255,255,0.1))' : 'var(--eg-accent, #a78bfa)',
              border: `1px solid var(--eg-border, rgba(255,255,255,0.15))`,
              color: isAi ? 'var(--eg-accent, #a78bfa)' : 'var(--eg-accent-text, #fff)',
              boxShadow: 'var(--eg-shadow-btn, none)',
            }}
          >
            {isAi ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
          </div>
        </div>

        {/* Message content */}
        <div className="flex flex-col min-w-0">

          {/* Name + timestamp */}
          <div className={`flex items-baseline gap-2 px-1 mb-1 ${isAi ? '' : 'justify-end'}`}>
            <span className="text-[11px] font-semibold" style={{ color: 'var(--eg-text, #f1f5f9)' }}>
              {isAi ? 'Edgar AI' : 'You'}
            </span>
            <span className="text-[10px]" style={{ color: 'var(--eg-text-muted, rgba(241,245,249,0.4))' }}>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {/* Bubble */}
          <div
            className="px-4 py-3 text-sm leading-relaxed break-words"
            style={
              isAi
                ? {
                    background: 'var(--eg-surface, rgba(255,255,255,0.08))',
                    border: `1px solid var(--eg-border, rgba(255,255,255,0.15))`,
                    borderRadius: `var(--eg-radius, 1.25rem) var(--eg-radius, 1.25rem) var(--eg-radius, 1.25rem) 4px`,
                    color: 'var(--eg-text, #f1f5f9)',
                    backdropFilter: 'var(--eg-backdrop, none)',
                    boxShadow: 'var(--eg-shadow, none)',
                  }
                : {
                    background: 'var(--eg-accent, #a78bfa)',
                    border: `1px solid var(--eg-border, transparent)`,
                    borderRadius: `var(--eg-radius, 1.25rem) var(--eg-radius, 1.25rem) 4px var(--eg-radius, 1.25rem)`,
                    color: 'var(--eg-accent-text, #ffffff)',
                    boxShadow: 'var(--eg-shadow-btn, none)',
                  }
            }
          >
            {renderContent(message.content)}
          </div>

          {/* ── CTA Button (e.g. Learning Hub redirect) ── */}
          {isAi && message.cta && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.3 }}
              className="mt-2.5 px-1"
            >
              <button
                onClick={handleCTA}
                className="group flex items-center gap-2.5 w-full px-4 py-3 text-sm font-bold transition-all duration-200 active:scale-[0.97]"
                style={{
                  background: 'var(--eg-accent, #a78bfa)',
                  color: 'var(--eg-accent-text, #ffffff)',
                  borderRadius: 'var(--eg-radius-sm, 0.75rem)',
                  border: `1px solid var(--eg-border, rgba(255,255,255,0.2))`,
                  boxShadow: 'var(--eg-shadow-btn, 0 4px 14px rgba(167,139,250,0.4))',
                  justifyContent: 'center',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--eg-accent-hover, #8b5cf6)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--eg-accent, #a78bfa)')}
              >
                <span className="text-base">{message.cta.icon ?? '🔗'}</span>
                {message.cta.label}
                <ExternalLink className="w-3.5 h-3.5 opacity-75 group-hover:opacity-100 transition-opacity" />
              </button>
            </motion.div>
          )}

          {/* Suggestion chips */}
          {isAi && message.suggestions && message.suggestions.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5 px-1">
              {message.suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => onSuggestionClick?.(s)}
                  className="text-[11px] px-3 py-1.5 font-medium transition-all active:scale-95"
                  style={{
                    background: 'transparent',
                    border: `1px solid var(--eg-accent, #a78bfa)`,
                    borderRadius: 'var(--eg-radius-full, 9999px)',
                    color: 'var(--eg-accent, #a78bfa)',
                    fontFamily: 'var(--eg-font, Inter, sans-serif)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--eg-accent, #a78bfa)';
                    e.currentTarget.style.color = 'var(--eg-accent-text, #fff)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--eg-accent, #a78bfa)';
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
