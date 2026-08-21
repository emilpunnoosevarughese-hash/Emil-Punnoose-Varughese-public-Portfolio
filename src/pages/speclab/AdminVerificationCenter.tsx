
import { useTheme } from '../../contexts/ThemeContext';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Check,
  X,
  FileText,
  Image as ImageIcon
} from 'lucide-react';

export function AdminVerificationCenter() {
  const { theme: _theme } = useTheme();
  
  return (
    <div className="min-h-screen bg-[var(--sl-bg-panel)] text-[var(--sl-text-primary)] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <Link to="/admin/speclab" className="text-sm text-[var(--sl-text-primary)] hover:underline mb-2 inline-block">&larr; Back to Admin</Link>
          <h1 className="text-3xl font-bold text-[var(--sl-text-primary)] flex items-center gap-3">
            <ShieldCheck className="w-8 h-8" />
            Verification Center
          </h1>
          <p className="text-[var(--sl-text-muted)] mt-1">Review and approve product data, specifications, and images.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="p-6 border border-[var(--sl-border)] rounded-xl bg-[var(--sl-bg-panel)]/50">
            <h3 className="text-sm font-semibold text-[var(--sl-text-muted)] mb-1">Awaiting Review</h3>
            <div className="text-3xl font-bold text-[var(--sl-text-primary)]">12</div>
            <p className="text-xs text-[var(--sl-text-muted)] mt-2">Products</p>
          </div>
          <div className="p-6 border border-[var(--sl-border)] rounded-xl bg-[var(--sl-bg-panel)]/50">
            <h3 className="text-sm font-semibold text-[var(--sl-text-muted)] mb-1">To Verify</h3>
            <div className="text-3xl font-bold text-[var(--sl-text-primary)]">45</div>
            <p className="text-xs text-[var(--sl-text-muted)] mt-2">Specifications</p>
          </div>
          <div className="p-6 border border-[var(--sl-border)] rounded-xl bg-[var(--sl-bg-panel)]/50">
            <h3 className="text-sm font-semibold text-[var(--sl-text-muted)] mb-1">Pending</h3>
            <div className="text-3xl font-bold text-[var(--sl-text-primary)]">8</div>
            <p className="text-xs text-[var(--sl-text-muted)] mt-2">Images</p>
          </div>
          <div className="p-6 border border-[var(--sl-border)] rounded-xl bg-[var(--sl-bg-panel)]/50">
            <h3 className="text-sm font-semibold text-[var(--sl-text-muted)] mb-1">Needs Review</h3>
            <div className="text-3xl font-bold text-orange-500">3</div>
            <p className="text-xs text-[var(--sl-text-muted)] mt-2">Sources</p>
          </div>
        </div>

        <div className="border border-[var(--sl-border)] rounded-2xl p-6 bg-[var(--sl-bg-panel)] min-h-[50vh]">
          <h2 className="text-xl font-bold mb-4">Verification Queue</h2>
          
          <div className="overflow-x-auto border border-[var(--sl-border)] rounded-xl">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--sl-bg-panel)]/50 border-b border-[var(--sl-border)]">
                <tr>
                  <th className="p-4 font-semibold">Item</th>
                  <th className="p-4 font-semibold">Type</th>
                  <th className="p-4 font-semibold">Source</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--sl-border)] text-[var(--sl-text-muted)]">
                <tr>
                  <td className="p-4 font-medium text-[var(--sl-text-primary)]">Ryzen 7 7800X3D L2 Cache</td>
                  <td className="p-4"><span className="flex items-center gap-1"><FileText className="w-4 h-4"/> Specification</span></td>
                  <td className="p-4">AMD Official Docs</td>
                  <td className="p-4"><span className="px-2 py-1 bg-orange-500/10 text-orange-500 rounded text-xs">Pending</span></td>
                  <td className="p-4 flex gap-2 justify-end">
                    <button className="p-1.5 bg-[var(--sl-bg-panel)] border border-[var(--sl-border)] rounded-md hover:text-green-500 transition-colors" title="Approve"><Check className="w-4 h-4" /></button>
                    <button className="p-1.5 bg-[var(--sl-bg-panel)] border border-[var(--sl-border)] rounded-md hover:text-red-500 transition-colors" title="Reject"><X className="w-4 h-4" /></button>
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-[var(--sl-text-primary)]">RTX 4090 Front Render</td>
                  <td className="p-4"><span className="flex items-center gap-1"><ImageIcon className="w-4 h-4"/> Image</span></td>
                  <td className="p-4">NVIDIA Press Kit</td>
                  <td className="p-4"><span className="px-2 py-1 bg-orange-500/10 text-orange-500 rounded text-xs">Pending</span></td>
                  <td className="p-4 flex gap-2 justify-end">
                    <button className="p-1.5 bg-[var(--sl-bg-panel)] border border-[var(--sl-border)] rounded-md hover:text-green-500 transition-colors" title="Approve"><Check className="w-4 h-4" /></button>
                    <button className="p-1.5 bg-[var(--sl-bg-panel)] border border-[var(--sl-border)] rounded-md hover:text-red-500 transition-colors" title="Reject"><X className="w-4 h-4" /></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

