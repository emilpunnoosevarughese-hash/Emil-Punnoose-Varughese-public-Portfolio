import { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Link } from 'react-router-dom';
import { 
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  X
} from 'lucide-react';

export function AdminSourceRegistry() {
  const { theme: _theme } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [sources, setSources] = useState<any[]>([]);

  useEffect(() => {
    // Mock fetch
    setSources([
      { id: 1, name: 'AMD Official Docs', type: 'Manufacturer', publisher: 'AMD', url: 'https://amd.com', license: 'Proprietary' },
      { id: 2, name: 'NVIDIA Press Kit', type: 'Press Kit', publisher: 'NVIDIA', url: 'https://nvidia.com', license: 'Restricted' },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--sl-bg-panel)] text-[var(--sl-text-primary)] p-4 md:p-8 relative">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <Link to="/admin/speclab" className="text-sm text-[var(--sl-text-primary)] hover:underline mb-2 inline-block">&larr; Back to Admin</Link>
            <h1 className="text-3xl font-bold text-[var(--sl-text-primary)] flex items-center gap-3">
              <BookOpen className="w-8 h-8" />
              Source Registry
            </h1>
            <p className="text-[var(--sl-text-muted)] mt-1">Manage approved data sources and publishers.</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--sl-text-primary)] text-white rounded-lg text-sm font-medium hover:brightness-110 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Source
          </button>
        </header>

        <div className="border border-[var(--sl-border)] rounded-2xl bg-[var(--sl-bg-panel)] min-h-[60vh] p-6">
          <div className="overflow-x-auto border border-[var(--sl-border)] rounded-xl">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--sl-bg-panel)]/50 border-b border-[var(--sl-border)]">
                <tr>
                  <th className="p-4 font-semibold">Source Name</th>
                  <th className="p-4 font-semibold">Type</th>
                  <th className="p-4 font-semibold">Publisher</th>
                  <th className="p-4 font-semibold">License</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--sl-border)] text-[var(--sl-text-muted)]">
                {sources.map(source => (
                  <tr key={source.id}>
                    <td className="p-4 font-medium text-[var(--sl-text-primary)]">{source.name}</td>
                    <td className="p-4">{source.type}</td>
                    <td className="p-4">{source.publisher}</td>
                    <td className="p-4">{source.license}</td>
                    <td className="p-4 flex gap-2 justify-end">
                      <a href={source.url} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-[var(--sl-bg-panel)] border border-[var(--sl-border)] rounded-md hover:text-blue-500 transition-colors"><ExternalLink className="w-4 h-4" /></a>
                      <button className="p-1.5 bg-[var(--sl-bg-panel)] border border-[var(--sl-border)] rounded-md hover:text-[var(--sl-text-primary)] transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button className="p-1.5 bg-[var(--sl-bg-panel)] border border-[var(--sl-border)] rounded-md hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-[var(--sl-bg-panel)] border border-[var(--sl-border)] rounded-2xl p-6 w-full max-w-md shadow-xl relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-[var(--sl-text-muted)] hover:text-[var(--sl-text-primary)]">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-4">Add New Source</h2>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowModal(false); }}>
              <div>
                <label className="block text-sm font-medium mb-1 text-[var(--sl-text-muted)]">Source Name</label>
                <input type="text" className="w-full bg-[var(--sl-bg-panel)] border border-[var(--sl-border)] rounded-lg px-3 py-2 text-[var(--sl-text-primary)] focus:outline-none focus:border-[var(--sl-text-primary)]" placeholder="e.g. AMD Documentation" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-[var(--sl-text-muted)]">Type</label>
                <select className="w-full bg-[var(--sl-bg-panel)] border border-[var(--sl-border)] rounded-lg px-3 py-2 text-[var(--sl-text-primary)] focus:outline-none focus:border-[var(--sl-text-primary)]">
                  <option>Manufacturer</option>
                  <option>Press Kit</option>
                  <option>Reviewer Data</option>
                  <option>Community</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-[var(--sl-text-muted)]">Publisher</label>
                <input type="text" className="w-full bg-[var(--sl-bg-panel)] border border-[var(--sl-border)] rounded-lg px-3 py-2 text-[var(--sl-text-primary)] focus:outline-none focus:border-[var(--sl-text-primary)]" placeholder="e.g. AMD" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-[var(--sl-text-muted)]">URL</label>
                <input type="url" className="w-full bg-[var(--sl-bg-panel)] border border-[var(--sl-border)] rounded-lg px-3 py-2 text-[var(--sl-text-primary)] focus:outline-none focus:border-[var(--sl-text-primary)]" placeholder="https://" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-[var(--sl-text-muted)]">License</label>
                  <input type="text" className="w-full bg-[var(--sl-bg-panel)] border border-[var(--sl-border)] rounded-lg px-3 py-2 text-[var(--sl-text-primary)] focus:outline-none focus:border-[var(--sl-text-primary)]" placeholder="e.g. MIT" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-[var(--sl-text-muted)]">License URL</label>
                  <input type="url" className="w-full bg-[var(--sl-bg-panel)] border border-[var(--sl-border)] rounded-lg px-3 py-2 text-[var(--sl-text-primary)] focus:outline-none focus:border-[var(--sl-text-primary)]" placeholder="https://" />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-[var(--sl-border)] rounded-lg text-sm font-medium hover:bg-[var(--sl-bg-panel)]/50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[var(--sl-text-primary)] text-white rounded-lg text-sm font-medium hover:brightness-110">Save Source</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

