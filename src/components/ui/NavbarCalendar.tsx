import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export function NavbarCalendar() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date()); // The date currently being viewed
  const [selectedDate, setSelectedDate] = useState(new Date()); // The date selected
  const { theme } = useTheme();
  const isDark = theme === 'dark' || theme === 'midnight';
  const calendarRef = useRef<HTMLDivElement>(null);

  // Close calendar on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Format: "8/AUG/2026"
  const formattedDate = `${selectedDate.getDate()}/${selectedDate.toLocaleString('default', { month: 'short' }).toUpperCase()}/${selectedDate.getFullYear()}`;

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateSelect = (day: number) => {
    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    setIsOpen(false); // Optionally close after selecting
  };

  const currentMonthYear = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div className="relative mr-2" ref={calendarRef}>
      {/* Trigger */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
          isDark 
            ? 'text-gray-400 hover:text-white shadow-[inset_-2px_-2px_5px_rgba(255,255,255,0.03),inset_2px_2px_5px_rgba(0,0,0,0.5)]' 
            : 'text-gray-500 hover:text-black shadow-[inset_-2px_-2px_5px_rgba(255,255,255,1),inset_2px_2px_5px_rgba(163,177,198,0.4)]'
        }`}
      >
        <CalendarIcon className="w-3.5 h-3.5 opacity-80" />
        <span>{formattedDate}</span>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`absolute right-0 top-full mt-2 w-64 rounded-xl shadow-2xl p-4 z-50 border glass-effect ${
              isDark ? 'border-white/10 text-white' : 'border-white/40 text-gray-800'
            }`}
          >
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <button onClick={handlePrevMonth} className={`p-1 rounded-md transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}>
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="text-sm font-bold tracking-wide">
                {currentMonthYear}
              </div>
              <button onClick={handleNextMonth} className={`p-1 rounded-md transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map(day => (
                <div key={day} className={`text-center text-[10px] font-bold uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const isSelected = selectedDate.getDate() === day && 
                                   selectedDate.getMonth() === currentDate.getMonth() && 
                                   selectedDate.getFullYear() === currentDate.getFullYear();
                const isToday = new Date().getDate() === day && 
                                new Date().getMonth() === currentDate.getMonth() && 
                                new Date().getFullYear() === currentDate.getFullYear();
                                
                return (
                  <button
                    key={day}
                    onClick={() => handleDateSelect(day)}
                    className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                      isSelected 
                        ? 'bg-primary text-white shadow-[0_0_10px_rgba(0,102,255,0.4)] scale-110' 
                        : isToday 
                          ? isDark ? 'border border-primary text-primary' : 'border border-primary text-primary'
                          : isDark ? 'text-gray-300 hover:bg-white/10' : 'text-gray-700 hover:bg-black/5'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
