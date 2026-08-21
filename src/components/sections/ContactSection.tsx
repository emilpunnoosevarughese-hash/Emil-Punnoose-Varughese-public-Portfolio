import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Heart } from 'lucide-react';
import { Github, Twitter, Instagram } from '../ui/SocialIcons';

// Mock Comments Data
const initialComments = [
  { id: 1, name: 'Admin', date: 'August 14, 2026 at 2:26 PM', text: 'Good', likes: 7, isLiked: false, color: 'bg-[#00dfd8]' },
  { id: 2, name: 'Likith', date: 'August 12, 2026 at 10:15 AM', text: 'Amazing portfolio design!', likes: 12, isLiked: true, color: 'bg-purple-500' },
];

export function ContactSection() {
  const [comments, setComments] = useState(initialComments);
  const [commentForm, setCommentForm] = useState({ name: '', text: '' });
  const [contactForm, setContactForm] = useState({ name: '', service: '', budget: '', message: '' });
  const [sortOrder, setSortOrder] = useState<'newest' | 'liked'>('newest');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const sortedComments = [...comments].sort((a, b) =>
    sortOrder === 'liked' ? b.likes - a.likes : b.id - a.id
  );

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Message sent!');
    setContactForm({ name: '', service: '', budget: '', message: '' });
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentForm.name || !commentForm.text) return;
    
    const newComment = {
      id: Date.now(),
      name: commentForm.name,
      date: 'Just now',
      text: commentForm.text,
      likes: 0,
      isLiked: false,
      color: 'bg-primary'
    };
    
    setComments([newComment, ...comments]);
    setCommentForm({ name: '', text: '' });
  };

  const toggleLike = (id: number) => {
    setComments(comments.map(c => {
      if (c.id === id) {
        return { ...c, likes: c.isLiked ? c.likes - 1 : c.likes + 1, isLiked: !c.isLiked };
      }
      return c;
    }));
  };

  return (
    <section id="contact" className="py-24 relative z-10">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Left Column - Get In Touch */}
          <div className="flex flex-col">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-[24px] p-6 md:p-8 relative bg-[#0a0a0a] border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex-1 flex flex-col overflow-hidden"
            >
              {/* High-Quality Sunflower Petal Drop Effect */}
              <div className="absolute inset-0 pointer-events-none z-0">
                {[...Array(8)].map((_, i) => {
                  const size = 14 + (i % 3) * 4; // 14px to 22px
                  return (
                    <motion.div
                      key={i}
                      className="absolute bg-gradient-to-br from-yellow-300 to-amber-500 rounded-[50%_0_50%_0] opacity-90 shadow-[0_0_12px_rgba(245,158,11,0.6)]"
                      style={{
                        width: `${size}px`,
                        height: `${size * 1.5}px`,
                        left: `${8 + i * 12}%`,
                        top: '-10%',
                      }}
                      animate={{
                        y: [-50, 800],
                        x: [0, (i % 2 === 0 ? 40 : -40), (i % 2 === 0 ? -20 : 20), 0],
                        rotate: [0, 200, 500, 720]
                      }}
                      transition={{
                        duration: 8 + (i % 4) * 2,
                        repeat: Infinity,
                        ease: "linear",
                        delay: i * 0.9,
                      }}
                    />
                  );
                })}
              </div>

              <div className="relative z-10 flex flex-col items-center mb-10">
                <div className="relative mb-6 mt-2">
                  <div className="absolute inset-0 bg-amber-500/10 blur-xl rounded-full"></div>
                  <div className="relative w-14 h-14 rounded-2xl bg-[#1a1a1a] border border-white/5 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-amber-500" />
                  </div>
                </div>
                <h3 className="text-[20px] sm:text-[22px] font-bold text-white tracking-wide">Get in touch</h3>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div>
                  <label className="block text-white text-[14px] font-medium mb-2">Name</label>
                  <input 
                    type="text" 
                    placeholder="Your name" 
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                    className="w-full h-[52px] rounded-[14px] px-5 focus:outline-none transition-all placeholder:text-gray-500 bg-[#1a1a1a] border border-white/5 text-[15px] text-white focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
                  />
                </div>
                
                <div>
                  <label className="block text-white text-[14px] font-medium mb-2">Service you need</label>
                  <div className="relative">
                    <select 
                      required
                      value={contactForm.service || ''}
                      onChange={(e) => setContactForm({...contactForm, service: e.target.value})}
                      className="w-full h-[52px] rounded-[14px] px-5 appearance-none focus:outline-none transition-all bg-[#1a1a1a] border border-white/5 text-[15px] text-white focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 cursor-pointer"
                    >
                      <option value="" disabled hidden className="text-gray-500">Select</option>
                      <option value="Web Development">Web Development</option>
                      <option value="UI/UX Design">UI/UX Design</option>
                      <option value="Consulting">Consulting</option>
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-white text-[14px] font-medium mb-2">What budget do you have available</label>
                  <input 
                    type="text" 
                    placeholder="Enter your budget" 
                    required
                    value={contactForm.budget || ''}
                    onChange={(e) => setContactForm({...contactForm, budget: e.target.value})}
                    className="w-full h-[52px] rounded-[14px] px-5 focus:outline-none transition-all placeholder:text-gray-500 bg-[#1a1a1a] border border-white/5 text-[15px] text-white focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
                  />
                  <p className="text-xs text-gray-500 mt-1.5 ml-1">Optional — helps us scope your project</p>
                </div>

                <div>
                  <label className="block text-white text-[14px] font-medium mb-2">Message</label>
                  <textarea 
                    placeholder="Please tell us about your project and what you need." 
                    rows={4}
                    required
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    className="w-full rounded-[14px] p-5 focus:outline-none transition-all placeholder:text-gray-500 bg-[#1a1a1a] border border-white/5 text-[15px] text-white focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 resize-y min-h-[120px]"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="w-full h-[52px] mt-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black font-bold text-[15px] rounded-[14px] flex items-center justify-center transition-all active:scale-[0.98]"
                >
                  Send
                </button>
              </form>
              {/* Decorative Designer Typography Fill */}
              <div className="mt-auto pt-16 pb-4 flex flex-col items-center justify-center select-none pointer-events-none">
                <p className="text-3xl md:text-5xl font-display font-black text-transparent bg-clip-text bg-gradient-to-b from-black/20 to-black/5 dark:from-white/40 dark:to-white/10 uppercase tracking-widest text-center leading-tight">
                  I'm a Designer<br/>& Developer
                </p>
              </div>
            </motion.div>


          </div>
          {/* Right Column */}
          <div className="flex flex-col">
            
            {/* Leave a Comment Form */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="rounded-[24px] p-6 md:p-8 relative bg-[#0a0a0a] border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex-1"
            >
              <div className="relative z-10 flex flex-col items-center mb-10">
                <div className="relative mb-6 mt-2">
                  <div className="absolute inset-0 bg-amber-500/10 blur-xl rounded-full"></div>
                  <div className="relative w-14 h-14 rounded-2xl bg-[#1a1a1a] border border-white/5 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-amber-500" />
                  </div>
                </div>
                <h3 className="text-[20px] sm:text-[22px] font-bold text-white tracking-wide">Leave a comment</h3>
              </div>

              <form onSubmit={handleCommentSubmit} className="space-y-6">
                <div>
                  <label className="block text-white text-[14px] font-medium mb-2">Name</label>
                  <input 
                    type="text" 
                    placeholder="Your name" 
                    required
                    value={commentForm.name}
                    onChange={(e) => setCommentForm({...commentForm, name: e.target.value})}
                    className="w-full h-[52px] rounded-[14px] px-5 focus:outline-none transition-all placeholder:text-gray-500 bg-[#1a1a1a] border border-white/5 text-[15px] text-white focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
                  />
                </div>

                <div>
                  <label className="block text-white text-[14px] font-medium mb-2">Comment</label>
                  <div className="relative">
                    <textarea 
                      placeholder="Write your comment..." 
                      rows={3}
                      required
                      maxLength={280}
                      value={commentForm.text}
                      onChange={(e) => setCommentForm({...commentForm, text: e.target.value})}
                      className="w-full rounded-[14px] p-5 focus:outline-none transition-all placeholder:text-gray-500 bg-[#1a1a1a] border border-white/5 text-[15px] text-white focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 resize-y min-h-[120px] pb-8"
                    ></textarea>
                    <div className="absolute right-4 bottom-4 text-[12px] text-gray-500 pointer-events-none">
                      {commentForm.text.length}/280
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full h-[52px] mt-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black font-bold text-[15px] rounded-[14px] flex items-center justify-center transition-all active:scale-[0.98]"
                >
                  Post Comment
                </button>
              </form>
            </motion.div>

            {/* Comments List */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="rounded-[24px] p-6 md:p-8 relative bg-[#0a0a0a] border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] mt-6 md:mt-8"
            >
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-amber-500" />
                  <h3 className="text-[18px] sm:text-[20px] font-bold text-white tracking-wide">Comments ({comments.length + 23})</h3>
                </div>
                {/* Custom Dark Dropdown */}
                <div className="relative" ref={sortRef}>
                  <button
                    onClick={() => setSortDropdownOpen(o => !o)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-gray-400 text-[12px] font-semibold hover:text-white hover:border-white/20 transition-all duration-200"
                  >
                    <span>{sortOrder === 'newest' ? 'Newest' : 'Most Liked'}</span>
                    <svg
                      width="12" height="12" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      className={`transition-transform duration-200 ${sortDropdownOpen ? 'rotate-180' : ''}`}
                    >
                      <path d="m6 9 6 6 6-6"/>
                    </svg>
                  </button>

                  {sortDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-36 z-50 rounded-xl overflow-hidden bg-[#131318] border border-white/[0.1] shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
                      {([['newest', 'Newest'], ['liked', 'Most Liked']] as const).map(([val, label]) => (
                        <button
                          key={val}
                          onClick={() => { setSortOrder(val); setSortDropdownOpen(false); }}
                          className={`w-full text-left px-4 py-2.5 text-[12px] font-semibold transition-colors duration-150 ${
                            sortOrder === val
                              ? 'bg-amber-500/15 text-amber-400'
                              : 'text-gray-400 hover:bg-white/[0.05] hover:text-white'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="relative z-10 space-y-0 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {sortedComments.map((comment) => (
                  <div key={comment.id} className="relative group border-b border-white/5 pb-5 mb-5 last:border-0 last:mb-0 last:pb-0">
                    <div className="flex gap-4">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold shrink-0 shadow-lg text-[14px]">
                        {comment.name.substring(0, 2).toUpperCase()}
                      </div>
                      
                      <div className="flex-1 pt-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-white text-[15px]">{comment.name}</span>
                          {comment.name.toLowerCase() === 'admin' && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 text-[10px] font-bold uppercase tracking-wider">Admin</span>
                          )}
                        </div>
                        <span className="text-[12px] text-gray-500 block mb-3">{comment.date}</span>
                        <p className="text-gray-300 text-[15px] mb-4 leading-relaxed">
                          {comment.text}
                        </p>
                        
                        <button 
                          onClick={() => toggleLike(comment.id)}
                          className="flex items-center gap-1.5 text-[13px] font-semibold transition-colors group/like"
                        >
                          <Heart className={`w-[18px] h-[18px] transition-transform active:scale-75 ${comment.isLiked ? 'text-red-500 fill-red-500' : 'text-gray-500 group-hover/like:text-red-400'}`} />
                          <span className={comment.isLiked ? 'text-red-500' : 'text-gray-500 group-hover/like:text-gray-400'}>{comment.likes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="mt-8 pt-6 border-t border-white/5 flex justify-center">
                  <button className="text-[14px] font-semibold text-amber-500 hover:text-amber-400 transition-colors">
                    Load more comments
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Connect With Me Grid */}
        <div className="mt-14 mb-8 flex flex-col items-center">
          <h3 className="text-[22px] font-bold text-white mb-1">Connect With Me</h3>
          <p className="text-[15px] text-gray-500">Find me on these platforms</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* GitHub Card */}
          <a href="https://github.com" target="_blank" rel="noreferrer" className="group flex flex-col bg-[#161616] rounded-[20px] p-5 border border-[#2a2a2a] hover:border-white/50 hover:bg-[#1c1c1c] hover:-translate-y-1 transition-all duration-200 ease-in-out cursor-pointer relative shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <div className="absolute top-5 right-5 text-gray-500 opacity-0 group-hover:opacity-100 group-hover:text-white transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
            </div>
            <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-105 border border-white/10">
              <Github className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-bold text-[16px] mb-1">GitHub</span>
            <span className="text-gray-500 text-[13px]">Check out my code</span>
          </a>
          
          {/* Instagram Card */}
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="group flex flex-col bg-[#161616] rounded-[20px] p-5 border border-[#2a2a2a] hover:border-pink-500/50 hover:bg-[#1c1c1c] hover:-translate-y-1 transition-all duration-200 ease-in-out cursor-pointer relative shadow-lg hover:shadow-[0_0_20px_rgba(236,72,153,0.15)]">
            <div className="absolute top-5 right-5 text-gray-500 opacity-0 group-hover:opacity-100 group-hover:text-pink-400 transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-orange-500 via-pink-500 to-purple-500 flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-105">
              <Instagram className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-bold text-[16px] mb-1">Instagram</span>
            <span className="text-gray-500 text-[13px]">See my visual journey</span>
          </a>

          {/* X (Twitter) Card */}
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="group flex flex-col bg-[#161616] rounded-[20px] p-5 border border-[#2a2a2a] hover:border-white/50 hover:bg-[#1c1c1c] hover:-translate-y-1 transition-all duration-200 ease-in-out cursor-pointer relative shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <div className="absolute top-5 right-5 text-gray-500 opacity-0 group-hover:opacity-100 group-hover:text-white transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
            </div>
            <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-105 border border-white/10">
              <Twitter className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-white font-bold text-[16px] mb-1">X (Twitter)</span>
            <span className="text-gray-500 text-[13px]">Read my thoughts</span>
          </a>
        </div>
      </div>
    </section>
  );
}
