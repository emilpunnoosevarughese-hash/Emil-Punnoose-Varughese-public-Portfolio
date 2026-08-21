import React from 'react';
import { motion } from 'framer-motion';
import { Check, AlertTriangle, XCircle, HelpCircle } from 'lucide-react';
import type { CompatibilityStatus } from '../../types/speclab';
import { useTheme } from '../../contexts/ThemeContext';

interface CompatibilityBadgeProps {
  status: CompatibilityStatus | string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

const CompatibilityBadge: React.FC<CompatibilityBadgeProps> = ({ 
  status, 
  label, 
  size = 'md' 
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || theme === 'midnight';

  const config = {
    compatible: {
      color: isDark ? 'text-green-400 bg-green-400/10 border-green-400/20' : 'text-green-700 bg-green-100 border-green-200',
      icon: Check,
      defaultLabel: 'Compatible'
    },
    warning: {
      color: isDark ? 'text-amber-400 bg-amber-400/10 border-amber-400/20' : 'text-amber-700 bg-amber-100 border-amber-200',
      icon: AlertTriangle,
      defaultLabel: 'Potential Issue'
    },
    incompatible: {
      color: isDark ? 'text-red-400 bg-red-400/10 border-red-400/20' : 'text-red-700 bg-red-100 border-red-200',
      icon: XCircle,
      defaultLabel: 'Incompatible'
    },
    unknown: {
      color: isDark ? 'text-gray-400 bg-gray-400/10 border-gray-400/20' : 'text-gray-700 bg-gray-100 border-gray-200',
      icon: HelpCircle,
      defaultLabel: 'Unknown'
    }
  };

  const currentConfig = config[status.toLowerCase() as keyof typeof config] || config.unknown;
  const Icon = currentConfig.icon;
  const displayLabel = label || currentConfig.defaultLabel;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-3 py-1 gap-1.5',
    lg: 'text-base px-4 py-1.5 gap-2'
  };

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center font-medium rounded-full border ${currentConfig.color} ${sizeClasses[size]}`}
    >
      <Icon size={iconSizes[size]} strokeWidth={2.5} />
      <span>{displayLabel}</span>
    </motion.div>
  );
};

export default CompatibilityBadge;
