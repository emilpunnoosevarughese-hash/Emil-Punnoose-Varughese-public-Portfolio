import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Shield, DollarSign, TrendingUp, AlertTriangle, X, Heart, Star, Zap } from 'lucide-react';

export function Ads() {
  const [isCoffeeOpen, setIsCoffeeOpen] = useState(false);

  return (
    <div className="min-h-[calc(100vh-var(--nav-height))] pt-12 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden">
      
      {/* Hero Section */}
      <div className="text-center mb-16 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-success/10 rounded-full blur-[100px] pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 flex flex-col items-center justify-center"
        >
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-[var(--color-text-primary)]">
            Support & <span className="text-transparent bg-clip-text bg-gradient-to-r from-success to-primary">Partners</span>
          </h1>
          <p className="text-[var(--color-text-muted)] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Fast, secure ways to support my development work through direct donations and verified ad partners.
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto relative z-10">
        
        {/* Left Column: Direct Fast Money (Donations/Sponsors) */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-5 flex flex-col space-y-6"
        >
          <div className="glass-effect p-8 rounded-[2rem] border-2 border-primary/20 relative overflow-hidden group hover:border-primary/50 transition-colors">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Coffee className="w-32 h-32 text-primary" />
            </div>
            
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2 relative z-10">Fast Support</h2>
            <p className="text-[var(--color-text-muted)] mb-8 relative z-10">
              The quickest way to support my open-source work and content creation. 100% of proceeds go to server costs and coffee.
            </p>
            
            <button 
              onClick={() => setIsCoffeeOpen(true)}
              className="w-full premium-button premium-button-primary py-4 text-lg font-bold flex items-center justify-center relative z-10 mb-4"
            >
              <Coffee className="w-5 h-5 mr-2" />
              Buy me a Coffee
            </button>
            <button className="w-full glass-effect py-4 rounded-full text-lg font-bold flex items-center justify-center relative z-10 text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-primary/30 transition-all">
              <DollarSign className="w-5 h-5 mr-1" />
              PayPal Donation
            </button>
          </div>

          {/* Ad Safety Notice */}
          <div className="glass-effect p-6 rounded-3xl border-l-4 border-l-success flex items-start space-x-4">
            <div className="p-3 bg-success/10 rounded-xl shrink-0">
              <Shield className="w-6 h-6 text-success" />
            </div>
            <div>
              <h4 className="font-bold text-[var(--color-text-primary)] text-lg mb-1">Family Friendly Ads</h4>
              <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
                All automated ads on this portfolio are strictly filtered. 18+ and sensitive content categories are permanently blocked via AdSense controls.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Automated Ad Placeholders */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-7 flex flex-col space-y-6"
        >
          <div className="glass-effect p-8 rounded-[2rem] h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)] flex items-center">
                <TrendingUp className="w-6 h-6 mr-3 text-success" />
                Network Partners
              </h2>
              <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-success/10 text-success border border-success/20">
                Active Slots
              </span>
            </div>
            
            <p className="text-[var(--color-text-muted)] mb-8">
              Premium ad placements integrated seamlessly into the design. To activate these, replace the placeholder divs in the codebase with your Google AdSense {'<ins>'} script tags.
            </p>

            {/* Ad Slot 1 */}
            <div className="w-full bg-[var(--color-background)] rounded-2xl border border-dashed border-[var(--color-border)] hover:border-primary/50 transition-colors p-6 flex flex-col items-center justify-center min-h-[250px] mb-6 relative group overflow-hidden">
              <div className="absolute inset-0 bg-[var(--color-surface)]/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                <p className="text-primary font-bold text-sm">Insert AdSense Script Here</p>
              </div>
              <DollarSign className="w-8 h-8 text-[var(--color-text-muted)] opacity-30 mb-2" />
              <p className="text-[var(--color-text-muted)] text-sm font-mono uppercase tracking-widest opacity-50">Leaderboard Ad Slot (728x90)</p>
            </div>

            {/* Ad Slot 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="w-full bg-[var(--color-background)] rounded-2xl border border-dashed border-[var(--color-border)] hover:border-primary/50 transition-colors p-6 flex flex-col items-center justify-center min-h-[200px] relative group overflow-hidden">
                 <div className="absolute inset-0 bg-[var(--color-surface)]/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                  <p className="text-primary font-bold text-xs">Insert AdSense Script Here</p>
                </div>
                <p className="text-[var(--color-text-muted)] text-xs font-mono uppercase tracking-widest opacity-50 text-center">Square Ad<br/>(250x250)</p>
              </div>
              
              <div className="w-full bg-[var(--color-background)] rounded-2xl border border-[var(--color-border)] p-6 flex flex-col items-center justify-center min-h-[200px] relative overflow-hidden">
                <div className="absolute inset-0 bg-warning/5" />
                <AlertTriangle className="w-6 h-6 text-warning mb-2 relative z-10" />
                <p className="text-[var(--color-text-primary)] font-bold text-sm text-center relative z-10 mb-1">Remember to Block 18+</p>
                <p className="text-[var(--color-text-muted)] text-xs text-center relative z-10">Go to AdSense Dashboard → Brand Safety → Sensitive Categories.</p>
              </div>
            </div>

          </div>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* Direct Advertising System Section                  */}
      {/* ═══════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-12 glass-effect rounded-[2rem] border border-[var(--color-border)] p-8 md:p-12 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
          <div>
            <h2 className="text-3xl font-black text-[var(--color-text-primary)] mb-4">Advertise With Me</h2>
            <p className="text-[var(--color-text-muted)] text-lg mb-8 leading-relaxed">
              Reach developers, learners, creators, and technology-focused visitors through carefully placed advertisements across my portfolio and Learning Hub.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <a href="/ads/create" className="premium-button premium-button-primary py-4 px-8 text-lg font-bold flex items-center justify-center text-center">
                Create an Advertisement
              </a>
              <a href="#packages" className="glass-effect py-4 px-8 rounded-full text-lg font-bold flex items-center justify-center text-center text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-primary/30 transition-all">
                View Packages
              </a>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-[var(--color-text-primary)]">Advertising Guidelines:</h3>
              <ul className="space-y-2 text-[var(--color-text-muted)] text-sm">
                <li className="flex items-center"><Shield className="w-4 h-4 text-success mr-2 shrink-0" /> All advertisements are subject to manual moderation.</li>
                <li className="flex items-center"><X className="w-4 h-4 text-red-400 mr-2 shrink-0" /> Prohibited: Adult content, gambling, scams, malware, deceptive UI.</li>
                <li className="flex items-center"><Zap className="w-4 h-4 text-warning mr-2 shrink-0" /> Supported Formats: PNG, JPG, WEBP (Max 5MB).</li>
              </ul>
            </div>
          </div>

          <div id="packages" className="space-y-6">
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">Available Packages</h3>
            
            <div className="glass-effect bg-[var(--color-surface)]/50 p-6 rounded-2xl border border-[var(--color-border)] hover:border-primary/30 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-primary text-lg">Learning Hub Banner</h4>
                  <p className="text-xs font-mono tracking-widest text-[var(--color-text-muted)] uppercase mb-2">Responsive (728x90 desktop)</p>
                </div>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">Standard</span>
              </div>
              <p className="text-[var(--color-text-muted)] text-sm mb-4">Premium placement natively integrated below learning resources on the Tutorials page.</p>
              <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-4">
                <span className="text-[var(--color-text-primary)] font-medium">30 Days Duration</span>
                <span className="text-2xl font-black text-[var(--color-text-primary)]">₹99</span>
              </div>
            </div>

            <div className="glass-effect bg-[var(--color-surface)]/50 p-6 rounded-2xl border border-[var(--color-border)] hover:border-primary/30 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-purple-400 text-lg">Featured Partner</h4>
                  <p className="text-xs font-mono tracking-widest text-[var(--color-text-muted)] uppercase mb-2">Multiple Placements</p>
                </div>
                <span className="bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full text-sm font-bold">Premium</span>
              </div>
              <p className="text-[var(--color-text-muted)] text-sm mb-4">Maximum visibility across the Learning Hub and Sidebar placements with priority rotation.</p>
              <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-4">
                <span className="text-[var(--color-text-primary)] font-medium">30 Days Duration</span>
                <span className="text-2xl font-black text-[var(--color-text-primary)]">₹199</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* Bottom Section: Stick Figure with Grid Background  */}
      {/* ═══════════════════════════════════════════════════ */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="relative mt-20 rounded-[2rem] overflow-hidden border border-[var(--color-border)] min-h-[350px]"
      >
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[var(--color-background)]">
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,200,150,0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,200,150,0.3) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}
          />
          {/* Ambient glow */}
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[200px] bg-success/10 rounded-full blur-[100px] pointer-events-none" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-8 md:p-12">
          
          {/* Left: Writeup */}
          <div className="max-w-md mb-8 md:mb-0">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-success" />
                <span className="text-sm font-bold text-success uppercase tracking-widest">Creator's Corner</span>
              </div>
              <h3 className="text-3xl font-black text-[var(--color-text-primary)] mb-4 leading-tight">
                Every Line of Code<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-success">Starts With an Idea</span>
              </h3>
              <p className="text-[var(--color-text-muted)] leading-relaxed mb-6">
                Behind every project is countless hours of brainstorming, sketching, and problem-solving. 
                Your support fuels this creative process and helps bring innovative ideas to life.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                </div>
                <span className="text-sm text-[var(--color-text-muted)]">Loved by supporters</span>
              </div>
            </motion.div>
          </div>

          {/* Right: Creator's Corner Video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            viewport={{ once: true }}
            className="relative w-full md:w-1/2 mt-8 md:mt-0 flex justify-center md:justify-end"
          >
            <div className="relative rounded-2xl overflow-hidden border border-[var(--color-border)]/50 shadow-[0_10px_40px_rgba(0,0,0,0.3)] bg-black/50 aspect-video w-full max-w-[400px]">
              <video 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="/CreatorsCorner.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              
              {/* Subtle overlay for better integration */}
              <div className="absolute inset-0 border border-white/5 rounded-2xl pointer-events-none" />
            </div>
            
            {/* Ambient glow behind video */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/10 rounded-full blur-[80px] pointer-events-none -z-10" />
          </motion.div>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* Buy Me a Coffee Modal                              */}
      {/* ═══════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isCoffeeOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setIsCoffeeOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 40 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[2rem] p-8 w-full max-w-md relative overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button 
                onClick={() => setIsCoffeeOpen(false)}
                className="absolute top-4 right-4 p-2 text-[var(--color-text-muted)] hover:text-white rounded-full hover:bg-white/10 transition-colors z-20"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Ambient glow */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-[#b87a3d]/20 rounded-full blur-[60px] pointer-events-none" />

              <div className="flex flex-col items-center text-center relative z-10">
                
                {/* Animated Coffee Cup SVG */}
                <motion.div className="mb-6 relative">
                  <svg width="120" height="140" viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Steam lines */}
                    <motion.path 
                      d="M35 35 Q38 20, 35 5" 
                      stroke="#b87a3d" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5"
                      animate={{ y: [0, -8, 0], opacity: [0.2, 0.6, 0.2] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                    />
                    <motion.path 
                      d="M55 30 Q58 15, 55 0" 
                      stroke="#b87a3d" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5"
                      animate={{ y: [0, -10, 0], opacity: [0.3, 0.7, 0.3] }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
                    />
                    <motion.path 
                      d="M75 35 Q78 20, 75 5" 
                      stroke="#b87a3d" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5"
                      animate={{ y: [0, -6, 0], opacity: [0.2, 0.5, 0.2] }}
                      transition={{ duration: 1.8, repeat: Infinity, delay: 0.6 }}
                    />
                    
                    {/* Cup Body */}
                    <path d="M15 45 L15 115 Q15 130, 55 130 Q95 130, 95 115 L95 45 Z" fill="#2a1f14" stroke="#3d2e1c" strokeWidth="2" />

                    {/* Coffee liquid */}
                    <motion.path 
                      d="M20 55 Q55 48, 90 55 L88 112 Q55 125, 22 112 Z" 
                      fill="#6F4E37"
                      animate={{ d: [
                        "M20 55 Q55 48, 90 55 L88 112 Q55 125, 22 112 Z",
                        "M20 58 Q55 50, 90 58 L88 112 Q55 125, 22 112 Z",
                        "M20 55 Q55 48, 90 55 L88 112 Q55 125, 22 112 Z"
                      ]}}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                    
                    {/* Coffee foam/cream highlight */}
                    <motion.ellipse 
                      cx="55" cy="55" rx="28" ry="5" 
                      fill="#c49a6c" opacity="0.4"
                      animate={{ ry: [5, 7, 5], opacity: [0.3, 0.5, 0.3] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    
                    {/* Cup Handle */}
                    <path d="M95 60 Q120 60, 120 85 Q120 110, 95 110" stroke="#3d2e1c" strokeWidth="6" fill="none" strokeLinecap="round" />
                    
                    {/* Cup rim highlight */}
                    <path d="M15 45 L95 45" stroke="#4a3828" strokeWidth="3" />

                    {/* Heart on cup */}
                    <motion.path 
                      d="M48 80 Q48 72, 55 72 Q62 72, 62 80 Q62 90, 55 95 Q48 90, 48 80 Z" 
                      fill="none" stroke="#FF6B6B" strokeWidth="1.5"
                      animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </svg>

                  {/* Floating hearts */}
                  <motion.div
                    className="absolute -top-2 -right-2"
                    animate={{ y: [0, -15, 0], opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
                  >
                    <Heart className="w-4 h-4 text-red-400 fill-red-400" />
                  </motion.div>
                  <motion.div
                    className="absolute top-4 -left-4"
                    animate={{ y: [0, -12, 0], opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                  >
                    <Heart className="w-3 h-3 text-pink-400 fill-pink-400" />
                  </motion.div>
                </motion.div>

                <h3 className="text-2xl font-black text-[var(--color-text-primary)] mb-2">
                  Buy Me a Coffee ☕
                </h3>
                <p className="text-[var(--color-text-muted)] text-sm mb-6 max-w-xs leading-relaxed">
                  Your support keeps me caffeinated and coding! Every coffee fuels the next open-source project, tutorial, or creative experiment.
                </p>

                {/* Coffee Options */}
                <div className="flex gap-3 mb-6 w-full">
                  {[
                    { label: '1 Coffee', price: '₹10', emoji: '☕', perk: 'Shoutout' },
                    { label: '3 Coffees', price: '₹15', emoji: '☕☕☕', perk: 'Priority Reply' },
                    { label: '5 Coffees', price: '₹25', emoji: '🎉', perk: 'Code Review' }
                  ].map((option, i) => (
                    <motion.button 
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex-1 p-3 rounded-xl border transition-all flex flex-col items-center justify-center ${i === 1 ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(0,102,255,0.15)]' : 'border-[var(--color-border)] bg-white/5 hover:border-primary/30'}`}
                    >
                      <span className="text-2xl mb-1">{option.emoji}</span>
                      <span className="font-bold text-[var(--color-text-primary)]">{option.price}</span>
                      <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">{option.label}</span>
                      <span className="text-[10px] text-primary font-bold mt-1 bg-primary/10 px-2 py-0.5 rounded-full">{option.perk}</span>
                    </motion.button>
                  ))}
                </div>

                {/* Additional Extra Support Section */}
                <div className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 mb-8 text-left">
                  <h4 className="text-sm font-bold text-[var(--color-text-primary)] mb-2 flex items-center">
                    <Star className="w-4 h-4 text-amber-500 mr-2" /> Supporter Perks
                  </h4>
                  <ul className="text-xs text-[var(--color-text-muted)] space-y-2">
                    <li><strong className="text-primary mr-1">₹10:</strong> Get a public shoutout on the Supporter Wall.</li>
                    <li><strong className="text-primary mr-1">₹15:</strong> Priority email replies for debugging/help.</li>
                    <li><strong className="text-primary mr-1">₹25:</strong> 30-min 1-on-1 Code Review or Architecture chat.</li>
                  </ul>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-[#FF813F] to-[#FF6B2B] text-white py-3.5 rounded-xl font-bold text-lg shadow-[0_10px_30px_rgba(255,107,43,0.3)] hover:shadow-[0_10px_40px_rgba(255,107,43,0.5)] transition-shadow flex items-center justify-center gap-2"
                >
                  <Coffee className="w-5 h-5" />
                  Support Now
                </motion.button>

                <p className="text-[10px] text-[var(--color-text-muted)] mt-4 font-mono">
                  Secure payment powered by Stripe • No account required
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
