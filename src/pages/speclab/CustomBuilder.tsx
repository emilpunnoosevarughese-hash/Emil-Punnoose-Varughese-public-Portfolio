import { useState, useMemo } from 'react';
import { ChevronRight, Search, Cpu, HardDrive, LayoutTemplate, Activity, Settings, Server, Zap } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import type { HardwareProduct, CpuSpec, GpuSpec } from '../../types/speclab';
import BreadcrumbNav from '../../components/speclab/BreadcrumbNav';
import { SEED_CPUS, SEED_MOTHERBOARDS, SEED_RAM, SEED_GPUS, SEED_STORAGE, SEED_PSUS, SEED_CASES } from '../../data/speclabData';

type BuilderStep = 'cpu' | 'motherboard' | 'ram' | 'gpu' | 'storage' | 'psu' | 'case' | 'review';

interface SelectedParts {
  cpu?: HardwareProduct;
  motherboard?: HardwareProduct;
  ram?: HardwareProduct;
  gpu?: HardwareProduct;
  storage?: HardwareProduct;
  psu?: HardwareProduct;
  case?: HardwareProduct;
}

const STEPS: { id: BuilderStep, label: string, icon: any, data: HardwareProduct[] }[] = [
  { id: 'cpu', label: 'Processor', icon: Cpu, data: SEED_CPUS },
  { id: 'motherboard', label: 'Motherboard', icon: LayoutTemplate, data: SEED_MOTHERBOARDS },
  { id: 'ram', label: 'Memory', icon: Activity, data: SEED_RAM },
  { id: 'gpu', label: 'Graphics Card', icon: Settings, data: SEED_GPUS },
  { id: 'storage', label: 'Storage', icon: HardDrive, data: SEED_STORAGE },
  { id: 'psu', label: 'Power Supply', icon: Zap, data: SEED_PSUS },
  { id: 'case', label: 'Cabinet', icon: Server, data: SEED_CASES }
];

