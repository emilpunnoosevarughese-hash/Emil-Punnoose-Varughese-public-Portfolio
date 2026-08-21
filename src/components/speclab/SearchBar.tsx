import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  onClear?: () => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  value, 
  onChange, 
  placeholder = 'Search...', 
  onClear,
  className = '' 
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || theme === 'midnight';
  const [localValue, setLocalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(localValue);
    }, 300);

    return () => clearTimeout(handler);
  }, [localValue, onChange]);

  // Sync external value
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleClear = () => {
    setLocalValue('');
    onChange('');
    if (onClear) onClear();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleClear();
      e.currentTarget.blur();
    }
  };

  const bgClasses = isDark 
    ? (isFocused ? 'bg-white/10 border-primary/50' : 'bg-white/5 border-white/10') 
    : (isFocused ? 'bg-white border-primary/50' : 'bg-gray-100 border-transparent');

  const textClasses = isDark ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500';
  const iconColor = isFocused ? 'text-primary' : (isDark ? 'text-gray-400' : 'text-gray-500');

  return (
    <div className={`relative flex items-center w-full transition-all duration-300 rounded-xl border ${bgClasses} ${isFocused ? 'shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.15)]' : ''} ${className}`}>
      <div className={`pl-4 pr-2 flex items-center pointer-events-none transition-colors ${iconColor}`}>
        <Search size={18} />
      </div>
      
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`w-full py-3 pr-10 bg-transparent outline-none text-sm ${textClasses}`}
      />
      
      {localValue && (
        <button
          onClick={handleClear}
          className={`absolute right-3 p-1 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-gray-200 text-gray-500 hover:text-gray-900'}`}
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
