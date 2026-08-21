import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cpu, Monitor, HardDrive, MemoryStick, Layers, ShieldCheck, Zap, Network, Search, ChevronRight, CircuitBoard, Wrench, Image as ImageIcon, PlugZap, FlaskConical } from 'lucide-react';
import { SpecLabShell } from '../../components/speclab/layout/SpecLabShell';
import { SpecPanel } from '../../components/speclab/SpecPanel';
import { TraceDivider } from '../../components/speclab/TraceDivider';

const CATEGORIES = [
  { id: 'cpu',         label: 'CPU',          icon: Cpu,         path: '/speclab/cpu',         desc: 'Processors' },
  { id: 'gpu',         label: 'GPU',          icon: Monitor,     path: '/speclab/gpu',         desc: 'Graphics Cards' },
  { id: 'motherboard', label: 'Motherboards', icon: CircuitBoard,path: '/speclab/motherboard', desc: 'Chipsets & Sockets' },
  { id: 'ram',         label: 'RAM',          icon: MemoryStick, path: '/speclab/ram',         desc: 'DDR3/4/5' },
  { id: 'storage',     label: 'Storage',      icon: HardDrive,   path: '/speclab/storage',     desc: 'NVMe / SATA' },
  { id: 'laptop',      label: 'Laptops',      icon: Layers,      path: '/speclab/laptop',      desc: 'Mobile Systems' },
  { id: 'networking',  label: 'Networking',   icon: Network,     path: '/speclab/networking',  desc: 'NICs & Routers' },
];

const TOOLS = [
  { icon: ShieldCheck, label: 'Compatibility Checker', desc: 'Verify parts work together',  path: '/speclab/compatibility',    accent: 'var(--sl-status-good)' },
  { icon: Zap,         label: 'Build Advisor',         desc: 'Budget-matched pre-builds',   path: '/speclab/build-advisor',    accent: 'var(--sl-accent-copper)' },
  { icon: Wrench,      label: 'Custom Builder',        desc: 'Assemble and score your build',path: '/speclab/custom-builder',   accent: 'var(--sl-accent-signal)' },
  { icon: PlugZap,     label: 'Connector Explorer',    desc: 'Port and cable reference',    path: '/speclab/connectors',       accent: '#a855f7' },
  { icon: FlaskConical,label: 'Tech Detective',        desc: 'Diagnose hardware issues',    path: '/speclab/tech-detective',   accent: '#f43f5e' },
  { icon: ImageIcon,   label: 'Image Gallery',         desc: 'Wikimedia hardware images',   path: '/admin/speclab/images',     accent: '#ec4899' },
];

