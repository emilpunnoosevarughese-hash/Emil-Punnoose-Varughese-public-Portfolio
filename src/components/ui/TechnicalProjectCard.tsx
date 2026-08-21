import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';

interface TechnicalProjectCardProps {
  title: string;
  description: string;
  image: string;
  videoUrl?: string;
  tags?: string[];
  status?: string;
  githubUrl?: string;
  liveUrl?: string;
  webUrl?: string;
  docsUrl?: string;
  isMobileApp?: boolean;
  index: number;
  isFeatured?: boolean;
}

export function TechnicalProjectCard({ 
  title, description, image, videoUrl, liveUrl, webUrl, docsUrl, index 
}: TechnicalProjectCardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || theme === 'midnight';
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();

  const handleClick = () => {
    if (docsUrl) {
      navigate(docsUrl);
    } else if (liveUrl || webUrl) {
      window.open(liveUrl || webUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.log("Auto-play prevented", e));
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const formattedIndex = String(index + 1).padStart(2, '0');

  return (
    <motion.div
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
      className="group block w-full h-full cursor-pointer transition-all duration-300"
    >
      <div className="flex flex-col md:flex-row h-full bg-[#08090c] rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5">
        
        {/* Image Section (Left on Desktop) */}
        <div className="relative w-full md:w-3/5 aspect-video md:aspect-auto md:h-[55vh] min-h-[300px] overflow-hidden bg-[#050608] flex items-center justify-center p-4 md:p-8">
          <div className="w-full h-full relative flex items-center justify-center">
            <img 
              src={image} 
              alt={title} 
              loading="lazy"
              className={`w-full h-full object-contain transition-transform duration-700 group-hover:scale-105 drop-shadow-[0_0_30px_rgba(255,255,255,0.05)] ${videoUrl ? 'group-hover:opacity-0' : ''}`} 
            />
            {videoUrl && (
              <video 
                ref={videoRef}
                src={videoUrl}
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-contain opacity-0 group-hover:opacity-100 transition-all duration-700 z-10"
              />
            )}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none" />
          </div>
        </div>

        {/* Content Section (Right on Desktop) */}
        <div className="flex-grow w-full md:w-2/5 p-8 md:p-12 flex flex-col justify-center relative">
          
          {/* Index Number */}
          <div className="text-5xl md:text-7xl font-black text-[#E53935] mb-6 tracking-tighter opacity-80" style={{ fontFamily: 'monospace' }}>
            {formattedIndex}
          </div>
          
          {/* Title & Description */}
          <div className="flex-grow flex flex-col justify-center mb-8">
            <h3 className={`text-2xl md:text-3xl font-bold uppercase tracking-widest mb-4 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'} group-hover:text-[#E53935]`}>
              {title}
            </h3>
            <p className="text-sm md:text-base text-gray-400 font-light leading-relaxed">
              {description}
            </p>
          </div>
          
          {/* Visit Button Area */}
          <div className="mt-auto flex items-center">
            <span className="flex items-center space-x-3 text-xs md:text-sm font-bold tracking-[0.2em] uppercase text-gray-500 group-hover:text-white transition-all duration-300 border border-[#333] group-hover:border-white/50 px-6 py-3 rounded-full bg-[#111] group-hover:bg-[#222]">
              <span>VISIT PROJECT</span>
              <span className="transform group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
            </span>
          </div>
          
        </div>
      </div>
    </motion.div>
  );
}
