import { X, ExternalLink, Code2, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Feature {
  title: string;
  description: string;
  imageUrl?: string;
}

interface ProjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    title: string;
    fullDescription?: string;
    description: string;
    webUrl?: string;
    liveUrl?: string;
    frontendTech?: string[];
    backendTech?: string[];
    features?: Feature[];
  } | null;
}

export function ProjectDetailsModal({ isOpen, onClose, project }: ProjectDetailsModalProps) {
  if (!project) return null;

  const targetUrl = project.webUrl || project.liveUrl;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center p-4 pt-16 md:p-6 md:pt-20 lg:p-12 lg:pt-24">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full h-full sm:h-auto sm:max-h-[90vh] md:max-w-4xl bg-[#0a0d14] md:rounded-2xl border border-white/5 shadow-2xl flex flex-col overflow-hidden text-white"
          >
            {/* Top Navigation Bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-[#0a0d14]/80 backdrop-blur z-20 shrink-0">
              <h2 className="text-lg md:text-xl font-bold tracking-tight">{project.title}</h2>
              <div className="flex items-center space-x-3">
                {targetUrl && (
                  <a
                    href={targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden md:flex items-center space-x-2 px-4 py-1.5 bg-white text-black text-xs font-bold rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <span>Visit</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  onClick={onClose}
                  className="p-1.5 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 px-5 py-6 md:px-8 md:py-6">
              <div className="max-w-3xl mx-auto space-y-6">
                
                {/* Main Media (First Image/Video) */}
                <div className="w-full rounded-2xl overflow-hidden border border-white/10 bg-[#050505] shadow-2xl aspect-[16/9] relative">
                  {/* Subtle glow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10 pointer-events-none" />
                  {(project as any).videoUrl ? (
                    <video 
                      src={(project as any).videoUrl}
                      className="w-full h-full object-cover relative z-0"
                      autoPlay
                      controls
                      loop
                      muted
                      playsInline
                    />
                  ) : (
                    <img 
                      src={(project as any).imageUrl} 
                      alt={project.title}
                      className="w-full h-full object-cover relative z-0"
                    />
                  )}
                </div>

                {/* Tech Stack Header */}
                <div className="flex flex-col sm:flex-row gap-8 sm:gap-16">
                  {project.frontendTech && project.frontendTech.length > 0 && (
                    <div className="space-y-3">
                      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <Code2 className="w-3 h-3" />
                        FRONTEND
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {project.frontendTech.map((tech, i) => (
                          <div key={i} className="px-3 py-1.5 bg-[#141824] border border-white/5 rounded-full text-xs text-gray-300 font-medium">
                            {tech}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {project.backendTech && project.backendTech.length > 0 && (
                    <div className="space-y-3">
                      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <Database className="w-3 h-3" />
                        BACKEND
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {project.backendTech.map((tech, i) => (
                          <div key={i} className="px-3 py-1.5 bg-[#141824] border border-white/5 rounded-full text-xs text-gray-300 font-medium">
                            {tech}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Main Overview */}
                <div className="space-y-8">
                  <p className="text-base md:text-lg text-gray-300 leading-relaxed font-light">
                    {project.fullDescription || project.description}
                  </p>

                  {targetUrl && (
                    <div className="pt-2">
                      <a
                        href={targetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-black text-sm font-bold rounded-lg hover:bg-gray-200 transition-transform hover:scale-105 active:scale-95"
                      >
                        <span>Visit Website</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </div>
                
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
