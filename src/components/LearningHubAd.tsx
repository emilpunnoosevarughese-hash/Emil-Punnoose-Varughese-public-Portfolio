import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { httpsCallable } from 'firebase/functions';
import { getFunctions } from 'firebase/functions';
import { app } from '../lib/firebase';
import { ExternalLink } from 'lucide-react';

interface AdCandidate {
  id: string;
  title: string;
  description: string;
  image_url: string;
  cta_text: string;
  weight: number;
}

export function LearningHubAd() {
  const [ads, setAds] = useState<AdCandidate[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [hasRecordedImpression, setHasRecordedImpression] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const functions = getFunctions(app);
        const getActiveAds = httpsCallable(functions, 'getActiveAds');
        const result = await getActiveAds({ placement: 'LEARNING_HUB_BANNER' }) as { data: { ads: AdCandidate[] } };
        
        if (result.data.ads && result.data.ads.length > 0) {
          // Weighted rotation logic can be complex, for simplicity here we just shuffle
          // based on weight or do a simple random if weights are equal
          setAds(result.data.ads);
        }
      } catch (error) {
        console.error("Failed to load advertisements", error);
      }
    };
    fetchAds();
  }, []);

  // Handle Rotation
  useEffect(() => {
    if (ads.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % ads.length);
      setHasRecordedImpression(false); // Reset impression for new ad
    }, 45000); // 45 seconds rotation
    
    return () => clearInterval(interval);
  }, [ads.length]);

  // Handle Impression Tracking
  useEffect(() => {
    if (ads.length === 0 || hasRecordedImpression || !containerRef.current) return;

    const currentAd = ads[currentAdIndex];

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setHasRecordedImpression(true);
        // Record impression
        const functions = getFunctions(app);
        const recordImpression = httpsCallable(functions, 'recordImpression');
        recordImpression({ adId: currentAd.id, placement: 'LEARNING_HUB_BANNER' }).catch(console.error);
        observer.disconnect();
      }
    }, { threshold: 0.5 }); // 50% visibility required

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [ads, currentAdIndex, hasRecordedImpression]);

  if (ads.length === 0) {
    return null; // Empty state: collapse completely
  }

  const activeAd = ads[currentAdIndex];

  // Secure click handling
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Redirect through the secure HTTP function endpoint
    // Assuming Cloud Functions are deployed at the Firebase project default URL or a rewrite is active
    // For local dev, we could use the local emulator URL. For now, assume a rewrite rule maps /api/ads/click
    window.open(`/api/ads/click?id=${activeAd.id}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full my-16 flex flex-col items-center">
      {/* Divider */}
      <div className="w-full max-w-4xl flex items-center justify-center mb-6">
        <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent flex-grow"></div>
        <span className="px-4 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] opacity-50">Sponsored Advertisement</span>
        <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent flex-grow"></div>
      </div>

      <div ref={containerRef} className="w-full max-w-[728px] mx-auto relative group">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-purple-500/20 to-success/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition duration-1000"></div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeAd.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="relative glass-effect bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden hover:border-primary/50 transition-colors cursor-pointer"
            onClick={handleClick}
          >
            <div className="flex flex-col md:flex-row h-auto md:h-[90px]">
              {/* Image Section */}
              <div className="w-full md:w-[250px] h-[150px] md:h-full shrink-0 bg-black overflow-hidden relative">
                <img 
                  src={activeAd.image_url} 
                  alt={`Sponsored advertisement for ${activeAd.title}`}
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
                <div className="absolute top-2 left-2 md:hidden bg-black/60 backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase">Sponsored</div>
              </div>

              {/* Content Section */}
              <div className="flex flex-col justify-center p-4 md:px-6 flex-grow">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-[var(--color-text-primary)] text-sm md:text-base line-clamp-1">{activeAd.title}</h3>
                  <span className="hidden md:inline-block px-2 py-0.5 border border-[var(--color-border)] rounded text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Partner</span>
                </div>
                <p className="text-[var(--color-text-muted)] text-xs md:text-sm line-clamp-2 md:line-clamp-1 mb-3 md:mb-0">
                  {activeAd.description}
                </p>
                
                {/* Mobile CTA */}
                <div className="md:hidden mt-auto pt-2 border-t border-[var(--color-border)] flex items-center justify-between text-primary font-bold text-sm">
                  {activeAd.cta_text}
                  <ExternalLink className="w-4 h-4" />
                </div>
              </div>

              {/* Desktop CTA */}
              <div className="hidden md:flex flex-col justify-center shrink-0 pr-6 pl-2 border-l border-[var(--color-border)]/50 ml-2">
                <span className="text-primary font-bold text-sm hover:text-primary/80 transition-colors flex items-center whitespace-nowrap">
                  {activeAd.cta_text}
                  <ExternalLink className="w-3 h-3 ml-1 opacity-50" />
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
