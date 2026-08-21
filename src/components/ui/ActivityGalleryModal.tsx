import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface ActivityGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Initial mock data
const initialActivities = [
  { 
    id: 1, 
    title: '[TES] MENJADI HAKIM SIDANG MUSYAARAH BESAR KAWAN KIPK', 
    date: '2026-01-21',
    description: 'Ini fisrt time saya upload gallery, saya mau coba fiturnya semoga aman',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80', 
    likes: 9,
    isLiked: false,
    comments: [
      { name: 'Adhe', text: 'Ada gwehh luhh', date: '21/01/2026', avatar: 'A', color: 'bg-blue-500' }
    ]
  },
  { 
    id: 2, 
    title: 'Building Modern UI Systems', 
    date: '2026-02-14',
    description: 'Experimenting with glassmorphism and modern web layouts.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80', 
    likes: 18,
    isLiked: true,
    comments: []
  },
  { 
    id: 3, 
    title: 'DIFESA Two Branding', 
    date: '2026-03-01',
    description: 'Logo and branding design process for DIFESA Two.',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80', 
    likes: 2,
    isLiked: false,
    comments: []
  },
  { 
    id: 4, 
    title: 'Frontend Performance Optimization', 
    date: '2026-03-15',
    description: 'Deep dive into React performance rendering techniques.',
    image: 'https://images.unsplash.com/photo-1550439062-609e1531270e?w=800&q=80', 
    likes: 42,
    isLiked: false,
    comments: []
  },
  { 
    id: 5, 
    title: 'Advanced Animations with Framer Motion', 
    date: '2026-04-02',
    description: 'Creating complex layout animations and physics-based interactions.',
    image: 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?w=800&q=80', 
    likes: 15,
    isLiked: true,
    comments: []
  },
  { 
    id: 6, 
    title: 'Web3 Integration Guide', 
    date: '2026-04-20',
    description: 'Connecting React applications to blockchain networks safely.',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80', 
    likes: 7,
    isLiked: false,
    comments: []
  }
];

