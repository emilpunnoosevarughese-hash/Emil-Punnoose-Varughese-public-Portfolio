import { SpecLabShell } from '../../components/speclab/layout/SpecLabShell';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Snail, 
  Flame, 
  MonitorOff, 
  WifiOff, 
  PowerOff, 
  HardDrive, 
  Usb, 
  VolumeX,
  ArrowRight,
  RefreshCcw,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Wrench
} from 'lucide-react';

type Step = {
  id: string;
  question: string;
  options: { label: string; nextId: string }[];
};

type Result = {
  id: string;
  severity: 'low' | 'medium' | 'high';
  recommendations: string[];
};

type ProblemFlow = {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  startStepId: string;
  steps: Record<string, Step>;
  results: Record<string, Result>;
};

const FLOWS: ProblemFlow[] = [
  {
    id: 'slow',
    title: 'My PC is slow',
    icon: Snail,
    color: 'text-amber-500',
    startStepId: 'q1',
    steps: {
      q1: {
        id: 'q1',
        question: 'Is it slow right after startup, or is it always slow?',
        options: [
          { label: 'After startup', nextId: 'res-startup' },
          { label: 'Always slow', nextId: 'q2' }
        ]
      },
      q2: {
        id: 'q2',
        question: 'Has it gotten slower over time, or was it a sudden change?',
        options: [
          { label: 'Slower over time', nextId: 'res-time' },
          { label: 'Sudden change', nextId: 'res-sudden' }
        ]
      }
    },
    results: {
      'res-startup': {
        id: 'res-startup',
        severity: 'low',
        recommendations: [
          'Disable unnecessary startup programs in Task Manager (Ctrl+Shift+Esc > Startup tab).',
          'Wait a few minutes after booting for background services to load.',
          'Consider upgrading to an SSD if you are still using a traditional Hard Drive (HDD).'
        ]
      },
      'res-time': {
        id: 'res-time',
        severity: 'medium',
        recommendations: [
          'Check your storage space. If your C: drive is almost full, delete old files.',
          'Run the built-in "Disk Cleanup" tool.',
          'Check for thermal throttling. Use hardware monitoring software to check CPU temperatures.',
          'Run a malware scan using Windows Defender or Malwarebytes.'
        ]
      },
      'res-sudden': {
        id: 'res-sudden',
        severity: 'medium',
        recommendations: [
          'Check if a recent Windows update or new software caused the issue.',
          'Open Task Manager and see if any app is using 100% CPU, Memory, or Disk.',
          'Restart your computer (use "Restart", not "Shut down").'
        ]
      }
    }
  },
  {
    id: 'overheat',
    title: 'Laptop is overheating',
    icon: Flame,
    color: 'text-red-500',
    startStepId: 'q1',
    steps: {
      q1: {
        id: 'q1',
        question: 'Is this new behavior, or has it always run hot?',
        options: [
          { label: 'New behavior', nextId: 'res-new' },
          { label: 'Always hot', nextId: 'res-always' }
        ]
      }
    },
    results: {
      'res-new': {
        id: 'res-new',
        severity: 'medium',
        recommendations: [
          'Clean the vents. Use compressed air (while the laptop is off) to clear dust.',
          'Check Task Manager for rogue background programs using high CPU.',
          'If it is an older laptop, the thermal paste may have dried out and needs reapplication (seek professional help if unsure).'
        ]
      },
      'res-always': {
        id: 'res-always',
        severity: 'low',
        recommendations: [
          'Always use the laptop on a hard, flat surface (not a bed or pillow).',
          'Consider buying a laptop cooling pad.',
          'Check the manufacturer thermal limits; gaming laptops naturally run very hot (80-90Ã‚Â°C under load).'
        ]
      }
    }
  },
  {
    id: 'display',
    title: 'No display / black screen',
    icon: MonitorOff,
    color: 'text-gray-400',
    startStepId: 'q1',
    steps: {
      q1: {
        id: 'q1',
        question: 'Are any LED lights or fans running on the PC/Laptop?',
        options: [
          { label: 'Yes, lights/fans are on', nextId: 'q2' },
          { label: 'No, completely dead', nextId: 'res-power' }
        ]
      },
      q2: {
        id: 'q2',
        question: 'Does the monitor work when plugged into another device?',
        options: [
          { label: 'Yes', nextId: 'res-pc' },
          { label: 'No', nextId: 'res-monitor' }
        ]
      }
    },
    results: {
      'res-power': {
        id: 'res-power',
        severity: 'high',
        recommendations: [
          'Check the power cable connection to the wall outlet and the back of the PC.',
          'Ensure the switch on the back of the power supply is flipped to "I".',
          'Try a different wall outlet.'
        ]
      },
      'res-pc': {
        id: 'res-pc',
        severity: 'high',
        recommendations: [
          'Try a different display cable or port.',
          'If you have a graphics card, ensure the monitor is plugged into the GPU, NOT the motherboard.',
          'Reseat the RAM and/or Graphics Card (if comfortable doing so).'
        ]
      },
      'res-monitor': {
        id: 'res-monitor',
        severity: 'medium',
        recommendations: [
          'Check the power cable for the monitor.',
          'Make sure the monitor is turned on and set to the correct input source.',
          'The monitor itself may be faulty.'
        ]
      }
    }
  },
  {
    id: 'wifi',
    title: 'Wi-Fi is slow or dropping',
    icon: WifiOff,
    color: 'text-blue-400',
    startStepId: 'q1',
    steps: {
      q1: {
        id: 'q1',
        question: 'Is it happening to all devices or just one?',
        options: [
          { label: 'All devices', nextId: 'res-router' },
          { label: 'Just this one', nextId: 'res-device' }
        ]
      }
    },
    results: {
      'res-router': {
        id: 'res-router',
        severity: 'medium',
        recommendations: [
          'Restart your modem and router (unplug for 30 seconds, plug back in).',
          'Check for outages with your Internet Service Provider.',
          'Move the router to a more central, elevated location away from thick walls.'
        ]
      },
      'res-device': {
        id: 'res-device',
        severity: 'low',
        recommendations: [
          'Forget the network and reconnect.',
          'Update your Wi-Fi drivers from the manufacturer website.',
          'Disable any VPN software temporarily to see if it fixes the issue.',
          'If you are far from the router, try moving closer or using an Ethernet cable.'
        ]
      }
    }
  },
  {
    id: 'boot',
    title: 'PC won\'t boot',
    icon: PowerOff,
    color: 'text-red-600',
    startStepId: 'q1',
    steps: {
      q1: {
        id: 'q1',
        question: 'Do you see any text or a logo on the screen before it fails?',
        options: [
          { label: 'Yes, a logo or text', nextId: 'q2' },
          { label: 'No, completely black', nextId: 'res-hardware' }
        ]
      },
      q2: {
        id: 'q2',
        question: 'Does it say "No bootable device found"?',
        options: [
          { label: 'Yes', nextId: 'res-drive' },
          { label: 'No, spinning circle / blue screen', nextId: 'res-os' }
        ]
      }
    },
    results: {
      'res-hardware': {
        id: 'res-hardware',
        severity: 'high',
        recommendations: [
          'Check all power cables and monitor connections.',
          'Look for diagnostic LEDs on the motherboard (if applicable).',
          'Try clearing the CMOS (resetting BIOS settings).'
        ]
      },
      'res-drive': {
        id: 'res-drive',
        severity: 'high',
        recommendations: [
          'Enter BIOS and check if your storage drive is detected.',
          'Check the physical connections (SATA/power cables) to the drive.',
          'The storage drive may have failed and requires replacement.'
        ]
      },
      'res-os': {
        id: 'res-os',
        severity: 'medium',
        recommendations: [
          'Use Windows Startup Repair from an installation USB.',
          'Try booting into Safe Mode.',
          'Uninstall recent updates from the recovery environment.'
        ]
      }
    }
  },
  {
    id: 'storage',
    title: 'Storage is full',
    icon: HardDrive,
    color: 'text-slate-500',
    startStepId: 'q1',
    steps: {
      q1: {
        id: 'q1',
        question: 'Do you use mostly apps/games or photos/videos?',
        options: [
          { label: 'Apps & Games', nextId: 'res-apps' },
          { label: 'Photos & Videos', nextId: 'res-media' }
        ]
      }
    },
    results: {
      'res-apps': {
        id: 'res-apps',
        severity: 'low',
        recommendations: [
          'Uninstall unused programs from Settings > Apps.',
          'Use software like WizTree or TreeSize to find large folders.',
          'Clear cache for platforms like Steam, Epic Games, etc.',
          'Empty the Recycle Bin.'
        ]
      },
      'res-media': {
        id: 'res-media',
        severity: 'low',
        recommendations: [
          'Move large media files to an external hard drive.',
          'Use cloud storage (Google Drive, OneDrive) and enable "Files On-Demand".',
          'Delete duplicate photos or large raw video files.'
        ]
      }
    }
  },
  {
    id: 'usb',
    title: 'USB device not detected',
    icon: Usb,
    color: 'text-indigo-400',
    startStepId: 'q1',
    steps: {
      q1: {
        id: 'q1',
        question: 'Have you tried a different USB port?',
        options: [
          { label: 'Yes, still broken', nextId: 'q2' },
          { label: 'No', nextId: 'res-port' }
        ]
      },
      q2: {
        id: 'q2',
        question: 'Does the device work on another computer?',
        options: [
          { label: 'Yes', nextId: 'res-drivers' },
          { label: 'No', nextId: 'res-dead' }
        ]
      }
    },
    results: {
      'res-port': {
        id: 'res-port',
        severity: 'low',
        recommendations: [
          'Try plugging it into the back of the PC (directly into the motherboard).',
          'Front panel USB ports often fail or come loose internally.'
        ]
      },
      'res-drivers': {
        id: 'res-drivers',
        severity: 'low',
        recommendations: [
          'Open Device Manager, find the device, right-click and select "Update driver".',
          'Download official drivers from the manufacturer website.',
          'Restart your PC.'
        ]
      },
      'res-dead': {
        id: 'res-dead',
        severity: 'medium',
        recommendations: [
          'The USB device itself may be faulty or broken.',
          'Check the cable/connector for physical damage.'
        ]
      }
    }
  },
  {
    id: 'audio',
    title: 'No sound / audio issues',
    icon: VolumeX,
    color: 'text-pink-500',
    startStepId: 'q1',
    steps: {
      q1: {
        id: 'q1',
        question: 'Is the correct output device selected in Windows?',
        options: [
          { label: 'Yes', nextId: 'q2' },
          { label: 'Not sure / No', nextId: 'res-output' }
        ]
      },
      q2: {
        id: 'q2',
        question: 'Are you using Bluetooth or a wired connection?',
        options: [
          { label: 'Bluetooth', nextId: 'res-bt' },
          { label: 'Wired (3.5mm/USB)', nextId: 'res-wired' }
        ]
      }
    },
    results: {
      'res-output': {
        id: 'res-output',
        severity: 'low',
        recommendations: [
          'Click the speaker icon in the taskbar and verify the correct output device is selected.',
          'Check if the volume is muted or turned down low.'
        ]
      },
      'res-bt': {
        id: 'res-bt',
        severity: 'low',
        recommendations: [
          'Ensure Bluetooth is turned on and the device is connected.',
          'Check the battery level of your Bluetooth headphones/speakers.',
          'Unpair and re-pair the device.'
        ]
      },
      'res-wired': {
        id: 'res-wired',
        severity: 'low',
        recommendations: [
          'Ensure the 3.5mm jack is plugged into the correct port (usually green for output).',
          'Try a different pair of headphones to isolate the issue.',
          'Update your audio drivers via Device Manager.'
        ]
      }
    }
  }
];