export function CustomBuilder() {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || theme === 'midnight';

  const [currentStep, setCurrentStep] = useState<BuilderStep>('cpu');
  const [selectedParts, setSelectedParts] = useState<SelectedParts>({});
  const [searchQuery, setSearchQuery] = useState('');

  const stepIndex = STEPS.findIndex(s => s.id === currentStep);
  const currentStepData = STEPS.find(s => s.id === currentStep);

  // Compute Total Price
  const totalPrice = useMemo(() => {
    return Object.values(selectedParts).reduce((sum, part) => {
      if (part && part.price_inr) return sum + part.price_inr;
      return sum as number;
    }, 0);
  }, [selectedParts]);

  const formattedPrice = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 3 }).format(totalPrice as number);

  const filteredItems = useMemo(() => {
    if (!currentStepData) return [];
    if (!searchQuery) return currentStepData.data;
    const lowerQ = searchQuery.toLowerCase();
    return currentStepData.data.filter(item => 
      item.name.toLowerCase().includes(lowerQ) || 
      item.manufacturer_name.toLowerCase().includes(lowerQ)
    );
  }, [currentStepData, searchQuery]);

  const handleSelect = (part: HardwareProduct) => {
    setSelectedParts(prev => ({ ...prev, [currentStep]: part }));
    setSearchQuery('');
    
    // Auto-advance
    if (stepIndex !== -1 && stepIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[stepIndex + 1].id);
    } else if (stepIndex === STEPS.length - 1) {
      setCurrentStep('review');
    }
  };

  const calculateEvaluation = () => {
    const { cpu, gpu } = selectedParts;
    let evalText = "A well-rounded custom PC!";
    let type = "General Use";

    // Rough benchmark evaluation
    const cpuSpec = (cpu as any)?.spec as CpuSpec;
    const gpuSpec = (gpu as any)?.spec as GpuSpec;
    
    const cpuScore = cpuSpec?.benchmark_score || 0;
    const gpuScore = gpuSpec?.benchmark_score || 0;
    const totalScore = cpuScore + gpuScore;

    if (totalScore > 50000 || (gpu?.name.includes('4090'))) {
      type = "God-Tier Workstation";
      evalText = "This setup is an absolute monster. Uncompromised 4K Gaming, blazing fast Video Rendering, and capability to train heavy AI models locally. You have no bottlenecks here.";
    } else if (totalScore > 35000) {
      type = "High-End Gaming & Production";
      evalText = "Excellent for 1440p High-Refresh or 4K Gaming. Great for Web Development with multiple Docker containers, and very fast compile times.";
    } else if (totalScore > 20000) {
      type = "Mid-Range / 1080p Sweet Spot";
      evalText = "Perfect for 1080p Ultra Gaming or 1440p Medium. A great coding machine and everyday workhorse. Very balanced price-to-performance ratio.";
    } else if ((totalPrice as number) < 40000 && Object.keys(selectedParts).length === 7) {
      type = "Budget / Entry Level";
      evalText = "A highly cost-effective build. Great for office work, web browsing, lightweight coding, and 1080p Esports titles (CS:GO, Valorant) on medium settings.";
    }

    return { type, evalText, score: totalScore };
  };

  const evaluation = currentStep === 'review' ? calculateEvaluation() : null;

  return (
    <div className={`min-h-screen pt-24 pb-32 px-4 sm:px-6 lg:px-8 ${isDark ? 'bg-[var(--sl-bg-panel)] text-[var(--sl-text-primary)]' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-6xl mx-auto space-y-8">
        <BreadcrumbNav 
          items={[
            { label: 'SpecLab', href: '/speclab' },
            { label: 'Custom Builder' }
          ]} 
        />

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Custom PC Builder</h1>
          <p className="text-lg" style={{ color: 'var(--sl-text-muted)' }}>
            Select your parts. See the real-time price. Get an instant performance evaluation.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT SIDEBAR: Current Build Status */}
          <div className="lg:w-1/3 order-2 lg:order-1">
            <div className="sticky top-24 rounded-xl border p-6 space-y-4" style={{ backgroundColor: 'var(--sl-bg-panel)', borderColor: 'var(--sl-border)' }}>
              <h2 className="text-xl font-bold border-b pb-4 mb-4" style={{ borderColor: 'var(--sl-border)' }}>Your Build</h2>
              
              {STEPS.map(step => {
                const stepKey = step.id as keyof SelectedParts;
                const isSelected = !!selectedParts[stepKey];
                const part = selectedParts[stepKey];
                return (
                  <div key={step.id} 
                    className={`flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${currentStep === step.id ? 'border-blue-500 bg-blue-500/5' : ''}`}
                    style={{ borderColor: currentStep === step.id ? '#3b82f6' : 'var(--sl-border)' }}
                    onClick={() => setCurrentStep(step.id)}
                  >
                    <div className={`p-2 rounded bg-black/5 dark:bg-white/5`}>
                      <step.icon size={18} className={currentStep === step.id ? 'text-blue-500' : ''} />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--sl-text-muted)' }}>{step.label}</div>
                      {isSelected ? (
                        <div className="text-sm font-medium leading-tight mt-1">{part?.name}</div>
                      ) : (
                        <div className="text-sm text-red-500/80 mt-1">Not selected</div>
                      )}
                    </div>
                    {isSelected && part?.price_inr && (
                      <div className="text-sm font-bold mt-1 text-green-500">₹{part.price_inr.toLocaleString('en-IN')}</div>
                    )}
                  </div>
                )
              })}

              <div className="pt-4 border-t mt-6 flex justify-between items-center" style={{ borderColor: 'var(--sl-border)' }}>
                <div className="text-lg font-bold">Total Price:</div>
                <div className="text-2xl font-black text-green-500">{formattedPrice}</div>
              </div>

              {Object.keys(selectedParts).length > 0 && currentStep !== 'review' && (
                <button 
                  onClick={() => setCurrentStep('review')}
                  className="w-full mt-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors"
                >
                  Analyze My Build
                </button>
              )}
            </div>
          </div>

          {/* RIGHT MAIN: Selection & Review Area */}
          <div className="lg:w-2/3 order-1 lg:order-2">
            
            {currentStep !== 'review' && currentStepData && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <currentStepData.icon className="text-blue-500" />
                    Select {currentStepData.label}
                  </h2>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
                  <input 
                    type="text" 
                    placeholder={`Search ${currentStepData.data.length} components...`}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
                    style={{ borderColor: 'var(--sl-border)' }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="grid gap-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {filteredItems.map(item => (
                    <div 
                      key={item.id} 
                      onClick={() => handleSelect(item)}
                      className="flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all hover:border-blue-500 hover:shadow-md"
                      style={{ 
                        backgroundColor: 'var(--sl-bg-panel)', 
                        borderColor: selectedParts[currentStep]?.id === item.id ? '#3b82f6' : 'var(--sl-border)' 
                      }}
                    >
                      <div>
                        <div className="text-xs font-bold text-gray-500 mb-1">{item.manufacturer_name}</div>
                        <div className="text-lg font-bold">{item.name}</div>
                      </div>
                      <div className="text-right flex items-center gap-4">
                        <div className="text-lg font-bold text-green-500">
                          {item.price_inr ? `₹${item.price_inr.toLocaleString('en-IN')}` : 'Price N/A'}
                        </div>
                        <ChevronRight className="text-gray-400" />
                      </div>
                    </div>
                  ))}
                  {filteredItems.length === 0 && (
                    <div className="text-center py-12" style={{ color: 'var(--sl-text-muted)' }}>
                      No components found matching "{searchQuery}"
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentStep === 'review' && evaluation && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-8 rounded-2xl border bg-gradient-to-br from-blue-500/10 to-purple-500/10" style={{ borderColor: 'var(--sl-border)' }}>
                  <div className="flex items-center gap-3 mb-6 text-blue-500">
                    <Activity size={32} />
                    <h2 className="text-3xl font-black tracking-tight">Benchmark Analysis</h2>
                  </div>
                  
                  <div className="mb-6">
                    <div className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-1">Estimated Tier</div>
                    <div className="text-2xl font-bold">{evaluation.type}</div>
                  </div>

                  <div className="p-5 rounded-xl bg-black/5 dark:bg-white/5 border text-lg leading-relaxed mb-6" style={{ borderColor: 'var(--sl-border)' }}>
                    {evaluation.evalText}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border" style={{ borderColor: 'var(--sl-border)', backgroundColor: 'var(--sl-bg-panel)' }}>
                      <div className="text-sm font-bold text-gray-500 mb-1">Total Cost</div>
                      <div className="text-xl font-bold text-green-500">{formattedPrice}</div>
                    </div>
                    <div className="p-4 rounded-xl border" style={{ borderColor: 'var(--sl-border)', backgroundColor: 'var(--sl-bg-panel)' }}>
                      <div className="text-sm font-bold text-gray-500 mb-1">Raw Compute Score</div>
                      <div className="text-xl font-bold text-purple-500">{evaluation.score.toLocaleString()} pts</div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-6 rounded-xl border" style={{ borderColor: 'var(--sl-border)', backgroundColor: 'var(--sl-bg-panel)' }}>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Ready to build?</h3>
                    <p className="text-sm" style={{ color: 'var(--sl-text-muted)' }}>Save this list or check part compatibility next.</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setCurrentStep('cpu')} className="px-4 py-2 rounded border font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors" style={{ borderColor: 'var(--sl-border)' }}>
                      Edit Parts
                    </button>
                    <button onClick={() => window.location.href='/speclab/compatibility'} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors">
                      Run Compatibility Check
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}





