import { useState, useEffect } from 'react';
import { SpecLabShell } from '../../components/speclab/layout/SpecLabShell';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Usb, 
  Monitor, 
  CreditCard, 
  HardDrive, 
  Cable, 
  Mic, 
  Cpu, 
  Network,
  Zap
} from 'lucide-react';

export type ConnectorInfo = {
  id: string;
  name: string;
  icon: React.ElementType;
  whatItIs: string;
  usedFor: string[];
  versions: { name: string; speed: string; notes: string; speedLevel: 'slow' | 'fast' | 'ultra' }[];
  compatibilityNotes: string;
  misconceptions?: string;
};

const CONNECTORS: ConnectorInfo[] = [
  {
    id: 'usb-a',
    name: 'USB-A',
    icon: Usb,
    whatItIs: 'The classic rectangular USB port found on older laptops, desktop PCs, and power adapters.',
    usedFor: ['Mice and Keyboards', 'Flash Drives', 'External Hard Drives', 'Printers'],
    versions: [
      { name: 'USB 2.0', speed: '480 Mbps', notes: 'Often black inside', speedLevel: 'slow' },
      { name: 'USB 3.0/3.1 Gen 1', speed: '5 Gbps', notes: 'Often blue inside', speedLevel: 'fast' },
      { name: 'USB 3.1 Gen 2', speed: '10 Gbps', notes: 'Often teal/red inside', speedLevel: 'fast' }
    ],
    compatibilityNotes: 'Backwards compatible. A USB 3.0 device works in a USB 2.0 port (at slower speeds).',
    misconceptions: '"USB 3.0" and "SuperSpeed USB" are the same thing.'
  },
  {
    id: 'usb-c',
    name: 'USB-C',
    icon: Cable,
    whatItIs: 'Oval reversible connector that is becoming the universal standard for phones, laptops, and accessories.',
    usedFor: ['Fast Charging', 'High-Speed Data Transfer', 'External Displays', 'Docks and Hubs'],
    versions: [
      { name: 'USB 2.0', speed: '480 Mbps', notes: 'Often used for cheap charging cables', speedLevel: 'slow' },
      { name: 'USB 3.2 Gen 2x2', speed: '20 Gbps', notes: 'High speed data', speedLevel: 'fast' },
      { name: 'Thunderbolt 3/4', speed: '40 Gbps', notes: 'Premium feature', speedLevel: 'ultra' },
      { name: 'USB4', speed: '40 Gbps', notes: 'Similar to TB4 but less strict requirements', speedLevel: 'ultra' }
    ],
    compatibilityNotes: 'Can carry power, data, video. Not all USB-C ports are equal (some are charge-only).',
    misconceptions: 'Just because it is USB-C does not mean it supports video output or Thunderbolt speeds.'
  },
  {
    id: 'thunderbolt-4',
    name: 'Thunderbolt 4',
    icon: Zap,
    whatItIs: 'Intel standard that uses the USB-C connector. Provides a guaranteed baseline of high-end features.',
    usedFor: ['eGPUs (External Graphics)', 'High-End Docks', 'Multiple 4K Monitors', 'Fast Network Adapters'],
    versions: [
      { name: 'Thunderbolt 4', speed: '40 Gbps', notes: 'PCIe tunnel, DisplayPort 2.0, up to 100W power', speedLevel: 'ultra' }
    ],
    compatibilityNotes: 'Requires Thunderbolt 4 certification. Backwards compatible with TB3 and USB4.',
    misconceptions: 'Thunderbolt 4 is not faster than Thunderbolt 3 in maximum bandwidth, but has higher minimum requirements.'
  },
  {
    id: 'hdmi',
    name: 'HDMI',
    icon: Monitor,
    whatItIs: 'Standard video and audio connector used on TVs, monitors, and gaming consoles.',
    usedFor: ['Monitors', 'TVs', 'Projectors', 'Home Theater Receivers'],
    versions: [
      { name: 'HDMI 1.4', speed: '10.2 Gbps', notes: '4K@30Hz', speedLevel: 'slow' },
      { name: 'HDMI 2.0', speed: '18 Gbps', notes: '4K@60Hz', speedLevel: 'fast' },
      { name: 'HDMI 2.1', speed: '48 Gbps', notes: '4K@120Hz / 8K@60Hz', speedLevel: 'ultra' }
    ],
    compatibilityNotes: 'ARC/eARC allows audio return from a TV to a receiver or soundbar over a single cable.',
    misconceptions: 'A "premium" expensive HDMI cable does not make the picture look better; it either has enough bandwidth or it drops signal.'
  },
  {
    id: 'displayport',
    name: 'DisplayPort',
    icon: Monitor,
    whatItIs: 'Video interface primarily used for PC monitors, favored by gamers for high refresh rates.',
    usedFor: ['High Refresh Rate Monitors', 'Multi-Monitor Setups', 'VR Headsets'],
    versions: [
      { name: 'DP 1.2', speed: '21.6 Gbps', notes: '4K@60Hz', speedLevel: 'fast' },
      { name: 'DP 1.4', speed: '32.4 Gbps', notes: '4K@144Hz or 8K@30Hz (with DSC)', speedLevel: 'ultra' },
      { name: 'DP 2.0/2.1', speed: '80 Gbps', notes: '4K@240Hz or 8K@85Hz', speedLevel: 'ultra' }
    ],
    compatibilityNotes: 'Supports daisy-chaining (connecting one monitor to another, instead of both to the PC).',
    misconceptions: 'DisplayPort and HDMI are not directly compatible without an active adapter in some directions.'
  },
  {
    id: 'm2',
    name: 'M.2',
    icon: HardDrive,
    whatItIs: 'Small form factor slot built directly onto the motherboard for SSDs and Wi-Fi cards.',
    usedFor: ['NVMe SSDs', 'SATA SSDs', 'Wi-Fi/Bluetooth Cards'],
    versions: [
      { name: 'PCIe 3.0 NVMe', speed: '~3,500 MB/s', notes: 'Gen 3 speeds', speedLevel: 'fast' },
      { name: 'PCIe 4.0 NVMe', speed: '~7,500 MB/s', notes: 'Gen 4 speeds', speedLevel: 'ultra' },
      { name: 'PCIe 5.0 NVMe', speed: '~14,000 MB/s', notes: 'Gen 5 speeds', speedLevel: 'ultra' }
    ],
    compatibilityNotes: 'Keying: M-key (NVMe/SATA), E-key (Wi-Fi). Lengths: 2242, 2260, 2280, 22110. Not all M.2 slots support NVMe.',
    misconceptions: 'An M.2 drive can be SATA-based (slow) or NVMe-based (fast). The shape does not guarantee speed.'
  },
  {
    id: 'pcie',
    name: 'PCIe (PCI Express)',
    icon: Cpu,
    whatItIs: 'High-speed expansion bus standard for connecting components directly to the motherboard.',
    usedFor: ['Graphics Cards (GPUs)', 'Network Cards (NICs)', 'Sound Cards', 'Capture Cards'],
    versions: [
      { name: 'PCIe 3.0', speed: '1 GB/s per lane', notes: 'Common on older systems', speedLevel: 'fast' },
      { name: 'PCIe 4.0', speed: '2 GB/s per lane', notes: 'Current standard', speedLevel: 'ultra' },
      { name: 'PCIe 5.0', speed: '4 GB/s per lane', notes: 'Cutting edge', speedLevel: 'ultra' }
    ],
    compatibilityNotes: 'Sizes: x1, x4, x8, x16. Physical size Ã¢â€°Â  bandwidth (an x16 slot may only run x4 electrically). Each version doubles bandwidth.',
    misconceptions: 'A GPU in a PCIe 3.0 slot instead of 4.0 only loses a very small percentage of performance in most cases.'
  },
  {
    id: 'sata',
    name: 'SATA III',
    icon: HardDrive,
    whatItIs: 'Storage interface for connecting traditional hard drives (HDDs) and older solid-state drives (SSDs).',
    usedFor: ['Hard Disk Drives', '2.5" SSDs', 'Optical Drives'],
    versions: [
      { name: 'SATA I', speed: '1.5 Gbps', notes: 'Obsolete', speedLevel: 'slow' },
      { name: 'SATA II', speed: '3.0 Gbps', notes: 'Obsolete', speedLevel: 'slow' },
      { name: 'SATA III', speed: '6.0 Gbps', notes: '~600 MB/s theoretical max', speedLevel: 'slow' }
    ],
    compatibilityNotes: 'Backwards compatible with SATA II and I.',
    misconceptions: 'A SATA SSD is physically identical inside to an M.2 SATA SSD, just a different connector.'
  },
  {
    id: 'ethernet',
    name: 'Ethernet / RJ45',
    icon: Network,
    whatItIs: 'The standard port for wired network connections, providing stable and fast internet/intranet access.',
    usedFor: ['Internet Routers', 'Switches', 'NAS (Network Attached Storage)', 'Smart Home Hubs'],
    versions: [
      { name: 'Fast Ethernet', speed: '100 Mbps', notes: 'Older standard', speedLevel: 'slow' },
      { name: 'Gigabit Ethernet', speed: '1 Gbps', notes: 'Current typical home standard', speedLevel: 'fast' },
      { name: 'Multi-Gig', speed: '2.5 / 5 / 10 Gbps', notes: 'High-end motherboards & servers', speedLevel: 'ultra' }
    ],
    compatibilityNotes: 'Speed depends on the weakest link: NIC, router/switch, and cable (Cat5e, Cat6, Cat6a).',
    misconceptions: 'Cat7 and Cat8 cables are rarely necessary for home use; Cat6 can handle 10Gbps at shorter distances.'
  },
  {
    id: 'audio-jack',
    name: '3.5mm Audio Jack',
    icon: Mic,
    whatItIs: 'Analog connector for sending audio to headphones/speakers or receiving audio from microphones.',
    usedFor: ['Headphones', 'Microphones', 'Speakers', 'Aux Inputs'],
    versions: [
      { name: 'TRS', speed: 'Analog Stereo', notes: 'Output only', speedLevel: 'fast' },
      { name: 'TRRS', speed: 'Analog Stereo + Mic', notes: 'Common on headsets/phones', speedLevel: 'fast' }
    ],
    compatibilityNotes: 'On desktop PCs: Pink = mic input, Green = audio output, Blue = line in.',
    misconceptions: 'An adapter splitting a TRRS headset into dual TRS is often needed for desktop PCs.'
  },
  {
    id: 'sd-card',
    name: 'SD Card',
    icon: CreditCard,
    whatItIs: 'Removable flash memory card slot commonly used by photographers and videographers.',
    usedFor: ['Cameras', 'Drones', 'Handheld Consoles', 'Audio Recorders'],
    versions: [
      { name: 'UHS-I', speed: 'Up to 104 MB/s', notes: 'Standard SD cards', speedLevel: 'slow' },
      { name: 'UHS-II', speed: 'Up to 312 MB/s', notes: 'Extra row of pins', speedLevel: 'fast' },
      { name: 'UHS-III', speed: 'Up to 624 MB/s', notes: 'High-end video', speedLevel: 'ultra' }
    ],
    compatibilityNotes: 'MicroSD cards can be used in full-size SD slots with an adapter without performance loss.',
    misconceptions: '"Class 10" just means 10 MB/s minimum write speed, which is very slow by modern standards. Look for V30, V60, or V90 for video.'
  }
];

