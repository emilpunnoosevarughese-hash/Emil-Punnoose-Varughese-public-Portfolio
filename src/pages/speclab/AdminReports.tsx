import { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Link } from 'react-router-dom';
import { 
  AlertTriangle,
  Eye,
  Check
} from 'lucide-react';

export function AdminReports() {
  const { theme: _theme } = useTheme();
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    // Mock fetch
    setReports([
      { id: 1, component: 'Ryzen 7 7800X3D', field: 'L3 Cache', issue: 'Incorrect value', reporter: 'user123', status: 'Open', date: '2026-08-18' },
      { id: 2, component: 'RTX 4090', field: 'Dimensions', issue: 'Length is 304mm, not 310mm', reporter: 'techguru', status: 'In Progress', date: '2026-08-17' },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--sl-bg-panel)] text-[var(--sl-text-primary)] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <Link to="/admin/speclab" className="text-sm text-[var(--sl-text-primary)] hover:underline mb-2 inline-block">&larr; Back to Admin</Link>
          <h1 className="text-3xl font-bold text-[var(--sl-text-primary)] flex items-center gap-3">
            <AlertTriangle className="w-8 h-8" />
            Correction Reports
          </h1>
          <p className="text-[var(--sl-text-muted)] mt-1">Review user-submitted corrections and feedback.</p>
        </header>

        <div className="border border-[var(--sl-border)] rounded-2xl bg-[var(--sl-bg-panel)] min-h-[60vh] p-6">
          <div className="overflow-x-auto border border-[var(--sl-border)] rounded-xl">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--sl-bg-panel)]/50 border-b border-[var(--sl-border)]">
                <tr>
                  <th className="p-4 font-semibold">Component</th>
                  <th className="p-4 font-semibold">Field / Issue</th>
                  <th className="p-4 font-semibold">Reporter</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--sl-border)] text-[var(--sl-text-muted)]">
                {reports.map(report => (
                  <tr key={report.id}>
                    <td className="p-4 font-medium text-[var(--sl-text-primary)]">{report.component}</td>
                    <td className="p-4">
                      <div className="font-medium text-[var(--sl-text-primary)]">{report.field}</div>
                      <div className="text-xs">{report.issue}</div>
                    </td>
                    <td className="p-4">{report.reporter}</td>
                    <td className="p-4">{report.date}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        report.status === 'Open' ? 'bg-red-500/10 text-red-500' :
                        report.status === 'In Progress' ? 'bg-blue-500/10 text-blue-500' :
                        'bg-green-500/10 text-green-500'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="p-4 flex gap-2 justify-end">
                      <button className="p-1.5 bg-[var(--sl-bg-panel)] border border-[var(--sl-border)] rounded-md hover:text-[var(--sl-text-primary)] transition-colors" title="View Details"><Eye className="w-4 h-4" /></button>
                      <button className="p-1.5 bg-[var(--sl-bg-panel)] border border-[var(--sl-border)] rounded-md hover:text-green-500 transition-colors" title="Resolve"><Check className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

