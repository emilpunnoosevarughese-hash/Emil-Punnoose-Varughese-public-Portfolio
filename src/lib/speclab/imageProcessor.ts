/**
 * Converts an image URL into a WebP blob using a hidden HTML5 canvas.
 * This runs entirely client-side, eliminating the need for a backend resizing server!
 */
export async function optimizeImageClientSide(
  imageUrl: string, 
  maxWidth: number = 1200, 
  quality: number = 0.85
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    // We must set crossOrigin to anonymous to draw external images to a canvas.
    // Note: The external server MUST send proper CORS headers (Wikimedia does).
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      // Calculate new dimensions
      let targetWidth = img.width;
      let targetHeight = img.height;
      
      if (targetWidth > maxWidth) {
        const ratio = maxWidth / targetWidth;
        targetWidth = maxWidth;
        targetHeight = Math.round(targetHeight * ratio);
      }
      
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }
      
      // Draw image to canvas
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      
      // Export as WebP
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to convert image to WebP blob"));
        }
      }, 'image/webp', quality);
    };
    
    img.onerror = () => {
      reject(new Error(`Failed to load image from URL for processing. (CORS issue?)`));
    };
    
    img.src = imageUrl;
  });
}