export function ActivityGalleryModal({ isOpen, onClose }: ActivityGalleryModalProps) {
  const [activities, setActivities] = useState(initialActivities);
  const [selectedActivityId, setSelectedActivityId] = useState<number | null>(null);
  const [commentForm, setCommentForm] = useState({ name: '', text: '' });
  
  // Search and Pagination State
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  
  const selectedActivity = activities.find(a => a.id === selectedActivityId);

  // Filter activities based on search
  const filteredActivities = activities.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredActivities.length / itemsPerPage));
  const currentActivities = filteredActivities.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleLike = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setActivities(activities.map(activity => {
      if (activity.id === id) {
        return {
          ...activity,
          likes: activity.isLiked ? activity.likes - 1 : activity.likes + 1,
          isLiked: !activity.isLiked
        };
      }
      return activity;
    }));
  };

  const handleCommentSubmit = () => {
    if (!commentForm.name.trim() || !commentForm.text.trim() || !selectedActivityId) return;

    const newComment = {
      name: commentForm.name,
      text: commentForm.text,
      date: new Date().toLocaleDateString('en-GB'),
      avatar: commentForm.name.charAt(0).toUpperCase(),
      color: 'bg-primary'
    };

    setActivities(activities.map(activity => {
      if (activity.id === selectedActivityId) {
        return {
          ...activity,
          comments: [...activity.comments, newComment]
        };
      }
      return activity;
    }));
    
    setCommentForm({ name: '', text: '' });
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className={`fixed inset-0 z-[200] flex justify-center ${!selectedActivity ? 'items-start' : 'items-center'} p-0 sm:p-6 bg-[#0a0a0a]/95 backdrop-blur-md overflow-y-auto custom-scrollbar`}>
          
          <button 
            onClick={onClose} 
            className="fixed top-6 right-6 z-[210] w-12 h-12 rounded-full bg-[#111] border border-white/10 shadow-xl flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {!selectedActivity ? (
            /* Grid View */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="w-full max-w-6xl min-h-screen py-16 px-4 flex flex-col items-center"
            >
              <h1 className="text-5xl md:text-7xl font-black mb-12 text-center tracking-tight drop-shadow-xl uppercase">
                <span className="text-[#00dfd8]">ACTIVITY</span> <span className="text-white">GALLERY</span>
              </h1>

              {/* Search Bar */}
              <div className="w-full max-w-2xl mx-auto mb-16 relative">
                <input 
                  type="text" 
                  placeholder="Search activities..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#111] border border-white/10 rounded-full px-6 py-4 pl-14 text-white focus:outline-none focus:border-[#00dfd8] focus:ring-1 focus:ring-[#00dfd8] shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all"
                />
                <Search className="w-5 h-5 text-gray-500 absolute left-5 top-1/2 -translate-y-1/2" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                {currentActivities.map((activity, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={activity.id}
                    onClick={() => setSelectedActivityId(activity.id)}
                    className="group rounded-3xl overflow-hidden bg-[#0a0a0a] border border-white/5 shadow-2xl cursor-pointer hover:shadow-[0_0_30px_rgba(0,223,216,0.15)] hover:border-[#00dfd8]/50 transition-all duration-300 flex flex-col"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-black">
                      <img 
                        src={activity.image} 
                        alt={activity.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-5 bg-[#0a0a0a] border-t border-white/5">
                      <div className="flex items-center gap-3 overflow-hidden mr-4">
                        <button 
                          onClick={(e) => handleLike(e, activity.id)}
                          className="flex items-center gap-1.5 text-sm font-bold group/like shrink-0"
                        >
                          <Heart className={`w-4 h-4 transition-transform group-hover/like:scale-110 ${activity.isLiked ? 'text-red-500 fill-red-500' : 'text-gray-500 group-hover/like:text-red-400'}`} />
                          <span className={activity.isLiked ? 'text-red-500' : 'text-white'}>{activity.likes}</span>
                        </button>
                        
                        <span className="text-xs font-medium text-gray-400 truncate hover:text-white transition-colors" title={activity.title}>
                          {activity.title}
                        </span>
                      </div>
                      
                      <span className="text-[10px] font-bold tracking-widest uppercase text-[#00dfd8] shrink-0">VIEW DETAILS</span>
                    </div>
                  </motion.div>
                ))}
                
                {currentActivities.length === 0 && (
                  <div className="col-span-full py-20 text-center">
                    <p className="text-gray-500 text-lg">No activities found matching "{searchQuery}"</p>
                  </div>
                )}
              </div>

              {/* Pagination UI */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-16">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-3 rounded-full bg-[#111] border border-white/10 text-white disabled:opacity-30 hover:bg-white/5 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-12 h-12 rounded-full font-bold transition-all duration-300 ${
                        currentPage === i + 1 
                          ? 'bg-[#00dfd8] text-black shadow-[0_0_20px_rgba(0,223,216,0.4)]' 
                          : 'bg-[#111] text-gray-400 border border-white/10 hover:border-[#00dfd8] hover:text-white'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-3 rounded-full bg-[#111] border border-white/10 text-white disabled:opacity-30 hover:bg-white/5 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            /* Detail View */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-5xl bg-[var(--color-surface)] sm:rounded-[2rem] overflow-hidden flex flex-col md:flex-row shadow-[0_0_50px_rgba(0,0,0,0.3)] border border-[var(--color-border)] relative z-10 max-h-[90vh] md:h-[600px] lg:h-[650px]"
            >
              {/* Left side: Image */}
              <div className="w-full md:w-3/5 bg-black relative flex items-center justify-center h-64 md:h-full">
                <img 
                  src={selectedActivity.image} 
                  alt={selectedActivity.title} 
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Right side: Content */}
              <div className="w-full md:w-2/5 flex flex-col bg-[var(--color-surface)] h-full">
                
                {/* Header Info */}
                <div className="p-6 md:p-8 flex-1 overflow-y-auto custom-scrollbar">
                  <div className="flex items-center justify-between mb-6">
                    <span className="px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wider rounded-lg">
                      {selectedActivity.date}
                    </span>
                    <button onClick={() => setSelectedActivityId(null)} className="text-[var(--color-text-muted)] hover:text-primary transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <h2 className="text-xl md:text-2xl font-black text-[var(--color-text-primary)] mb-4 uppercase tracking-wide leading-tight">
                    {selectedActivity.title}
                  </h2>
                  <p className="text-[var(--color-text-muted)] text-sm mb-8 leading-relaxed font-medium">
                    {selectedActivity.description}
                  </p>

                  {/* Comments Section */}
                  <div className="space-y-4">
                    {selectedActivity.comments.map((comment: any, i: number) => (
                      <div key={i} className="bg-[var(--color-background)] rounded-2xl p-4 border border-[var(--color-border)]">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-full ${comment.color} flex items-center justify-center text-white font-black text-sm shrink-0 shadow-md`}>
                            {comment.avatar}
                          </div>
                          <div>
                            <div className="font-bold text-[var(--color-text-primary)] text-sm">{comment.name}</div>
                            <div className="text-[var(--color-text-muted)] text-sm mt-1">{comment.text}</div>
                            <div className="text-[var(--color-text-muted)] text-[10px] uppercase tracking-widest mt-2 font-bold opacity-70">{comment.date}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {selectedActivity.comments.length === 0 && (
                      <div className="text-center text-[var(--color-text-muted)] text-sm font-medium py-8 bg-[var(--color-background)] rounded-2xl border border-dashed border-[var(--color-border)]">
                        No comments yet. Be the first!
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 md:p-8 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
                  <button 
                    onClick={(e) => handleLike(e, selectedActivity.id)}
                    className="flex items-center gap-2 mb-4 font-bold text-sm transition-colors group/like"
                  >
                    <Heart className={`w-6 h-6 transition-transform group-hover/like:scale-110 ${selectedActivity.isLiked ? 'text-red-500 fill-red-500' : 'text-[var(--color-text-muted)] group-hover/like:text-red-400'}`} />
                    <span className={selectedActivity.isLiked ? 'text-red-500' : 'text-[var(--color-text-primary)]'}>{selectedActivity.likes} Likes</span>
                  </button>
                  
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Name" 
                        value={commentForm.name}
                        onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
                        className="w-1/3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-[var(--color-text-muted)]"
                      />
                      <input 
                        type="text" 
                        placeholder="Add a comment..." 
                        value={commentForm.text}
                        onChange={(e) => setCommentForm({ ...commentForm, text: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()}
                        className="w-2/3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-[var(--color-text-muted)]"
                      />
                    </div>
                    <div className="flex justify-end mt-2">
                      <button 
                        onClick={handleCommentSubmit}
                        disabled={!commentForm.name.trim() || !commentForm.text.trim()}
                        className="text-primary font-black text-sm tracking-widest uppercase hover:text-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Post Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </AnimatePresence>
  );

  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body);
  }
  
  return null;
}
