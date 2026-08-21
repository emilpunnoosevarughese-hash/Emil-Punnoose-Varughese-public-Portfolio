import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin } from './SocialIcons';

export function LoadingSequence({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!document.querySelector('script[src="https://unpkg.com/@splinetool/viewer@1.9.82/build/spline-viewer.js"]')) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://unpkg.com/@splinetool/viewer@1.9.82/build/spline-viewer.js';
      document.body.appendChild(script);
    }

    const interval = setInterval(() => {
      setProgress((prev: number) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 2000);
          return 100;
        }
        return Math.min(prev + Math.floor(Math.random() * 6) + 2, 100);
      });
    }, 150);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.2, ease: "easeInOut" } }}
    >
      <motion.div 
        className="absolute inset-0 z-0 flex items-center justify-center pointer-events-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        {/* @ts-ignore */}
        <spline-viewer url="https://prod.spline.design/i1Mq-U343U9N87vL/scene.splinecode"></spline-viewer>
      </motion.div>
      
      <div className="z-10 flex flex-col items-center w-full max-w-5xl px-6 mt-[35vh] sm:mt-[40vh] pointer-events-none">
        <motion.h1 
          className="text-4xl sm:text-5xl md:text-7xl lg:text-7xl font-black tracking-widest uppercase mb-4 text-white text-center drop-shadow-2xl"
          style={{ fontFamily: '"Orbitron", sans-serif' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
        >
          EMIL PUNNOOSE VARUGHESE
        </motion.h1>

        <motion.p 
          className="text-sm md:text-lg text-gray-400 font-mono tracking-[0.2em] mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
        >
          www.emilpunnoosevarughese.in
        </motion.p>
        
        <motion.div 
          className="flex space-x-6 text-white mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <a href="#" className="p-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/20 hover:scale-110 transition-all cursor-pointer pointer-events-auto">
            <Github className="w-6 h-6" />
          </a>
          <a href="#" className="p-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/20 hover:scale-110 transition-all cursor-pointer pointer-events-auto">
            <Linkedin className="w-6 h-6" />
          </a>
        </motion.div>

        {/* Progress Line */}
        <div className="w-full max-w-sm absolute bottom-12">
          <div className="flex justify-between w-full text-xs font-mono text-gray-500 uppercase tracking-widest mb-3">
            <span className="animate-pulse">Loading Environment</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-1 bg-gray-900 rounded-full overflow-hidden relative">
            <motion.div 
              className="absolute top-0 left-0 bottom-0 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear", duration: 0.15 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
