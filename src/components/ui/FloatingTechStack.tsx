import { useEffect, useRef, useState, useMemo } from 'react';
import { Terminal } from 'lucide-react';

const technologies = [
  { name: 'Tailwind', color: '#38bdf8', icon: 'tailwindcss' },
  { name: 'React', color: '#61dafb', icon: 'react' },
  { name: 'JavaScript', color: '#f7df1e', icon: 'javascript' },
  { name: 'Next.js', color: '#ffffff', icon: 'nextdotjs' },
  { name: 'Python', color: '#3776ab', icon: 'python' },
  { name: 'HTML5', color: '#e34f26', icon: 'html5' },
  { name: 'CSS3', color: '#1572b6', icon: 'css3' },
  { name: 'Firebase', color: '#ffca28', icon: 'firebase' },
  { name: 'Git', color: '#f05032', icon: 'git' },
  { name: 'Vercel', color: '#ffffff', icon: 'vercel' },
  { name: 'Netlify', color: '#00c7b7', icon: 'netlify' },
  { name: 'Terminal', color: '#4ade80', icon: 'terminal' },
  { name: 'TypeScript', color: '#3178c6', icon: 'typescript' },
  { name: 'Node.js', color: '#339933', icon: 'nodedotjs' },
  { name: 'Figma', color: '#f24e1e', icon: 'figma' },
  { name: 'Docker', color: '#2496ed', icon: 'docker' },
  { name: 'GraphQL', color: '#e10098', icon: 'graphql' }
];

interface Point3D {
  x: number;
  y: number;
  z: number;
}

export function FloatingTechStack() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const mousePos = useRef({ x: 0, y: 0 });
  
  // Radius of the globe
  const radius = 180;

  // 1. Generate points on a sphere using Fibonacci spiral
  const points = useMemo(() => {
    const N = technologies.length;
    const pts: Point3D[] = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle
    
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y); // radius at y
      const theta = phi * i; // golden angle increment
      
      pts.push({
        x: Math.cos(theta) * radiusAtY * radius,
        y: y * radius,
        z: Math.sin(theta) * radiusAtY * radius
      });
    }
    return pts;
  }, []);

  const [items, setItems] = useState<Array<{ id: number; tech: any; style: any }>>([]);

  useEffect(() => {
    setMounted(true);
    let animationFrameId: number;
    let rotationX = 0;
    let rotationY = 0;

    const updatePositions = () => {
      // Base auto-rotation
      rotationX -= 0.002;
      rotationY += 0.002;

      // Add mouse influence (smoothly)
      rotationX -= mousePos.current.y * 0.005;
      rotationY += mousePos.current.x * 0.005;

      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);
      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);

      const nextItems = points.map((pt, i) => {
        // Rotate around Y
        const x1 = pt.x * cosY - pt.z * sinY;
        const z1 = pt.z * cosY + pt.x * sinY;

        // Rotate around X
        const y2 = pt.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + pt.y * sinX;

        // Calculate scale and opacity based on Z depth
        const zDepth = (z2 + radius) / (2 * radius); // 0 to 1
        const scale = 0.5 + zDepth * 0.8; // Objects closer are larger
        const opacity = 0.2 + zDepth * 0.8;
        const zIndex = Math.round(zDepth * 100);

        return {
          id: i,
          tech: technologies[i],
          style: {
            transform: `translate3d(${x1}px, ${y2}px, 0) scale(${scale})`,
            opacity,
            zIndex,
            color: technologies[i].color
          }
        };
      });

      // Sort by Z index to render back elements first
      nextItems.sort((a, b) => a.style.zIndex - b.style.zIndex);
      setItems(nextItems);

      animationFrameId = requestAnimationFrame(updatePositions);
    };

    updatePositions();

    return () => cancelAnimationFrame(animationFrameId);
  }, [points]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    // Normalize mouse position between -1 and 1
    mousePos.current = {
      x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
      y: ((e.clientY - rect.top) / rect.height) * 2 - 1
    };
  };

  const handleMouseLeave = () => {
    // Slowly reset mouse influence
    mousePos.current = { x: 0, y: 0 };
  };

  if (!mounted) return null;

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full h-[600px] relative flex items-center justify-center overflow-hidden cursor-crosshair"
      style={{ perspective: '1000px' }}
    >
      {/* Central subtitle */}
      <div className="absolute top-10 w-full text-center z-50 pointer-events-none">
        <div className="flex items-center justify-center space-x-4">
          <div className="h-px w-12 bg-white/20"></div>
          <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-white/50 font-mono drop-shadow-md">
            Interactive 3D Stack
          </span>
          <div className="h-px w-12 bg-white/20"></div>
        </div>
      </div>

      {/* The Globe Container */}
      <div className="relative w-full max-w-[600px] h-[600px] flex items-center justify-center pointer-events-none">
        
        {/* Ambient Center Glow */}
        <div className="absolute w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

        {items.map((item) => (
          <div
            key={item.id}
            className="absolute left-1/2 top-1/2 -ml-8 -mt-8 w-16 h-16 flex flex-col items-center justify-center rounded-2xl bg-black/40 backdrop-blur-sm border border-white/10 shadow-2xl transition-all duration-75 ease-out pointer-events-auto hover:bg-white/10 hover:border-white/30 group"
            style={item.style}
          >
            <div className="w-8 h-8 flex items-center justify-center">
              {item.tech.icon === 'terminal' ? (
                <Terminal className="w-6 h-6" />
              ) : (
                <img 
                  src={`https://cdn.simpleicons.org/${item.tech.icon}/${item.tech.color.replace('#', '')}`} 
                  alt={item.tech.name} 
                  className="w-6 h-6 object-contain"
                />
              )}
            </div>
            
            {/* Tooltip on hover */}
            <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/80 px-2 py-1 rounded text-[10px] font-mono border border-white/10 text-white shadow-xl pointer-events-none">
              {item.tech.name}
            </div>
            
            {/* Inner Glow */}
            <div 
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity blur-md pointer-events-none"
              style={{ backgroundColor: item.tech.color }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
