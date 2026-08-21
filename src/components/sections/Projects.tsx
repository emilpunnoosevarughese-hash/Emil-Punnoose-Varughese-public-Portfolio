import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { portfolioProjects } from '../../data/projects';
import { ProjectCard } from '../ui/ProjectCard';
import { FeaturedProjectCard } from '../ui/FeaturedProjectCard';

const FILTERS = ["All", "AI", "Web Apps", "Interactive", "Experiments"];

export function Projects() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark' || theme === 'midnight';

  const headerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress: headerScroll } = useScroll({
    target: headerRef,
    offset: ["start end", "end start"]
  });

  const x1 = useTransform(headerScroll, [0, 0.4, 0.6, 1], ["50vw", "0vw", "0vw", "-50vw"]);
  const x2 = useTransform(headerScroll, [0, 0.4, 0.6, 1], ["-50vw", "0vw", "0vw", "50vw"]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return portfolioProjects.filter(project => 
      activeFilter === "All" || project.filterCategories.includes(activeFilter)
    );
  }, [activeFilter]);

  // All projects cycle through featured spot
  const featuredProject = filteredProjects[featuredIndex % filteredProjects.length] ?? filteredProjects[0];
  const gridProjects = filteredProjects.filter((_, i) => i !== (featuredIndex % filteredProjects.length));

  const goToNext = useCallback(() => {
    setDirection(1);
    setFeaturedIndex(i => (i + 1) % filteredProjects.length);
  }, [filteredProjects.length]);

  const goToPrev = useCallback(() => {
    setDirection(-1);
    setFeaturedIndex(i => (i - 1 + filteredProjects.length) % filteredProjects.length);
  }, [filteredProjects.length]);

  const goTo = useCallback((idx: number) => {
    setDirection(idx > featuredIndex ? 1 : -1);
    setFeaturedIndex(idx);
  }, [featuredIndex]);

  // Auto-cycle every 4s unless paused
  useEffect(() => {
    if (isPaused || filteredProjects.length <= 1) return;
    const timer = setInterval(goToNext, 4000);
    return () => clearInterval(timer);
  }, [isPaused, goToNext, filteredProjects.length]);

  // Reset index when filter changes
  useEffect(() => {
    setFeaturedIndex(0);
  }, [activeFilter]);

  return (
    <section className="relative bg-[var(--color-background)] text-[var(--color-text-primary)] py-24 md:py-32 overflow-hidden transition-colors duration-300" id="projects">
      
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {isDark && (
          <>
            <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-cyan-900/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 right-1/4 w-1/2 h-1/2 bg-purple-900/10 blur-[120px] rounded-full" />
          </>
        )}
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Animated Text Header */}
        <div ref={headerRef} className="relative z-10 flex flex-col items-center justify-center w-full mb-16 md:mb-32 overflow-visible">
          <div className="flex flex-col items-center space-y-2 md:space-y-4 w-full px-4 overflow-visible">
            <motion.div style={{ x: x1 }} className="w-full flex justify-center">
              <span className={`text-[32px] sm:text-[50px] md:text-[70px] lg:text-[100px] font-black uppercase tracking-tight whitespace-nowrap leading-none drop-shadow-[0_0_20px_rgba(255,255,255,0.15)] ${isDark ? 'text-white' : 'text-black'}`}>
                PROJECTS & AUTOMATIONS
              </span>
            </motion.div>
            
            <motion.div style={{ x: x2 }} className="w-full flex justify-center">
              <span className="text-[32px] sm:text-[50px] md:text-[70px] lg:text-[100px] font-black uppercase tracking-tight whitespace-nowrap leading-none text-transparent drop-shadow-[0_0_20px_rgba(255,255,255,0.05)]" style={{ WebkitTextStroke: isDark ? '2px white' : '2px black' }}>
                DESIGN & DEVELOPMENT
              </span>
            </motion.div>
          </div>
        </div>
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-24">
          <div className="max-w-2xl">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-cyan-500 font-bold tracking-[0.2em] uppercase text-sm mb-4 block"
            >
              What I've Built
            </motion.span>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight mb-6"
            >
              Selected Projects
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className={`text-lg md:text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
            >
              A collection of products, experiments, and digital experiences I've designed and developed.
            </motion.p>
          </div>

          {/* Filter Navigation */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={`flex flex-wrap gap-2 p-2 rounded-2xl md:rounded-full ${isDark ? 'bg-white/5 border border-white/10' : 'bg-[#e0e5ec] border border-black/5 shadow-inner'}`}
          >
            {FILTERS.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                  activeFilter === filter
                    ? isDark 
                      ? 'bg-white text-black shadow-lg' 
                      : 'bg-black text-white shadow-lg'
                    : isDark
                      ? 'text-gray-400 hover:text-white hover:bg-white/5'
                      : 'text-gray-600 hover:text-black hover:bg-black/5'
                }`}
              >
                {filter}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Projects Grid */}
        <div className="flex flex-col gap-8 md:gap-12">

          {/* ── AUTO-CYCLING FEATURED SHOWCASE ── */}
          {featuredProject && (
            <div
              className="relative group"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <AnimatePresence mode="popLayout" custom={direction}>
                <motion.div
                  key={featuredProject.id}
                  custom={direction}
                  variants={{
                    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 80 : -80, scale: 0.97 }),
                    center: { opacity: 1, x: 0, scale: 1 },
                    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -80 : 80, scale: 0.97 }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <FeaturedProjectCard project={featuredProject} />
                </motion.div>
              </AnimatePresence>

              {/* Prev / Next arrows */}
              <button
                onClick={goToPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 opacity-0 group-hover:opacity-100 hover:opacity-100 bg-black/40 border border-white/10 text-white hover:bg-black/60 hover:border-white/30"
                style={{ marginTop: '-2rem' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 opacity-0 group-hover:opacity-100 hover:opacity-100 bg-black/40 border border-white/10 text-white hover:bg-black/60 hover:border-white/30"
                style={{ marginTop: '-2rem' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>

              {/* Progress dots + timer bar */}
              <div className="flex flex-col items-center gap-3 mt-4">
                {/* Dot indicators */}
                <div className="flex items-center gap-2">
                  {filteredProjects.map((p, i) => (
                    <button
                      key={p.id}
                      onClick={() => goTo(i)}
                      className="relative rounded-full overflow-hidden transition-all duration-300 focus:outline-none"
                      style={{
                        width: i === (featuredIndex % filteredProjects.length) ? '28px' : '8px',
                        height: '8px',
                        background: i === (featuredIndex % filteredProjects.length)
                          ? 'transparent'
                          : isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
                        border: i === (featuredIndex % filteredProjects.length) ? '1px solid rgba(245,158,11,0.5)' : 'none',
                      }}
                    >
                      {i === (featuredIndex % filteredProjects.length) && !isPaused && (
                        <motion.div
                          key={featuredProject.id + '-bar'}
                          className="absolute inset-0 rounded-full origin-left"
                          style={{ background: 'linear-gradient(90deg, #f59e0b, #f97316)' }}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 4, ease: 'linear' }}
                        />
                      )}
                      {i === (featuredIndex % filteredProjects.length) && isPaused && (
                        <div className="absolute inset-0 rounded-full bg-amber-500" />
                      )}
                    </button>
                  ))}
                </div>
                {/* Paused indicator */}
                {isPaused && (
                  <motion.span
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[10px] font-bold tracking-widest uppercase text-amber-500/60"
                  >
                    ⏸ Auto-cycling paused
                  </motion.span>
                )}
              </div>
            </div>
          )}

          <AnimatePresence mode="popLayout">

            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
            >
              <AnimatePresence mode="popLayout">
                {gridProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <ProjectCard project={project} index={index} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-24 text-center"
            >
              <p className={`text-xl ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>No projects found for this category.</p>
            </motion.div>
          )}
        </div>

        {/* Section Ending CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`mt-32 p-12 md:p-24 rounded-[3rem] text-center relative overflow-hidden group ${
            isDark 
              ? 'bg-[#181a20] border border-white/5' 
              : 'bg-[#e0e5ec] border border-black/5 shadow-[-10px_-10px_30px_rgba(255,255,255,1),_10px_10px_30px_rgba(163,177,198,0.5)]'
          }`}
        >
          {isDark && (
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          )}
          
          <div className="relative z-10 flex flex-col items-center justify-center max-w-2xl mx-auto">
            <h3 className={`text-3xl md:text-5xl font-black uppercase tracking-tight mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Have an idea?
            </h3>
            <p className={`text-xl md:text-3xl font-medium mb-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Let's build something.
            </p>
            
            <a 
              href="#contact"
              className="relative inline-flex items-center justify-center px-10 py-5 font-bold uppercase tracking-[0.2em] text-white bg-black rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(0,223,216,0.4)] group/btn"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center gap-3">
                Let's Work Together <span className="transform group-hover/btn:translate-x-2 transition-transform duration-300">&rarr;</span>
              </span>
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
