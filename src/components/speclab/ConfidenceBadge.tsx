import React from 'react';
import { SignalHigh, SignalMedium, SignalLow, SignalZero } from 'lucide-react';
import type { ConfidenceLevel } from '../../types/speclab';
import { useTheme } from '../../contexts/ThemeContext';

interface ConfidenceBadgeProps {
  level: ConfidenceLevel;
  size?: 'sm' | 'md';
}

const levelConfig: Record<ConfidenceLevel, { icon: React.ElementType, color: string, label: string }> = {
  high: { icon: SignalHigh, color: 'text-green-500 bg-green-100/10 border-green-500/30', label: 'High Confidence' },
  medium: { icon: SignalMedium, color: 'text-blue-500 bg-blue-100/10 border-blue-500/30', label: 'Medium Confidence' },
  low: { icon: SignalLow, color: 'text-amber-500 bg-amber-100/10 border-amber-500/30', label: 'Low Confidence' },
  unknown: { icon: SignalZero, color: 'text-gray-500 bg-gray-100/10 border-gray-500/30', label: 'Unknown Confidence' },
};

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ level, size = 'sm' }) => {
  const { theme: _theme } = useTheme(); // theme drives CSS variables globally
  const config = levelConfig[level];
  const Icon = config.icon;

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';
  const iconSize = size === 'sm' ? 14 : 16;

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full border ${config.color} ${sizeClasses} glass-effect`}>
      <Icon size={iconSize} />
      <span>{config.label}</span>
    </div>
  );
};
