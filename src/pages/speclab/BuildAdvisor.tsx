import { useState } from 'react';
import { SpecLabShell } from '../../components/speclab/layout/SpecLabShell';

import { Gamepad2, Code, Globe, Brain, Film, Box, Shield, Home, Book, RefreshCw, IndianRupee, ArrowDownUp, Info } from 'lucide-react';
import BreadcrumbNav from '../../components/speclab/BreadcrumbNav';
import { SEED_BUDGET_BUILDS } from '../../data/speclabData';

type UseCase = 'gaming' | 'programming' | 'web' | 'ai' | 'video' | '3d' | 'cyber' | 'general' | 'student';
type AdvisorMode = 'usecase' | 'budget';

const USE_CASES: { id: UseCase, title: string, icon: any, desc: string }[] = [
  { id: 'gaming', title: 'Gaming', icon: Gamepad2, desc: 'High frame rates and graphical fidelity' },
  { id: 'programming', title: 'Programming', icon: Code, desc: 'Fast compilation, heavy multitasking' },
  { id: 'web', title: 'Web Development', icon: Globe, desc: 'Running local servers, docker, browser tabs' },
  { id: 'ai', title: 'AI / Machine Learning', icon: Brain, desc: 'Heavy GPU computing, large datasets' },
  { id: 'video', title: 'Video Editing', icon: Film, desc: 'Timeline scrub, rendering, large storage' },
  { id: '3d', title: '3D Rendering', icon: Box, desc: 'CPU/GPU hybrid rendering tasks' },
  { id: 'cyber', title: 'Cybersecurity', icon: Shield, desc: 'VM hosting, network analysis' },
  { id: 'general', title: 'General Use', icon: Home, desc: 'Browsing, office apps, media' },
  { id: 'student', title: 'Student Work', icon: Book, desc: 'Budget-friendly, reliable everyday tasks' }
];

