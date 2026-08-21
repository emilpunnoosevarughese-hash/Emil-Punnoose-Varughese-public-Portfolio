import { useState, useRef, useEffect } from 'react';
import { Palette, Sparkles, Droplet } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const ACCENT_OPTIONS = [
  { id: 'auto', label: 'Auto (Scroll)', color: 'linear-gradient(to right, #3b82f6, #ec4899, #10b981)' },
  { id: 'blue', label: 'Ocean Blue', color: '#3b82f6' },
  { id: 'pink', label: 'Neon Pink', color: '#ec4899' },
  { id: 'green', label: 'Emerald Green', color: '#10b981' },
  { id: 'purple', label: 'Cyber Purple', color: '#8b5cf6' },
] as const;

export function PaletteToggle() {
  const { accentMode, setAccentMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl transition-all duration-300 hover:bg-[var(--color-surface)] border border-transparent hover:border-[var(--color-border)] group relative"
        aria-label="Change Accent Color"
      >
        <Palette className="w-5 h-5 text-[var(--color-text-muted)] group-hover:text-primary transition-colors" />
        
        {/* Active Indicator Dot */}
        {accentMode !== 'auto' && (
          <span 
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" 
            style={{ backgroundColor: ACCENT_OPTIONS.find(o => o.id === accentMode)?.color }}
          />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-48 rounded-2xl glass-effect p-2 shadow-2xl border border-[var(--color-border)] z-50 flex flex-col gap-1"
          >
            {ACCENT_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  setAccentMode(option.id as any);
                  setIsOpen(false);
                }}
                className={`flex items-center space-x-3 w-full p-2.5 rounded-xl transition-colors text-sm ${
                  accentMode === option.id 
                    ? 'bg-primary/10 text-[var(--color-text-primary)] font-medium' 
                    : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                <div 
                  className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm flex items-center justify-center overflow-hidden"
                  style={{ background: option.color }}
                >
                  {option.id === 'auto' && <Sparkles className="w-2.5 h-2.5 text-white mix-blend-overlay" />}
                </div>
                <span>{option.label}</span>
                
                {accentMode === option.id && (
                  <Droplet className="w-4 h-4 ml-auto text-primary" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