export function SpecLabHome() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  useEffect(() => { document.title = 'SpecLab — Hardware Intelligence Platform'; }, []);
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) navigate('/speclab/cpu');
  }, [searchValue, navigate]);

  return (
    <SpecLabShell>
      <div className="px-6 py-8 max-w-5xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>
          <div className="flex items-baseline gap-3 mb-1">
            <h1 className="text-3xl font-semibold tracking-tight" style={{ fontFamily: 'var(--sl-font-display)', color: 'var(--sl-text-primary)' }}>SpecLab</h1>
            <span className="text-sm px-2 py-0.5 rounded" style={{ background: 'rgba(76,141,255,0.1)', color: 'var(--sl-accent-signal)', border: '1px solid rgba(76,141,255,0.2)', fontFamily: 'var(--sl-font-mono)' }}>v2.0</span>
          </div>
          <p className="text-sm" style={{ color: 'var(--sl-text-muted)', fontFamily: 'var(--sl-font-body)' }}>Hardware Intelligence Platform — Explore, compare, build smarter.</p>
        </motion.div>

        <SpecPanel className="p-4">
          <form onSubmit={handleSearch} className="flex items-center gap-3">
            <Search size={16} style={{ color: 'var(--sl-text-muted)' }} className="flex-shrink-0" />
            <input type="text" value={searchValue} onChange={e => setSearchValue(e.target.value)}
              placeholder="Search CPU, GPU, motherboard, laptop or hardware model..."
              className="flex-1 bg-transparent outline-none text-sm" style={{ color: 'var(--sl-text-primary)', fontFamily: 'var(--sl-font-body)' }} />
            <button type="submit" className="px-4 py-1.5 rounded text-xs font-medium transition-opacity hover:opacity-80"
              style={{ background: 'var(--sl-accent-signal)', color: '#fff', fontFamily: 'var(--sl-font-body)' }}>Search</button>
          </form>
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t" style={{ borderColor: 'var(--sl-border)' }}>
            <span className="text-[11px]" style={{ color: 'var(--sl-text-muted)', fontFamily: 'var(--sl-font-mono)' }}>Quick:</span>
            {CATEGORIES.map(c => (
              <button key={c.id} onClick={() => navigate(c.path)} className="text-[11px] px-2 py-0.5 rounded"
                style={{ color: 'var(--sl-accent-signal)', background: 'rgba(76,141,255,0.08)', fontFamily: 'var(--sl-font-mono)', border: '1px solid rgba(76,141,255,0.15)' }}>
                {c.label}
              </button>
            ))}
          </div>
        </SpecPanel>

        <TraceDivider label="Hardware Categories" />

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {CATEGORIES.map((cat, i) => (
            <motion.div key={cat.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Link to={cat.path} className="flex flex-col items-center gap-2 p-3 rounded-[8px] border text-center group transition-all"
                style={{ background: 'var(--sl-bg-panel)', borderColor: 'var(--sl-border)' }}>
                <div className="w-9 h-9 rounded flex items-center justify-center" style={{ background: 'var(--sl-bg-panel-raised)' }}>
                  <cat.icon size={18} style={{ color: 'var(--sl-accent-signal)' }} />
                </div>
                <span className="text-[11px] font-medium" style={{ color: 'var(--sl-text-primary)', fontFamily: 'var(--sl-font-body)' }}>{cat.label}</span>
                <span className="text-[10px] hidden sm:block" style={{ color: 'var(--sl-text-muted)', fontFamily: 'var(--sl-font-body)' }}>{cat.desc}</span>
              </Link>
            </motion.div>
          ))}
        </div>

        <TraceDivider label="Tools" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TOOLS.map((tool, i) => (
            <motion.div key={tool.label} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
              <Link to={tool.path} className="flex items-start gap-3 p-4 rounded-[8px] border group transition-all"
                style={{ background: 'var(--sl-bg-panel)', borderColor: 'var(--sl-border)', display: 'flex' }}>
                <div className="w-9 h-9 rounded flex items-center justify-center flex-shrink-0"
                  style={{ background: tool.accent + '18', border: '1px solid ' + tool.accent + '33' }}>
                  <tool.icon size={18} style={{ color: tool.accent }} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium" style={{ color: 'var(--sl-text-primary)', fontFamily: 'var(--sl-font-body)' }}>{tool.label}</span>
                    <ChevronRight size={14} style={{ color: 'var(--sl-text-muted)' }} />
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--sl-text-muted)', fontFamily: 'var(--sl-font-body)' }}>{tool.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="pt-4 pb-2 border-t flex items-center justify-between" style={{ borderColor: 'var(--sl-border)' }}>
          <span className="text-[10px]" style={{ color: 'var(--sl-text-muted)', fontFamily: 'var(--sl-font-mono)' }}>SPECLAB // HARDWARE INTELLIGENCE // DIAGNOSTIC CONSOLE</span>
          <span className="text-[10px]" style={{ color: 'var(--sl-text-muted)', fontFamily: 'var(--sl-font-mono)' }}>{new Date().getFullYear()}</span>
        </div>
      </div>
    </SpecLabShell>
  );
}

