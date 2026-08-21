// ─── 7 Theme Token Sets for Edgar AI ────────────────────────────────────────
// Each theme defines CSS custom properties applied to the chat container only.
// Switching themes is a single class/var swap — zero per-component overrides.

export type ThemeId =
  | 'glassmorphism'
  | 'neumorphism'
  | 'skeuomorphism'
  | 'claymorphism'
  | 'minimalism'
  | 'maximalism'
  | 'brutalism';

export interface ThemeTokens {
  id: ThemeId;
  label: string;
  emoji: string;
  description: string;
  swatchBg: string;       // for the swatch preview in settings
  swatchAccent: string;   // for the swatch dot
  vars: Record<string, string>;
}

export const THEMES: ThemeTokens[] = [
  // ── 1. GLASSMORPHISM ──────────────────────────────────────────────────────
  {
    id: 'glassmorphism',
    label: 'Glass',
    emoji: '🪟',
    description: 'Frosted glass, translucent layers',
    swatchBg: 'linear-gradient(135deg, rgba(99,102,241,0.4) 0%, rgba(168,85,247,0.4) 100%)',
    swatchAccent: '#a78bfa',
    vars: {
      '--eg-bg':            'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
      '--eg-bg-solid':      '#1e1b4b',
      '--eg-surface':       'rgba(255,255,255,0.08)',
      '--eg-surface-high':  'rgba(255,255,255,0.14)',
      '--eg-header':        'rgba(255,255,255,0.06)',
      '--eg-input':         'rgba(255,255,255,0.08)',
      '--eg-text':          '#f1f5f9',
      '--eg-text-muted':    'rgba(241,245,249,0.5)',
      '--eg-accent':        '#a78bfa',
      '--eg-accent-hover':  '#8b5cf6',
      '--eg-accent-text':   '#ffffff',
      '--eg-border':        'rgba(255,255,255,0.18)',
      '--eg-shadow':        '0 8px 32px rgba(31,38,135,0.37)',
      '--eg-shadow-btn':    '0 4px 20px rgba(167,139,250,0.4)',
      '--eg-radius':        '1.25rem',
      '--eg-radius-sm':     '0.75rem',
      '--eg-radius-full':   '9999px',
      '--eg-font':          "'Inter', sans-serif",
      '--eg-backdrop':      'blur(16px)',
      '--eg-blob1':         'rgba(139,92,246,0.35)',
      '--eg-blob2':         'rgba(99,102,241,0.3)',
    },
  },

  // ── 2. NEUMORPHISM ────────────────────────────────────────────────────────
  {
    id: 'neumorphism',
    label: 'Neu',
    emoji: '🧊',
    description: 'Soft extruded monochromatic surfaces',
    swatchBg: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
    swatchAccent: '#6366f1',
    vars: {
      '--eg-bg':            'linear-gradient(135deg, #dde1e7 0%, #dde1e7 100%)',
      '--eg-bg-solid':      '#dde1e7',
      '--eg-surface':       '#dde1e7',
      '--eg-surface-high':  '#e8ecf0',
      '--eg-header':        '#dde1e7',
      '--eg-input':         '#dde1e7',
      '--eg-text':          '#334155',
      '--eg-text-muted':    '#94a3b8',
      '--eg-accent':        '#6366f1',
      '--eg-accent-hover':  '#4f46e5',
      '--eg-accent-text':   '#ffffff',
      '--eg-border':        'transparent',
      '--eg-shadow':        '-6px -6px 14px rgba(255,255,255,0.9), 6px 6px 14px rgba(0,0,0,0.12)',
      '--eg-shadow-btn':    '-3px -3px 8px rgba(255,255,255,0.9), 3px 3px 8px rgba(0,0,0,0.12)',
      '--eg-radius':        '1.5rem',
      '--eg-radius-sm':     '1rem',
      '--eg-radius-full':   '9999px',
      '--eg-font':          "'Inter', sans-serif",
      '--eg-backdrop':      'none',
      '--eg-blob1':         'transparent',
      '--eg-blob2':         'transparent',
    },
  },

  // ── 3. SKEUOMORPHISM ─────────────────────────────────────────────────────
  {
    id: 'skeuomorphism',
    label: 'Skeu',
    emoji: '🪨',
    description: 'Realistic textures, tactile surfaces',
    swatchBg: 'linear-gradient(145deg, #4a5568 0%, #2d3748 60%, #1a202c 100%)',
    swatchAccent: '#68d391',
    vars: {
      '--eg-bg':            'linear-gradient(145deg, #3a4150 0%, #2c3344 100%)',
      '--eg-bg-solid':      '#2c3344',
      '--eg-surface':       'linear-gradient(145deg, #3d4455, #2a3040)',
      '--eg-surface-high':  'linear-gradient(145deg, #454d60, #333c50)',
      '--eg-header':        'linear-gradient(180deg, #404856, #2e3648)',
      '--eg-input':         'linear-gradient(145deg, #252d3c, #2d3648)',
      '--eg-text':          '#e2e8f0',
      '--eg-text-muted':    '#8896b0',
      '--eg-accent':        '#68d391',
      '--eg-accent-hover':  '#48bb78',
      '--eg-accent-text':   '#1a202c',
      '--eg-border':        'rgba(255,255,255,0.12)',
      '--eg-shadow':        '2px 2px 8px rgba(0,0,0,0.5), -1px -1px 4px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.08)',
      '--eg-shadow-btn':    '2px 2px 6px rgba(0,0,0,0.4), -1px -1px 3px rgba(255,255,255,0.05)',
      '--eg-radius':        '0.75rem',
      '--eg-radius-sm':     '0.5rem',
      '--eg-radius-full':   '0.5rem',
      '--eg-font':          "'Inter', sans-serif",
      '--eg-backdrop':      'none',
      '--eg-blob1':         'transparent',
      '--eg-blob2':         'transparent',
    },
  },

  // ── 4. CLAYMORPHISM ──────────────────────────────────────────────────────
  {
    id: 'claymorphism',
    label: 'Clay',
    emoji: '🫧',
    description: 'Puffy clay shapes, pastel palette',
    swatchBg: 'linear-gradient(135deg, #fbc2eb 0%, #a18cd1 100%)',
    swatchAccent: '#f472b6',
    vars: {
      '--eg-bg':            'linear-gradient(135deg, #fdf4ff 0%, #f0e6ff 100%)',
      '--eg-bg-solid':      '#fdf4ff',
      '--eg-surface':       '#ffffff',
      '--eg-surface-high':  '#fdf4ff',
      '--eg-header':        '#ffffff',
      '--eg-input':         '#f9f0ff',
      '--eg-text':          '#4c1d95',
      '--eg-text-muted':    '#9d8ac7',
      '--eg-accent':        '#f472b6',
      '--eg-accent-hover':  '#ec4899',
      '--eg-accent-text':   '#ffffff',
      '--eg-border':        'rgba(244,114,182,0.25)',
      '--eg-shadow':        '0 12px 40px rgba(196,149,245,0.35), 0 4px 16px rgba(196,149,245,0.2)',
      '--eg-shadow-btn':    '0 8px 20px rgba(244,114,182,0.35)',
      '--eg-radius':        '2rem',
      '--eg-radius-sm':     '1.5rem',
      '--eg-radius-full':   '9999px',
      '--eg-font':          "'Nunito', 'Inter', sans-serif",
      '--eg-backdrop':      'none',
      '--eg-blob1':         'rgba(244,114,182,0.15)',
      '--eg-blob2':         'rgba(167,139,250,0.15)',
    },
  },

  // ── 5. MINIMALISM ─────────────────────────────────────────────────────────
  {
    id: 'minimalism',
    label: 'Minimal',
    emoji: '⬜',
    description: 'Clean, white, maximum breathing room',
    swatchBg: '#f8fafc',
    swatchAccent: '#0f172a',
    vars: {
      '--eg-bg':            '#f8fafc',
      '--eg-bg-solid':      '#f8fafc',
      '--eg-surface':       '#ffffff',
      '--eg-surface-high':  '#f1f5f9',
      '--eg-header':        '#ffffff',
      '--eg-input':         '#f8fafc',
      '--eg-text':          '#0f172a',
      '--eg-text-muted':    '#64748b',
      '--eg-accent':        '#0f172a',
      '--eg-accent-hover':  '#1e293b',
      '--eg-accent-text':   '#ffffff',
      '--eg-border':        '#e2e8f0',
      '--eg-shadow':        '0 1px 3px rgba(0,0,0,0.06)',
      '--eg-shadow-btn':    '0 1px 2px rgba(0,0,0,0.1)',
      '--eg-radius':        '0.75rem',
      '--eg-radius-sm':     '0.5rem',
      '--eg-radius-full':   '9999px',
      '--eg-font':          "'Inter', sans-serif",
      '--eg-backdrop':      'none',
      '--eg-blob1':         'transparent',
      '--eg-blob2':         'transparent',
    },
  },

  // ── 6. MAXIMALISM ─────────────────────────────────────────────────────────
  {
    id: 'maximalism',
    label: 'Maximal',
    emoji: '🌈',
    description: 'Bold colors, dense, expressive',
    swatchBg: 'linear-gradient(135deg, #f97316 0%, #ec4899 40%, #8b5cf6 80%, #06b6d4 100%)',
    swatchAccent: '#fbbf24',
    vars: {
      '--eg-bg':            'linear-gradient(135deg, #0f0524 0%, #1a0536 40%, #0a1628 100%)',
      '--eg-bg-solid':      '#0f0524',
      '--eg-surface':       'linear-gradient(135deg, rgba(249,115,22,0.12) 0%, rgba(139,92,246,0.12) 100%)',
      '--eg-surface-high':  'rgba(255,255,255,0.08)',
      '--eg-header':        'linear-gradient(90deg, rgba(249,115,22,0.15) 0%, rgba(139,92,246,0.15) 100%)',
      '--eg-input':         'rgba(255,255,255,0.06)',
      '--eg-text':          '#ffffff',
      '--eg-text-muted':    'rgba(255,255,255,0.55)',
      '--eg-accent':        '#f97316',
      '--eg-accent-hover':  '#fb923c',
      '--eg-accent-text':   '#ffffff',
      '--eg-border':        'rgba(249,115,22,0.3)',
      '--eg-shadow':        '0 0 40px rgba(249,115,22,0.2), 0 8px 24px rgba(0,0,0,0.5)',
      '--eg-shadow-btn':    '0 0 20px rgba(249,115,22,0.5)',
      '--eg-radius':        '1rem',
      '--eg-radius-sm':     '0.75rem',
      '--eg-radius-full':   '9999px',
      '--eg-font':          "'Inter', sans-serif",
      '--eg-backdrop':      'blur(8px)',
      '--eg-blob1':         'rgba(249,115,22,0.3)',
      '--eg-blob2':         'rgba(139,92,246,0.3)',
    },
  },

  // ── 7. BRUTALISM ──────────────────────────────────────────────────────────
  {
    id: 'brutalism',
    label: 'Brutal',
    emoji: '🔨',
    description: 'Raw, high-contrast, exposed structure',
    swatchBg: '#ffffff',
    swatchAccent: '#000000',
    vars: {
      '--eg-bg':            '#f5f0e8',
      '--eg-bg-solid':      '#f5f0e8',
      '--eg-surface':       '#ffffff',
      '--eg-surface-high':  '#fffde7',
      '--eg-header':        '#ffffff',
      '--eg-input':         '#ffffff',
      '--eg-text':          '#000000',
      '--eg-text-muted':    '#444444',
      '--eg-accent':        '#000000',
      '--eg-accent-hover':  '#333333',
      '--eg-accent-text':   '#ffff00',
      '--eg-border':        '#000000',
      '--eg-shadow':        '4px 4px 0px #000000',
      '--eg-shadow-btn':    '3px 3px 0px #000000',
      '--eg-radius':        '0px',
      '--eg-radius-sm':     '0px',
      '--eg-radius-full':   '0px',
      '--eg-font':          "'Courier New', 'Courier', monospace",
      '--eg-backdrop':      'none',
      '--eg-blob1':         'transparent',
      '--eg-blob2':         'transparent',
    },
  },
];

export const DEFAULT_THEME: ThemeId = 'glassmorphism';
export const LS_THEME_KEY = 'edgarAI_theme';
export const LS_NAME_KEY  = 'edgarAI_userName';

/** Apply a theme's CSS variables to a specific DOM element */
export function applyThemeToElement(element: HTMLElement, themeId: ThemeId): void {
  const theme = THEMES.find(t => t.id === themeId);
  if (!theme) return;
  Object.entries(theme.vars).forEach(([key, value]) => {
    element.style.setProperty(key, value);
  });
}

/** Read theme from localStorage */
export function getStoredTheme(): ThemeId {
  try {
    const stored = localStorage.getItem(LS_THEME_KEY);
    if (stored && THEMES.find(t => t.id === stored)) return stored as ThemeId;
  } catch { /* ignore */ }
  return DEFAULT_THEME;
}

/** Persist theme to localStorage */
export function storeTheme(themeId: ThemeId): void {
  try { localStorage.setItem(LS_THEME_KEY, themeId); } catch { /* ignore */ }
}
