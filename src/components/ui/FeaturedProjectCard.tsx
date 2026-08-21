import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import type { ProjectData } from '../../data/projects';

interface FeaturedProjectCardProps {
  project: ProjectData;
}

export function FeaturedProjectCard({ project }: FeaturedProjectCardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || theme === 'midnight';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`group w-full md:col-span-2 rounded-[2rem] overflow-hidden transition-all duration-400 relative
        ${isDark 
          ? 'bg-[#181a20] border border-white/5 hover:border-white/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5),0_0_30px_rgba(245,158,11,0.1)]' 
          : 'bg-[#e0e5ec] border border-black/5 hover:shadow-[-10px_-10px_20px_rgba(255,255,255,1),_10px_10px_20px_rgba(163,177,198,0.5)]'
        }
      `}
      style={{
        transform: 'translateY(0)',
      }}
      whileHover={{ y: -5 }}
    >
      <div className="flex flex-col h-full relative">
        {/* Large Preview Area */}
        <a href={project.url} className="block relative w-full aspect-video md:aspect-[21/9] overflow-hidden bg-[#08090c] flex items-center justify-center cursor-pointer group">
          <div className="absolute inset-0 bg-gradient-to-t from-[#181a20] via-transparent to-transparent z-10 pointer-events-none opacity-80" />
          
          <img 
            src={project.preview} 
            alt={project.name} 
            loading="lazy"
            className="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-105 drop-shadow-[0_0_30px_rgba(255,255,255,0.05)]"
          />
        </a>

        {/* Content Area */}
        <div className="p-8 md:p-12 flex flex-col sm:flex-row gap-8 justify-between items-start md:items-end flex-grow">
          <div className="flex-1 max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${isDark ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-amber-50 text-amber-600 border border-amber-200'}`}>
                {project.category}
              </span>
              <span className="text-[10px] font-black tracking-widest uppercase text-amber-500 animate-pulse">
                Featured
              </span>
            </div>
            
            <h3 className={`text-3xl md:text-5xl font-display font-black mb-4 tracking-tight transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'} group-hover:text-amber-500`}>
              {project.name}
            </h3>
            
            <p className={`text-base md:text-lg mb-8 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {project.description}
            </p>

            {/* Tech Tags */}
            <div className="flex flex-wrap gap-2">
              {project.technologies.map(tech => (
                <span key={tech} className={`text-[11px] px-3 py-1.5 rounded-md font-medium tracking-wide ${isDark ? 'bg-white/5 text-gray-300' : 'bg-white text-gray-700 shadow-sm border border-black/5'}`}>
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Action Area */}
          <div className="flex flex-col gap-4 w-full sm:w-auto shrink-0 mt-6 sm:mt-0">
            <a 
              href={project.url}
              className={`w-full sm:w-auto px-8 py-4 rounded-xl font-black uppercase tracking-[0.15em] text-xs flex items-center justify-center transition-all duration-300 ${
                isDark 
                  ? 'bg-[#181a20] text-amber-500 shadow-[-3px_-3px_8px_rgba(255,255,255,0.03),_3px_3px_8px_rgba(0,0,0,0.6)] hover:shadow-[inset_-2px_-2px_5px_rgba(255,255,255,0.03),inset_2px_2px_5px_rgba(0,0,0,0.6)] hover:text-amber-400' 
                  : 'bg-[#e0e5ec] text-amber-600 shadow-[-3px_-3px_8px_rgba(255,255,255,1),_3px_3px_8px_rgba(163,177,198,0.5)] hover:shadow-[inset_-2px_-2px_5px_rgba(255,255,255,1),inset_2px_2px_5px_rgba(163,177,198,0.5)] hover:text-amber-700'
              }`}
            >
              {project.ctaText}
            </a>
            
            {project.secondaryCtaText && project.secondaryUrl && (
              <a 
                href={project.secondaryUrl}
                className={`w-full sm:w-auto px-8 py-4 rounded-xl font-black uppercase tracking-[0.15em] text-xs flex items-center justify-center gap-3 transition-all duration-300 border ${
                  isDark 
                    ? 'border-white/20 text-white hover:bg-white/5' 
                    : 'border-black/20 text-black hover:bg-black/5'
                }`}
              >
                {project.secondaryCtaText}
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
