import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface SpecPanelProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  animate?: boolean;
  delay?: number;
}

export function SpecPanel({ children, className = '', hover = true, animate = true, delay = 0 }: SpecPanelProps) {
  const base = 'relative rounded-[8px] border bg-[var(--sl-bg-panel)] border-[var(--sl-border)]';
  const hoverCls = hover ? 'transition-shadow duration-200 hover:[box-shadow:inset_0_0_0_1px_rgba(76,141,255,0.08)]' : '';
  const baseClass = `${base} ${hoverCls} ${className}`;
  if (animate) {
    return (
      <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15, ease: 'easeOut', delay }} className={baseClass}>
        {children}
      </motion.div>
    );
  }
  return <div className={baseClass}>{children}</div>;
}
