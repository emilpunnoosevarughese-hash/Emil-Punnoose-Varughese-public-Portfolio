import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  align?: 'left' | 'center';
}

export function SectionTitle({ title, subtitle, icon: Icon, align = 'left' }: SectionTitleProps) {
  const containerClass = align === 'center' ? 'flex flex-col items-center text-center' : 'flex flex-col';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`mb-16 ${containerClass}`}
    >
      {Icon && (
        <div className="p-4 rounded-2xl glass-effect shadow-[0_0_20px_rgba(0,102,255,0.15)] mb-6">
          <Icon className="w-8 h-8 text-primary" />
        </div>
      )}
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-4 text-[var(--color-text-primary)]">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg md:text-xl text-[var(--color-text-muted)] max-w-2xl text-balance">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
