import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, ArrowRight, Maximize2 } from 'lucide-react';
import { ActivityGalleryModal } from '../ui/ActivityGalleryModal';

interface PhotographySectionProps {
  profileData: any;
}

export function PhotographySection({ profileData }: PhotographySectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [isLightOn, setIsLightOn] = useState(true);

  const filters = ["All", "Portraits", "Street", "Nature"];

  const galleryItems = [
    {
      id: 1,
      src: profileData.images?.photography,
      category: "Portraits",
      title: "Neon Reflections",
      tag: "Urban Portrait",
      date: "2/05/2025",
      isLarge: true
    },
    {
      id: 2,
      src: profileData.images?.identities?.[1]?.src || profileData.images?.main,
      category: "Street",
      title: "Midnight Alley",
      tag: "Street Photography",
      date: "14/08/2025",
      isLarge: false
    },
    {
      id: 3,
      src: profileData.images?.creator,
      category: "Portraits",
      title: "Creator Studio",
      tag: "Self Portrait",
      date: "22/10/2025",
      isLarge: false
    },
    {
      id: 4,
      src: profileData.images?.artwork,
      category: "Nature",
      title: "Abstract Wilderness",
      tag: "Conceptual Nature",
      date: "05/11/2025",
      isLarge: false
    }
  ].filter(item => item.src);

  const filteredItems = galleryItems.filter(item => activeFilter === "All" || item.category === activeFilter);

  return (
    <>
      <section className="py-24 md:py-32 relative overflow-hidden bg-[var(--color-surface)]/10">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent" />
        
        {/* Top Gallery Spotlight Effect */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[700px] pointer-events-none z-0 transition-opacity duration-1000 ease-in-out ${isLightOn ? 'opacity-100' : 'opacity-0'}`}>
          {/* Main Cone */}
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-amber-500/10 via-amber-500/2 to-transparent blur-[12px]" 
            style={{ clipPath: 'polygon(40% 0, 60% 0, 95% 100%, 5% 100%)' }}
          />
          {/* Core Bright Beam */}
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[350px] h-full bg-gradient-to-b from-amber-400/20 via-amber-500/5 to-transparent blur-[6px]" 
            style={{ clipPath: 'polygon(46% 0, 54% 0, 75% 100%, 25% 100%)' }}
          />
          {/* Source Fixture Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1.5 bg-amber-200 blur-[2px]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-500/20 blur-[40px]" />
        </div>

        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="flex flex-col items-center text-center mb-12">
            <div className="mb-6 mt-16 relative z-10">
              <div className="relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center group">
                {/* Camera Icon Button */}
                <button 
                  onClick={() => setIsLightOn(!isLightOn)}
                  className={`relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#0a0a0a]/50 backdrop-blur-md border flex items-center justify-center transition-all duration-500 hover:scale-110 cursor-pointer ${
                    isLightOn 
                      ? 'border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.25)] hover:shadow-[0_0_40px_rgba(245,158,11,0.4)]' 
                      : 'border-white/10 shadow-none hover:border-white/20'
                  }`}
                  title={isLightOn ? "Turn off gallery lights" : "Turn on gallery lights"}
                >
                  <Camera className={`w-8 h-8 md:w-10 md:h-10 transition-colors duration-500 ${isLightOn ? 'text-amber-500' : 'text-gray-500'}`} />
                </button>
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-400 tracking-tight mb-4 uppercase">
              Visual <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Narratives</span>
            </h2>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl font-light tracking-wide leading-relaxed">
              A curated gallery of photography and visual explorations.
            </p>
            
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    activeFilter === filter 
                      ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]' 
                      : 'bg-transparent text-gray-500 hover:text-white border border-transparent hover:border-white/10'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Bento/Masonry Grid */}
          <motion.div layout className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[150px] sm:auto-rows-[200px] md:auto-rows-[280px]">
            <AnimatePresence>
              {filteredItems.map((item, index) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.05 }}
                  key={item.id} 
                  onClick={() => setIsModalOpen(true)}
                  className={`relative group rounded-[16px] overflow-hidden border border-white/10 bg-[#0a0a0a] cursor-pointer shadow-lg hover:shadow-2xl transition-shadow ${
                    item.isLarge ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1 md:col-span-1 md:row-span-1'
                  }`}
                >
                  <img 
                    src={item.src} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105" 
                  />
                  
                  {/* Date Badge */}
                  <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/90 text-xs font-semibold z-10">
                    {item.date}
                  </div>

                  {/* Expand Icon */}
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 border border-white/10">
                    <Maximize2 className="w-4 h-4 text-white" />
                  </div>

                  {/* Hover Overlay & Caption */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 md:p-6">
                    <motion.div 
                      initial={{ y: 10, opacity: 0 }} 
                      whileInView={{ y: 0, opacity: 1 }} 
                      transition={{ duration: 0.3 }}
                    >
                      <h4 className="text-white font-bold text-lg leading-tight mb-1">{item.title}</h4>
                      <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">{item.category} &mdash; {item.tag}</span>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          <div className="mt-16 flex justify-center">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onClick={() => setIsModalOpen(true)}
              className="group relative px-8 py-4 bg-transparent border border-[var(--color-border)] rounded-full text-[var(--color-text-primary)] font-bold tracking-widest uppercase text-sm hover:border-primary transition-colors overflow-hidden"
            >
              <div className="absolute inset-0 bg-primary translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative z-10 flex items-center group-hover:text-[var(--color-background)] transition-colors duration-300">
                View Full Gallery <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>
          </div>
        </div>
      </section>

      <ActivityGalleryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
