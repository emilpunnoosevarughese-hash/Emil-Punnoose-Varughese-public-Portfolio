import React from 'react';
import { CheckCircle, Clock, FileEdit, AlertCircle, FileText } from 'lucide-react';
import type { VerificationStatus } from '../../types/speclab';
import { useTheme } from '../../contexts/ThemeContext';

interface VerificationBadgeProps {
  status: VerificationStatus;
  size?: 'sm' | 'md';
}

const statusConfig: Record<VerificationStatus, { icon: React.ElementType, color: string, label: string }> = {
  draft: { icon: FileText, color: 'text-gray-500 bg-gray-100/10 border-gray-500/30', label: 'Draft' },
  under_review: { icon: Clock, color: 'text-blue-500 bg-blue-100/10 border-blue-500/30', label: 'Under Review' },
  verified: { icon: CheckCircle, color: 'text-green-500 bg-green-100/10 border-green-500/30', label: 'Verified' },
  published: { icon: FileEdit, color: 'text-teal-500 bg-teal-100/10 border-teal-500/30', label: 'Published' },
  needs_review: { icon: AlertCircle, color: 'text-amber-500 bg-amber-100/10 border-amber-500/30', label: 'Needs Review' },
};

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({ status, size = 'sm' }) => {
  const { theme: _theme } = useTheme(); // theme drives CSS variables globally
  const config = statusConfig[status];
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
