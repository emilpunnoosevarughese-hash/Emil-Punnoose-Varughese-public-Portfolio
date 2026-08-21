import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Star, Search, X, Clock, Bookmark, ChevronRight } from 'lucide-react';
import { tutorialCategories } from '../data/learningResources';
import { useTheme } from '../contexts/ThemeContext';
import { LearningHubAd } from '../components/LearningHubAd';

export function Tutorials() {
  const [activeCategory, setActiveCategory] = useState(tutorialCategories[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme } = useTheme();
  const isDark = theme === 'dark' || theme === 'midnight';

  const [bookmarks, setBookmarks] = useState<any[]>(() => {
    const saved = localStorage.getItem('edgar_learning_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });
  const [recent, setRecent] = useState<any[]>(() => {
    const saved = localStorage.getItem('edgar_learning_recent');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('edgar_learning_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('edgar_learning_recent', JSON.stringify(recent));
  }, [recent]);

  const toggleBookmark = (e: React.MouseEvent, resource: any) => {
    e.preventDefault();
    e.stopPropagation();
    setBookmarks(prev => {
      if (prev.some(b => b.id === resource.id)) {
        return prev.filter(b => b.id !== resource.id);
      }
      return [...prev, { id: resource.id, name: resource.name, url: resource.url }];
    });
  };

  const handleResourceClick = (resource: any) => {
    setRecent(prev => {
      const filtered = prev.filter(r => r.id !== resource.id);
      return [{ id: resource.id, name: resource.name, url: resource.url }, ...filtered].slice(0, 5);
    });
  };

  const currentCategory = tutorialCategories.find(c => c.id === activeCategory) || tutorialCategories[0];
  
  // Filter resources based on search query
  const displayResources = searchQuery
    ? tutorialCategories.flatMap(cat => 
        cat.resources.map(res => ({ ...res, categoryName: cat.name }))
      ).filter(resource => 
        resource.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        resource.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : currentCategory.resources.map(res => ({ ...res, categoryName: currentCategory.name }));

  return (
    <div className="min-h-[calc(100vh-var(--nav-height))] pt-12 pb-24 px-4 sm:px-6 lg:px-8 max-w-[1600px] w-full mx-auto">
      
      {/* Header Section */}
      <div className="text-center mb-16 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 flex flex-col items-center justify-center"
        >
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-[var(--color-text-primary)]">
            Learning <span className="text-gradient">Hub</span>
          </h1>
          <p className="text-[var(--color-text-muted)] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            A curated collection of official documentation, free courses, and highly respected industry resources.
          </p>
        </motion.div>
      </div>

      {/* Main Layout Grid */}
      <div className="flex flex-col lg:flex-row gap-8 w-full mx-auto relative z-10">
        
        {/* Left Sidebar */}
        <div className="w-full lg:w-64 shrink-0 flex flex-col space-y-8">
          
          {/* Recent Section */}
          <div className="glass-effect rounded-[1.5rem] p-5 border border-[var(--color-border)] shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-sm text-[var(--color-text-primary)] uppercase tracking-wider">Recently Visited</h3>
            </div>
            <div className="flex flex-col space-y-2">
              {recent.length === 0 ? (
                <div className="text-xs text-[var(--color-text-muted)] italic px-2 py-3">No recent visits yet.</div>
              ) : recent.map((site, i) => (
                <a key={i} href={site.url} target="_blank" rel="noreferrer" className="flex items-center justify-between group p-2 rounded-lg hover:bg-[var(--color-surface)] transition-colors">
                  <span className="text-xs font-medium text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)] transition-colors truncate pr-2">{site.name}</span>
                  <ExternalLink className="w-3 h-3 text-[var(--color-text-muted)] group-hover:text-primary transition-colors shrink-0" />
                </a>
              ))}
            </div>
          </div>

          {/* Bookmarks Section */}
          <div className="glass-effect rounded-[1.5rem] p-5 border border-[var(--color-border)] shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Bookmark className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-sm text-[var(--color-text-primary)] uppercase tracking-wider">Bookmarks</h3>
            </div>
            <div className="flex flex-col space-y-2">
              {bookmarks.length === 0 ? (
                <div className="text-xs text-[var(--color-text-muted)] italic px-2 py-3">Click the bookmark icon on resources to save them here.</div>
              ) : bookmarks.map((site, i) => (
                <a key={i} href={site.url} target="_blank" rel="noreferrer" className="flex items-center justify-between group p-2 rounded-lg hover:bg-[var(--color-surface)] transition-colors">
                  <span className="text-xs font-medium text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)] transition-colors truncate pr-2">{site.name}</span>
                  <ChevronRight className="w-3 h-3 text-[var(--color-text-muted)] group-hover:text-primary transition-colors shrink-0" />
                </a>
              ))}
            </div>
          </div>
          
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          
          {/* Categories Navigation and Search */}
          <div className="mb-10 relative flex flex-col xl:flex-row items-center justify-between gap-4 border-b border-[var(--color-border)]/50 pb-2">
            <div className="flex overflow-x-auto no-scrollbar py-2 space-x-2 md:space-x-4 flex-1 mask-image-fade w-full xl:w-auto">
              {tutorialCategories.map((category) => {
                const Icon = category.icon;
                const isActive = activeCategory === category.id;
                
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex items-center space-x-2 px-5 py-3 rounded-xl whitespace-nowrap transition-all duration-300 relative group flex-shrink-0 ${
                      isActive 
                        ? 'text-primary bg-primary/10' 
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'group-hover:text-primary transition-colors'}`} />
                    <span className="font-bold text-sm tracking-wide">{category.name}</span>
                    {isActive && (
                      <motion.div 
                        layoutId="activeTabIndicator"
                        className="absolute inset-0 border border-primary/30 rounded-xl"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Premium Neumorphic Search Bar */}
            <div className="w-full xl:w-auto mt-2 xl:mt-0 flex-shrink-0">
              <div className={`relative flex items-center h-12 rounded-full px-4 w-full xl:w-72 transition-all duration-300 ${
                isDark 
                  ? 'bg-[#181a20] shadow-[inset_-3px_-3px_8px_rgba(255,255,255,0.03),inset_3px_3px_8px_rgba(0,0,0,0.5)] focus-within:shadow-[inset_-3px_-3px_8px_rgba(255,255,255,0.05),inset_3px_3px_8px_rgba(0,0,0,0.8)]'
                  : 'bg-[#e0e5ec] shadow-[inset_-3px_-3px_8px_rgba(255,255,255,1),inset_3px_3px_8px_rgba(163,177,198,0.5)] focus-within:shadow-[inset_-3px_-3px_8px_rgba(255,255,255,1),inset_3px_3px_8px_rgba(163,177,198,0.7)]'
              }`}>
                <Search className={`w-5 h-5 flex-shrink-0 mr-3 transition-colors ${
                  searchQuery ? 'text-primary' : 'text-[var(--color-text-muted)]'
                }`} />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`bg-transparent border-none outline-none w-full text-sm font-bold tracking-wide ${
                    isDark ? 'text-white placeholder:text-gray-500' : 'text-gray-800 placeholder:text-gray-400'
                  }`}
                />
                <AnimatePresence>
                  {searchQuery && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      onClick={() => setSearchQuery('')}
                      className="ml-2 p-1 rounded-full hover:bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

      {/* Category Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="relative z-10"
        >
          {/* Category Description (only show when not searching) */}
          {!searchQuery && (
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">{currentCategory.name}</h2>
              <p className="text-[var(--color-text-muted)]">{currentCategory.description}</p>
            </div>
          )}

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {displayResources.length === 0 ? (
              <div className="col-span-full py-12 text-center text-[var(--color-text-muted)]">
                No resources found matching "{searchQuery}"
              </div>
            ) : (
              displayResources.map((resource, index) => (
              <motion.a
                key={resource.id}
                href={resource.url}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group relative glass-effect rounded-[1.5rem] p-6 flex flex-col h-full border border-[var(--color-border)] hover:border-primary/50 transition-all duration-500 overflow-hidden"
              >
                {/* Background Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Top Row: Title & Link Icon */}
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div>
                    {searchQuery && (
                      <span className="text-xs font-bold text-primary mb-1 block uppercase tracking-wider opacity-80">
                        {resource.categoryName}
                      </span>
                    )}
                    <h3 className="text-xl font-bold text-[var(--color-text-primary)] group-hover:text-primary transition-colors pr-4">
                      {resource.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => toggleBookmark(e, resource)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all border ${
                        bookmarks.some(b => b.id === resource.id) 
                          ? 'bg-primary text-white border-primary shadow-sm' 
                          : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] border-[var(--color-border)] hover:text-primary hover:border-primary'
                      }`}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${bookmarks.some(b => b.id === resource.id) ? 'fill-white' : ''}`} />
                    </button>
                    <div 
                      onClick={() => handleResourceClick(resource)}
                      className="w-8 h-8 rounded-full bg-[var(--color-surface)] flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all shadow-sm border border-[var(--color-border)] group-hover:border-primary"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[var(--color-text-muted)] text-sm leading-relaxed mb-6 flex-1 relative z-10">
                  {resource.description}
                </p>

                {/* Bottom Row: Badge */}
                <div className="mt-auto relative z-10">
                  {resource.isRecommended ? (
                    <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#FFC857]/10 border border-[#FFC857]/30 text-[#FFC857] shadow-[0_0_15px_rgba(255,200,87,0.15)]">
                      <Star className="w-3 h-3 fill-[#FFC857]" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Top Recommendation</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)]">
                      <span className="text-[10px] font-bold uppercase tracking-wider">Official / Trusted</span>
                    </div>
                  )}
                </div>
              </motion.a>
            )))}
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Sponsored Ad Placement */}
      <LearningHubAd />

        </div>
      </div>

      {/* Footer Text */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
        className="mt-16 mb-8 text-center px-4 max-w-3xl mx-auto relative z-10"
      >
        <div className="relative overflow-hidden rounded-[2.5rem] p-8 md:p-12 border border-white/10 bg-white/5 backdrop-blur-3xl shadow-[0_8px_32px_rgba(0,102,255,0.15)] group transition-all duration-700 hover:shadow-[0_8px_40px_rgba(0,102,255,0.25)] hover:border-white/20">
          
          {/* Sweeping Light Edge */}
          <div className="absolute top-0 inset-x-0 h-[2px] w-full overflow-hidden opacity-80">
            <motion.div 
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
              className="w-1/2 h-full bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_20px_#0066ff]"
            />
          </div>
          
          {/* Liquid / Web3 Glow Effects */}
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 group-hover:bg-primary/30 transition-colors duration-700" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#B794F4]/20 rounded-full blur-[80px] translate-y-1/2 group-hover:bg-[#B794F4]/30 transition-colors duration-700" />

          <motion.p 
            animate={{ textShadow: isDark ? ['0px 0px 0px rgba(255,255,255,0)', '0px 0px 20px rgba(255,255,255,0.6)', '0px 0px 0px rgba(255,255,255,0)'] : 'none' }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className={`relative z-10 text-[15px] font-medium leading-relaxed tracking-wide ${isDark ? 'text-white/90 group-hover:text-white transition-colors duration-500' : 'text-gray-900'}`}
          >
            The resources provided here are curated based on industry standards, developer feedback, and professional experience. 
            <br className="hidden md:block" />
            <span className="text-white font-bold drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">Continual learning</span> is the foundation of modern engineering. Keep exploring, experimenting, and building.
          </motion.p>
        </div>
      </motion.div>

    </div>
  );
}
