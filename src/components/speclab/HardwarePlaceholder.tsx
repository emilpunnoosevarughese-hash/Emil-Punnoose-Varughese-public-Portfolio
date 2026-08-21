import React from "react";
import { 
  Cpu, 
  HardDrive, 
  Monitor, 
  Zap, 
  Thermometer, 
  MemoryStick, 
  CircuitBoard, 
  Laptop,
  Network,
  Server,
  Image as ImageIcon,
  CheckCircle2
} from "lucide-react";
import type { HardwareCategory } from "../../types/speclab";

interface HardwarePlaceholderProps {
  category: HardwareCategory | string;
  className?: string;
  productName?: string;
  compact?: boolean;
}

const getCategoryDetails = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes("cpu")) return { icon: Cpu, label: "Processor illustration", gradient: "from-blue-500/20 to-purple-500/20", iconColor: "text-blue-500" };
  if (cat.includes("gpu")) return { icon: Server, label: "Graphics Card illustration", gradient: "from-green-500/20 to-emerald-500/20", iconColor: "text-green-500" };
  if (cat.includes("ram") || cat.includes("memory")) return { icon: MemoryStick, label: "Memory Module illustration", gradient: "from-pink-500/20 to-rose-500/20", iconColor: "text-pink-500" };
  if (cat.includes("storage") || cat.includes("ssd") || cat.includes("hdd")) return { icon: HardDrive, label: "Storage Drive illustration", gradient: "from-amber-500/20 to-orange-500/20", iconColor: "text-amber-500" };
  if (cat.includes("motherboard") || cat.includes("mobo")) return { icon: CircuitBoard, label: "Motherboard illustration", gradient: "from-red-500/20 to-rose-500/20", iconColor: "text-red-500" };
  if (cat.includes("laptop")) return { icon: Laptop, label: "Laptop illustration", gradient: "from-indigo-500/20 to-cyan-500/20", iconColor: "text-indigo-500" };
  if (cat.includes("psu") || cat.includes("power")) return { icon: Zap, label: "Power Supply illustration", gradient: "from-yellow-500/20 to-amber-500/20", iconColor: "text-yellow-500" };
  if (cat.includes("cooler") || cat.includes("cooling")) return { icon: Thermometer, label: "Cooling System illustration", gradient: "from-cyan-500/20 to-blue-500/20", iconColor: "text-cyan-500" };
  if (cat.includes("display") || cat.includes("monitor")) return { icon: Monitor, label: "Display illustration", gradient: "from-violet-500/20 to-fuchsia-500/20", iconColor: "text-violet-500" };
  if (cat.includes("network")) return { icon: Network, label: "Networking illustration", gradient: "from-teal-500/20 to-emerald-500/20", iconColor: "text-teal-500" };
  
  return { icon: ImageIcon, label: "Hardware illustration", gradient: "from-gray-500/20 to-slate-500/20", iconColor: "text-gray-500" };
};

const HardwarePlaceholder: React.FC<HardwarePlaceholderProps> = ({ category, className = "", productName, compact = false }) => {
  const { icon: Icon, label, gradient, iconColor } = getCategoryDetails(category as string);

  // Check for AMD/Intel branding
  const nameLower = (productName || "").toLowerCase();
  let brandText = null;
  if (nameLower.includes("amd")) brandText = "AMD";
  else if (nameLower.includes("intel")) brandText = "INTEL";
  else if (nameLower.includes("nvidia")) brandText = "NVIDIA";

  return (
    <div 
      className={`relative flex flex-col items-center justify-center w-full h-full rounded-xl overflow-hidden ${compact ? "min-h-[160px]" : "min-h-[300px]"} ${className}`}
      style={{ backgroundColor: "var(--sl-bg-sidebar)", borderColor: "var(--sl-border)", borderWidth: "1px" }}
    >
      {/* Dynamic Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-50`} />
      
      {/* Geometric accent patterns */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
        backgroundSize: "24px 24px"
      }} />

      <div className={`relative z-10 flex flex-col items-center ${compact ? "p-2 space-y-2" : "p-8 space-y-4"} text-center`}>
        <div className={`${compact ? "p-3 rounded-xl" : "p-6 rounded-2xl"} bg-black/40 backdrop-blur-sm border border-white/10 shadow-xl relative`}>
          <Icon 
            className={`${compact ? "w-8 h-8" : "w-20 h-20"} ${iconColor} opacity-90`} 
            strokeWidth={1.5}
          />
          {brandText && compact && (
            <div className="absolute -top-3 -right-3 bg-white text-black text-[9px] font-black px-1.5 py-0.5 rounded shadow-lg uppercase tracking-wider">
              {brandText}
            </div>
          )}
        </div>
        
        {brandText && !compact && (
          <div className="bg-white text-black text-xs font-black px-3 py-1 rounded shadow-lg uppercase tracking-wider mt-2">
            {brandText}
          </div>
        )}

        {!compact && (
          <div className="space-y-1">
            {productName && (
              <h3 className="font-bold text-lg max-w-[250px] truncate text-white">{productName}</h3>
            )}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider bg-white/5 border border-white/10 text-white">
              <ImageIcon size={12} className="opacity-70" />
              <span>Illustrative Image</span>
            </div>
            <p className="text-sm opacity-60 max-w-[250px] mx-auto mt-2 leading-tight text-white">
              Original SpecLab {label.toLowerCase()}.
            </p>
          </div>
        )}
      </div>

      {/* Verified Data Badge fallback concept */}
      {!compact && (
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-xs opacity-50 text-white">
          <span>SpecLab Original Graphic</span>
          <span className="flex items-center gap-1"><CheckCircle2 size={12}/> Verified Specifications</span>
        </div>
      )}
    </div>
  );
};

export default HardwarePlaceholder;
