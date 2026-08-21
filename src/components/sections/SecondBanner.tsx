import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import secondBannerImg from '../../assets/images/secondbanner.webp';

export function SecondBanner() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <section className="relative min-h-[70vh] flex items-center py-24 overflow-hidden border-t border-[var(--color-border)] bg-[var(--color-background)]">
      <div className="max-w-[1920px] mx-auto px-6 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col space-y-6"
          >
            <div className="inline-flex items-center space-x-2 text-primary font-mono text-sm uppercase tracking-widest">
              <Sparkles className="w-4 h-4" />
              <span>Limitless Creativity</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight drop-shadow-md">
              Bringing Ideas to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Reality.</span>
            </h2>
            
            <p className="text-lg text-[var(--color-text-muted)] max-w-lg leading-relaxed">
              Every pixel, every line of code is carefully crafted to build experiences that not only look incredible but perform flawlessly. I believe in pushing the boundaries of what's possible on the web.
            </p>
            
            <div className="pt-4">
              <button className="premium-button px-8 py-3 rounded-full text-sm font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(0,102,255,0.3)] hover:shadow-[0_0_30px_rgba(0,102,255,0.5)] transition-all">
                Explore My Work
              </button>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative h-[400px] md:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.1)] border border-white/10 group"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
            <motion.img 
              style={{ y }}
              src={secondBannerImg} 
              alt="Second Banner" 
              className="w-full h-[120%] object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
          </motion.div>
          
        </div>
      </div>
      
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] pointer-events-none z-0" />
    </section>
  );
}
