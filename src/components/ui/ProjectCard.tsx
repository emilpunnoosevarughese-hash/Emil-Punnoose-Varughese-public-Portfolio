import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import type { ProjectData } from '../../data/projects';

interface ProjectCardProps {
  project: ProjectData;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || theme === 'midnight';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
      className={`group block w-full rounded-[2rem] overflow-hidden transition-all duration-400 relative
        ${isDark 
          ? 'bg-[#181a20] border border-white/5 hover:border-white/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4),0_0_20px_rgba(245,158,11,0.1)]' 
          : 'bg-[#e0e5ec] border border-black/5 hover:shadow-[-10px_-10px_20px_rgba(255,255,255,1),_10px_10px_20px_rgba(163,177,198,0.5)]'
        }
      `}
      style={{
        transform: 'translateY(0)', // Default state
      }}
      whileHover={{ y: -5 }} // Subtle lift
    >
      {/* Preview Section */}
      <a href={project.url} className="block relative w-full aspect-[4/3] sm:aspect-video overflow-hidden bg-[#08090c] flex items-center justify-center cursor-pointer">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10 pointer-events-none" />
        
        {project.preview ? (
          <img 
            src={project.preview} 
            alt={project.name} 
            loading="lazy"
            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          /* Clean Fallback for projects without an image (e.g. Mech) */
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#111] to-[#000] border border-white/5 rounded-xl relative overflow-hidden transition-transform duration-500 group-hover:scale-105">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.15)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <h3 className="text-4xl sm:text-6xl font-black uppercase tracking-[0.3em] text-white/80 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              {project.name}
            </h3>
          </div>
        )}
      </a>

      {/* Content Section */}
      <div className="p-6 sm:p-8 flex flex-col flex-grow">
        <div className="flex items-center gap-3 mb-4">
          <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${isDark ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-amber-50 text-amber-600 border border-amber-200'}`}>
            {project.category}
          </span>
        </div>
        
        <h3 className={`text-2xl font-display font-black tracking-tight mb-3 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'} group-hover:text-amber-500`}>
          {project.name}
        </h3>
        
        <p className={`text-sm mb-6 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {project.description}
        </p>

        {/* Tech Tags */}
        <div className="flex flex-wrap gap-2 mb-8 mt-auto">
          {project.technologies.map(tech => (
            <span key={tech} className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-white/5 text-gray-300' : 'bg-white text-gray-700 shadow-sm border border-black/5'}`}>
              {tech}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
          <a href={project.url} className={`mt-6 w-full py-3 sm:py-4 rounded-xl font-black uppercase tracking-[0.15em] text-[11px] sm:text-xs flex items-center justify-center transition-all duration-300 ${
            isDark 
              ? 'bg-[#181a20] text-amber-500 shadow-[-3px_-3px_8px_rgba(255,255,255,0.03),_3px_3px_8px_rgba(0,0,0,0.6)] hover:shadow-[inset_-2px_-2px_5px_rgba(255,255,255,0.03),inset_2px_2px_5px_rgba(0,0,0,0.6)] hover:text-amber-400' 
              : 'bg-[#e0e5ec] text-amber-600 shadow-[-3px_-3px_8px_rgba(255,255,255,1),_3px_3px_8px_rgba(163,177,198,0.5)] hover:shadow-[inset_-2px_-2px_5px_rgba(255,255,255,1),inset_2px_2px_5px_rgba(163,177,198,0.5)] hover:text-amber-700'
          }`}>
            {project.ctaText}
          </a>
        </div>
      </div>
    </motion.div>
  );
}
