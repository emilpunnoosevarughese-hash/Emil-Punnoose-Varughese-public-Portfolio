import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { HardDrive, Clock, Activity, Monitor, Zap, Hash } from 'lucide-react';

const TABS = [
  { id: 'storage', label: 'Storage', icon: HardDrive },
  { id: 'download', label: 'Download Time', icon: Clock },
  { id: 'bandwidth', label: 'Mbps ↔ MB/s', icon: Activity },
  { id: 'ppi', label: 'Display PPI', icon: Monitor },
  { id: 'psu', label: 'PSU Estimator', icon: Zap },
  { id: 'base', label: 'Base Converter', icon: Hash }
];

export function TechCalculator() {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || theme === 'midnight';
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  // Storage State
  const [storageVal, setStorageVal] = useState('1');
  const [storageUnit, setStorageUnit] = useState('GB');

  // Network State
  const [fileSize, setFileSize] = useState('50');
  const [speedMbps, setSpeedMbps] = useState('100');

  // PPI State
  const [resW, setResW] = useState('1920');
  const [resH, setResH] = useState('1080');
  const [diagInches, setDiagInches] = useState('24');

  const renderStorage = () => {
    const val = parseFloat(storageVal) || 0;
    const multipliers: Record<string, number> = { 'B': 1, 'KB': 1024, 'MB': 1024**2, 'GB': 1024**3, 'TB': 1024**4 };
    const bytes = val * (multipliers[storageUnit] || 1);
    
    return (
      <div className="space-y-6">
        <div className="flex gap-4">
          <input type="number" value={storageVal} onChange={e => setStorageVal(e.target.value)} className="flex-1 p-3 rounded border bg-transparent" />
          <select value={storageUnit} onChange={e => setStorageUnit(e.target.value)} className="p-3 rounded border bg-transparent">
            {Object.keys(multipliers).map(k => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(multipliers).map(([unit, mult]) => (
            <div key={unit} className="p-4 rounded border" style={{ borderColor: 'var(--color-border)' }}>
              <div className="text-sm font-semibold opacity-70">{unit}</div>
              <div className="text-xl font-mono">{(bytes / mult).toLocaleString(undefined, { maximumFractionDigits: 4 })}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDownload = () => {
    const gb = parseFloat(fileSize) || 0;
    const mbps = parseFloat(speedMbps) || 1;
    const totalMB = gb * 1024;
    const speedMBps = mbps / 8;
    const seconds = totalMB / speedMBps;
    
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-2 opacity-70">File Size (GB)</label>
            <input type="number" value={fileSize} onChange={e => setFileSize(e.target.value)} className="w-full p-3 rounded border bg-transparent" />
          </div>
          <div>
            <label className="block text-sm mb-2 opacity-70">Speed (Mbps)</label>
            <input type="number" value={speedMbps} onChange={e => setSpeedMbps(e.target.value)} className="w-full p-3 rounded border bg-transparent" />
          </div>
        </div>
        <div className="p-6 rounded-xl text-center border bg-blue-500/10 border-blue-500/30">
          <div className="text-sm opacity-70 uppercase tracking-widest mb-2">Estimated Time</div>
          <div className="text-4xl font-mono font-bold">
            {h > 0 ? `${h}h ` : ''}{m > 0 ? `${m}m ` : ''}{s}s
          </div>
        </div>
      </div>
    );
  };

  const renderPPI = () => {
    const w = parseFloat(resW) || 0;
    const h = parseFloat(resH) || 0;
    const d = parseFloat(diagInches) || 1;
    const ppi = Math.sqrt(w*w + h*h) / d;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm mb-2 opacity-70">Width (px)</label>
            <input type="number" value={resW} onChange={e => setResW(e.target.value)} className="w-full p-3 rounded border bg-transparent" />
          </div>
          <div>
            <label className="block text-sm mb-2 opacity-70">Height (px)</label>
            <input type="number" value={resH} onChange={e => setResH(e.target.value)} className="w-full p-3 rounded border bg-transparent" />
          </div>
          <div>
            <label className="block text-sm mb-2 opacity-70">Diagonal (in)</label>
            <input type="number" value={diagInches} onChange={e => setDiagInches(e.target.value)} className="w-full p-3 rounded border bg-transparent" />
          </div>
        </div>
        <div className="p-6 rounded-xl text-center border bg-blue-500/10 border-blue-500/30">
          <div className="text-sm opacity-70 uppercase tracking-widest mb-2">Pixel Density</div>
          <div className="text-4xl font-mono font-bold">
            {ppi.toFixed(2)} PPI
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case 'storage': return renderStorage();
      case 'download': return renderDownload();
      case 'ppi': return renderPPI();
      default: return <div className="text-center p-12 opacity-50">Under Construction</div>;
    }
  };

  return (
    <div className={`min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 ${isDark ? 'bg-[var(--color-surface)] text-[var(--color-text-primary)]' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Tech Calculators</h1>
        <p className="text-lg opacity-70">A collection of utility calculators for developers and enthusiasts.</p>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64 flex-shrink-0 space-y-2">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === tab.id ? 'bg-blue-600 text-white' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
              >
                <tab.icon size={18} /> {tab.label}
              </button>
            ))}
          </div>
          
          <div className="flex-1">
            <div className="p-8 rounded-xl border" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                {React.createElement(TABS.find(t => t.id === activeTab)?.icon || Activity)} 
                {TABS.find(t => t.id === activeTab)?.label}
              </h2>
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
