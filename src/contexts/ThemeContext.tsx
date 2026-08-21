import { createContext, useContext, useEffect, useState } from 'react';
import { useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

type Theme = 'light' | 'dark' | 'midnight';
type AccentMode = 'auto' | 'blue' | 'pink' | 'green' | 'purple';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  accentMode: AccentMode;
  setAccentMode: (mode: AccentMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ACCENT_COLORS = {
  blue: '#3b82f6', // Ocean Blue
  pink: '#ec4899', // Neon Pink
  green: '#10b981', // Emerald Green
  purple: '#8b5cf6', // Cyber Purple
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('portfolio-theme') as Theme;
    if (savedTheme) return savedTheme;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  });

  const [accentMode, setAccentMode] = useState<AccentMode>(() => {
    return (localStorage.getItem('portfolio-accent') as AccentMode) || 'auto';
  });

  // Handle core theme mode
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    if (theme === 'dark' || theme === 'midnight') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  // Handle accent mode manual overrides
  useEffect(() => {
    localStorage.setItem('portfolio-accent', accentMode);
    
    if (accentMode !== 'auto') {
      const root = document.documentElement;
      root.style.setProperty('--color-primary', ACCENT_COLORS[accentMode]);
    }
  }, [accentMode]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, accentMode, setAccentMode }}>
      <ScrollAccentHandler accentMode={accentMode} />
      {children}
    </ThemeContext.Provider>
  );
}

// A dedicated component to handle the scroll color morphing
// Needs to be separate from the provider to not cause full app re-renders on scroll
function ScrollAccentHandler({ accentMode }: { accentMode: AccentMode }) {
  const { scrollYProgress } = useScroll();
  
  // Create a color interpolation sequence based on scroll depth
  const colorProgress = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [
      ACCENT_COLORS.blue,
      ACCENT_COLORS.purple,
      ACCENT_COLORS.pink,
      '#f97316', // Orange
      ACCENT_COLORS.green
    ]
  );

  // Apply the color to the DOM in real-time
  useMotionValueEvent(colorProgress, "change", (latestColor) => {
    if (accentMode === 'auto') {
      document.documentElement.style.setProperty('--color-primary', latestColor);
    }
  });

  return null;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