export function ConnectorExplorer() {
  const { theme: _theme } = useTheme(); // theme drives CSS vars globally
  const [selectedId, setSelectedId] = useState<string>(CONNECTORS[0].id);

  useEffect(() => {
    document.title = 'Port & Connector Explorer Ã¢â‚¬â€ SpecLab | Emil Punnoose Varughese';
  }, []);

  const selectedConnector = CONNECTORS.find(c => c.id === selectedId) || CONNECTORS[0];

  const getSpeedColor = (level: string) => {
    switch (level) {
      case 'slow': return 'bg-[var(--sl-bg-panel)] text-[var(--sl-text-muted)] border-[var(--sl-border)]';
      case 'fast': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'ultra': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      default: return 'bg-[var(--sl-bg-panel)] text-[var(--sl-text-primary)] border-[var(--sl-border)]';
    }
  };

  return (
    <SpecLabShell>
    <div className="px-6 py-8 max-w-6xl mx-auto" style={{ color: 'var(--sl-text-primary)', fontFamily: 'var(--sl-font-body)' }}>
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-[var(--sl-text-primary)]">Port & Connector Explorer</h1>
          <p className="text-[var(--sl-text-muted)]">A comprehensive educational reference for ports and connectors.</p>
        </header>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Sidebar */}
          <div className="w-full md:w-1/3 border border-[var(--sl-border)] rounded-xl overflow-hidden bg-[var(--sl-bg-panel)] flex-shrink-0">
            <div className="p-4 border-b border-[var(--sl-border)] bg-[var(--sl-bg-panel)]/50">
              <h2 className="font-semibold">Connectors</h2>
            </div>
            <div className="overflow-y-auto max-h-[60vh] md:max-h-[80vh] flex flex-col">
              {CONNECTORS.map((connector) => {
                const Icon = connector.icon;
                const isSelected = selectedId === connector.id;
                return (
                  <button
                    key={connector.id}
                    onClick={() => setSelectedId(connector.id)}
                    className={`w-full text-left flex items-center gap-3 p-3 transition-colors border-b border-[var(--sl-border)] last:border-0 ${
                      isSelected 
                        ? 'bg-[var(--sl-text-primary)]/10 text-[var(--sl-text-primary)]' 
                        : 'hover:bg-[var(--sl-bg-panel)] hover:brightness-110'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{connector.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Detail Panel */}
          <div className="w-full md:w-2/3">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedConnector.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="border border-[var(--sl-border)] rounded-xl p-6 bg-[var(--sl-bg-panel)]"
              >
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[var(--sl-border)]">
                  <div className="p-4 bg-[var(--sl-text-primary)]/10 rounded-xl text-[var(--sl-text-primary)]">
                    <selectedConnector.icon className="w-10 h-10" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedConnector.name}</h2>
                  </div>
                </div>

                <div className="space-y-8">
                  <section>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-[var(--sl-text-primary)]" />
                      What it is
                    </h3>
                    <p className="text-[var(--sl-text-muted)] leading-relaxed">
                      {selectedConnector.whatItIs}
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <Target className="w-5 h-5 text-[var(--sl-text-primary)]" />
                      What it's used for
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedConnector.usedFor.map((use, i) => (
                        <li key={i} className="flex items-center gap-2 text-[var(--sl-text-muted)]">
                          <div className="w-1.5 h-1.5 rounded-full bg-[var(--sl-text-primary)]" />
                          {use}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-[var(--sl-text-primary)]" />
                      Versions & Speeds
                    </h3>
                    <div className="overflow-x-auto border border-[var(--sl-border)] rounded-lg">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-[var(--sl-bg-panel)]/50 border-b border-[var(--sl-border)]">
                          <tr>
                            <th className="p-3 font-semibold">Version</th>
                            <th className="p-3 font-semibold">Speed / Bandwidth</th>
                            <th className="p-3 font-semibold">Notes</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--sl-border)]">
                          {selectedConnector.versions.map((v, i) => (
                            <tr key={i} className="hover:bg-[var(--sl-bg-panel)]/50 transition-colors">
                              <td className="p-3 font-medium">{v.name}</td>
                              <td className="p-3">
                                <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getSpeedColor(v.speedLevel)}`}>
                                  {v.speed}
                                </span>
                              </td>
                              <td className="p-3 text-[var(--sl-text-muted)]">{v.notes}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <section className="bg-[var(--sl-bg-panel)]/30 border border-[var(--sl-border)] p-4 rounded-lg">
                      <h3 className="text-sm font-semibold mb-2 text-blue-500 uppercase tracking-wider">Compatibility</h3>
                      <p className="text-sm text-[var(--sl-text-muted)]">{selectedConnector.compatibilityNotes}</p>
                    </section>

                    {selectedConnector.misconceptions && (
                      <section className="bg-[var(--sl-bg-panel)]/30 border border-[var(--sl-border)] p-4 rounded-lg">
                        <h3 className="text-sm font-semibold mb-2 text-orange-500 uppercase tracking-wider">Common Misconception</h3>
                        <p className="text-sm text-[var(--sl-text-muted)]">{selectedConnector.misconceptions}</p>
                      </section>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
</SpecLabShell>
  );
}

// Simple icons for sections
const Target = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
);
const Activity = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);

export default ConnectorExplorer;





