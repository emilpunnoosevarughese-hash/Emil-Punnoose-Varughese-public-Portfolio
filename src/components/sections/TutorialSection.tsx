import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { SectionTitle } from '../ui/SectionTitle';

interface TutorialSectionProps {
  tutorialsData: any[];
}

export function TutorialSection({ tutorialsData }: TutorialSectionProps) {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent" />
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionTitle 
          title="Insights & Tutorials" 
          subtitle="Sharing my knowledge on AI, full-stack development, and system architecture."
          icon={BookOpen} 
          align="center"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutorialsData.map((tut, index) => (
            <motion.div 
              key={tut.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="glass-effect p-6 rounded-2xl flex items-center space-x-4 cursor-pointer group hover:border-primary/40 transition-all shadow-md hover:shadow-xl"
            >
              <div className="w-14 h-14 rounded-full bg-[var(--color-surface)] flex items-center justify-center shrink-0 border border-[var(--color-border)] group-hover:border-primary/50 transition-colors">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-[var(--color-text-primary)] group-hover:text-primary transition-colors line-clamp-2">{tut.title}</h4>
                <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-widest font-semibold mt-1 block">
                  {tut.category || 'Engineering'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
