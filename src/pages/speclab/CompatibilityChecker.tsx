import { useState, useMemo } from 'react';
import { Check, X, AlertTriangle, ArrowRight, ArrowLeft, RefreshCw, Cpu, HardDrive, Zap, CircuitBoard, MemoryStick } from 'lucide-react';
import type { HardwareProduct } from '../../types/speclab';
import { SpecLabShell } from '../../components/speclab/layout/SpecLabShell';
import { SpecPanel } from '../../components/speclab/SpecPanel';
import { TraceDivider } from '../../components/speclab/TraceDivider';
import { BuildScoreGauge } from '../../components/speclab/BuildScoreGauge';
import { StatusChip } from '../../components/speclab/StatusChip';
import { scoreBuild } from '../../lib/buildScore';
import { SEED_CPUS, SEED_MOTHERBOARDS, SEED_RAM, SEED_GPUS, SEED_STORAGE } from '../../data/speclabData';

type BuildSelection = { cpu?: HardwareProduct; motherboard?: HardwareProduct; ram?: HardwareProduct; gpu?: HardwareProduct; storage?: HardwareProduct; };

const STEPS = [
  { id: 'cpu',         title: 'CPU',         data: SEED_CPUS,         icon: Cpu },
  { id: 'motherboard', title: 'Motherboard', data: SEED_MOTHERBOARDS, icon: CircuitBoard },
  { id: 'ram',         title: 'RAM',         data: SEED_RAM,          icon: MemoryStick },
  { id: 'gpu',         title: 'GPU',         data: SEED_GPUS,         icon: HardDrive },
  { id: 'storage',     title: 'Storage',     data: SEED_STORAGE,      icon: Zap },
];


