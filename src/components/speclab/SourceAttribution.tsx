import React from 'react';
import { ExternalLink, ShieldCheck, Info } from 'lucide-react';
import type { SpecLabSource } from '../../types/speclab';
import { useTheme } from '../../contexts/ThemeContext';

interface SourceAttributionProps {
  source?: SpecLabSource;
  lastVerified?: string;
  compact?: boolean;
  disclaimer?: boolean;
}

export const SourceAttribution: React.FC<SourceAttributionProps> = ({ 
  source, 
  lastVerified, 
  compact = false, 
  disclaimer = false 
}) => {
  const { theme: _theme } = useTheme(); // theme drives CSS variables globally

  return (
    <div className={`space-y-4 ${compact ? 'text-sm' : 'text-base'}`}>
      {source && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between p-3 rounded-lg border border-gray-200  glass-effect">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-green-500" size={18} />
            <span className="font-medium text-gray-900 ">Sources & Verification</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {source.license && (
              <span className="px-2 py-1 bg-gray-100  text-gray-600  rounded text-xs">
                License: {source.license}
              </span>
            )}
            {lastVerified && (
              <span className="text-gray-500  text-xs">
                Verified: {new Date(lastVerified).toLocaleDateString()}
              </span>
            )}
            {source.url && (
              <a 
                href={source.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-500 hover:text-blue-600   transition-colors text-xs"
              >
                View Source <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>
      )}

      {disclaimer && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-gray-50  border border-gray-200  text-xs text-gray-500 ">
          <Info size={16} className="shrink-0 mt-0.5 text-gray-400 " />
          <p>
            SpecLab provides technical information for educational and informational purposes. Specifications and compatibility information may change over time and differ between product revisions. Always verify critical information with the manufacturer's current official documentation before making purchasing or engineering decisions.
          </p>
        </div>
      )}
    </div>
  );
};

