import { useState, useMemo, useEffect } from 'react';
import { SpecLabShell } from '../../components/speclab/layout/SpecLabShell';
import { useParams, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { Filter, X, ChevronLeft, ChevronRight, SearchX } from 'lucide-react';
import type { HardwareProduct } from '../../types/speclab';
import BreadcrumbNav from '../../components/speclab/BreadcrumbNav';
import SearchBar from '../../components/speclab/SearchBar';
import HardwareCard from '../../components/speclab/HardwareCard';
import { SEED_CPUS, SEED_GPUS, SEED_MOTHERBOARDS, SEED_RAM, SEED_STORAGE, SEED_LAPTOPS, SEED_NETWORKING, SEED_PSUS, SEED_CASES } from '../../data/speclabData';

const CATEGORY_NAMES: Record<string, string> = {
  cpu: 'CPU / Processors',
  gpu: 'GPU / Graphics Cards',
  motherboard: 'Motherboards',
  ram: 'RAM / Memory',
  storage: 'Storage',
  laptop: 'Laptops',
  networking: 'Networking',
  psu: 'Power Supplies',
  case: 'PC Cases',
  search: 'Search Results'
};

const getSeedData = (category: string | undefined): HardwareProduct[] => {
  switch(category) {
    case 'cpu': return SEED_CPUS as unknown as HardwareProduct[] || [];
    case 'gpu': return SEED_GPUS as unknown as HardwareProduct[] || [];
    case 'motherboard': return SEED_MOTHERBOARDS as unknown as HardwareProduct[] || [];
    case 'ram': return SEED_RAM as unknown as HardwareProduct[] || [];
    case 'storage': return SEED_STORAGE as unknown as HardwareProduct[] || [];
    case 'laptop': return SEED_LAPTOPS as unknown as HardwareProduct[] || [];
    case 'networking': return SEED_NETWORKING as unknown as HardwareProduct[] || [];
    case 'psu': return SEED_PSUS as unknown as HardwareProduct[] || [];
    case 'case': return SEED_CASES as unknown as HardwareProduct[] || [];
    case 'search': return [
      ...(SEED_CPUS as unknown as HardwareProduct[] || []),
      ...(SEED_GPUS as unknown as HardwareProduct[] || []),
      ...(SEED_MOTHERBOARDS as unknown as HardwareProduct[] || []),
      ...(SEED_RAM as unknown as HardwareProduct[] || []),
      ...(SEED_STORAGE as unknown as HardwareProduct[] || []),
      ...(SEED_LAPTOPS as unknown as HardwareProduct[] || []),
      ...(SEED_NETWORKING as unknown as HardwareProduct[] || []),
      ...(SEED_PSUS as unknown as HardwareProduct[] || []),
      ...(SEED_CASES as unknown as HardwareProduct[] || [])
    ];
    default: return [];
  }
};

const ITEMS_PER_PAGE = 12;

export function SpecLabCategory() {
  const { category } = useParams<{ category: string }>();
  const { theme } = useTheme();
  const isDark = theme === 'dark' || theme === 'midnight';
  
  const location = useLocation();
  const initialQuery = new URLSearchParams(location.search).get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  useEffect(() => {
    const q = new URLSearchParams(location.search).get('q');
    if (q !== null && q !== searchQuery) {
      setSearchQuery(q);
    }
  }, [location.search]);
  const [selectedMfrs, setSelectedMfrs] = useState<Set<string>>(new Set());
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('name_asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const categoryName = category ? CATEGORY_NAMES[category] || category : 'Category';
  const data = useMemo(() => getSeedData(category), [category]);

  useEffect(() => {
    document.title = `${categoryName} Ã¢â‚¬â€ SpecLab | Emil Punnoose Varughese`;
    // Simulate network delay
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [categoryName, category]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedMfrs, verifiedOnly, sortBy, category]);

  const manufacturers = useMemo(() => {
    const mfrs = new Set<string>();
    data.forEach(item => {
      if (item.manufacturer_name) mfrs.add(item.manufacturer_name);
    });
    return Array.from(mfrs).sort();
  }, [data]);

  const toggleMfr = (mfr: string) => {
    const newMfrs = new Set(selectedMfrs);
    if (newMfrs.has(mfr)) newMfrs.delete(mfr);
    else newMfrs.add(mfr);
    setSelectedMfrs(newMfrs);
  };

  const filteredData = useMemo(() => {
    let result = [...data];
    
    if (searchQuery) {
      const terms = searchQuery.toLowerCase().split(' ').filter(Boolean);
      result = result.filter(item => {
        const searchableText = `${item.name} ${item.manufacturer_name || ''} ${item.category}`.toLowerCase();
        return terms.every(term => searchableText.includes(term));
      });
    }
    
    if (selectedMfrs.size > 0) {
      result = result.filter(item => item.manufacturer_name && selectedMfrs.has(item.manufacturer_name));
    }
    
    if (verifiedOnly) {
      result = result.filter(item => item.verified);
    }
    
    result.sort((a, b) => {
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name_desc') return b.name.localeCompare(a.name);
      if (sortBy === 'release_date') {
        const dateA = a.release_date ? new Date(a.release_date).getTime() : 0;
        const dateB = b.release_date ? new Date(b.release_date).getTime() : 0;
        return dateB - dateA; // Newest first
      }
      return 0;
    });
    
    return result;
  }, [data, searchQuery, selectedMfrs, verifiedOnly, sortBy]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const currentItems = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedMfrs(new Set());
    setVerifiedOnly(false);
    setSortBy('name_asc');
  };


  return (
    <SpecLabShell>
    <div className="px-6 py-8 max-w-7xl mx-auto" style={{ color: 'var(--sl-text-primary)', fontFamily: 'var(--sl-font-body)' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        <BreadcrumbNav 
          items={[
            { label: 'SpecLab', href: '/speclab' },
            { label: categoryName }
          ]} 
        />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6" style={{ borderColor: 'var(--sl-border)' }}>
          <div>
            <h1 className="text-3xl font-bold">{categoryName}</h1>
            <p className="mt-2" style={{ color: 'var(--sl-text-muted)' }}>
              Browse and compare {filteredData.length} hardware options.
            </p>
          </div>
          <div className="w-full md:w-96">
            <SearchBar 
              value={searchQuery} 
              onChange={setSearchQuery} 
              placeholder="Search hardware..." 
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <button 
              onClick={() => setShowMobileFilters(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-md font-medium"
              style={{ backgroundColor: 'var(--sl-bg-panel)', border: '1px solid var(--sl-border)' }}
            >
              <Filter size={18} /> Filters
            </button>
          </div>

          {/* Sidebar Filters */}
          <div className={`
            fixed inset-0 z-50 lg:static lg:block lg:w-64 flex-shrink-0
            ${showMobileFilters ? 'block' : 'hidden'}
          `}>
            {/* Overlay */}
            <div 
              className="fixed inset-0 bg-black/50 lg:hidden"
              onClick={() => setShowMobileFilters(false)}
            />
            
            <div className={`
              absolute inset-y-0 left-0 w-80 lg:w-full lg:static h-full overflow-y-auto
              p-6 lg:p-0 rounded-r-xl lg:rounded-none shadow-xl lg:shadow-none
              ${isDark ? 'bg-gray-900' : 'bg-white'} lg:bg-transparent
            `}>
              <div className="flex justify-between items-center lg:hidden mb-6">
                <h2 className="text-xl font-bold">Filters</h2>
                <button onClick={() => setShowMobileFilters(false)}>
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-8">
                {/* Sort */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm uppercase tracking-wider" style={{ color: 'var(--sl-text-muted)' }}>Sort By</h3>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-2 rounded border"
                    style={{ backgroundColor: 'var(--sl-bg-panel)', borderColor: 'var(--sl-border)', color: 'var(--sl-text-primary)' }}
                  >
                    <option value="name_asc">Name (A-Z)</option>
                    <option value="name_desc">Name (Z-A)</option>
                    <option value="release_date">Newest First</option>
                  </select>
                </div>

                {/* Verification */}
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={verifiedOnly}
                      onChange={(e) => setVerifiedOnly(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600"
                    />
                    <span>Verified Specs Only</span>
                  </label>
                </div>

                {/* Manufacturers */}
                {manufacturers.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm uppercase tracking-wider" style={{ color: 'var(--sl-text-muted)' }}>Manufacturers</h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {manufacturers.map(mfr => (
                        <label key={mfr} className="flex items-center gap-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={selectedMfrs.has(mfr)}
                            onChange={() => toggleMfr(mfr)}
                            className="w-4 h-4 rounded text-blue-600"
                          />
                          <span>{mfr}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {(searchQuery || selectedMfrs.size > 0 || verifiedOnly) && (
                  <button 
                    onClick={clearFilters}
                    className="w-full py-2 px-4 rounded text-sm font-medium transition-colors"
                    style={{ backgroundColor: 'var(--sl-border)' }}
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="animate-pulse rounded-xl h-64" style={{ backgroundColor: 'var(--sl-bg-panel)', border: '1px solid var(--sl-border)' }} />
                ))}
              </div>
            ) : currentItems.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {currentItems.map(item => (
                    <HardwareCard key={item.id} product={item} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center items-center gap-4">
                    <button 
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className="p-2 rounded-full disabled:opacity-50"
                      style={{ backgroundColor: 'var(--sl-bg-panel)', border: '1px solid var(--sl-border)' }}
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <span className="text-sm font-medium">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button 
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className="p-2 rounded-full disabled:opacity-50"
                      style={{ backgroundColor: 'var(--sl-bg-panel)', border: '1px solid var(--sl-border)' }}
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-24 rounded-xl border border-dashed" style={{ borderColor: 'var(--sl-border)' }}>
                <SearchX size={48} className="mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No hardware found</h3>
                <p className="mb-6" style={{ color: 'var(--sl-text-muted)' }}>
                  Try adjusting your search or filter criteria.
                </p>
                <button 
                  onClick={clearFilters}
                  className="px-6 py-2 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
</SpecLabShell>
  );
}




