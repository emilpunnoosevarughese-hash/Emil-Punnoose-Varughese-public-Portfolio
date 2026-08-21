import { useState } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';

interface ParallaxImageProps {
  src: string;
  fallback: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export function ParallaxImage({ src, fallback, alt, className = '', priority = false }: ParallaxImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    mouseX.set(x * 15);
    mouseY.set(y * -15);
  }

  return (
    <motion.div 
      className={`relative overflow-hidden group cursor-pointer ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
      }}
      style={{
        rotateX: useMotionTemplate`${mouseY}deg`,
        rotateY: useMotionTemplate`${mouseX}deg`,
        transformPerspective: 1000
      }}
    >
      <img 
        src={imgSrc} 
        alt={alt}
        onError={() => setImgSrc(fallback)}
        loading={priority ? "eager" : "lazy"}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] via-transparent to-transparent opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
    </motion.div>
  );
}
