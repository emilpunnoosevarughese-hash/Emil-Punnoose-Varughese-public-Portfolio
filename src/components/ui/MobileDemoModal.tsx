import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  demoUrl: string;
  webUrl?: string;
  docsUrl?: string;
}

export function MobileDemoModal({ isOpen, onClose, demoUrl }: MobileDemoModalProps) {
  const isVideo = demoUrl.match(/\.(mp4|webm)($|\?)/i);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 md:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full h-full sm:h-auto sm:aspect-video max-w-7xl bg-[#0a0a0a] sm:rounded-lg overflow-hidden border border-[#222] shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col"
          >
            {/* Floating Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition-colors shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Main Layout */}
            <div className="flex-1 flex overflow-hidden relative bg-black">
              {isVideo ? (
                <video 
                  src={demoUrl}
                  className="w-full h-full flex-1 border-none bg-black relative z-10 object-contain"
                  autoPlay
                  controls
                  loop
                  muted
                  playsInline
                />
              ) : (
                <iframe 
                  src={demoUrl} 
                  className="w-full h-full flex-1 border-none bg-black relative z-10"
                  title="Project Preview"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
