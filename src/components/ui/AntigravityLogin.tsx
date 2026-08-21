import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { AlertCircle, LogIn, Lock, User as UserIcon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface AntigravityLoginProps {
  onLogin: () => void;
  error?: string;
}

// Sub-component for individual particles to safely use hooks
function Particle({ 
  p, 
  smoothMouseX, 
  smoothMouseY 
}: { 
  p: { id: number; x: number; y: number; size: number; color: string }; 
  smoothMouseX: any; 
  smoothMouseY: any; 
}) {
  const particleX = useTransform(smoothMouseX, (val: number) => {
    const dist = val - (p.x - window.innerWidth/2);
    return Math.abs(dist) < 200 ? p.x + (dist > 0 ? -30 : 30) : p.x;
  });
  
  const particleY = useTransform(smoothMouseY, (val: number) => {
    const dist = val - (p.y - window.innerHeight/2);
    return Math.abs(dist) < 200 ? p.y + (dist > 0 ? -30 : 30) : p.y;
  });

  return (
    <motion.div
      className="absolute rounded-full pointer-events-none blur-xl"
      style={{
        x: particleX,
        y: particleY,
        width: p.size,
        height: p.size,
        backgroundColor: p.color,
      }}
      animate={{
        y: [p.y - 20, p.y + 20, p.y - 20],
        x: [p.x - 10, p.x + 10, p.x - 10],
      }}
      transition={{
        duration: Math.random() * 5 + 5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
}

export function AntigravityLogin({ onLogin, error }: AntigravityLoginProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark' || theme === 'midnight';
  
  // Mouse position for particle repulsion and card tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring physics for mouse movement
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  
  // Card Tilt transforms
  const cardRotateX = useTransform(smoothMouseY, [-300, 300], [10, -10]);
  const cardRotateY = useTransform(smoothMouseX, [-300, 300], [-10, 10]);
  
  // Particles state
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; color: string }>>([]);

  useEffect(() => {
    // Initialize random particles
    const newParticles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 40 + 10,
      color: Math.random() > 0.5 ? 'rgba(0, 255, 255, 0.15)' : 'rgba(138, 43, 226, 0.15)' // Cyan and Violet
    }));
    setParticles(newParticles);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Button dodge logic
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [buttonOffset, setButtonOffset] = useState({ x: 0, y: 0 });

  const handleButtonHover = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;
    
    // Calculate distance from cursor to button center
    const distX = e.clientX - btnCenterX;
    const distY = e.clientY - btnCenterY;
    
    // If mouse is moving fast/is very close, dodge slightly
    setButtonOffset({
      x: -distX * 0.15,
      y: -distY * 0.15
    });
  };

  const handleButtonLeave = () => {
    setButtonOffset({ x: 0, y: 0 });
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[calc(100vh-var(--nav-height))] flex items-center justify-center overflow-hidden"
      style={{ perspective: 1000 }}
    >
      {/* Dynamic Repelling Particles */}
      {particles.map(p => (
        <Particle key={p.id} p={p} smoothMouseX={smoothMouseX} smoothMouseY={smoothMouseY} />
      ))}

      {/* Main Glassmorphism Card */}
      <motion.div
        style={{ rotateX: cardRotateX, rotateY: cardRotateY, z: 50 }}
        whileHover={{ scale: 1.02, z: 100 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`relative z-10 w-full max-w-md p-10 rounded-3xl backdrop-blur-2xl border shadow-[0_0_50px_rgba(0,255,255,0.05)] overflow-hidden ${isDark ? 'bg-white/[0.03] border-white/10' : 'bg-black/[0.02] border-black/10'}`}
      >
        {/* Subtle glowing edge effect inside card */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-violet-500/10 pointer-events-none" />
        
        <div className="relative z-20 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-violet-500/20 border border-white/10 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,255,255,0.2)]">
            <LogIn className="w-8 h-8 text-cyan-400" />
          </div>
          
          <h2 className={`text-3xl font-black tracking-wider mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>ACCESS</h2>
          <p className="text-cyan-400/60 text-sm tracking-widest uppercase mb-8 text-center">
            Zero Gravity Authentication
          </p>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="w-full mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start text-left text-sm backdrop-blur-md"
              >
                <AlertCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-red-200 leading-relaxed">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Fields - Ultra Minimalist */}
          <div className="w-full space-y-6 mb-10">
            <div className="relative group">
              <motion.div 
                className={`absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:-translate-y-10 group-focus-within:-translate-x-2 group-focus-within:scale-75 group-focus-within:text-cyan-400 transition-all duration-300 pointer-events-none flex items-center ${isDark ? 'text-white/30' : 'text-gray-500'}`}
              >
                <UserIcon className="w-4 h-4 mr-2" />
                <span className="font-medium tracking-wider">USERNAME</span>
              </motion.div>
              <input 
                type="text" 
                className={`w-full border-b-2 focus:border-cyan-400 px-4 py-4 rounded-t-xl outline-none transition-colors ${isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-white/60 border-black/10 text-gray-900 shadow-sm'}`}
              />
            </div>

            <div className="relative group">
              <motion.div 
                className={`absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:-translate-y-10 group-focus-within:-translate-x-2 group-focus-within:scale-75 group-focus-within:text-cyan-400 transition-all duration-300 pointer-events-none flex items-center ${isDark ? 'text-white/30' : 'text-gray-500'}`}
              >
                <Lock className="w-4 h-4 mr-2" />
                <span className="font-medium tracking-wider">PASSWORD</span>
              </motion.div>
              <input 
                type="password" 
                className={`w-full border-b-2 focus:border-cyan-400 px-4 py-4 rounded-t-xl outline-none transition-colors ${isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-white/60 border-black/10 text-gray-900 shadow-sm'}`}
              />
            </div>
          </div>

          <p className={`text-xs mb-6 text-center tracking-widest ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
            OR INITIALIZE VIA SECURE PROTOCOL
          </p>

          <motion.button
            ref={buttonRef}
            onMouseMove={handleButtonHover}
            onMouseLeave={handleButtonLeave}
            onClick={onLogin}
            animate={{ x: buttonOffset.x, y: buttonOffset.y }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={`w-full group relative px-8 py-4 border rounded-xl overflow-hidden transition-colors ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-cyan-400/50' : 'bg-white shadow-sm border-gray-200 hover:bg-gray-50 hover:border-cyan-400/50'}`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-violet-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <div className="relative z-10 flex items-center justify-center space-x-3">
              <svg className="w-5 h-5 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className={`font-bold tracking-widest text-sm uppercase ${isDark ? 'text-white' : 'text-gray-800'}`}>Google Auth</span>
            </div>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
