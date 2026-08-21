import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image as ImageIcon, Wand2, Palette, Code, Check } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface TypographyTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TypographyTutorialModal({ isOpen, onClose }: TypographyTutorialModalProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || theme === 'midnight';

  const steps = [
    {
      icon: <ImageIcon className="w-6 h-6 text-primary" />,
      title: "1. Capture the Perfect Photo",
      description: "Take a clear portrait photo against a solid background with good lighting."
    },
    {
      icon: <Wand2 className="w-6 h-6 text-accent" />,
      title: "2. Generate Typography Art",
      description: "Use a typography portrait generator or Photoshop to map text to your facial contours."
    },
    {
      icon: <Palette className="w-6 h-6 text-purple-500" />,
      title: "3. Prepare for Themes",
      description: "Export two versions: one with a dark background for Dark Mode, and one with a white background for Light Mode."
    },
    {
      icon: <Code className="w-6 h-6 text-green-500" />,
      title: "4. Apply CSS Magic",
      description: "Use mix-blend-multiply in Light Mode to seamlessly blend the white background, and mix-blend-overlay for premium hover effects!"
    }
  ];

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-lg overflow-hidden rounded-3xl ${
              isDark 
                ? 'bg-[#181a20] border-none shadow-[-10px_-10px_30px_rgba(255,255,255,0.03),_10px_10px_30px_rgba(0,0,0,0.9)]' 
                : 'bg-[#e0e5ec] shadow-[-10px_-10px_30px_rgba(255,255,255,1),_10px_10px_30px_rgba(163,177,198,0.6)] border-none'
            }`}
          >
            <div className="relative p-6 md:p-8">
              <button
                onClick={onClose}
                className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 ${
                  isDark 
                    ? 'hover:shadow-[inset_-2px_-2px_5px_rgba(255,255,255,0.03),inset_2px_2px_5px_rgba(0,0,0,0.8)] text-gray-400 hover:text-white'
                    : 'hover:shadow-[inset_-2px_-2px_5px_rgba(255,255,255,1),inset_2px_2px_5px_rgba(163,177,198,0.5)] text-gray-500 hover:text-black'
                }`}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-8 text-center max-w-md mx-auto">
                <h3 className={`text-2xl font-display font-black mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  Custom Typography Portrait
                </h3>
                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Want a stunning typography portrait for your own portfolio? Here is the step-by-step process.
                </p>
              </div>

              <div className="space-y-4">
                {steps.map((step, index) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    key={index} 
                    className={`flex items-start gap-5 p-4 rounded-2xl transition-all duration-300 ${
                      isDark 
                        ? 'bg-[#181a20] shadow-[inset_-3px_-3px_7px_rgba(255,255,255,0.02),inset_3px_3px_7px_rgba(0,0,0,0.5)] hover:shadow-[-3px_-3px_7px_rgba(255,255,255,0.03),_3px_3px_7px_rgba(0,0,0,0.8)]'
                        : 'bg-[#e0e5ec] shadow-[inset_-3px_-3px_7px_rgba(255,255,255,0.8),inset_3px_3px_7px_rgba(163,177,198,0.4)] hover:shadow-[-3px_-3px_7px_rgba(255,255,255,1),_3px_3px_7px_rgba(163,177,198,0.5)]'
                    }`}
                  >
                    <div className={`p-3 rounded-xl shrink-0 flex items-center justify-center ${
                      isDark 
                        ? 'bg-[#181a20] shadow-[-3px_-3px_7px_rgba(255,255,255,0.03),_3px_3px_7px_rgba(0,0,0,0.8)]' 
                        : 'bg-[#e0e5ec] shadow-[-3px_-3px_7px_rgba(255,255,255,1),_3px_3px_7px_rgba(163,177,198,0.5)]'
                    }`}>
                      {step.icon}
                    </div>
                    <div className="pt-1">
                      <h4 className={`text-base font-bold mb-1 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                        {step.title}
                      </h4>
                      <p className={`text-xs leading-relaxed font-medium ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 text-center flex justify-center">
                <button 
                  onClick={onClose} 
                  className={`px-8 py-3 rounded-full text-sm font-bold tracking-widest uppercase transition-all duration-300 flex items-center ${
                    isDark
                      ? 'bg-[#181a20] text-primary shadow-[-5px_-5px_10px_rgba(255,255,255,0.03),_5px_5px_10px_rgba(0,0,0,0.8)] hover:shadow-[inset_-3px_-3px_7px_rgba(255,255,255,0.03),inset_3px_3px_7px_rgba(0,0,0,0.8)]'
                      : 'bg-[#e0e5ec] text-primary shadow-[-5px_-5px_10px_rgba(255,255,255,1),_5px_5px_10px_rgba(163,177,198,0.5)] hover:shadow-[inset_-3px_-3px_7px_rgba(255,255,255,1),inset_3px_3px_7px_rgba(163,177,198,0.5)]'
                  }`}
                >
                  <Check className="w-4 h-4 mr-2" /> Got it!
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body);
  }
  
  return null;
}
