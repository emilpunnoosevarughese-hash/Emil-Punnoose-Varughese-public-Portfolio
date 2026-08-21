import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home, Search, ShieldCheck, Zap, Wrench,
  Cpu, Monitor, CircuitBoard, MemoryStick, HardDrive,
  Layers, Network, PlugZap, FlaskConical, Calculator,
  Image as ImageIcon, ChevronRight, Clock
} from 'lucide-react';
import type { ReactNode } from 'react';

const NAV_ITEMS = [
  { icon: Home,         label: 'Home',             path: '/speclab' },
  { icon: Search,       label: 'Hardware Explorer', path: '/speclab/cpu' },
  { icon: ShieldCheck,  label: 'Compatibility',     path: '/speclab/compatibility' },
  { icon: Zap,          label: 'Build Advisor',     path: '/speclab/build-advisor' },
  { icon: Wrench,       label: 'Custom Builder',    path: '/speclab/custom-builder' },
  {
    icon: Cpu, label: 'Categories', path: null as null,
    flyout: [
      { icon: Cpu,          label: 'CPU',         path: '/speclab/cpu' },
      { icon: Monitor,      label: 'GPU',         path: '/speclab/gpu' },
      { icon: CircuitBoard, label: 'Motherboard', path: '/speclab/motherboard' },
      { icon: MemoryStick,  label: 'RAM',         path: '/speclab/ram' },
      { icon: HardDrive,    label: 'Storage',     path: '/speclab/storage' },
      { icon: Layers,       label: 'Laptops',     path: '/speclab/laptop' },
      { icon: Network,      label: 'Networking',  path: '/speclab/networking' },
    ]
  },
  { icon: PlugZap,      label: 'Connectors',        path: '/speclab/connectors' },
  { icon: FlaskConical, label: 'Tech Detective',    path: '/speclab/tech-detective' },
  { icon: Calculator,   label: 'Tech Calculator',   path: '/tools/tech-calculator' },
  { icon: ImageIcon,    label: 'Image Gallery',     path: '/admin/speclab/images' },
];

function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="text-xs tabular-nums" style={{ fontFamily: 'var(--sl-font-mono)', color: 'var(--sl-text-muted)' }}>
      {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </span>
  );
}

