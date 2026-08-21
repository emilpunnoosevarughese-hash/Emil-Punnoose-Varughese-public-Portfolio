import { SpecLabShell } from '../../components/speclab/layout/SpecLabShell';
import { useMemo, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { ExternalLink, CheckCircle, ShieldCheck, Info, X } from 'lucide-react';
import type { HardwareProduct, HardwareImage } from '../../types/speclab';
import BreadcrumbNav from '../../components/speclab/BreadcrumbNav';
import HardwarePlaceholder from '../../components/speclab/HardwarePlaceholder';
import SpecTable from '../../components/speclab/SpecTable';
import HardwareCard from '../../components/speclab/HardwareCard';
import { SourceAttribution } from '../../components/speclab/SourceAttribution';
import { CorrectionReportModal } from '../../components/speclab/CorrectionReportModal';
import { SEED_CPUS, SEED_GPUS, SEED_MOTHERBOARDS, SEED_RAM, SEED_STORAGE, SEED_LAPTOPS, SEED_NETWORKING } from '../../data/speclabData';

const getSeedData = (category: string | undefined): HardwareProduct[] => {
  switch(category) {
    case 'cpu': return SEED_CPUS as unknown as HardwareProduct[] || [];
    case 'gpu': return SEED_GPUS as unknown as HardwareProduct[] || [];
    case 'motherboard': return SEED_MOTHERBOARDS as unknown as HardwareProduct[] || [];
    case 'ram': return SEED_RAM as unknown as HardwareProduct[] || [];
    case 'storage': return SEED_STORAGE as unknown as HardwareProduct[] || [];
    case 'laptop': return SEED_LAPTOPS as unknown as HardwareProduct[] || [];
    case 'networking': return SEED_NETWORKING as unknown as HardwareProduct[] || [];
    default: return [];
  }
};

export function SpecLabProduct() {
  const { category, slug } = useParams<{ category: string, slug: string }>();
  const { theme } = useTheme();
  const isDark = theme === 'dark' || theme === 'midnight';
  const [activeTab, setActiveTab] = useState<'specs' | 'compat'>('specs');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const data = useMemo(() => getSeedData(category), [category]);
  const product = useMemo(() => data.find(p => p.slug === slug), [data, slug]);
  
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return data.filter(p => p.id !== product.id).slice(0, 3);
  }, [data, product]);

  useEffect(() => {
    if (product) {
      document.title = `${product.name} Specs Ã¢â‚¬â€ SpecLab | Emil Punnoose Varughese`;
    }
  }, [product]);

  if (!product) {
    return (
      <div className={`min-h-screen pt-24 pb-12 flex items-center justify-center ${isDark ? 'bg-[var(--sl-bg-panel)] text-[var(--sl-text-primary)]' : 'bg-gray-50 text-gray-900'}`}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <Link to={`/speclab/${category}`} className="text-blue-500 hover:underline">
            Return to {category} list
          </Link>
        </div>
      </div>
    );
  }

  // Determine active verified image
  const displayImage: HardwareImage | undefined = useMemo(() => {
    if (product.primary_image?.is_verified) return product.primary_image;
    if (product.gallery_images?.length) {
      const firstVerified = product.gallery_images.find(img => img.is_verified);
      if (firstVerified) return firstVerified;
    }
    // Legacy fallback
    if (product.image) return { ...product.image, source_type: 'PLACEHOLDER', is_verified: false } as HardwareImage;
    return undefined;
  }, [product]);

  // Generate spec rows based on category
  const getSpecRows = () => {
    const specs = (product as any).spec || {};
    const rows = [];
    
    // Generic
    if (specs.form_factor) rows.push({ label: 'Form Factor', value: specs.form_factor });
    if (specs.tdp) rows.push({ label: 'TDP / Power', value: `${specs.tdp}W` });
    
    // CPU
    if (specs.socket) rows.push({ label: 'Socket', value: specs.socket });
    if (specs.architecture) rows.push({ label: 'Architecture', value: specs.architecture });
    if (specs.cores !== undefined) rows.push({ label: 'Cores / Threads', value: `${specs.cores}C / ${specs.threads}T` });
    if (specs.base_clock) rows.push({ label: 'Base Clock', value: `${specs.base_clock} GHz` });
    if (specs.boost_clock) rows.push({ label: 'Boost Clock', value: `${specs.boost_clock} GHz` });
    if (specs.l3_cache) rows.push({ label: 'L3 Cache', value: `${specs.l3_cache} MB` });
    if (specs.integrated_graphics) rows.push({ label: 'Integrated Graphics', value: specs.integrated_graphics });
    if (specs.memory_type) rows.push({ label: 'Memory Type', value: specs.memory_type });
    if (specs.pcie_version) rows.push({ label: 'PCIe Version', value: specs.pcie_version });
    
    // GPU
    if (specs.vram) rows.push({ label: 'VRAM', value: `${specs.vram} GB ${specs.vram_type || ''}` });
    if (specs.pcie_slot) rows.push({ label: 'Interface', value: specs.pcie_slot });
    if (specs.power_connectors) rows.push({ label: 'Power Connectors', value: specs.power_connectors });
    if (specs.outputs) rows.push({ label: 'Outputs', value: specs.outputs });
    
    // Motherboard
    if (specs.chipset) rows.push({ label: 'Chipset', value: specs.chipset });
    if (specs.ram_type) rows.push({ label: 'RAM Type', value: specs.ram_type });
    if (specs.ram_slots) rows.push({ label: 'RAM Slots', value: specs.ram_slots.toString() });
    if (specs.max_ram) rows.push({ label: 'Max RAM', value: `${specs.max_ram} GB` });
    if (specs.m2_slots) rows.push({ label: 'M.2 Slots', value: specs.m2_slots.toString() });
    if (specs.sata_ports) rows.push({ label: 'SATA Ports', value: specs.sata_ports.toString() });
    if (specs.wifi !== undefined) rows.push({ label: 'Wi-Fi', value: specs.wifi ? 'Yes' : 'No' });
    
    // RAM
    if (specs.speed) rows.push({ label: 'Speed', value: `${specs.speed} MHz` });
    if (specs.capacity) rows.push({ label: 'Capacity', value: `${specs.capacity} GB` });
    if (specs.kit_count) rows.push({ label: 'Kit Count', value: `${specs.kit_count}x` });
    if (specs.cas_latency) rows.push({ label: 'CAS Latency', value: `CL${specs.cas_latency}` });
    if (specs.voltage) rows.push({ label: 'Voltage', value: `${specs.voltage}V` });
    
    // Storage
    if (specs.interface) rows.push({ label: 'Interface', value: specs.interface });
    if (specs.sequential_read) rows.push({ label: 'Sequential Read', value: `${specs.sequential_read} MB/s` });
    if (specs.sequential_write) rows.push({ label: 'Sequential Write', value: `${specs.sequential_write} MB/s` });
    
    // Laptop
    if (specs.cpu) rows.push({ label: 'Processor', value: specs.cpu });
    if (specs.gpu) rows.push({ label: 'Graphics', value: specs.gpu });
    if (specs.ram) rows.push({ label: 'Memory', value: specs.ram });
    if (specs.storage) rows.push({ label: 'Storage', value: specs.storage });
    if (specs.display) rows.push({ label: 'Display', value: specs.display });
    if (specs.resolution) rows.push({ label: 'Resolution', value: specs.resolution });
    if (specs.refresh_rate) rows.push({ label: 'Refresh Rate', value: `${specs.refresh_rate}Hz` });
    if (specs.ports) rows.push({ label: 'Ports', value: specs.ports });
    if (specs.battery) rows.push({ label: 'Battery', value: specs.battery });
    if (specs.weight) rows.push({ label: 'Weight', value: specs.weight });
    if (specs.ram_upgradeable !== undefined) rows.push({ label: 'RAM Upgradeable', value: specs.ram_upgradeable ? 'Yes' : 'No' });

    return rows.map(r => ({ ...r, verified: product.verified }));
  };

  return (
    <SpecLabShell>
    <div className="px-6 py-8 max-w-5xl mx-auto" style={{ color: 'var(--sl-text-primary)', fontFamily: 'var(--sl-font-body)' }}>
      <div className="max-w-5xl mx-auto space-y-8">
        <BreadcrumbNav 
          items={[
            { label: 'SpecLab', href: '/speclab' },
            { label: category || '', href: `/speclab/${category}` },
            { label: product.name }
          ]} 
        />

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-full md:w-1/3 flex-shrink-0 flex flex-col gap-4">
            <div className="relative w-full aspect-square rounded-xl shadow-lg border overflow-hidden bg-white/5" style={{ borderColor: 'var(--sl-border)' }}>
              {displayImage ? (
                displayImage.url.toLowerCase().endsWith('.webm') || displayImage.url.toLowerCase().endsWith('.mp4') ? (
                  <video 
                    src={displayImage.url} 
                    autoPlay loop muted playsInline 
                    className="w-full h-full object-contain p-4"
                  />
                ) : (
                  <picture className="w-full h-full">
                    {displayImage.url.toLowerCase().endsWith('.webp') && (
                      <source srcSet={displayImage.url} type="image/webp" />
                    )}
                    <img 
                      src={displayImage.url} 
                      alt={displayImage.alt_text || product.name} 
                      className="w-full h-full object-contain p-4" 
                    />
                  </picture>
                )
              ) : (
                <HardwarePlaceholder category={product.category} className="w-full h-full" />
              )}
              
              {displayImage?.is_verified && (
                <button 
                  onClick={() => setIsImageModalOpen(true)}
                  className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-black/70 text-white hover:bg-black/90 transition-colors backdrop-blur-md border border-white/20 shadow-xl"
                >
                  <ShieldCheck size={14} className="text-green-400" />
                  Verified Image
                </button>
              )}
            </div>
            
            {/* Gallery Thumbnails */}
            {product.gallery_images && product.gallery_images.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {product.gallery_images.filter(img => img.is_verified).map((img, i) => (
                  <button key={i} className="relative w-16 h-16 rounded-md border flex-shrink-0 overflow-hidden bg-white/5 hover:border-blue-500 transition-colors" style={{ borderColor: 'var(--sl-border)' }}>
                    <img src={img.url} alt={img.alt_text} className="w-full h-full object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider" style={{ backgroundColor: 'var(--sl-border)' }}>
                {product.category}
              </span>
              {product.verified && (
                <span className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-100  px-3 py-1 rounded-full">
                  <ShieldCheck size={14} /> Verified Data
                </span>
              )}
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold">{product.name}</h1>
            <p className="text-xl" style={{ color: 'var(--sl-text-muted)' }}>by {product.manufacturer_name}</p>
            
            {product.description && (
              <p className="mt-4 leading-relaxed" style={{ color: 'var(--sl-text-primary)' }}>
                {product.description}
              </p>
            )}

            {product.features && product.features.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {product.features.map((feature, idx) => (
                  <span key={idx} className="px-3 py-1 text-sm font-medium rounded-full bg-blue-500/10 text-blue-600  border border-blue-500/20">
                    {feature}
                  </span>
                ))}
              </div>
            )}

            {(product.game_support || product.windows_support || product.linux_support) && (
              <div className="grid grid-cols-1 gap-3 mt-6 p-4 rounded-xl bg-black/5  border" style={{ borderColor: 'var(--sl-border)' }}>
                {product.game_support && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--sl-text-muted)' }}>Gaming Capabilities</h4>
                    <p className="text-sm font-medium">{product.game_support}</p>
                  </div>
                )}
                {product.windows_support && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--sl-text-muted)' }}>Windows Support</h4>
                    <p className="text-sm font-medium">{product.windows_support}</p>
                  </div>
                )}
                {product.linux_support && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--sl-text-muted)' }}>Linux Support</h4>
                    <p className="text-sm font-medium">{product.linux_support}</p>
                  </div>
                )}
              </div>
            )}

            {product.source_url && (
              <a 
                href={product.source_url} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 font-medium mt-6"
              >
                <ExternalLink size={18} /> View Official Specs
              </a>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b" style={{ borderColor: 'var(--sl-border)' }}>
          <div className="flex gap-6">
            <button 
              onClick={() => setActiveTab('specs')}
              className={`pb-3 font-medium text-lg border-b-2 transition-colors ${activeTab === 'specs' ? 'border-blue-500 text-blue-500' : 'border-transparent opacity-60 hover:opacity-100'}`}
            >
              Specifications
            </button>
            <button 
              onClick={() => setActiveTab('compat')}
              className={`pb-3 font-medium text-lg border-b-2 transition-colors ${activeTab === 'compat' ? 'border-blue-500 text-blue-500' : 'border-transparent opacity-60 hover:opacity-100'}`}
            >
              Compatibility Guidelines
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="py-4">
          {activeTab === 'specs' ? (
            <div className="space-y-8">
              <SpecTable rows={getSpecRows()} />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--sl-bg-panel)', borderColor: 'var(--sl-border)' }}>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><CheckCircle className="text-green-500"/> General Compatibility</h3>
                <ul className="list-disc pl-5 space-y-2" style={{ color: 'var(--sl-text-muted)' }}>
                  {product.category === 'cpu' && (
                    <>
                      <li>Requires a motherboard with <strong>{(product as any).spec?.socket}</strong> socket.</li>
                      <li>Supports <strong>{(product as any).spec?.memory_type}</strong> memory.</li>
                      <li>Ensure your cooler can handle at least <strong>{(product as any).spec?.tdp}W</strong> of heat dissipation.</li>
                    </>
                  )}
                  {product.category === 'gpu' && (
                    <>
                      <li>Requires a <strong>{(product as any).spec?.pcie_slot}</strong> slot on the motherboard.</li>
                      <li>Requires <strong>{(product as any).spec?.power_connectors || 'No additional'}</strong> power connectors from the PSU.</li>
                      <li>Check your PC case clearance for this card's dimensions.</li>
                    </>
                  )}
                  {product.category === 'motherboard' && (
                    <>
                      <li>Fits in cases supporting <strong>{(product as any).spec?.form_factor}</strong> form factor.</li>
                      <li>Compatible with processors using the <strong>{(product as any).spec?.socket}</strong> socket.</li>
                      <li>Supports up to <strong>{(product as any).spec?.max_ram}GB</strong> of <strong>{(product as any).spec?.ram_type}</strong> RAM.</li>
                    </>
                  )}
                  {!['cpu', 'gpu', 'motherboard'].includes(product.category) && (
                    <li>Standard compatibility rules apply. Please check specific interface and dimension requirements.</li>
                  )}
                </ul>
              </div>
              <div className="flex justify-center mt-6">
                <Link to="/speclab/compatibility" className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">
                  Open Compatibility Checker
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Provenance & Verification */}
        <div className="pt-12 mt-12 mb-8 border-t" style={{ borderColor: 'var(--sl-border)' }}>
          <h3 className="text-xl font-bold mb-6">Sources & Verification</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--sl-bg-panel)', borderColor: 'var(--sl-border)' }}>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-3 text-blue-500">Specifications</h4>
              <p className="font-medium">{product.source_url ? 'Official manufacturer documentation' : 'Manufacturer Specifications'}</p>
              {product.source_url && (
                <a href={product.source_url} target="_blank" rel="noreferrer" className="text-sm text-blue-400 hover:underline inline-flex items-center gap-1 mt-2">
                  <ExternalLink size={14} /> View original source
                </a>
              )}
            </div>

            <div className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--sl-bg-panel)', borderColor: 'var(--sl-border)' }}>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-3 text-green-500">Product Image</h4>
              {displayImage?.is_verified ? (
                <>
                  <p className="font-medium">{displayImage.source_type.replace(/_/g, ' ')}</p>
                  <button onClick={() => setIsImageModalOpen(true)} className="text-sm text-blue-400 hover:underline inline-flex items-center gap-1 mt-2">
                    <Info size={14} /> View license details
                  </button>
                </>
              ) : (
                <p className="font-medium text-gray-500">Original SpecLab illustration</p>
              )}
            </div>
          </div>

          <SourceAttribution 
            source={{
              id: 'mock-1',
              source_name: 'Official Manufacturer Documentation',
              source_type: 'Manufacturer Product Page',
              publisher: product.manufacturer_name,
              url: product.source_url || '#',
              license: 'Copyright',
              accessed_at: '2026-08-18',
              status: 'published',
              created_at: '2026-08-18',
              updated_at: '2026-08-18'
            }}
            lastVerified={displayImage?.verified_at || "August 18, 2026"}
            disclaimer={true}
          />
          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsReportModalOpen(true)}
              className="text-sm text-gray-500 hover:text-blue-500 transition-colors underline cursor-pointer"
            >
              Report incorrect information
            </button>
          </div>
        </div>

        {/* Image Source Modal */}
        {isImageModalOpen && displayImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className={`relative w-full max-w-md p-6 rounded-xl shadow-2xl border ${isDark ? 'bg-gray-900 border-white/10' : 'bg-white border-black/10'}`}>
              <button 
                onClick={() => setIsImageModalOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-black/5  transition-colors"
              >
                <X size={20} />
              </button>
              
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <ShieldCheck className="text-green-500" />
                Image Source Information
              </h3>
              
              <div className="space-y-4 text-sm">
                <div>
                  <span className="opacity-60 block text-xs uppercase tracking-wider mb-1">Source</span>
                  <div className="font-medium">{displayImage.source_name || displayImage.source_type}</div>
                </div>
                
                {displayImage.creator && (
                  <div>
                    <span className="opacity-60 block text-xs uppercase tracking-wider mb-1">Creator</span>
                    <div className="font-medium">{displayImage.creator}</div>
                  </div>
                )}
                
                {displayImage.license && (
                  <div>
                    <span className="opacity-60 block text-xs uppercase tracking-wider mb-1">License</span>
                    <div className="font-medium">
                      {displayImage.license_url ? (
                        <a href={displayImage.license_url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">
                          {displayImage.license} <ExternalLink size={12} className="inline ml-1" />
                        </a>
                      ) : (
                        displayImage.license
                      )}
                    </div>
                  </div>
                )}
                
                {displayImage.attribution_text && (
                  <div>
                    <span className="opacity-60 block text-xs uppercase tracking-wider mb-1">Attribution</span>
                    <div className="p-3 bg-black/5  rounded-lg border border-black/10  text-xs font-mono break-words">
                      {displayImage.attribution_text}
                    </div>
                  </div>
                )}

                {displayImage.source_url && (
                  <div className="pt-2">
                    <a href={displayImage.source_url} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full py-2 bg-blue-600/10 text-blue-500 hover:bg-blue-600/20 rounded-lg font-medium transition-colors">
                      <ExternalLink size={16} /> View Original Image Page
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <CorrectionReportModal 
          productId={product.id}
          productName={product.name}
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
        />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="pt-12 border-t mt-12" style={{ borderColor: 'var(--sl-border)' }}>
            <h3 className="text-2xl font-bold mb-6">Similar Hardware</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map(item => (
                <HardwareCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
</SpecLabShell>
  );
}






