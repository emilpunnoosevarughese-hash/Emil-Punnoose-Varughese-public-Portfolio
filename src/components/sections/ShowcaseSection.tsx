import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor } from 'lucide-react';

import { FloatingTechStack } from '../ui/FloatingTechStack';

type TabType = 'certificates' | 'stack';

export function ShowcaseSection() {
  const [activeTab, setActiveTab] = useState<TabType>('stack');

  return (
    <section className="py-24 relative overflow-hidden bg-[var(--color-surface)]/10 min-h-screen flex flex-col">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent" />
      
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex-grow flex flex-col">
        {/* Massive Title like in the screenshot */}
        <div className="flex flex-col items-center justify-center mb-16">
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-12 drop-shadow-2xl">
            Portfolio Showcase
          </h2>

          {/* Tab Navigation */}
          <div className="inline-flex items-center p-1.5 bg-[#111] rounded-full border border-white/10 shadow-2xl">
            {(['certificates', 'stack'] as TabType[]).map((tab) => {
              const isActive = activeTab === tab;
              const labels = {
                certificates: 'Certificates',
                stack: 'Tech Stack'
              };

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-8 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive ? 'text-white' : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="showcaseTab"
                      className="absolute inset-0 bg-white/10 rounded-full border border-white/20"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{labels[tab]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Area */}
        <div className="w-full flex-grow relative flex flex-col justify-center">
          <AnimatePresence mode="wait">
            
            {/* CERTIFICATES TAB */}
            {activeTab === 'certificates' && (
              <motion.div
                key="certificates"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full min-h-[400px] flex flex-col items-center justify-center text-center"
              >
                <div className="w-24 h-24 mb-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <Monitor className="w-10 h-10 text-gray-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">No Certificates Yet</h3>
                <p className="text-gray-400 max-w-md">
                  This section is ready to host your premium certificates. You can add them through the data provider later.
                </p>
              </motion.div>
            )}

            {/* TECH STACK TAB */}
            {activeTab === 'stack' && (
              <motion.div
                key="stack"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.4 }}
                className="w-full flex justify-center"
              >
                <FloatingTechStack />
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
