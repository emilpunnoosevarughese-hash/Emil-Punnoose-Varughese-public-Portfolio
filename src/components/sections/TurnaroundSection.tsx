import { useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import { ScrollTurnaround } from '../ui/ScrollTurnaround';
import { SwingingBadge } from '../ui/SwingingBadge';
import { profileData } from '../../data/profile';

export function TurnaroundSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress within this specific section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // We can also extract the raw value if we want to pass it down directly, 
  // but useScroll returns a MotionValue. ScrollTurnaround expects a regular number.
  // We'll use a custom hook or just subscribe to the motion value.
  // Actually, Framer Motion can wrap the component, or we can just pass the motion value down.
  
  return (
    <section ref={containerRef} className="relative h-[400vh] bg-transparent">
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        {/* Background ambient light */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        </div>

        {/* The 3D Turnaround Canvas */}
        <div className="absolute inset-0 z-10">
          <TurnaroundWrapper scrollYProgress={scrollYProgress} />
        </div>

        {/* Overlay Text and ID Card */}
        <div className="absolute inset-0 z-20 pointer-events-none flex flex-col md:flex-row justify-between py-24 px-8 md:px-16 items-start">
          
          <motion.div 
            style={{ 
              opacity: useTransform(scrollYProgress, [0, 0.1, 0.2], [1, 1, 0]),
              y: useTransform(scrollYProgress, [0, 0.2], [0, -50])
            }}
            className="text-center md:text-left flex-1"
          >
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
              Interactive <br/><span className="text-primary">3D Avatar</span>
            </h2>
            <p className="text-gray-400 mt-4 max-w-sm">
              Scroll down to inspect the model in full 360-degree 3D space.
            </p>
          </motion.div>

          <motion.div
            style={{ 
              opacity: useTransform(scrollYProgress, [0, 0.1, 0.2], [1, 1, 0]),
              y: useTransform(scrollYProgress, [0, 0.2], [0, -50])
            }}
            className="hidden md:flex justify-center pointer-events-auto flex-1 mt-12 md:mt-0"
          >
             <SwingingBadge 
                image={profileData.images?.main || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80"}
                name={profileData.name.split(' ')[0]} 
             />
          </motion.div>
        </div>

        {/* End Overlay Text */}
        <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-end py-24 px-8 md:px-16">
          <motion.div 
            style={{ 
              opacity: useTransform(scrollYProgress, [0.8, 0.9, 1], [0, 1, 1]),
              y: useTransform(scrollYProgress, [0.8, 1], [50, 0])
            }}
            className="text-center md:text-right self-end"
          >
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
              Pixel <span className="text-primary">Perfect</span>
            </h2>
            <p className="text-gray-400 mt-4 max-w-sm">
              Highly optimized frame-by-frame rendering for buttery smooth performance.
            </p>
          </motion.div>

        </div>

        {/* Scroll Indicator */}
        <motion.div 
          style={{ opacity: useTransform(scrollYProgress, [0.9, 1], [1, 0]) }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none"
        >
          <div className="w-[1px] h-16 bg-gradient-to-b from-white/0 via-white/50 to-white/0 mb-4 animate-pulse" />
          <span className="text-xs font-mono tracking-[0.3em] uppercase text-white/50">Keep Scrolling</span>
        </motion.div>
      </div>
    </section>
  );
}

// Wrapper to convert MotionValue to a regular number for the canvas
import { useState, useEffect } from 'react';
import { MotionValue } from 'framer-motion';

function TurnaroundWrapper({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setProgress(latest);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return <ScrollTurnaround progress={progress} />;
}
