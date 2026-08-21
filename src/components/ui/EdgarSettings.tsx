import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Palette, User, Trash2, RotateCcw, Volume2, VolumeX, Check } from 'lucide-react';
import { THEMES, type ThemeId, LS_NAME_KEY } from '../../lib/edgarThemes';
import { useTheme } from '../../contexts/ThemeContext';

interface EdgarSettingsProps {
  isOpen: boolean;
  currentTheme: ThemeId;
  onThemeChange: (id: ThemeId) => void;
  onClose: () => void;
  onClearChat: () => void;
  onResetAll: () => void;
  userName: string;
  onNameChange: (name: string) => void;
}

type ConfirmTarget = 'clear' | 'reset' | null;

export function EdgarSettings({
  isOpen,
  currentTheme,
  onThemeChange,
  onClose,
  onClearChat,
  onResetAll,
  userName,
  onNameChange,
}: EdgarSettingsProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || theme === 'midnight';

  const [confirmTarget, setConfirmTarget] = useState<ConfirmTarget>(null);
  const [nameEdit, setNameEdit] = useState(userName);
  const [nameSaved, setNameSaved] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Sync nameEdit when userName changes externally
  useEffect(() => { setNameEdit(userName); }, [userName]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (confirmTarget) { setConfirmTarget(null); }
        else { onClose(); }
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, confirmTarget, onClose]);

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, onClose]);

  const saveName = () => {
    const trimmed = nameEdit.trim();
    try { localStorage.setItem(LS_NAME_KEY, trimmed); } catch { /* ignore */ }
    onNameChange(trimmed);
    setNameSaved(true);
    setTimeout(() => setNameSaved(false), 2000);
  };

  const handleConfirm = () => {
    if (confirmTarget === 'clear') {
      onClearChat();
      onClose();
    } else if (confirmTarget === 'reset') {
      onResetAll();
      onClose();
    }
    setConfirmTarget(null);
  };

  const sectionStyle: React.CSSProperties = {
    borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
    paddingBottom: '1.25rem',
    marginBottom: '1.25rem',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '0.65rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: isDark ? '#a78bfa' : '#6366f1',
    marginBottom: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-50">
            {/* Transparent Backdrop to detect outside clicks but not dim the UI */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
              style={{ background: 'transparent' }}
              onClick={onClose}
            />

            {/* Liquid Glass Popover */}
            <motion.div
              ref={panelRef}
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="absolute top-[72px] right-4 z-10 flex flex-col overflow-hidden shadow-2xl"
              style={{
                width: '100%',
                maxWidth: '380px',
                maxHeight: 'calc(100vh - 100px)',
                borderRadius: '1.25rem',
                background: isDark ? 'rgba(15, 15, 15, 0.5)' : 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(40px) saturate(150%)',
                WebkitBackdropFilter: 'blur(40px) saturate(150%)',
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.8)'}`,
                boxShadow: isDark 
                  ? '0 24px 48px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.1)'
                  : '0 24px 48px -12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255,255,255,0.9)',
              }}
            >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 shrink-0"
              style={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }}
            >
              <span className="font-bold text-sm" style={{ color: isDark ? '#f1f5f9' : '#111827' }}>
                Settings
              </span>
              <button
                onClick={onClose}
                className={`p-1.5 rounded-lg transition-all ${isDark ? 'hover:bg-white/10 text-white/50' : 'hover:bg-black/5 text-gray-500'}`}
                aria-label="Close settings"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-0">

              {/* ── THEME PICKER ── */}
              <div style={sectionStyle}>
                <div style={labelStyle}>
                  <Palette className="w-3 h-3" />
                  Visual Style
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {THEMES.map((theme) => {
                    const isActive = currentTheme === theme.id;
                    return (
                      <button
                        key={theme.id}
                        onClick={() => onThemeChange(theme.id)}
                        className="flex items-center gap-3 w-full px-3 py-2.5 transition-all text-left"
                        style={{
                          borderRadius: '0.85rem',
                          border: isActive
                            ? `1px solid ${isDark ? 'rgba(167,139,250, 0.5)' : 'rgba(99,102,241, 0.5)'}`
                            : `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                          background: isActive
                            ? (isDark ? 'rgba(167,139,250, 0.1)' : 'rgba(99,102,241, 0.08)')
                            : (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.4)'),
                          boxShadow: isActive 
                            ? (isDark ? 'inset 0 1px 0 rgba(255,255,255,0.1)' : 'inset 0 1px 0 rgba(255,255,255,0.5)') 
                            : 'none',
                        }}
                      >
                        {/* Swatch */}
                        <div
                          className="w-8 h-8 rounded-md flex-shrink-0 flex items-center justify-center text-base relative overflow-hidden"
                          style={{
                            background: theme.swatchBg,
                            borderRadius: theme.id === 'brutalism' ? '0' : '8px',
                            border: theme.id === 'brutalism' ? '2px solid #000' : 'none',
                          }}
                        >
                          <span style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.3))' }}>
                            {theme.emoji}
                          </span>
                          {isActive && (
                            <div className="absolute inset-0 flex items-center justify-center"
                              style={{ background: 'rgba(0,0,0,0.35)' }}>
                              <Check className="w-3.5 h-3.5 text-white" />
                            </div>
                          )}
                        </div>

                        {/* Label */}
                        <div className="flex-1 min-w-0">
                          <div
                            className="text-xs font-bold"
                            style={{ color: isActive ? (isDark ? '#a78bfa' : '#6366f1') : (isDark ? '#f1f5f9' : '#111827') }}
                          >
                            {theme.label}
                          </div>
                          <div className="text-[10px] truncate" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
                            {theme.description}
                          </div>
                        </div>

                        {isActive && (
                          <div
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ background: isDark ? '#a78bfa' : '#6366f1' }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── NAME ── */}
              <div style={sectionStyle}>
                <div style={labelStyle}>
                  <User className="w-3 h-3" />
                  Your Name
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={nameEdit}
                    onChange={e => setNameEdit(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && saveName()}
                    placeholder="Enter your name..."
                    maxLength={32}
                    className={`flex-1 px-3 py-2 text-xs outline-none rounded-xl border ${isDark ? 'bg-white/5 border-white/10 text-white placeholder:text-white/40 shadow-inner' : 'bg-white/40 border-black/5 text-black placeholder:text-black/40 shadow-inner'}`}
                  />
                  <button
                    onClick={saveName}
                    className="px-3 py-2 text-xs font-bold flex items-center justify-center gap-1.5 transition-all rounded-xl"
                    style={{
                      background: nameSaved ? '#22c55e' : (isDark ? '#a78bfa' : '#6366f1'),
                      color: '#fff',
                    }}
                  >
                    {nameSaved ? <Check className="w-3 h-3" /> : 'Save'}
                  </button>
                </div>
              </div>

              {/* ── SOUND ── */}
              <div style={sectionStyle}>
                <div style={labelStyle}>
                  {soundOn ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                  Sound Effects
                </div>
                <button
                  onClick={() => setSoundOn(s => !s)}
                  className={`flex items-center gap-3 w-full px-3 py-2.5 transition-all text-left rounded-xl border ${isDark ? 'border-white/5 bg-white/5' : 'border-black/5 bg-white/40'}`}
                >
                  <div
                    className="relative w-9 h-5 rounded-full transition-colors"
                    style={{ background: soundOn ? (isDark ? '#a78bfa' : '#6366f1') : (isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)') }}
                  >
                    <div
                      className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-sm"
                      style={{ left: soundOn ? '1.2rem' : '0.1rem' }}
                    />
                  </div>
                  <span className={`text-xs ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                    {soundOn ? 'On' : 'Off'}
                  </span>
                </button>
              </div>

              {/* ── CLEAR / RESET ── */}
              <div>
                <div style={labelStyle}>
                  <Trash2 className="w-3 h-3" />
                  Data
                </div>

                <AnimatePresence mode="wait">
                  {confirmTarget ? (
                    <motion.div
                      key="confirm"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="p-4 mb-2"
                      style={{
                        background: 'rgba(239,68,68,0.1)',
                        border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: 'var(--eg-radius-sm, 0.75rem)',
                      }}
                    >
                      <p className={`text-xs mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {confirmTarget === 'clear'
                          ? '⚠️ Clear this conversation? This cannot be undone.'
                          : '⚠️ Reset everything? This will forget your name, theme, and all messages.'}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={handleConfirm}
                          className="flex-1 py-2 text-xs font-bold rounded-lg text-white transition-all bg-red-500 hover:bg-red-600"
                        >
                          {confirmTarget === 'clear' ? 'Yes, Clear' : 'Yes, Reset All'}
                        </button>
                        <button
                          onClick={() => setConfirmTarget(null)}
                          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all border ${isDark ? 'border-white/10 text-white/50 bg-white/5 hover:bg-white/10' : 'border-black/10 text-black/50 bg-white/40 hover:bg-white/60'}`}
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="buttons"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="space-y-2"
                    >
                      <button
                        onClick={() => setConfirmTarget('clear')}
                        className={`flex items-center gap-2.5 w-full px-3 py-2.5 text-xs font-medium transition-all rounded-xl border ${isDark ? 'border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'border-red-500/20 bg-red-50 text-red-500 hover:bg-red-100'}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Clear Conversation
                      </button>
                      <button
                        onClick={() => setConfirmTarget('reset')}
                        className={`flex items-center gap-2.5 w-full px-3 py-2.5 text-xs font-medium transition-all rounded-xl border ${isDark ? 'border-red-500/10 bg-white/5 text-white/50 hover:bg-red-500/5' : 'border-red-500/10 bg-white/40 text-black/50 hover:bg-white/60'}`}
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reset Edgar AI (forget everything)
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </>
      )}
    </AnimatePresence>
  );
}
