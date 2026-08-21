import { motion } from 'framer-motion';
import { Gamepad2, Play, ExternalLink } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export function GamesSection() {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || theme === 'midnight';

  const games = [
    {
      id: "spec",
      title: "SPEC",
      subtitle: "by EdgeFX",
      description: "A premium browser-based multiplayer FPS. No download. No limits. Pure precision. Built by EdgeFX.",
      imageUrl: "/src/assets/images/games/spec.webp",
      link: "/spec/index.html",
      badge: "SEASON 1 LIVE"
    },
    {
      id: "mech",
      title: "MECH",
      subtitle: "Troll Platformer",
      description: "A devious troll platformer. The floor lies. The exit runs. The spikes are friendly. Can you escape MECH?",
      imageUrl: "/mech/mech-preview.jpg",
      link: "/mech/index.html",
      badge: "NEW"
    },
    {
      id: "mech-duel",
      title: "MECH DUEL",
      subtitle: "Arena · 2P Battle",
      description: "2-player turn-based mech battle on an 8×8 grid. Move. Attack. Use special abilities. Last mech standing wins.",
      imageUrl: "/mech/mech-duel-preview.jpg",
      link: "/mech/duel.html",
      badge: "2 PLAYERS"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-[var(--color-background)]">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent" />
      
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Full-width Neumorphic Debossed Bar */}
        <div className={`w-full rounded-full p-4 mb-8 flex items-center border transition-all overflow-hidden relative ${
            isDark 
              ? 'bg-[#0a0a0a] border-white/5 shadow-[inset_-3px_-3px_8px_rgba(255,255,255,0.02),inset_3px_3px_8px_rgba(0,0,0,0.8)]' 
              : 'bg-[#e0e5ec] border-transparent shadow-[inset_-3px_-3px_8px_rgba(255,255,255,1),inset_3px_3px_8px_rgba(163,177,198,0.4)]'
          }`}>
          <Gamepad2 className={`w-6 h-6 ml-4 z-10 shrink-0 ${isDark ? 'text-yellow-400' : 'text-black'}`} />
          
          <div className="flex-1 overflow-hidden ml-4 mr-8 relative h-6">
            <motion.div
              animate={{
                x: ["100%", "0%", "0%", "-100%"]
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                repeatType: "reverse",
                times: [0, 0.4, 0.6, 1],
                ease: "easeInOut"
              }}
              className="w-full absolute inset-y-0 flex items-center whitespace-nowrap text-xs md:text-sm font-bold tracking-[0.2em] uppercase"
            >
              <span className={isDark ? 'text-yellow-400/80' : 'text-black/60'}>
                • LATEST UPDATES: SPEC SEASON 1 IS NOW LIVE! • JUMP INTO THE ACTION • MECH TROLL PLATFORMER RELEASED •
              </span>
            </motion.div>
          </div>
        </div>

        {/* Section Header & Button */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tight text-[var(--color-text-primary)] mb-2">
              Indie <span className={isDark ? 'text-yellow-400' : 'text-black'}>Games</span>
            </h2>
            <p className="text-[var(--color-text-muted)] text-lg">Explore the interactive games and virtual worlds I've built.</p>
          </div>
          <a 
            href="#" 
            className={`mt-6 md:mt-0 flex-shrink-0 px-8 py-3.5 rounded-full text-sm font-bold tracking-widest uppercase transition-all duration-300 flex items-center ${
              isDark
                ? 'bg-[#181a20] text-white shadow-[-5px_-5px_10px_rgba(255,255,255,0.03),_5px_5px_10px_rgba(0,0,0,0.6)] hover:shadow-[inset_-3px_-3px_7px_rgba(255,255,255,0.03),inset_3px_3px_7px_rgba(0,0,0,0.6)] hover:text-yellow-400'
                : 'bg-[#e0e5ec] text-black shadow-[-5px_-5px_10px_rgba(255,255,255,1),_5px_5px_10px_rgba(163,177,198,0.5)] hover:shadow-[inset_-3px_-3px_7px_rgba(255,255,255,1),inset_3px_3px_7px_rgba(163,177,198,0.5)]'
            }`}
          >
            Visit Game Store
            <ExternalLink className="w-4 h-4 ml-3" />
          </a>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`group relative rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col ${
                isDark 
                  ? 'bg-[#050505] border-white/5 hover:border-yellow-400/50 hover:shadow-[0_0_30px_rgba(250,204,21,0.15)]' 
                  : 'bg-white border-gray-200 hover:shadow-xl'
              }`}
            >
              <div className="aspect-video overflow-hidden bg-[#050505] relative">
                <img 
                  src={game.imageUrl} 
                  alt={game.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                {/* Cinematic overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <a href={game.link} className={`w-16 h-16 rounded-full flex items-center justify-center scale-75 group-hover:scale-100 transition-transform ${isDark ? 'bg-yellow-400 text-black shadow-[0_0_30px_rgba(250,204,21,0.6)]' : 'bg-black text-white shadow-[0_0_30px_rgba(0,0,0,0.4)]'}`}>
                    <Play className="w-6 h-6 ml-1" />
                  </a>
                </div>
                {/* Title overlay on image */}
                <div className="absolute bottom-5 left-6">
                  <h3 className="text-3xl font-black tracking-widest text-white drop-shadow-lg uppercase">{game.title}</h3>
                  {game.subtitle && <p className="text-xs text-yellow-400 tracking-[0.3em] font-bold uppercase mt-1">{game.subtitle}</p>}
                </div>
              </div>
              
              <div className={`p-6 flex-grow flex flex-col ${isDark ? 'bg-[#050505]' : 'bg-[var(--color-surface)]'}`}>
                <div className="flex justify-between items-start mb-4">
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'} pr-4`}>
                    {game.description}
                  </p>
                  <span className={`shrink-0 px-3 py-1.5 text-[9px] font-bold tracking-widest uppercase rounded-full border ${
                    isDark ? 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20' : 'bg-black text-white border-transparent shadow-md'
                  }`}>
                    {game.badge || 'NEW'}
                  </span>
                </div>
                <div className="mt-auto pt-4">
                  <a
                    href={game.link}
                    className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 border ${
                      isDark 
                        ? 'bg-[#111] text-yellow-400 border-white/5 hover:bg-yellow-400 hover:text-black hover:shadow-[0_0_20px_rgba(250,204,21,0.3)]' 
                        : 'bg-white text-black border-gray-200 hover:bg-black hover:text-white hover:border-black shadow-sm hover:shadow-md'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5" />
                    Play Free
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