export function SpecLabShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);
  const [flyoutOpen, setFlyoutOpen] = useState(false);
  const dockW = expanded ? 'var(--sl-dock-expanded)' : 'var(--sl-dock-collapsed)';

  return (
    <div className="flex flex-col min-h-[calc(100vh-var(--nav-height))] sl-grid-bg" style={{ background: 'var(--sl-bg-substrate)' }}>
      {/* Status Bar */}
      <header
        className="fixed top-[var(--nav-height)] left-0 right-0 z-40 flex items-center px-4 gap-4 border-b"
        style={{ height: 'var(--sl-statusbar-h)', background: 'var(--sl-bg-panel)', borderColor: 'var(--sl-border)' }}
      >
        <div className="flex items-center gap-2" style={{ minWidth: 'var(--sl-dock-collapsed)' }}>
          <div className="w-7 h-7 rounded flex items-center justify-center text-xs font-bold"
            style={{ background: 'var(--sl-accent-signal)', color: '#fff', fontFamily: 'var(--sl-font-display)' }}>
            SL
          </div>
          {expanded && <span className="font-semibold text-sm" style={{ color: 'var(--sl-text-primary)', fontFamily: 'var(--sl-font-display)' }}>SpecLab</span>}
        </div>
        <Link to="/speclab" className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs max-w-md"
          style={{ background: 'var(--sl-bg-panel-raised)', color: 'var(--sl-text-muted)', border: '1px solid var(--sl-border)' }}>
          <Search size={12} /><span style={{ fontFamily: 'var(--sl-font-body)' }}>Search hardware...</span>
        </Link>
        <div className="flex-1" />
        <div className="hidden sm:flex items-center gap-2">
          <Clock size={12} style={{ color: 'var(--sl-text-muted)' }} /><LiveClock />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px]" style={{ color: 'var(--sl-text-muted)', fontFamily: 'var(--sl-font-mono)' }}>ONLINE</span>
        </div>
      </header>

      <div className="flex flex-1" style={{ paddingTop: 'calc(var(--nav-height) + var(--sl-statusbar-h))' }}>
        {/* Left Dock */}
        <nav
          className="hidden lg:flex fixed top-[calc(var(--nav-height)+var(--sl-statusbar-h))] bottom-0 left-0 z-30 flex-col border-r overflow-y-auto overflow-x-hidden transition-all duration-200"
          style={{ width: dockW, background: 'var(--sl-bg-panel)', borderColor: 'var(--sl-border)' }}
          onMouseEnter={() => setExpanded(true)}
          onMouseLeave={() => { setExpanded(false); setFlyoutOpen(false); }}
        >
          <button onClick={() => setExpanded(e => !e)}
            className="flex items-center justify-center h-10 mx-2 mt-2 mb-1 rounded opacity-40 hover:opacity-80 transition-opacity"
            style={{ color: 'var(--sl-text-muted)' }} aria-label="Toggle dock">
            <ChevronRight size={14} className={expanded ? 'rotate-180' : ''} />
          </button>

          {NAV_ITEMS.map((item, idx) => {
            const isActive = item.path
              ? (item.path === '/speclab' ? location.pathname === '/speclab' : location.pathname.startsWith(item.path))
              : false;
            const isCat = !item.path;
            return (
              <div key={idx} className="relative">
                {isCat ? (
                  <button onClick={() => setFlyoutOpen(o => !o)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium transition-colors relative"
                    style={{ color: flyoutOpen ? 'var(--sl-accent-copper)' : 'var(--sl-text-muted)' }}>
                    <span className="absolute left-0 top-1 bottom-1 w-[3px] rounded-r"
                      style={{ background: 'var(--sl-accent-copper)', opacity: flyoutOpen ? 1 : 0 }} />
                    <item.icon size={16} className="flex-shrink-0" />
                    {expanded && <><span style={{ fontFamily: 'var(--sl-font-body)' }}>{item.label}</span>
                    <ChevronRight size={10} className={`ml-auto transition-transform ${flyoutOpen ? 'rotate-90' : ''}`} /></>}
                  </button>
                ) : (
                  <Link to={item.path!}
                    className="flex items-center gap-3 px-3 py-2.5 text-xs font-medium transition-colors relative"
                    style={{ color: isActive ? 'var(--sl-accent-copper)' : 'var(--sl-text-muted)', background: isActive ? 'var(--sl-bg-panel-raised)' : undefined }}>
                    <span className="absolute left-0 top-1 bottom-1 w-[3px] rounded-r"
                      style={{ background: 'var(--sl-accent-copper)', opacity: isActive ? 1 : 0 }} />
                    <item.icon size={16} className="flex-shrink-0" />
                    {expanded && <span style={{ fontFamily: 'var(--sl-font-body)' }}>{item.label}</span>}
                  </Link>
                )}
                {isCat && flyoutOpen && expanded && item.flyout && (
                  <div className="pl-8 pb-1 space-y-0.5">
                    {item.flyout.map((f, fi) => (
                      <Link key={fi} to={f.path}
                        className="flex items-center gap-2 px-2 py-1.5 rounded text-[11px] transition-colors"
                        style={{ color: 'var(--sl-text-muted)', fontFamily: 'var(--sl-font-body)' }}>
                        <f.icon size={12} />{f.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Mobile bottom bar */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around border-t px-2 py-1"
          style={{ background: 'var(--sl-bg-panel)', borderColor: 'var(--sl-border)', height: '56px' }}>
          {NAV_ITEMS.slice(0, 5).map((item, idx) => {
            if (!item.path) return null;
            const isActive = item.path === '/speclab' ? location.pathname === '/speclab' : location.pathname.startsWith(item.path);
            return (
              <Link key={idx} to={item.path}
                className="flex flex-col items-center gap-0.5 px-2 py-1"
                style={{ color: isActive ? 'var(--sl-accent-copper)' : 'var(--sl-text-muted)' }}>
                <item.icon size={18} />
                <span className="text-[9px]" style={{ fontFamily: 'var(--sl-font-body)' }}>{item.label.split(' ')[0]}</span>
              </Link>
            );
          })}
        </nav>

        {/* Main canvas */}
        <main className="flex-1 overflow-y-auto pb-16 lg:pb-0 min-h-0"
          style={{ paddingLeft: 'var(--sl-dock-collapsed)', marginLeft: '0' }}>
          {children}
        </main>
      </div>
    </div>
  );
}



