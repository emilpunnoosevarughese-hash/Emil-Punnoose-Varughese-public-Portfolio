import { useEffect, useRef, useState } from 'react';

interface ScrollTurnaroundProps {
  progress: number; // 0 to 1
  frameCount?: number;
  imagePathPrefix?: string;
  imagePathSuffix?: string;
}

export function ScrollTurnaround({
  progress,
  frameCount = 202,
  imagePathPrefix = '/turnaround/Man_in_pinstripe_shirt_turnaround_202607032301_frames/frame_',
  imagePathSuffix = '.webp'
}: ScrollTurnaroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);

  // Preload images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loaded = 0;

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      // Format number to 3 digits (e.g., 001, 010, 100)
      const paddedIndex = i.toString().padStart(3, '0');
      img.src = `${imagePathPrefix}${paddedIndex}${imagePathSuffix}`;
      
      img.onload = () => {
        loaded++;
        setLoadedCount(loaded);
      };
      img.onerror = () => {
        loaded++;
        setLoadedCount(loaded);
      };
      loadedImages.push(img);
    }
    setImages(loadedImages);
  }, [frameCount, imagePathPrefix, imagePathSuffix]);

  // Draw frame when progress changes
  useEffect(() => {
    if (images.length === 0 || loadedCount === 0) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Calculate which frame to show
    // We want progress 0 -> frame 0, progress 1 -> frame 199
    const frameIndex = Math.min(
      frameCount - 1,
      Math.max(0, Math.floor(progress * frameCount))
    );

    const img = images[frameIndex];
    
    // Only draw if the image has actually loaded successfully
    if (img && img.complete && img.naturalHeight !== 0) {
      // Support retina displays for crisp quality
      const dpr = window.devicePixelRatio || 1;
      
      // Ensure canvas matches container dimensions
      const container = canvas.parentElement;
      if (container) {
        const rect = container.getBoundingClientRect();
        
        // Only resize if actual dimensions changed
        if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
          canvas.width = rect.width * dpr;
          canvas.height = rect.height * dpr;
          canvas.style.width = `${rect.width}px`;
          canvas.style.height = `${rect.height}px`;
          ctx.scale(dpr, dpr);
        }
      }

      // Draw image using cover mechanics
      const logicalWidth = canvas.width / dpr;
      const logicalHeight = canvas.height / dpr;

      const hRatio = logicalWidth / img.width;
      const vRatio = logicalHeight / img.height;
      const ratio = Math.max(hRatio, vRatio);
      
      const centerShift_x = (logicalWidth - img.width * ratio) / 2;
      const centerShift_y = (logicalHeight - img.height * ratio) / 2;
      
      ctx.clearRect(0, 0, logicalWidth, logicalHeight);
      
      // Use high-quality image smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(
        img,
        0, 0, img.width, img.height,
        centerShift_x, centerShift_y, img.width * ratio, img.height * ratio
      );
    }
  }, [progress, images, loadedCount, frameCount]);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Loading State */}
      {loadedCount < frameCount && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden mb-4">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(loadedCount / frameCount) * 100}%` }}
            />
          </div>
          <p className="text-white/60 font-mono text-xs uppercase tracking-widest">
            Loading 3D Assets... {Math.round((loadedCount / frameCount) * 100)}%
          </p>
        </div>
      )}
      
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover"
        style={{ 
          // Feather the edges so the image background blends perfectly into the site
          maskImage: 'radial-gradient(circle at center, black 50%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 50%, transparent 95%)'
        }}
      />
    </div>
  );
}
