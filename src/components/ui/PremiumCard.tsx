import { Github } from './SocialIcons';
import { ExternalLink } from 'lucide-react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';

interface PremiumCardProps {
  title: string;
  description: string;
  image: string;
  tags?: string[];
  status?: string;
  githubUrl?: string;
  liveUrl?: string;
  webUrl?: string;
  docsUrl?: string;
  isMobileApp?: boolean;
  onOpenMobileDemo?: (url: string, webUrl?: string, docsUrl?: string) => void;
  index: number;
}

export function PremiumCard({ title, description, image, tags, status, githubUrl, liveUrl, webUrl, docsUrl, isMobileApp, onOpenMobileDemo, index }: PremiumCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    mouseX.set(x * 10);
    mouseY.set(y * -10);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
      }}
      style={{
        rotateX: useMotionTemplate`${mouseY}deg`,
        rotateY: useMotionTemplate`${mouseX}deg`,
        transformPerspective: 1000
      }}
      className="premium-card group cursor-pointer h-full flex flex-col"
    >
      {/* Mac Window Header */}
      <div className="mac-window-header shrink-0">
        <div className="mac-dot close" />
        <div className="mac-dot minimize" />
        <div className="mac-dot maximize" />
        <div className="flex-1 text-center font-mono text-[10px] text-[var(--color-text-muted)] opacity-50 tracking-widest truncate px-2">
          {title.toLowerCase().replace(/\s+/g, '-')}.exe
        </div>
      </div>

      {/* Image Container */}
      <div className="relative aspect-video overflow-hidden shrink-0 bg-black/50">
        <img 
          src={image} 
          alt={title} 
          loading="lazy"
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
        />
        {/* Inner shadow/reflection overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] via-transparent to-transparent opacity-80" />
        
        {status && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-[var(--color-surface)]/80 backdrop-blur-md border border-[var(--color-border)] text-primary">
            {status}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold mb-2 text-[var(--color-text-primary)] group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-[var(--color-text-muted)] text-sm mb-4 line-clamp-3 leading-relaxed flex-1">
          {description}
        </p>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="px-2 py-1 text-[10px] uppercase tracking-wider font-bold rounded bg-primary/10 text-primary border border-primary/20">
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="px-2 py-1 text-[10px] uppercase tracking-wider font-bold rounded bg-[var(--color-surface)] text-[var(--color-text-muted)] border border-[var(--color-border)]">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 mt-auto pt-4 border-t border-[var(--color-border)]">
          {liveUrl && (
            isMobileApp && onOpenMobileDemo ? (
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  onOpenMobileDemo(liveUrl, webUrl, docsUrl);
                }}
                className="flex-1 flex items-center justify-center space-x-2 py-2 rounded-xl text-sm font-bold bg-primary text-white hover:bg-accent hover:shadow-[0_0_15px_rgba(0,102,255,0.4)] transition-all"
              >
                <span>Live Demo</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            ) : (
              <a 
                href={liveUrl} 
                target="_blank" 
                rel="noreferrer"
                className="flex-1 flex items-center justify-center space-x-2 py-2 rounded-xl text-sm font-bold bg-primary text-white hover:bg-accent hover:shadow-[0_0_15px_rgba(0,102,255,0.4)] transition-all"
              >
                <span>Live Demo</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )
          )}
          {docsUrl && !isMobileApp && (
            <a 
              href={docsUrl}
              className="flex-1 flex items-center justify-center space-x-2 py-2 rounded-xl text-sm font-bold bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-primary hover:text-primary transition-all"
            >
              <span>Docs</span>
            </a>
          )}
          {githubUrl && (
            <a 
              href={githubUrl}
              target="_blank" 
              rel="noreferrer"
              className="p-2 rounded-xl glass-effect text-[var(--color-text-primary)] hover:text-primary transition-colors"
              aria-label="View Source Code"
            >
              <Github className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>
      
      {/* Animated Border Glow */}
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-tr from-transparent via-primary/0 to-primary/0 group-hover:via-primary/20 group-hover:to-accent/30 pointer-events-none transition-all duration-500 opacity-0 group-hover:opacity-100" style={{ zIndex: -1 }} />
    </motion.div>
  );
}
