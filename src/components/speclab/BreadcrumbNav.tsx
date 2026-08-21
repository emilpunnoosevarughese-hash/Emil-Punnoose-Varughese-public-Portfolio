import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface BreadcrumbItem {
  label: string;
  href?: string;
  path?: string;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
}

const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({ items }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || theme === 'midnight';
  
  const textColor = isDark ? 'text-gray-400' : 'text-gray-500';
  const hoverColor = isDark ? 'hover:text-white' : 'hover:text-black';
  const activeColor = isDark ? 'text-white' : 'text-black';

  return (
    <nav className="flex items-center flex-wrap gap-1 text-sm mb-6" aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <React.Fragment key={index}>
            {isLast ? (
              <span className={`font-medium ${activeColor}`} aria-current="page">
                {item.label}
              </span>
            ) : (
              <>
                {item.href || item.path ? (
                  <Link 
                    to={(item.href || item.path) as string} 
                    className={`transition-colors ${textColor} ${hoverColor}`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className={textColor}>{item.label}</span>
                )}
                <ChevronRight size={14} className={textColor} />
              </>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default BreadcrumbNav;