export function BuildAdvisor() {
  
  

  const [mode, setMode] = useState<AdvisorMode>('usecase');
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [useCase, setUseCase] = useState<UseCase | null>(null);
  
  // Budget Mode State
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const getRecommendations = () => {
    switch (useCase) {
      case 'gaming': return [
        { cat: 'CPU', name: 'Intel Core i5-13600K', desc: 'Excellent single-core performance for high FPS.' },
        { cat: 'GPU', name: 'NVIDIA RTX 4070', desc: 'Great 1440p gaming value.' },
        { cat: 'RAM', name: '32GB DDR5-6000', desc: 'Plenty of fast memory for modern titles.' }
      ];
      case 'ai': return [
        { cat: 'CPU', name: 'Intel Core i9-13900K', desc: 'Massive core count for data prep.' },
        { cat: 'GPU', name: 'NVIDIA RTX 4090 24GB', desc: 'Huge VRAM is essential for model training.' },
        { cat: 'RAM', name: '64GB DDR5', desc: 'Required for loading large datasets into memory.' }
      ];
      case 'programming': return [
        { cat: 'CPU', name: 'AMD Ryzen 7 7700X', desc: 'Fast compile times and efficient.' },
        { cat: 'RAM', name: '32GB DDR5', desc: 'For running IDEs, Docker, and emulators.' },
        { cat: 'Storage', name: '1TB NVMe Gen4', desc: 'Fast file system access for large repos.' }
      ];
      default: return [
        { cat: 'CPU', name: 'Intel Core i5-12400', desc: 'Great all-rounder value.' },
        { cat: 'RAM', name: '16GB DDR4', desc: 'Standard for most tasks today.' },
        { cat: 'Storage', name: '512GB NVMe SSD', desc: 'Fast boot and app loading times.' }
      ];
    }
  };

  const formattedPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 3 }).format(price);
  };

  const sortedBudgets = [...SEED_BUDGET_BUILDS].sort((a, b) => 
    sortOrder === 'asc' ? a.price_inr - b.price_inr : b.price_inr - a.price_inr
  );

  return (
    <SpecLabShell>
    <div className="px-6 py-8 max-w-5xl mx-auto" style={{ color: 'var(--sl-text-primary)', fontFamily: 'var(--sl-font-body)' }}>
      <div className="max-w-6xl mx-auto space-y-8">
        <BreadcrumbNav 
          items={[
            { label: 'SpecLab', href: '/speclab' },
            { label: 'Build Advisor' }
          ]} 
        />

        <div className="text-center max-w-2xl mx-auto mb-8">
          <h1 className="text-4xl font-bold mb-4">Build Advisor</h1>
          <p className="text-lg mb-8" style={{ color: 'var(--sl-text-muted)' }}>
            Tell us what you want to do, or how much you want to spend, and we'll recommend the exact hardware you need.
          </p>

          <div className="inline-flex rounded-lg p-1 bg-black/5 dark:bg-white/5 border" style={{ borderColor: 'var(--sl-border)' }}>
            <button 
              onClick={() => { setMode('usecase'); setStep(1); }}
              className={`px-6 py-2.5 rounded-md text-sm font-semibold transition-all ${mode === 'usecase' ? 'bg-white dark:bg-gray-800 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              Advise by Use Case
            </button>
            <button 
              onClick={() => { setMode('budget'); }}
              className={`px-6 py-2.5 rounded-md text-sm font-semibold transition-all ${mode === 'budget' ? 'bg-white dark:bg-gray-800 shadow-sm text-green-600 dark:text-green-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              Advise by Budget
            </button>
          </div>
        </div>

        {/* --- USE CASE MODE --- */}
        {mode === 'usecase' && (
          <>
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-center mb-8">What will you use this PC for primarily?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                  {USE_CASES.map(uc => (
                    <button
                      key={uc.id}
                      onClick={() => { setUseCase(uc.id); setStep(3); }}
                      className="flex flex-col items-center text-center p-6 rounded-xl border-2 transition-all hover:scale-105"
                      style={{ 
                        backgroundColor: 'var(--sl-bg-panel)', 
                        borderColor: useCase === uc.id ? '#3b82f6' : 'var(--sl-border)' 
                      }}
                    >
                      <uc.icon size={48} className="mb-4 text-blue-500" />
                      <h3 className="text-xl font-bold mb-2">{uc.title}</h3>
                      <p className="text-sm" style={{ color: 'var(--sl-text-muted)' }}>{uc.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && useCase && (
              <div className="rounded-xl border p-8 space-y-8 max-w-4xl mx-auto" style={{ backgroundColor: 'var(--sl-bg-panel)', borderColor: 'var(--sl-border)' }}>
                <div className="flex justify-between items-center border-b pb-4" style={{ borderColor: 'var(--sl-border)' }}>
                  <h2 className="text-3xl font-bold">Recommended Specs for {USE_CASES.find(u => u.id === useCase)?.title}</h2>
                  <button 
                    onClick={() => { setStep(1); setUseCase(null); }}
                    className="flex items-center gap-2 text-blue-500 hover:text-blue-600 font-medium"
                  >
                    <RefreshCw size={18} /> Start Over
                  </button>
                </div>

                <div className="grid gap-6">
                  {getRecommendations().map((rec, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-4 p-6 rounded-lg border" style={{ borderColor: 'var(--sl-border)' }}>
                      <div className="w-24 text-center px-4 py-2 rounded font-bold uppercase tracking-widest text-sm" style={{ backgroundColor: 'var(--sl-border)' }}>
                        {rec.cat}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold">{rec.name}</h4>
                        <p className="mt-1" style={{ color: 'var(--sl-text-muted)' }}>{rec.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 text-sm">
                  <p><strong>Note:</strong> These are baseline recommendations. Actual hardware availability and pricing may vary. Always double-check compatibility before purchasing parts.</p>
                </div>
              </div>
            )}
          </>
        )}

        {/* --- BUDGET MODE --- */}
        {mode === 'budget' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b pb-4" style={{ borderColor: 'var(--sl-border)' }}>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <IndianRupee size={24} className="text-green-500" /> Pricing Tiers
              </h2>
              
              <button 
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-medium"
                style={{ borderColor: 'var(--sl-border)' }}
              >
                <ArrowDownUp size={16} />
                Sort: {sortOrder === 'asc' ? 'Low to High' : 'High to Low'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sortedBudgets.map((build) => (
                <div key={build.id} className="flex flex-col rounded-xl border overflow-hidden transition-all hover:border-green-500/50 hover:shadow-lg" style={{ backgroundColor: 'var(--sl-bg-panel)', borderColor: 'var(--sl-border)' }}>
                  {/* Header */}
                  <div className="p-6 border-b flex justify-between items-start bg-black/5 dark:bg-white/5" style={{ borderColor: 'var(--sl-border)' }}>
                    <div>
                      <h3 className="text-2xl font-bold">{build.tier}</h3>
                      <p className="text-xl font-semibold text-green-600 dark:text-green-400 mt-1">
                        ~ {formattedPrice(build.price_inr)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Specs */}
                  <div className="p-6 flex-1 grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
                    <div>
                      <span className="block text-xs uppercase font-bold tracking-wider mb-1" style={{ color: 'var(--sl-text-muted)' }}>Processor</span>
                      <span className="font-medium">{build.cpu}</span>
                    </div>
                    <div>
                      <span className="block text-xs uppercase font-bold tracking-wider mb-1" style={{ color: 'var(--sl-text-muted)' }}>Graphics</span>
                      <span className="font-medium">{build.gpu}</span>
                    </div>
                    <div>
                      <span className="block text-xs uppercase font-bold tracking-wider mb-1" style={{ color: 'var(--sl-text-muted)' }}>Memory</span>
                      <span className="font-medium">{build.ram}</span>
                    </div>
                    <div>
                      <span className="block text-xs uppercase font-bold tracking-wider mb-1" style={{ color: 'var(--sl-text-muted)' }}>Storage</span>
                      <span className="font-medium">{build.storage}</span>
                    </div>
                    <div>
                      <span className="block text-xs uppercase font-bold tracking-wider mb-1" style={{ color: 'var(--sl-text-muted)' }}>Motherboard</span>
                      <span className="font-medium">{build.motherboard}</span>
                    </div>
                    <div>
                      <span className="block text-xs uppercase font-bold tracking-wider mb-1" style={{ color: 'var(--sl-text-muted)' }}>Power / Case</span>
                      <span className="font-medium text-gray-500 dark:text-gray-400">{build.power_supply} Ã¢â‚¬Â¢ {build.case}</span>
                    </div>
                  </div>

                  {/* Description Footer */}
                  <div className="p-6 pt-0 mt-auto">
                    <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 mb-3">
                      <p className="text-sm font-medium leading-relaxed">{build.performance_desc}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--sl-text-muted)' }}>
                      <Info size={14} /> Recommended OS: <span className="text-[var(--sl-text-primary)]">{build.recommended_os}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 text-sm flex items-start gap-3">
               <Info size={20} className="text-blue-500 flex-shrink-0" />
               <p><strong>Pricing Disclaimer:</strong> These prices are estimates in INR (Ã¢â€šÂ¹) for the core components (Tower only). Prices fluctuate based on availability, region, and current market conditions. Peripherals like monitors and keyboards are not included.</p>
            </div>
          </div>
        )}
      </div>
    </div>
</SpecLabShell>
  );
}







