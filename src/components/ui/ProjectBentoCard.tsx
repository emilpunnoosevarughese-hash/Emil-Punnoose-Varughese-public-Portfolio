import { Github } from './SocialIcons';
import { ExternalLink } from 'lucide-react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';

interface ProjectBentoCardProps {
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
  isFeatured?: boolean;
}

export function ProjectBentoCard({ 
  title, description, image, tags, status, githubUrl, liveUrl, webUrl, docsUrl, 
  isMobileApp, onOpenMobileDemo, index, isFeatured 
}: ProjectBentoCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
      onMouseMove={handleMouseMove}
      className={`group relative overflow-hidden rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-primary/50 transition-colors duration-500 h-full flex flex-col ${isFeatured ? 'md:col-span-2 md:row-span-2' : ''}`}
    >
      {/* Dynamic Hover Glow */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500 z-10"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(0,102,255,0.15),
              transparent 80%
            )
          `,
        }}
      />

      {/* Image Section */}
      <div className={`relative w-full overflow-hidden shrink-0 ${isFeatured ? 'h-64 md:h-80' : 'h-48'}`}>
        <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-700 z-10" />
        <img 
          src={image} 
          alt={title} 
          loading="lazy"
          className="w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-1000 ease-out" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] via-[var(--color-surface)]/20 to-transparent z-10 opacity-90" />
        
        {/* Status Badge */}
        {status && (
          <div className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-black/60 backdrop-blur-md border border-white/10 text-white shadow-lg">
            {status}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="relative z-20 flex flex-col flex-1 p-6 -mt-10">
        <h3 className={`font-bold text-white group-hover:text-primary transition-colors duration-300 drop-shadow-md ${isFeatured ? 'text-3xl mb-3' : 'text-xl mb-2'}`}>
          {title}
        </h3>
        <p className={`text-[var(--color-text-muted)] leading-relaxed flex-1 ${isFeatured ? 'text-base mb-6' : 'text-sm mb-4 line-clamp-3'}`}>
          {description}
        </p>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.slice(0, isFeatured ? 5 : 3).map((tag, i) => (
              <span key={i} className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded-lg bg-white/5 text-white/70 border border-white/10 backdrop-blur-sm group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 transition-colors">
                {tag}
              </span>
            ))}
            {tags.length > (isFeatured ? 5 : 3) && (
              <span className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded-lg bg-white/5 text-white/50 border border-white/10">
                +{tags.length - (isFeatured ? 5 : 3)}
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
                className="flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl text-sm font-bold bg-primary/90 text-white hover:bg-primary hover:shadow-[0_0_20px_rgba(0,102,255,0.4)] transition-all"
              >
                <span>Live Demo</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            ) : (
              <a 
                href={liveUrl} 
                target="_blank" 
                rel="noreferrer"
                className="flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl text-sm font-bold bg-primary/90 text-white hover:bg-primary hover:shadow-[0_0_20px_rgba(0,102,255,0.4)] transition-all"
              >
                <span>Live Demo</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )
          )}
          {docsUrl && !isMobileApp && (
            <a 
              href={docsUrl}
              className="flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl text-sm font-bold bg-white/5 border border-white/10 text-[var(--color-text-primary)] hover:bg-white/10 hover:text-white hover:border-white/20 transition-all"
            >
              <span>Docs</span>
            </a>
          )}
          {githubUrl && (
            <a 
              href={githubUrl}
              target="_blank" 
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all"
              aria-label="View Source Code"
            >
              <Github className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
