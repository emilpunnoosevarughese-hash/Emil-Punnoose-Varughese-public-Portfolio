import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface AdminWarningBannerProps {
  warnings: string[];
}

export const AdminWarningBanner: React.FC<AdminWarningBannerProps> = ({ warnings }) => {
  const { theme: _theme } = useTheme(); // theme drives CSS variables globally

  if (!warnings || warnings.length === 0) return null;

  return (
    <div className="rounded-lg border border-amber-200  bg-amber-50  p-4 glass-effect">
      <div className="flex items-start gap-3">
        <AlertTriangle className="text-amber-600  shrink-0 mt-0.5" size={20} />
        <div>
          <h4 className="text-sm font-medium text-amber-800  mb-1">
            Pre-publish Warnings ({warnings.length})
          </h4>
          <ul className="text-sm text-amber-700  space-y-1 list-disc list-inside">
            {warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

