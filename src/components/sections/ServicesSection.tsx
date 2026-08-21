import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Video, TerminalSquare, ArrowRight, Zap } from 'lucide-react';

const services = [
  {
    id: 'frontend',
    title: 'Frontend & AI Dev',
    icon: Code2,
    color: '#0066FF',
    bgImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000',
    description: 'Crafting stunning, highly interactive web applications using React, Next.js, and advanced Framer Motion physics. I also integrate AI models and intelligent agents directly into UI workflows.',
    skills: ['React & Next.js', 'Framer Motion', 'Tailwind CSS', 'AI Integration']
  },
  {
    id: 'video',
    title: 'Video Editor',
    icon: Video,
    color: '#FF3366',
    bgImage: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=1000',
    description: 'Professional video editing and motion graphics. From high-retention YouTube edits to cinematic brand trailers, I bring raw footage to life with intense pacing and color grading.',
    skills: ['Premiere Pro', 'After Effects', 'Color Grading', 'Motion Graphics']
  },
  {
    id: 'backend',
    title: 'Backend & Automation',
    icon: TerminalSquare,
    color: '#00C7B7',
    bgImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1000',
    description: 'Architecting scalable server-side systems and building complex automated workflows. I connect APIs, manage databases, and create bots that save hundreds of hours of manual work.',
    skills: ['Node.js & Python', 'Database Architecture', 'n8n Automations', 'Telegram Bots']
  }
];

export function ServicesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number>(0);

  return (
    <section className="py-32 relative overflow-hidden bg-black">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 opacity-20 transition-colors duration-700 ease-in-out mix-blend-screen"
          style={{ backgroundColor: services[hoveredIndex].color }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
      </div>

      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <div className="flex flex-col mb-16">
          <div className="inline-flex items-center space-x-2 mb-4">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-mono tracking-widest uppercase text-gray-400">Services & Roles</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
            Hire Me
          </h2>
        </div>

        {/* Accordion Container */}
        <div className="flex flex-col lg:flex-row h-[800px] lg:h-[500px] w-full gap-4">
          {services.map((service, index) => {
            const isHovered = hoveredIndex === index;
            const Icon = service.icon;

            return (
              <motion.div
                key={service.id}
                layout
                onMouseEnter={() => setHoveredIndex(index)}
                onClick={() => setHoveredIndex(index)}
                initial={{ borderRadius: 32 }}
                animate={{
                  flex: isHovered ? (window.innerWidth < 1024 ? 3 : 3) : 1,
                  backgroundColor: isHovered ? '#111' : '#0a0a0a',
                }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
                className="relative overflow-hidden group cursor-pointer border border-white/10"
              >
                {/* Background Image (Only visible when hovered) */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, scale: 1.2 }}
                      animate={{ opacity: 0.3, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8 }}
                      className="absolute inset-0 z-0"
                    >
                      <img 
                        src={service.bgImage} 
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Content Container */}
                <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 md:p-8">
                  
                  {/* Icon & Title - Always visible, layout shifts */}
                  <motion.div layout className="flex items-center space-x-4 mb-4">
                    <div 
                      className={`p-3 rounded-xl transition-colors duration-500 ${isHovered ? 'bg-white/10' : 'bg-white/5'}`}
                      style={{ color: isHovered ? service.color : '#888' }}
                    >
                      <Icon className="w-6 h-6 md:w-8 md:h-8" />
                    </div>
                    <motion.h3 
                      layout="position"
                      className={`font-bold transition-all duration-500 whitespace-nowrap ${isHovered ? 'text-2xl md:text-3xl text-white' : 'text-xl text-gray-400'}`}
                    >
                      {service.title}
                    </motion.h3>
                  </motion.div>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, y: 20 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: 20 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="overflow-hidden"
                      >
                        <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6 max-w-lg">
                          {service.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-8">
                          {service.skills.map(skill => (
                            <span 
                              key={skill}
                              className="text-xs font-medium px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>

                        <a 
                          href={`mailto:hello@emil.dev?subject=Hiring for ${service.title}`}
                          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl text-white font-bold text-sm transition-all duration-300 hover:scale-105"
                          style={{ backgroundColor: service.color }}
                        >
                          <span>Hire for this role</span>
                          <ArrowRight className="w-4 h-4" />
                        </a>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>

                {/* Glowing Border effect when hovered */}
                {isHovered && (
                  <motion.div
                    layoutId="activeServiceBorder"
                    className="absolute inset-0 z-20 pointer-events-none border-2 rounded-[32px]"
                    style={{ borderColor: service.color }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
