import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCog, Camera, Save, X, Shield, User, Crown, Pencil, Check } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const MEMBERS = [
  { id: 1, name: 'Emil Punnoose', role: 'Admin', status: 'online', avatar: '/logo.png' },
  { id: 2, name: 'Alex Dev', role: 'Member', status: 'online', avatar: '' },
  { id: 3, name: 'Sara UI', role: 'Member', status: 'idle', avatar: '' },
  { id: 4, name: 'John QA', role: 'Member', status: 'offline', avatar: '' },
];

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function getStatusColor(status: string) {
  if (status === 'online') return 'bg-green-500';
  if (status === 'idle') return 'bg-yellow-400';
  return 'bg-gray-400';
}

function getAvatarGradient(id: number) {
  const gradients = [
    'from-violet-500 to-purple-600',
    'from-blue-500 to-cyan-500',
    'from-rose-500 to-pink-500',
    'from-emerald-500 to-teal-500',
  ];
  return gradients[id % gradients.length];
}

function RoleBadge({ role }: { role: string }) {
  if (role === 'Admin') return (
    <span className="flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/20">
      <Crown className="w-2.5 h-2.5" />Admin
    </span>
  );
  return (
    <span className="flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
      <User className="w-2.5 h-2.5" />Member
    </span>
  );
}

export function GroupProfilePanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [groupName, setGroupName] = useState('EdgeFX Team');
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(groupName);
  const [saved, setSaved] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark' || theme === 'midnight';
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setEditingName(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSaveName = () => {
    setGroupName(tempName);
    setEditingName(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-lg transition-colors ${isDark ? 'text-[var(--color-text-primary)] hover:bg-white/5' : 'text-[var(--color-text-primary)] hover:bg-black/5'}`}
        title="Group Profile"
      >
        <UserCog className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`absolute right-0 top-full mt-2 w-72 rounded-2xl shadow-2xl z-50 overflow-hidden border glass-effect ${
              isDark ? 'border-white/10' : 'border-white/50'
            }`}
          >
            {/* Group banner / avatar */}
            <div className="relative h-20 bg-gradient-to-br from-primary/80 via-accent/60 to-violet-600/80">
              <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23fff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M20 20L40 0H0z\'/%3E%3C/g%3E%3C/svg%3E")'}}/>
              <button className="absolute top-2 right-2 p-1.5 bg-black/30 hover:bg-black/50 rounded-lg transition-colors text-white">
                <Camera className="w-3.5 h-3.5" />
              </button>
              <div className="absolute -bottom-6 left-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-black text-lg ring-4 ring-[var(--color-background)] shadow-xl relative">
                  <Shield className="w-7 h-7" />
                  <button className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--color-background)] rounded-full flex items-center justify-center shadow-md border border-[var(--color-border)]">
                    <Camera className="w-2.5 h-2.5 text-[var(--color-text-muted)]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Group Name */}
            <div className="pt-8 px-4 pb-3 border-b border-[var(--color-border)]">
              {editingName ? (
                <div className="flex items-center gap-2">
                  <input
                    value={tempName}
                    onChange={e => setTempName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSaveName()}
                    autoFocus
                    className="flex-1 bg-transparent text-base font-bold text-[var(--color-text-primary)] border-b border-primary outline-none pb-0.5"
                  />
                  <button onClick={handleSaveName} className="p-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20">
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setEditingName(false)} className="p-1 rounded-md hover:bg-[var(--color-surface)] text-[var(--color-text-muted)]">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 group">
                  <div className="font-bold text-base text-[var(--color-text-primary)]">{groupName}</div>
                  <button
                    onClick={() => { setEditingName(true); setTempName(groupName); }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-[var(--color-surface)] text-[var(--color-text-muted)] transition-all"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                  {saved && <span className="text-[10px] text-green-500 font-semibold">Saved ✓</span>}
                </div>
              )}
              <div className="text-xs text-[var(--color-text-muted)] mt-0.5">{MEMBERS.length} members</div>
            </div>

            {/* Members List */}
            <div className="px-4 py-3 space-y-2.5 max-h-52 overflow-y-auto">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-1">Members</div>
              {MEMBERS.map(member => (
                <div key={member.id} className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    {member.avatar ? (
                      <img src={member.avatar} className="w-8 h-8 rounded-xl object-cover" alt={member.name} />
                    ) : (
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${getAvatarGradient(member.id)} flex items-center justify-center text-[10px] text-white font-bold`}>
                        {getInitials(member.name)}
                      </div>
                    )}
                    <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 ${getStatusColor(member.status)} rounded-full border-2 border-[var(--color-background)]`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-[var(--color-text-primary)] truncate">{member.name}</div>
                    <div className="capitalize text-[10px] text-[var(--color-text-muted)]">{member.status}</div>
                  </div>
                  <RoleBadge role={member.role} />
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className={`px-4 py-2.5 border-t ${isDark ? 'border-white/5' : 'border-black/5'}`}>
              <button className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity shadow-md">
                <Save className="w-3.5 h-3.5" />
                Save Changes
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