export function CompatibilityChecker() {
  const [stepIdx, setStepIdx]       = useState(0);
  const [selections, setSelections] = useState<BuildSelection>({});
  const [search, setSearch]         = useState('');
  const [showResults, setShowResults] = useState(false);

  const currentStep = STEPS[stepIdx];
  const filtered = currentStep.data.filter((p: HardwareProduct) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 40);

  const buildResult = useMemo(() => scoreBuild(selections as any), [selections]);

  const handleSelect = (p: HardwareProduct) => {
    setSelections(prev => ({ ...prev, [currentStep.id]: p }));
    setSearch('');
  };
  const handleNext = () => { if (stepIdx < STEPS.length - 1) setStepIdx(s => s + 1); else setShowResults(true); };
  const handleBack = () => { if (stepIdx > 0) setStepIdx(s => s - 1); };
  const reset = () => { setSelections({}); setStepIdx(0); setShowResults(false); setSearch(''); };

  return (
    <SpecLabShell>
      <div className="px-6 py-8 max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-semibold" style={{ fontFamily: 'var(--sl-font-display)', color: 'var(--sl-text-primary)' }}>Compatibility Checker</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--sl-text-muted)', fontFamily: 'var(--sl-font-body)' }}>Select components step-by-step and get an instant compatibility score.</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {STEPS.map((s, i) => {
            const sel = selections[s.id as keyof BuildSelection];
            const done = !!sel;
            const active = i === stepIdx && !showResults;
            return (
              <div key={s.id} className="flex items-center gap-1">
                <button onClick={() => { if (!showResults) setStepIdx(i); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all"
                  style={{
                    background: active ? 'var(--sl-accent-signal)' : done ? 'rgba(62,207,142,0.1)' : 'var(--sl-bg-panel)',
                    color: active ? '#fff' : done ? 'var(--sl-status-good)' : 'var(--sl-text-muted)',
                    border: '1px solid ' + (active ? 'var(--sl-accent-signal)' : done ? 'var(--sl-status-good)33' : 'var(--sl-border)'),
                    fontFamily: 'var(--sl-font-body)'
                  }}>
                  {done ? <Check size={11} /> : <s.icon size={11} />}
                  <span className="hidden sm:inline">{s.title}</span>
                  <span className="sm:hidden">{i + 1}</span>
                </button>
                {i < STEPS.length - 1 && <ArrowRight size={10} style={{ color: 'var(--sl-border)', flexShrink: 0 }} />}
              </div>
            );
          })}
        </div>

        {!showResults ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Part selector */}
            <div className="lg:col-span-2 space-y-4">
              <SpecPanel className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <currentStep.icon size={16} style={{ color: 'var(--sl-accent-signal)' }} />
                  <span className="font-medium text-sm" style={{ color: 'var(--sl-text-primary)', fontFamily: 'var(--sl-font-display)' }}>Select {currentStep.title}</span>
                </div>
                <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder={"Search " + currentStep.title + "..."}
                  className="w-full mt-3 px-3 py-2 rounded text-xs bg-transparent outline-none"
                  style={{ border: '1px solid var(--sl-border)', color: 'var(--sl-text-primary)', fontFamily: 'var(--sl-font-body)', background: 'var(--sl-bg-panel-raised)' }} />
              </SpecPanel>

              <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
                {filtered.map((p: HardwareProduct) => {
                  const sel = selections[currentStep.id as keyof BuildSelection];
                  const isSelected = sel?.id === p.id;
                  return (
                    <button key={p.id} onClick={() => handleSelect(p)} className="w-full flex items-center justify-between px-4 py-2.5 rounded-[8px] border text-left transition-all"
                      style={{
                        background: isSelected ? 'rgba(76,141,255,0.08)' : 'var(--sl-bg-panel)',
                        borderColor: isSelected ? 'var(--sl-accent-signal)' : 'var(--sl-border)',
                      }}>
                      <div>
                        <span className="text-sm font-medium block" style={{ color: 'var(--sl-text-primary)', fontFamily: 'var(--sl-font-body)' }}>{p.name}</span>
                        <span className="text-[11px]" style={{ color: 'var(--sl-text-muted)', fontFamily: 'var(--sl-font-mono)' }}>{p.manufacturer_name}</span>
                      </div>
                      {(p as any).price_inr && (
                        <span className="text-sm tabular-nums" style={{ color: 'var(--sl-accent-copper)', fontFamily: 'var(--sl-font-mono)' }}>
                          â‚¹{((p as any).price_inr || 0).toLocaleString('en-IN')}
                        </span>
                      )}
                    </button>
                  );
                })}
                {filtered.length === 0 && (
                  <p className="text-center py-8 text-sm" style={{ color: 'var(--sl-text-muted)', fontFamily: 'var(--sl-font-body)' }}>No results found.</p>
                )}
              </div>

              <div className="flex justify-between gap-3">
                <button onClick={handleBack} disabled={stepIdx === 0}
                  className="flex items-center gap-2 px-4 py-2 rounded text-xs font-medium disabled:opacity-30 transition-opacity"
                  style={{ background: 'var(--sl-bg-panel)', color: 'var(--sl-text-muted)', border: '1px solid var(--sl-border)', fontFamily: 'var(--sl-font-body)' }}>
                  <ArrowLeft size={12} /> Back
                </button>
                <button onClick={handleNext}
                  className="flex items-center gap-2 px-4 py-2 rounded text-xs font-medium transition-opacity hover:opacity-80"
                  style={{ background: 'var(--sl-accent-signal)', color: '#fff', fontFamily: 'var(--sl-font-body)' }}>
                  {stepIdx < STEPS.length - 1 ? 'Next' : 'Check Compatibility'} <ArrowRight size={12} />
                </button>
              </div>
            </div>

            {/* Live score sidebar */}
            <SpecPanel className="flex flex-col items-center py-4">
              <p className="text-xs mb-2" style={{ color: 'var(--sl-text-muted)', fontFamily: 'var(--sl-font-mono)' }}>LIVE BUILD SCORE</p>
              <BuildScoreGauge result={buildResult} size="md" />
              <TraceDivider className="w-full mt-2" label="Selected" />
              <div className="w-full px-4 space-y-2">
                {STEPS.map(s => {
                  const sel = selections[s.id as keyof BuildSelection];
                  return (
                    <div key={s.id} className="flex items-center justify-between text-xs">
                      <span style={{ color: 'var(--sl-text-muted)', fontFamily: 'var(--sl-font-mono)' }}>{s.title}</span>
                      <span className="truncate max-w-[120px] text-right" style={{ color: sel ? 'var(--sl-text-primary)' : 'var(--sl-border)', fontFamily: 'var(--sl-font-body)' }}>
                        {sel ? sel.name.split(' ').slice(0, 3).join(' ') : 'â€”'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </SpecPanel>
          </div>
        ) : (
          /* Results */
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Score */}
              <SpecPanel className="flex flex-col items-center py-6">
                <p className="text-xs mb-3" style={{ color: 'var(--sl-text-muted)', fontFamily: 'var(--sl-font-mono)', letterSpacing: '0.1em' }}>BUILD SCORE</p>
                <BuildScoreGauge result={buildResult} size="lg" />
              </SpecPanel>

              {/* Parts summary */}
              <SpecPanel className="p-5">
                <p className="text-xs mb-3" style={{ color: 'var(--sl-text-muted)', fontFamily: 'var(--sl-font-mono)', letterSpacing: '0.1em' }}>SELECTED PARTS</p>
                <div className="space-y-3">
                  {STEPS.map(s => {
                    const sel = selections[s.id as keyof BuildSelection];
                    return (
                      <div key={s.id} className="flex items-start justify-between gap-3 text-sm border-b pb-2 last:border-0 last:pb-0" style={{ borderColor: 'var(--sl-border)' }}>
                        <div className="flex items-center gap-2">
                          <s.icon size={13} style={{ color: 'var(--sl-accent-signal)', flexShrink: 0 }} />
                          <span style={{ color: 'var(--sl-text-muted)', fontFamily: 'var(--sl-font-mono)', fontSize: '11px' }}>{s.title}</span>
                        </div>
                        <span className="text-right text-xs" style={{ color: sel ? 'var(--sl-text-primary)' : 'var(--sl-text-muted)', fontFamily: 'var(--sl-font-body)' }}>
                          {sel ? sel.name : <em>Not selected</em>}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {/* Total price */}
                <div className="mt-4 pt-3 border-t flex justify-between items-center" style={{ borderColor: 'var(--sl-border)' }}>
                  <span className="text-xs" style={{ color: 'var(--sl-text-muted)', fontFamily: 'var(--sl-font-mono)' }}>EST. TOTAL</span>
                  <span className="text-lg font-bold tabular-nums" style={{ color: 'var(--sl-accent-copper)', fontFamily: 'var(--sl-font-mono)' }}>
                    â‚¹{Object.values(selections).reduce((s, p) => s + ((p as any)?.price_inr || 0), 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </SpecPanel>
            </div>

            {/* Badges */}
            {buildResult.badges.length > 0 && (
              <SpecPanel className="p-4">
                <p className="text-xs mb-3" style={{ color: 'var(--sl-text-muted)', fontFamily: 'var(--sl-font-mono)' }}>ASSESSMENT</p>
                <div className="flex flex-wrap gap-2">
                  {buildResult.badges.map((b, i) => <StatusChip key={i} status={b.status} label={b.label} />)}
                </div>
              </SpecPanel>
            )}

            {/* Detailed checks */}
            <SpecPanel className="p-5">
              <p className="text-xs mb-4" style={{ color: 'var(--sl-text-muted)', fontFamily: 'var(--sl-font-mono)', letterSpacing: '0.1em' }}>DETAILED CHECKS</p>
              <div className="space-y-4">
                {buildResult.checks.map(c => (
                  <div key={c.id}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {c.status === 'good' ? <Check size={13} style={{ color: 'var(--sl-status-good)' }} /> :
                         c.status === 'caution' ? <AlertTriangle size={13} style={{ color: 'var(--sl-status-caution)' }} /> :
                         <X size={13} style={{ color: 'var(--sl-status-critical)' }} />}
                        <span className="text-xs font-medium" style={{ color: 'var(--sl-text-primary)', fontFamily: 'var(--sl-font-body)' }}>{c.label}</span>
                      </div>
                      <span className="text-xs tabular-nums" style={{ color: 'var(--sl-text-muted)', fontFamily: 'var(--sl-font-mono)' }}>{c.score}/{c.maxScore}</span>
                    </div>
                    <div className="w-full rounded-full overflow-hidden mb-1" style={{ height: '4px', background: 'var(--sl-border)' }}>
                      <div className="h-full rounded-full transition-all duration-500" style={{
                        width: ((c.score / c.maxScore) * 100) + '%',
                        background: c.status === 'good' ? 'var(--sl-status-good)' : c.status === 'caution' ? 'var(--sl-status-caution)' : 'var(--sl-status-critical)'
                      }} />
                    </div>
                    <p className="text-[11px]" style={{ color: 'var(--sl-text-muted)', fontFamily: 'var(--sl-font-body)' }}>{c.detail}</p>
                  </div>
                ))}
              </div>
            </SpecPanel>

            <button onClick={reset} className="flex items-center gap-2 text-xs px-4 py-2 rounded transition-opacity hover:opacity-80"
              style={{ background: 'var(--sl-bg-panel)', color: 'var(--sl-text-muted)', border: '1px solid var(--sl-border)', fontFamily: 'var(--sl-font-body)' }}>
              <RefreshCw size={12} /> Start Over
            </button>
          </div>
        )}
      </div>
    </SpecLabShell>
  );
}

