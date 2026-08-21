import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import type { HardwareProduct } from "../../types/speclab";
import HardwarePlaceholder from "./HardwarePlaceholder";

interface HardwareCardProps {
  product: HardwareProduct;
  spec?: any;
  onClick?: () => void;
}

const HardwareCard: React.FC<HardwareCardProps> = ({ product, spec, onClick }) => {
  const displayImage = product.primary_image || (product.gallery_images && product.gallery_images[0]) || product.image;

  // Determine highlights based on category
  const renderHighlights = () => {
    if (!spec) return null;
    const highlights = [];
    
    if (product.category === "cpu") {
      if (spec.cores) highlights.push(`${spec.cores}C/${spec.threads}T`);
      if (spec.boostClock) highlights.push(`${spec.boostClock} GHz`);
      if (spec.tdp) highlights.push(`${spec.tdp}W TDP`);
    } else if (product.category === "gpu") {
      if (spec.vram) highlights.push(`${spec.vram}GB VRAM`);
      if (spec.tdp) highlights.push(`${spec.tdp}W TDP`);
    } else if (product.category === "ram") {
      if (spec.type) highlights.push(spec.type);
      if (spec.speed) highlights.push(`${spec.speed} MT/s`);
      if (spec.capacity) highlights.push(`${spec.capacity}GB`);
    } else {
      if (spec.formFactor) highlights.push(spec.formFactor);
      if (spec.capacity) highlights.push(spec.capacity);
    }

    return (
      <div className="flex flex-wrap gap-2 mt-3">
        {highlights.map((h, i) => (
          <span key={i} className="text-xs px-2 py-1 rounded-md" style={{ backgroundColor: "var(--sl-bg-substrate)", color: "var(--sl-text-muted)" }}>
            {h}
          </span>
        ))}
      </div>
    );
  };

  const CardContent = (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
      className="relative p-4 rounded-xl border glass-effect transition-colors h-full flex flex-col cursor-pointer"
      style={{ backgroundColor: "var(--sl-bg-panel)", borderColor: "var(--sl-border)" }}
      onClick={onClick}
    >
      <div className="absolute top-4 left-4 z-10">
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary backdrop-blur-md" style={{ color: "var(--sl-text-primary)" }}>
          {product.category.toUpperCase()}
        </span>
      </div>
      
      {product.verified && (
        <div className="absolute bottom-4 right-4 z-10 bg-blue-500 text-white p-1 rounded-full" title="Verified Product">
          <Check size={12} strokeWidth={3} />
        </div>
      )}

      <div className="h-40 w-full mb-4 relative rounded-lg overflow-hidden flex-shrink-0">
        {displayImage ? (
          displayImage.url.toLowerCase().endsWith(".webm") || displayImage.url.toLowerCase().endsWith(".mp4") ? (
            <video 
              src={displayImage.url} 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-contain"
            />
          ) : (
            <picture className="w-full h-full">
              {displayImage.url.toLowerCase().endsWith(".webp") && (
                <source srcSet={displayImage.url} type="image/webp" />
              )}
              <img 
                src={displayImage.url} 
                alt={product.name}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </picture>
          )
        ) : (
          <HardwarePlaceholder category={product.category} productName={product.name} compact={true} />
        )}
      </div>

      <div className="flex-grow flex flex-col">
        <span className="text-xs uppercase tracking-wider font-semibold mb-1" style={{ color: "var(--sl-text-muted)" }}>
          {product.manufacturer_name}
        </span>
        <h3 className="font-bold text-base leading-tight line-clamp-2" style={{ color: "var(--sl-text-primary)" }}>
          {product.name}
        </h3>
        
        {renderHighlights()}

        <div className="mt-auto pt-4 flex items-end justify-between">
          <div>
            <span className="text-xs font-medium" style={{ color: "var(--sl-text-muted)" }}>Est. Price</span>
            <div className="text-lg font-bold font-mono" style={{ color: "var(--sl-text-primary)" }}>
              ${product.price_usd?.toFixed(2) || "---"}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (onClick) {
    return CardContent;
  }

  return (
    <Link to={`/speclab/${product.category.toLowerCase()}/${product.slug}`} className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
      {CardContent}
    </Link>
  );
};

export default HardwareCard;