export function TechDetective() {
  const { theme: _theme } = useTheme(); // theme drives CSS vars globally
  
  const [activeFlow, setActiveFlow] = useState<ProblemFlow | null>(null);
  const [currentStepId, setCurrentStepId] = useState<string | null>(null);
  const [resultId, setResultId] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Tech Detective Ã¢â‚¬â€ SpecLab | Emil Punnoose Varughese';
  }, []);

  const handleSelectFlow = (flow: ProblemFlow) => {
    setActiveFlow(flow);
    setCurrentStepId(flow.startStepId);
    setResultId(null);
  };

  const handleOptionSelect = (nextId: string) => {
    if (!activeFlow) return;
    
    if (activeFlow.results[nextId]) {
      setResultId(nextId);
      setCurrentStepId(null);
    } else if (activeFlow.steps[nextId]) {
      setCurrentStepId(nextId);
    }
  };

  const handleStartOver = () => {
    setActiveFlow(null);
    setCurrentStepId(null);
    setResultId(null);
  };

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case 'high': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'medium': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'low': return 'bg-green-500/10 text-green-500 border-green-500/20';
      default: return '';
    }
  };

  return (
    <SpecLabShell>
    <div className="px-6 py-8 max-w-4xl mx-auto" style={{ color: 'var(--sl-text-primary)', fontFamily: 'var(--sl-font-body)' }}>
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-[var(--sl-text-primary)]/10 text-[var(--sl-text-primary)] rounded-2xl mb-4">
            <Wrench className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Tech Detective</h1>
          <p className="text-[var(--sl-text-muted)] max-w-xl mx-auto">
            A troubleshooting wizard to help you diagnose and fix common computer problems safely.
          </p>
        </header>

        <AnimatePresence mode="wait">
          {!activeFlow ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
            >
              <div className="col-span-full mb-2">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-[var(--sl-text-primary)]" />
                  What are you experiencing?
                </h2>
              </div>
              
              {FLOWS.map((flow) => {
                const Icon = flow.icon;
                return (
                  <button
                    key={flow.id}
                    onClick={() => handleSelectFlow(flow)}
                    className="flex flex-col items-center justify-center gap-4 p-6 border border-[var(--sl-border)] rounded-xl bg-[var(--sl-bg-panel)] hover:bg-[var(--sl-bg-panel)]/80 hover:border-[var(--sl-text-primary)]/50 transition-all group"
                  >
                    <div className={`p-4 rounded-full bg-[var(--sl-bg-panel)] border border-[var(--sl-border)] group-hover:scale-110 transition-transform ${flow.color}`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <span className="font-medium text-center">{flow.title}</span>
                  </button>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="flow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-[var(--sl-bg-panel)] border border-[var(--sl-border)] ${activeFlow.color}`}>
                    <activeFlow.icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-semibold">{activeFlow.title}</h2>
                </div>
                <button 
                  onClick={handleStartOver}
                  className="text-sm flex items-center gap-1 text-[var(--sl-text-muted)] hover:text-[var(--sl-text-primary)] transition-colors"
                >
                  <RefreshCcw className="w-4 h-4" /> Start Over
                </button>
              </div>

              {currentStepId && activeFlow.steps[currentStepId] && (
                <div className="border border-[var(--sl-border)] bg-[var(--sl-bg-panel)] p-6 md:p-8 rounded-2xl shadow-sm">
                  <h3 className="text-2xl font-medium mb-8 text-center leading-relaxed">
                    {activeFlow.steps[currentStepId].question}
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {activeFlow.steps[currentStepId].options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleOptionSelect(opt.nextId)}
                        className="flex-1 py-4 px-6 bg-[var(--sl-text-primary)] text-white rounded-xl font-medium hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                        {opt.label} <ArrowRight className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {resultId && activeFlow.results[resultId] && (
                <div className="border border-[var(--sl-border)] bg-[var(--sl-bg-panel)] p-6 md:p-8 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--sl-border)]">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                      Recommendations
                    </h3>
                    <span className={`text-xs uppercase tracking-wider font-bold px-3 py-1 rounded-full border ${getSeverityColor(activeFlow.results[resultId].severity)}`}>
                      {activeFlow.results[resultId].severity} Severity
                    </span>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-[var(--sl-text-muted)] mb-4">Try these safe steps in order:</p>
                    <ol className="space-y-4">
                      {activeFlow.results[resultId].recommendations.map((rec, i) => (
                        <li key={i} className="flex gap-4">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--sl-text-primary)]/10 text-[var(--sl-text-primary)] flex items-center justify-center text-sm font-medium">
                            {i + 1}
                          </div>
                          <p className="text-[var(--sl-text-primary)] leading-relaxed pt-0.5">{rec}</p>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="bg-amber-500/10 border border-amber-500/20 text-amber-700  p-4 rounded-xl flex items-start gap-3 mb-8">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">
                      Still having issues? Check manufacturer support. Never open a power supply or touch internal high-voltage components.
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <button 
                      onClick={handleStartOver}
                      className="px-6 py-3 border border-[var(--sl-border)] hover:bg-[var(--sl-bg-panel)]/80 rounded-xl font-medium transition-colors flex items-center gap-2"
                    >
                      <RefreshCcw className="w-4 h-4" /> Try another problem
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
</SpecLabShell>
  );
}

export default TechDetective;






