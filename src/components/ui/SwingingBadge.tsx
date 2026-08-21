import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface SwingingBadgeProps {
  image: string;
  name: string;
}

export function SwingingBadge({ image, name }: SwingingBadgeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse position values for 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for the 3D tilt
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), { damping: 20, stiffness: 100 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), { damping: 20, stiffness: 100 });

  // Spring for the pendulum swing based on mouse X velocity/movement
  const swingAngle = useSpring(0, { damping: 10, stiffness: 50, mass: 2 });

  useEffect(() => {
    let animationFrameId: number;
    let targetSwing = 0;
    
    // Continuous subtle pendulum animation
    let time = 0;
    const animate = () => {
      time += 0.02;
      // Gentle natural swing
      const baseSwing = Math.sin(time) * 3;
      swingAngle.set(baseSwing + targetSwing);
      targetSwing *= 0.95; // Decay the interactive swing
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, [swingAngle]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // Calculate normalized mouse position (-0.5 to 0.5)
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    mouseX.set(x);
    mouseY.set(y);

    // Add some swing force based on mouse movement
    const swingForce = x * 20;
    swingAngle.set(swingAngle.get() + (swingForce - swingAngle.get()) * 0.1);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[600px] flex justify-center perspective-[1200px]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div 
        className="relative flex flex-col items-center origin-top cursor-grab active:cursor-grabbing"
        drag
        dragConstraints={{ left: -150, right: 150, top: -50, bottom: 200 }}
        dragElastic={0.4}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
        style={{
          rotateZ: swingAngle,
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
      >
        {/* Lanyard Line */}
        <div className="w-4 h-[200px] bg-gradient-to-b from-[#111] to-[#222] shadow-xl relative z-0 flex justify-center overflow-hidden">
          {/* Lanyard Text (Vertical) */}
          <div className="absolute top-10 flex flex-col items-center space-y-2 opacity-50">
            {'EMIL'.split('').map((char, i) => (
              <span key={i} className="text-[10px] font-black text-white transform -rotate-90">{char}</span>
            ))}
          </div>
        </div>

        {/* Lanyard Clip */}
        <div className="w-8 h-10 bg-gradient-to-b from-gray-700 to-gray-900 rounded-b-xl z-10 shadow-xl border border-gray-600/50 flex items-center justify-center relative -mt-2">
          <div className="w-3 h-3 rounded-full bg-gray-900 shadow-inner" />
          {/* The metal ring */}
          <div className="absolute -bottom-4 w-6 h-6 border-4 border-gray-500 rounded-full z-0" style={{ transform: 'translateZ(-1px)' }} />
        </div>

        {/* The ID Card */}
        <div 
          className="relative mt-2 w-[280px] h-[400px] bg-white rounded-2xl shadow-2xl p-4 flex flex-col items-center z-20 border border-gray-200"
          style={{ transform: "translateZ(20px)" }}
        >
          {/* Hole Punch */}
          <div className="w-12 h-3 rounded-full bg-gray-900/10 mb-4 shadow-inner" />

          {/* Profile Image */}
          <div className="w-full aspect-[3/4] relative rounded-xl overflow-hidden mb-6 bg-gray-100">
            <img 
              src={image} 
              alt={name}
              className="w-full h-full object-cover object-top"
            />
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/40 mix-blend-overlay pointer-events-none" />
          </div>

          {/* User Name (Script Font) */}
          <div className="mt-auto mb-2 w-full text-center">
            <p className="font-mono text-[10px] text-gray-400 uppercase tracking-widest mb-1">Developer</p>
            <h3 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'cursive' }}>
              {name}
            </h3>
          </div>

          {/* Pinging Green Border (User requested exact HTML) */}
          <div className="absolute inset-0 rounded-2xl border border-green-400/30 animate-ping pointer-events-none"></div>
          {/* Static Green Glow to make it look active */}
          <div className="absolute inset-0 rounded-2xl border-2 border-green-400/50 pointer-events-none shadow-[0_0_15px_rgba(74,222,128,0.2)]"></div>
        </div>

      </motion.div>
    </div>
  );
}
