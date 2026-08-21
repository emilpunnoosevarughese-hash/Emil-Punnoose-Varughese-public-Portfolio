import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Cpu, 
  Monitor, 
  CircuitBoard, 
  MemoryStick, 
  HardDrive, 
  Layers, 
  Shield, 
  Zap, 
  Network, 
  Search as SearchIcon, 
  Server, 
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface SpecLabSidebarProps {
  className?: string;
}

const navItems = [
  { label: 'Overview', path: '/speclab', icon: Home, type: 'link' },
  { label: 'CPU', path: '/speclab/cpu', icon: Cpu, type: 'link' },
  { label: 'GPU', path: '/speclab/gpu', icon: Monitor, type: 'link' },
  { label: 'Motherboards', path: '/speclab/motherboard', icon: CircuitBoard, type: 'link' },
  { label: 'RAM', path: '/speclab/ram', icon: MemoryStick, type: 'link' },
  { label: 'Storage', path: '/speclab/storage', icon: HardDrive, type: 'link' },
  { label: 'Laptops', path: '/speclab/laptop', icon: Layers, type: 'link' },
  { type: 'divider', id: 'd1' },
  { label: 'Compatibility', path: '/speclab/compatibility', icon: Shield, type: 'link' },
  { label: 'Build Advisor', path: '/speclab/build-advisor', icon: Zap, type: 'link' },
  { type: 'divider', id: 'd2' },
  { label: 'Connectors', path: '/speclab/connectors', icon: Network, type: 'link' },
  { label: 'Tech Detective', path: '/speclab/tech-detective', icon: SearchIcon, type: 'link' },
  { label: 'Calculator', path: '/tools/tech-calculator', icon: Server, type: 'link' }
];

const SpecLabSidebar: React.FC<SpecLabSidebarProps> = ({ className = '' }) => {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const { theme } = useTheme();
  
  const isDark = theme === 'dark' || theme === 'midnight';
  const sidebarBg = isDark ? 'backdrop-blur-xl bg-black/40 border-r border-white/10' : 'backdrop-blur-xl bg-white/60 border-r border-black/10';
  const textColor = isDark ? 'text-gray-300' : 'text-gray-700';
  const hoverBg = isDark ? 'hover:bg-white/10' : 'hover:bg-black/5';
  const activeBg = 'bg-primary/10 text-primary';
  const activeTextColor = 'text-primary font-medium';

  return (
    <motion.aside
      layout
      initial={false}
      animate={{ width: expanded ? 240 : 56 }}
      className={`fixed top-0 left-0 h-full z-50 flex flex-col py-4 glass-effect ${sidebarBg} ${className}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className="flex items-center px-3 mb-6 h-10">
        <div className="flex items-center justify-center min-w-[32px] w-[32px] h-[32px] rounded-lg bg-primary/20 text-primary">
          <Cpu size={18} strokeWidth={2.5} />
        </div>
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="ml-3 overflow-hidden whitespace-nowrap"
            >
              <h2 className={`font-bold text-base leading-tight ${isDark ? 'text-white' : 'text-black'}`}>
                SpecLab
              </h2>
              <p className="text-[10px] uppercase tracking-wider text-primary font-semibold">
                Hardware Intelligence
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 custom-scrollbar">
        <div className="flex flex-col space-y-1">
          {navItems.map((item) => {
            if (item.type === 'divider') {
              return (
                <div key={item.id} className={`my-2 h-px w-full ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />
              );
            }

            const isActive = location.pathname === item.path;
            const Icon = item.icon!;

            return (
              <Link
                key={item.path}
                to={item.path!}
                className={`flex items-center h-10 px-2 rounded-lg transition-colors overflow-hidden ${
                  isActive ? activeBg : `${textColor} ${hoverBg}`
                }`}
                title={!expanded ? item.label : undefined}
              >
                <div className="flex items-center justify-center min-w-[24px]">
                  <Icon size={18} className={isActive ? 'text-primary' : ''} />
                </div>
                
                <AnimatePresence>
                  {expanded && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className={`ml-3 whitespace-nowrap text-sm ${isActive ? activeTextColor : ''}`}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Expand/Collapse Toggle (optional bottom button) */}
      <div className="mt-auto px-2 pt-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className={`w-full flex items-center h-10 px-2 rounded-lg transition-colors ${textColor} ${hoverBg}`}
        >
          <div className="flex items-center justify-center min-w-[24px]">
            {expanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </div>
          <AnimatePresence>
            {expanded && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="ml-3 whitespace-nowrap text-sm"
              >
                Collapse
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
};

export default SpecLabSidebar;
