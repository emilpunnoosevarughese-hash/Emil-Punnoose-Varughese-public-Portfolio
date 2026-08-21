import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date) => void;
  label?: string;
  minDate?: Date;
  placeholder?: string;
}

export function DatePicker({ value, onChange, label, minDate, placeholder = "Select date" }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value ? new Date(value) : new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateSelect = (day: number) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (minDate && selected < new Date(minDate.setHours(0,0,0,0))) return; // Prevent selecting disabled dates
    onChange(selected);
    setIsOpen(false);
  };

  const renderDays = () => {
    const days = [];
    // Empty cells for days before the 1st
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8" />);
    }
    
    // Actual days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
      const isSelected = value?.getDate() === i && value?.getMonth() === currentMonth.getMonth() && value?.getFullYear() === currentMonth.getFullYear();
      
      let isDisabled = false;
      if (minDate) {
        const minDateWithoutTime = new Date(minDate);
        minDateWithoutTime.setHours(0,0,0,0);
        isDisabled = date < minDateWithoutTime;
      }

      days.push(
        <button
          key={i}
          type="button"
          disabled={isDisabled}
          onClick={(e) => { e.preventDefault(); handleDateSelect(i); }}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors
            ${isSelected ? 'bg-primary text-white shadow-[0_0_10px_rgba(0,102,255,0.4)]' : ''}
            ${!isSelected && !isDisabled ? 'hover:bg-white/10 text-[var(--color-text-primary)]' : ''}
            ${isDisabled ? 'opacity-30 cursor-not-allowed text-[var(--color-text-muted)]' : ''}
          `}
        >
          {i}
        </button>
      );
    }
    return days;
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-2 uppercase tracking-wider">{label}</label>}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] focus:border-primary/50 text-[var(--color-text-primary)] transition-colors hover:bg-white/5"
      >
        <span className={value ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-muted)]"}>
          {value ? value.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : placeholder}
        </span>
        <CalendarIcon className="w-4 h-4 text-[var(--color-text-muted)]" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full left-0 mt-2 p-4 bg-[#111115] border border-white/10 rounded-2xl shadow-2xl z-50 w-[280px] glass-effect"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <button type="button" onClick={handlePrevMonth} className="p-1.5 hover:bg-white/10 rounded-lg text-[var(--color-text-primary)] transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-bold text-[var(--color-text-primary)]">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </span>
              <button type="button" onClick={handleNextMonth} className="p-1.5 hover:bg-white/10 rounded-lg text-[var(--color-text-primary)] transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map(day => (
                <div key={day} className="w-8 text-center text-[10px] font-bold text-[var(--color-text-muted)]">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {renderDays()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
