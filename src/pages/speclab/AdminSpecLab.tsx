import { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { auth } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  Database, 
  Settings, 
  Cpu, 
  Factory, 
  Link as LinkIcon,
  Plus,
  Edit2,
  Trash2,
  ShieldAlert,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  BookOpen,
  AlertTriangle,
  Image as ImageIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdminSpecLab() {
  const { theme: _theme } = useTheme(); // theme drives CSS vars globally
  
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'hardware' | 'manufacturers' | 'rules' | 'settings'>('hardware');

  useEffect(() => {
    document.title = 'SpecLab Admin â€” Emil Punnoose Varughese';
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-[var(--sl-text-muted)]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--sl-text-primary)]" />
        <p>Verifying access...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-[var(--sl-bg-panel)] border border-[var(--sl-border)] rounded-2xl p-8 text-center shadow-lg">
          <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--sl-text-primary)] mb-2">Admin Access Required</h1>
          <p className="text-[var(--sl-text-muted)] mb-8">
            You must be logged in with administrative privileges to access the SpecLab management interface.
          </p>
          <a href="/" className="inline-flex items-center justify-center px-6 py-3 bg-[var(--sl-text-primary)] text-white rounded-xl font-medium hover:brightness-110 transition-all">
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--sl-bg-panel)] text-[var(--sl-text-primary)] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[var(--sl-text-primary)] flex items-center gap-3">
              <Database className="w-8 h-8" />
              SpecLab Admin
            </h1>
            <p className="text-[var(--sl-text-muted)] mt-1">Manage hardware database, rules, and manufacturers.</p>
          </div>
          <div className="flex items-center gap-3 bg-[var(--sl-bg-panel)] border border-[var(--sl-border)] px-4 py-2 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm font-medium">Database Online</span>
          </div>
        </header>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Nav */}
          <div className="w-full md:w-64 flex-shrink-0 space-y-6">
            <div className="space-y-2">
              <h3 className="px-4 text-xs font-semibold text-[var(--sl-text-muted)] uppercase tracking-wider">Database</h3>
              <button
                onClick={() => setActiveTab('hardware')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                  activeTab === 'hardware' 
                    ? 'bg-[var(--sl-text-primary)]/10 text-[var(--sl-text-primary)] border border-[var(--sl-text-primary)]/20' 
                    : 'hover:bg-[var(--sl-bg-panel)] border border-transparent text-[var(--sl-text-muted)] hover:text-[var(--sl-text-primary)]'
                }`}
              >
                <Cpu className="w-5 h-5" /> Hardware
              </button>
              <button
                onClick={() => setActiveTab('manufacturers')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                  activeTab === 'manufacturers' 
                    ? 'bg-[var(--sl-text-primary)]/10 text-[var(--sl-text-primary)] border border-[var(--sl-text-primary)]/20' 
                    : 'hover:bg-[var(--sl-bg-panel)] border border-transparent text-[var(--sl-text-muted)] hover:text-[var(--sl-text-primary)]'
                }`}
              >
                <Factory className="w-5 h-5" /> Manufacturers
              </button>
              <button
                onClick={() => setActiveTab('rules')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                  activeTab === 'rules' 
                    ? 'bg-[var(--sl-text-primary)]/10 text-[var(--sl-text-primary)] border border-[var(--sl-text-primary)]/20' 
                    : 'hover:bg-[var(--sl-bg-panel)] border border-transparent text-[var(--sl-text-muted)] hover:text-[var(--sl-text-primary)]'
                }`}
              >
                <LinkIcon className="w-5 h-5" /> Compatibility Rules
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                  activeTab === 'settings' 
                    ? 'bg-[var(--sl-text-primary)]/10 text-[var(--sl-text-primary)] border border-[var(--sl-text-primary)]/20' 
                    : 'hover:bg-[var(--sl-bg-panel)] border border-transparent text-[var(--sl-text-muted)] hover:text-[var(--sl-text-primary)]'
                }`}
              >
                <Settings className="w-5 h-5" /> Settings
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="px-4 text-xs font-semibold text-[var(--sl-text-muted)] uppercase tracking-wider">Provenance</h3>
              <Link
                to="/admin/speclab/verification"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors hover:bg-[var(--sl-bg-panel)] border border-transparent text-[var(--sl-text-muted)] hover:text-[var(--sl-text-primary)]"
              >
                <ShieldCheck className="w-5 h-5" /> Verification Center
              </Link>
              <Link
                to="/admin/speclab/images"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors hover:bg-[var(--sl-bg-panel)] border border-transparent text-[var(--sl-text-muted)] hover:text-[var(--sl-text-primary)]"
              >
                <ImageIcon className="w-5 h-5" /> Image Manager
              </Link>
              <Link
                to="/admin/speclab/sources"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors hover:bg-[var(--sl-bg-panel)] border border-transparent text-[var(--sl-text-muted)] hover:text-[var(--sl-text-primary)]"
              >
                <BookOpen className="w-5 h-5" /> Source Registry
              </Link>
              <Link
                to="/admin/speclab/reports"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors hover:bg-[var(--sl-bg-panel)] border border-transparent text-[var(--sl-text-muted)] hover:text-[var(--sl-text-primary)]"
              >
                <AlertTriangle className="w-5 h-5" /> Correction Reports
              </Link>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 bg-[var(--sl-bg-panel)] border border-[var(--sl-border)] rounded-2xl p-6 min-h-[60vh]">
            {activeTab === 'hardware' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Hardware Components</h2>
                  <button className="flex items-center gap-2 px-4 py-2 bg-[var(--sl-text-primary)] text-white rounded-lg text-sm font-medium hover:brightness-110 transition-colors">
                    <Plus className="w-4 h-4" /> Add Component
                  </button>
                </div>
                
                <div className="overflow-x-auto border border-[var(--sl-border)] rounded-xl">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[var(--sl-bg-panel)]/50 border-b border-[var(--sl-border)]">
                      <tr>
                        <th className="p-4 font-semibold">Name</th>
                        <th className="p-4 font-semibold">Category</th>
                        <th className="p-4 font-semibold">Manufacturer</th>
                        <th className="p-4 font-semibold">Verified</th>
                        <th className="p-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--sl-border)] text-[var(--sl-text-muted)]">
                      {/* Placeholder data */}
                      <tr>
                        <td className="p-4 font-medium text-[var(--sl-text-primary)]">Ryzen 7 7800X3D</td>
                        <td className="p-4">CPU</td>
                        <td className="p-4">AMD</td>
                        <td className="p-4"><CheckCircle2 className="w-5 h-5 text-green-500" /></td>
                        <td className="p-4 flex gap-2">
                          <button className="p-1.5 bg-[var(--sl-bg-panel)] border border-[var(--sl-border)] rounded-md hover:text-[var(--sl-text-primary)] transition-colors"><Edit2 className="w-4 h-4" /></button>
                          <button className="p-1.5 bg-[var(--sl-bg-panel)] border border-[var(--sl-border)] rounded-md hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-4 font-medium text-[var(--sl-text-primary)]">GeForce RTX 4090</td>
                        <td className="p-4">GPU</td>
                        <td className="p-4">NVIDIA</td>
                        <td className="p-4"><CheckCircle2 className="w-5 h-5 text-green-500" /></td>
                        <td className="p-4 flex gap-2">
                          <button className="p-1.5 bg-[var(--sl-bg-panel)] border border-[var(--sl-border)] rounded-md hover:text-[var(--sl-text-primary)] transition-colors"><Edit2 className="w-4 h-4" /></button>
                          <button className="p-1.5 bg-[var(--sl-bg-panel)] border border-[var(--sl-border)] rounded-md hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'manufacturers' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Manufacturers</h2>
                  <button className="flex items-center gap-2 px-4 py-2 bg-[var(--sl-text-primary)] text-white rounded-lg text-sm font-medium hover:brightness-110 transition-colors">
                    <Plus className="w-4 h-4" /> Add Manufacturer
                  </button>
                </div>
                
                <div className="overflow-x-auto border border-[var(--sl-border)] rounded-xl">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[var(--sl-bg-panel)]/50 border-b border-[var(--sl-border)]">
                      <tr>
                        <th className="p-4 font-semibold">Name</th>
                        <th className="p-4 font-semibold">Slug</th>
                        <th className="p-4 font-semibold">URL</th>
                        <th className="p-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--sl-border)] text-[var(--sl-text-muted)]">
                      <tr>
                        <td className="p-4 font-medium text-[var(--sl-text-primary)]">AMD</td>
                        <td className="p-4">amd</td>
                        <td className="p-4">amd.com</td>
                        <td className="p-4 flex gap-2">
                          <button className="p-1.5 bg-[var(--sl-bg-panel)] border border-[var(--sl-border)] rounded-md hover:text-[var(--sl-text-primary)] transition-colors"><Edit2 className="w-4 h-4" /></button>
                          <button className="p-1.5 bg-[var(--sl-bg-panel)] border border-[var(--sl-border)] rounded-md hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'rules' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Compatibility Rules</h2>
                  <button className="flex items-center gap-2 px-4 py-2 bg-[var(--sl-text-primary)] text-white rounded-lg text-sm font-medium hover:brightness-110 transition-colors">
                    <Plus className="w-4 h-4" /> Add Rule
                  </button>
                </div>
                <div className="p-8 text-center text-[var(--sl-text-muted)] border border-dashed border-[var(--sl-border)] rounded-xl">
                  No custom rules defined yet.
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h2 className="text-xl font-bold mb-6">Database Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 border border-[var(--sl-border)] rounded-xl bg-[var(--sl-bg-panel)]/50">
                    <h3 className="text-sm font-semibold text-[var(--sl-text-muted)] mb-1 uppercase tracking-wider">Database Status</h3>
                    <div className="flex items-center gap-2 text-green-500 font-medium">
                      <CheckCircle2 className="w-5 h-5" /> Online & Connected
                    </div>
                  </div>
                  <div className="p-6 border border-[var(--sl-border)] rounded-xl bg-[var(--sl-bg-panel)]/50">
                    <h3 className="text-sm font-semibold text-[var(--sl-text-muted)] mb-1 uppercase tracking-wider">Total Components</h3>
                    <div className="text-2xl font-bold text-[var(--sl-text-primary)]">
                      142
                    </div>
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

export default AdminSpecLab;

