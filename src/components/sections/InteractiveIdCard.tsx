import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import aboutMeImage from '../../assets/images/profile/aboutme.webp';
import typographyPortraitDark from '../../assets/images/profile/typography-portrait.webp';
import typographyPortraitLight from '../../assets/images/profile/typography-portrait-light.webp';
import { useTheme } from '../../contexts/ThemeContext';
import { TypographyTutorialModal } from '../ui/TypographyTutorialModal';

export function InteractiveIdCard() {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || theme === 'midnight';
  const [isVisible, setIsVisible] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Elastic physics values
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  const strapHeight = useMotionValue(200);
  const strapRotate = useMotionValue(0);

  // Desktop Mouse Tilt
  const rotateX = useTransform(y, [-200, 200], [15, -15]);
  const rotateY = useTransform(x, [-200, 200], [-15, 15]);

  function handleMouse(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  // Mobile Device Orientation Tilt
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta && event.gamma) {
        let mappedX = event.gamma; 
        let mappedY = event.beta - 45; 

        mappedX = Math.max(-30, Math.min(30, mappedX));
        mappedY = Math.max(-30, Math.min(30, mappedY));

        x.set(mappedX * 6);
        y.set(mappedY * 6);
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [x, y]);

  // Handle snapping to hide when pulled down
  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.y > 150) {
      // Pulled down far enough! Hide it.
      setIsVisible(false);
    }
  };

  // Sync strap visually with drag animation (including snap back)
  useEffect(() => {
    const updateStrap = () => {
      const dx = dragX.get();
      const dy = dragY.get();
      const baseH = 200;
      const currentY = baseH + dy;
      
      const newHeight = Math.sqrt(dx * dx + Math.max(10, currentY) * Math.max(10, currentY));
      strapHeight.set(newHeight);

      const angle = Math.atan2(dx, Math.max(10, currentY)) * (180 / Math.PI);
      strapRotate.set(-angle);
    };

    const unsubX = dragX.on('change', updateStrap);
    const unsubY = dragY.on('change', updateStrap);

    return () => {
      unsubX();
      unsubY();
    };
  }, [dragX, dragY, strapHeight, strapRotate]);

  return (
    <section 
      className="relative bg-[var(--color-background)] flex flex-col items-center border-b border-white/5 py-16 overflow-visible z-40"
    >
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-16 flex flex-col xl:flex-row justify-between items-center relative z-10 perspective-[2000px]">
        
        {/* Left Side: Always Visible Typography Portrait */}
        <div className="w-[450px] 2xl:w-[550px] hidden xl:block relative z-0 pointer-events-auto shrink-0">
          <div className={`w-full rounded-2xl overflow-hidden relative group ${isDark ? 'bg-black shadow-[0_30px_100px_rgba(0,0,0,0.8)]' : 'bg-transparent shadow-none'}`}>
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/60 via-accent/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 pointer-events-none mix-blend-overlay"></div>
            <img 
              src={isDark ? typographyPortraitDark : typographyPortraitLight} 
              alt="Typography Portrait" 
              className={`w-full h-auto object-contain relative z-0 transition-transform duration-1000 group-hover:scale-105 ${isDark ? '' : 'mix-blend-multiply'}`}
            />
          </div>
          <div className="mt-8 flex justify-center">
            <button 
              onClick={() => setIsTutorialOpen(true)}
              className="px-5 py-2.5 flex items-center border border-gray-900/20 dark:border-white/20 text-xs tracking-widest font-bold uppercase text-[var(--color-text-primary)] hover:bg-[var(--color-text-primary)] hover:text-[var(--color-background)] rounded-full shadow-xl transition-colors duration-300"
            >
              <Sparkles className="w-4 h-4 mr-2" /> How I made this portrait
            </button>
          </div>
        </div>

        <TypographyTutorialModal 
          isOpen={isTutorialOpen}
          onClose={() => setIsTutorialOpen(false)}
        />

        {/* Right Side: Toggle Button + Draggable ID Card + About Text */}
        <div className="relative w-full max-w-lg flex flex-col items-center xl:items-start shrink-0">
          
          {/* Container to align Button and ID Card perfectly */}
          <div className="flex flex-col items-center xl:items-start w-full">
            {/* Toggle Button acting as Pin */}
            <div className="relative z-50 mb-8">
              <button
                onClick={() => {
                  // Reset physics when toggled
                  dragX.set(0);
                  dragY.set(0);
                  strapHeight.set(200);
                  strapRotate.set(0);
                  setIsVisible(!isVisible);
                }}
                className="px-6 py-2.5 rounded-full flex items-center space-x-2 text-sm font-semibold tracking-wide bg-gradient-to-b from-[#2e2e32] to-[#151518] border border-[#3a3a40] text-[#e0e0e0] shadow-[0_5px_15px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.1)] hover:from-[#3a3a40] hover:to-[#1f1f22] hover:border-[#4f4f56] hover:text-white transition-all duration-300"
              >
                {isVisible ? (
                  <>
                    <span>Hide ID Card</span>
                    <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>Show ID Card</span>
                    <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            <AnimatePresence>
              {isVisible && (
                <motion.div
                  initial={{ y: -800, x: 200, rotate: 25, opacity: 0 }}
                  animate={{ 
                    y: 0, 
                    x: 0,
                    rotate: [25, -15, 8, -4, 0],
                    opacity: 1, 
                    transition: { 
                      type: "spring", 
                      bounce: 0.5, 
                      duration: 1.8 
                    } 
                  }}
                  exit={{ y: -800, x: 200, rotate: 25, opacity: 0, transition: { duration: 0.8, ease: "anticipate" } }}
                  className="relative w-full z-40 origin-top flex flex-col items-center xl:items-start"
                >
                
                {/* Elastic Pinned Strap (Outside the draggable card!) */}
                <motion.div 
                  style={{ 
                    height: strapHeight,
                    rotate: strapRotate,
                    transformOrigin: 'top center'
                  }}
                  className="absolute -top-[48px] left-1/2 xl:left-[80px] -translate-x-1/2 w-6 bg-[#0f0f0f] shadow-[0_10px_20px_rgba(0,0,0,0.5)] flex items-center justify-center border-x border-[#222] z-0"
                >
                  <div className="absolute bottom-0 w-full h-6 bg-gradient-to-t from-black to-transparent" />
                  <span className="text-[#d0d0d0] font-black text-[9px] tracking-[0.3em] -rotate-90 whitespace-nowrap opacity-90 mt-auto mb-24">
                    EDGAR COMPANY
                  </span>
                </motion.div>

                <motion.div
                  drag
                  dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
                  dragElastic={0.8}
                  style={{ x: dragX, y: dragY }}
                  onDragEnd={handleDragEnd}
                  whileDrag={{ scale: 1.05, zIndex: 100 }}
                  className="w-full xl:w-auto cursor-grab active:cursor-grabbing relative z-10 pt-[160px] xl:-ml-[70px]"
                >
                  <motion.div
                    onMouseMove={handleMouse}
                    onMouseLeave={handleMouseLeave}
                    style={{ rotateX, rotateY }}
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                    className="relative w-full group transform-style-3d"
                  >
                    
                    {/* Realistic Black Metal Clip/Connector (SVG) */}
                    <div className="absolute -top-[55px] left-[calc(50%-150px+150px)] -translate-x-1/2 flex flex-col items-center z-20 pointer-events-none drop-shadow-[0_10px_10px_rgba(0,0,0,0.6)]">
                      <svg width="36" height="60" viewBox="0 0 36 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <linearGradient id="metalGrad" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#111" />
                            <stop offset="20%" stopColor="#444" />
                            <stop offset="50%" stopColor="#1a1a1a" />
                            <stop offset="80%" stopColor="#333" />
                            <stop offset="100%" stopColor="#050505" />
                          </linearGradient>
                          <linearGradient id="metalGradDark" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#050505" />
                            <stop offset="25%" stopColor="#2a2a2a" />
                            <stop offset="50%" stopColor="#111" />
                            <stop offset="75%" stopColor="#222" />
                            <stop offset="100%" stopColor="#000" />
                          </linearGradient>
                          <linearGradient id="metalGradGate" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#000" />
                            <stop offset="50%" stopColor="#444" />
                            <stop offset="100%" stopColor="#000" />
                          </linearGradient>
                        </defs>
                        
                        {/* D-Ring Top (Strap loop) */}
                        <path d="M4 12 V4 C4 1.5, 8 0, 18 0 C28 0, 32 1.5, 32 4 V12" stroke="#111" strokeWidth="5" strokeLinecap="round" />
                        <path d="M4 12 V4 C4 1.5, 8 0, 18 0 C28 0, 32 1.5, 32 4 V12" stroke="url(#metalGrad)" strokeWidth="4" strokeLinecap="round" />
                        
                        {/* Swivel Base */}
                        <rect x="12" y="12" width="12" height="7" rx="1.5" fill="url(#metalGrad)" stroke="#000" strokeWidth="0.5" />
                        
                        {/* Swivel Pin */}
                        <rect x="15.5" y="19" width="5" height="4" fill="url(#metalGradDark)" stroke="#000" strokeWidth="0.5" />

                        {/* Lobster Clasp Body */}
                        <path d="M14 23 C8 28, 6 40, 17 58 C20 60, 24 55, 20 50 C16 43, 15 32, 23 32 C26 32, 27 28, 23 25 Q18 22, 14 23 Z" fill="url(#metalGradDark)" stroke="#000" strokeWidth="1" />
                        
                        {/* Clasp Gate (Spring mechanism) - on the right */}
                        <path d="M22.5 28 L23 48" stroke="url(#metalGradGate)" strokeWidth="3" strokeLinecap="round" />
                        <path d="M22.5 28 L23 48" stroke="#000" strokeWidth="0.5" strokeLinecap="round" />
                        
                        {/* Inner shadow/highlight for realism */}
                        <path d="M15 25 C10 30, 9 40, 18 55" stroke="#333" strokeWidth="0.5" fill="none" />
                      </svg>
                    </div>

                    {/* Card Container - ZAIN STYLE */}
                    <div className="w-[300px] h-[440px] mx-auto rounded-[32px] overflow-hidden relative z-10 bg-[#0b0c10] shadow-[0_20px_50px_rgba(0,0,0,0.7)] border-4 border-[#0b0c10] flex">
                      
                      {/* Punch Hole */}
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-[18px] h-7 bg-[var(--color-background)] rounded-full shadow-[inset_0_4px_8px_rgba(0,0,0,0.9)] z-50 border border-white/5" />

                      {/* Left Side: Photo with Cyan Background */}
                      <div className="w-[55%] h-full relative overflow-hidden bg-[#008b9c]">
                        {/* Wavy Cyan top-left accent */}
                        <div className="absolute top-5 left-4 flex items-center space-x-2 z-20">
                           <div className="text-white font-bold text-xs flex items-center leading-tight">
                              <span className="text-[#00dfd8] text-xl mr-1 font-black italic">E</span> 
                              <span className="text-[9px] tracking-wide">Edge<br/>FX</span>
                           </div>
                        </div>

                        {/* Profile Image (cut out) */}
                        <img 
                          src={aboutMeImage} 
                          alt="Emil Punnoose Varughese" 
                          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[190%] max-w-none h-[85%] object-cover object-top z-10 grayscale-[0.2] hover:grayscale-0 transition-all duration-500"
                        />
                      </div>

                      {/* Right Side: Black Background + Vertical Text */}
                      <div className="w-[45%] h-full bg-[#0b0c10] relative flex justify-center overflow-hidden">
                        
                        <div className="absolute top-1/2 -translate-y-[55%] right-0 flex items-center h-full">
                           <span className="text-white text-[7.5rem] font-bold tracking-tighter leading-none" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontFamily: '"Inter", sans-serif' }}>
                             EMIL
                           </span>
                        </div>
                        
                        {/* Cyan wavy shape bottom right */}
                        <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-[#6bd6e9] rounded-full z-0 opacity-90"></div>
                        
                        {/* Green Flowers */}
                        <div className="absolute bottom-6 right-2 text-[#c8f35c] z-30 opacity-100 flex flex-col items-center drop-shadow-md">
                          <span style={{ fontSize: '48px', lineHeight: '0.6', color: '#d2fa64' }}>❋</span>
                          <span style={{ fontSize: '28px', marginLeft: '25px', color: '#d2fa64' }}>❋</span>
                        </div>
                      </div>

                      {/* Bottom Name Plate */}
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-[#efefef] rounded-[20px] py-4 px-4 flex flex-col items-center shadow-2xl z-40 border border-white/50">
                        <h3 className="text-[#0b0c10] text-[17px] font-extrabold tracking-widest uppercase mb-1.5 whitespace-nowrap">
                          EMIL PUNNOOSE V
                        </h3>
                        <div className="bg-[#0b0c10] text-[#e0e0e0] text-[9px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest w-full text-center">
                          AI & FULL STACK DEV
                        </div>
                      </div>
                      
                      {/* Holographic glare effect */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none mix-blend-overlay z-50" />
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          </div>

          {/* About Portfolio Text (Hidden when ID card is visible) */}
          <AnimatePresence>
            {!isVisible && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
                className="w-full text-center xl:text-left mt-16 xl:mt-24"
              >
                <h3 className={`text-4xl font-black mb-6 tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  About This <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Portfolio</span>
                </h3>
                <p className={`text-lg leading-relaxed mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  This portfolio is a showcase of my creative engineering and design skills. Built from the ground up to push the boundaries of what's possible on the web.
                </p>
                <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  It features interactive 3D elements, custom physics-based animations, and a seamless dual-theme experience designed to leave a lasting impression.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
