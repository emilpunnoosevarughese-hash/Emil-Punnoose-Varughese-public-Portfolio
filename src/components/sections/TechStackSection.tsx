import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Cpu, ChevronDown } from 'lucide-react';
import { 
  SiReact, SiNextdotjs, SiJavascript, SiTypescript, SiTailwindcss, SiHtml5, SiCss, SiFramer, SiFlutter,
  SiNodedotjs, SiExpress, SiPython, SiFastapi, SiCplusplus, SiGo, SiDjango,
  SiMongodb, SiPostgresql, SiRedis, SiFirebase, SiSupabase, SiMysql,
  SiGit, SiDocker, SiVercel, SiLinux, SiPostman, SiFigma
} from 'react-icons/si';
import { FaAws } from 'react-icons/fa';

const techCategories = [
  {
    title: "FRONTEND",
    skills: [
      { name: "React", icon: SiReact, color: "#61DAFB" },
      { name: "Next.js", icon: SiNextdotjs, color: "#FFFFFF" },
      { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
      { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
      { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
      { name: "HTML5", icon: SiHtml5, color: "#E34F26" },
      { name: "CSS3", icon: SiCss, color: "#1572B6" },
      { name: "Framer Motion", icon: SiFramer, color: "#0055FF" },
      { name: "Flutter", icon: SiFlutter, color: "#02569B" },
    ]
  },
  {
    title: "BACKEND",
    skills: [
      { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
      { name: "Express", icon: SiExpress, color: "#FFFFFF" },
      { name: "Python", icon: SiPython, color: "#3776AB" },
      { name: "FastAPI", icon: SiFastapi, color: "#009688" },
      { name: "C++", icon: SiCplusplus, color: "#00599C" },
      { name: "Go", icon: SiGo, color: "#00ADD8" },
      { name: "Django", icon: SiDjango, color: "#092E20" },
    ]
  },
  {
    title: "DATABASE",
    skills: [
      { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
      { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
      { name: "Redis", icon: SiRedis, color: "#DC382D" },
      { name: "Firebase", icon: SiFirebase, color: "#FFCA28" },
      { name: "Supabase", icon: SiSupabase, color: "#3ECF8E" },
      { name: "MySQL", icon: SiMysql, color: "#4479A1" },
    ]
  },
  {
    title: "TOOLS & DEPLOYMENT",
    skills: [
      { name: "Git", icon: SiGit, color: "#F05032" },
      { name: "Docker", icon: SiDocker, color: "#2496ED" },
      { name: "AWS", icon: FaAws, color: "#232F3E" },
      { name: "Vercel", icon: SiVercel, color: "#FFFFFF" },
      { name: "Linux", icon: SiLinux, color: "#FCC624" },
      { name: "Postman", icon: SiPostman, color: "#FF6C37" },
      { name: "Figma", icon: SiFigma, color: "#F24E1E" },
    ]
  }
];

export function TechStackSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  // Parallax transform for the dot grid pattern (animating position instead of the whole div)
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0px", "300px"]);

  return (
    <section ref={containerRef} id="tech-stack" className="relative py-32 bg-[#050505] overflow-hidden">
      {/* Dot Grid Background with Parallax */}
      <motion.div 
        className="absolute inset-0 pointer-events-none z-0" 
        style={{
          backgroundPositionY: backgroundY,
          backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.15) 1.5px, transparent 1.5px)',
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(ellipse at top, black 50%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse at top, black 50%, transparent 100%)'
        }}
      />

      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-24">
          {/* Top Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 text-[11px] font-bold tracking-widest uppercase mb-10 backdrop-blur-md"
          >
            <Cpu className="w-4 h-4 text-teal-400" />
            <span>My Arsenal</span>
          </motion.div>
          
          {/* Main Title */}
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-display font-black uppercase tracking-tight mb-6"
          >
            <span className="text-white">Tech</span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Stack</span>
          </motion.h2>
          
          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="text-[16px] md:text-[18px] text-gray-400 max-w-[700px] leading-relaxed"
          >
            Passionate about coding and creative technology. I enjoy building 
            scalable software, automation tools, and innovative engineering 
            solutions while continuously learning emerging technologies to push 
            the boundaries of what's possible on the web.
          </motion.p>
        </div>

        {/* Category Blocks */}
        <div ref={containerRef} className="space-y-16">
          {techCategories.map((category) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="w-full flex flex-col"
            >
              {/* Category Label */}
              <h3 className="text-[18px] md:text-[20px] font-bold uppercase tracking-[0.15em] mb-8 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400 self-start">
                {category.title}
              </h3>
              
              {/* Skills Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 xl:grid-cols-8 gap-4 md:gap-5">
                {category.skills.map((skill, skillIndex) => {
                  const Icon = skill.icon;
                  return (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: skillIndex * 0.05 }}
                      className="group relative flex flex-col items-center justify-center p-6 rounded-2xl bg-[#0f121b]/80 backdrop-blur-md border border-white/5 transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:border-teal-400/50 hover:shadow-[0_0_25px_rgba(45,212,191,0.15)] cursor-pointer overflow-hidden"
                    >
                      {/* Inner glow effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-b from-teal-400/0 to-teal-400/0 group-hover:from-teal-400/5 group-hover:to-transparent transition-colors duration-300"></div>
                      
                      <div className="relative z-10 flex flex-col items-center gap-4">
                        <Icon 
                          className="w-10 h-10 transition-transform duration-300 group-hover:scale-110" 
                          style={{ color: skill.color }}
                        />
                        <span className="text-[13px] font-medium text-gray-400 group-hover:text-white transition-colors duration-300 text-center">
                          {skill.name}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="mt-24 flex justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
        >
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-gray-500"
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}

