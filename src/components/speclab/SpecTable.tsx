import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface SpecRow {
  label: string;
  value: string | number | null | undefined;
  verified?: boolean;
  unit?: string;
}

interface SpecTableProps {
  rows: SpecRow[];
  title?: string;
}

const SpecTable: React.FC<SpecTableProps> = ({ rows, title }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || theme === 'midnight';

  const borderColor = isDark ? 'border-white/10' : 'border-black/10';
  const labelColor = isDark ? 'text-gray-400' : 'text-gray-500';
  const valueColor = isDark ? 'text-gray-100' : 'text-gray-900';
  const dotColor = isDark ? 'bg-blue-400' : 'bg-blue-500';

  return (
    <div className={`w-full overflow-hidden rounded-xl border ${borderColor}`}>
      {title && (
        <div className={`px-4 py-3 border-b ${borderColor} ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
          <h3 className={`font-semibold text-sm ${valueColor}`}>{title}</h3>
        </div>
      )}
      <div className="flex flex-col">
        {rows.map((row, idx) => {
          const isLast = idx === rows.length - 1;
          const displayValue = (row.value === null || row.value === undefined || row.value === '') 
            ? '—' 
            : `${row.value}${row.unit ? ` ${row.unit}` : ''}`;
            
          return (
            <div 
              key={idx} 
              className={`flex items-center justify-between px-4 py-3 text-sm ${!isLast ? `border-b ${borderColor}` : ''}`}
            >
              <div className={`flex items-center gap-2 ${labelColor}`}>
                <span>{row.label}</span>
              </div>
              <div className={`flex items-center gap-2 font-medium ${valueColor}`}>
                <span>{displayValue}</span>
                {row.verified && (
                  <div 
                    className={`w-1.5 h-1.5 rounded-full ${dotColor}`} 
                    title="Verified Specification"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SpecTable;
