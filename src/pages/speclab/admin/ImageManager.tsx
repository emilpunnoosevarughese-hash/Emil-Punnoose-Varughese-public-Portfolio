import React, { useState } from 'react';
import { Search, Image as ImageIcon, ShieldCheck, Download, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { SpecLabShell } from '../../../components/speclab/layout/SpecLabShell';
import { WikimediaProvider, OpenverseProvider } from '../../../lib/speclab/imageProviders';
import type { ImageCandidate } from '../../../lib/speclab/imageProviders';
// import { optimizeImageClientSide } from '../../../lib/speclab/imageProcessor';

export function ImageManager() {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || theme === 'midnight';
  
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<ImageCandidate[]>([]);
  
  const [selectedImage, setSelectedImage] = useState<ImageCandidate | null>(null);
  
  // Checklist State
  const [checks, setChecks] = useState({
    correctProduct: false,
    licenseReviewed: false,
    usagePermitted: false
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedData, setProcessedData] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    
    setIsSearching(true);
    setResults([]);
    setSelectedImage(null);
    setProcessedData(null);
    
    try {
      // Query both providers in parallel
      const [wmResults, ovResults] = await Promise.all([
        WikimediaProvider.search(query, { limit: 12 }),
        OpenverseProvider.search(query, { limit: 12 })
      ]);
      
      setResults([...wmResults, ...ovResults]);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleProcessImage = async () => {
    if (!selectedImage) return;
    setIsProcessing(true);
    
    try {
      // In a real app with Firebase, you would:
      // 1. Process client side
      // const webpBlob = await optimizeImageClientSide(selectedImage.image_url, 1200);
      // 2. Upload to Firebase Storage
      // const storageRef = ref(storage, `speclab/products/${selectedImage.id}.webp`);
      // await uploadBytes(storageRef, webpBlob);
      // const downloadUrl = await getDownloadURL(storageRef);
      
      // Since this is mock architecture, we will just generate the JSON object
      // representing the database record for the admin to copy-paste.
      const dbRecord = {
        id: `img-${Date.now()}`,
        url: selectedImage.image_url, // Would be Firebase URL in prod
        source_type: selectedImage.source_type,
        source_name: selectedImage.source_name,
        source_url: selectedImage.source_url,
        creator: selectedImage.creator,
        license: selectedImage.license,
        license_url: selectedImage.license_url,
        attribution_text: selectedImage.attribution_text,
        is_verified: true,
        verification_status: 'verified',
        verified_at: new Date().toISOString().split('T')[0],
        alt_text: selectedImage.title
      };
      
      setProcessedData(dbRecord);
    } catch (error) {
      console.error("Failed to process image:", error);
      alert("Failed to process image. (CORS error from source?)");
    } finally {
      setIsProcessing(false);
    }
  };

  const allChecked = checks.correctProduct && checks.licenseReviewed && checks.usagePermitted;

  return (
    <SpecLabShell>
      <div className="min-h-screen pt-6 pb-12 px-4 sm:px-6 lg:px-8 text-[var(--sl-text-primary)]">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ImageIcon className="text-blue-500" /> 
            SpecLab Image Manager
          </h1>
          <p className="mt-2 text-gray-500">Zero-budget legal hardware image sourcing system.</p>
        </div>

        {/* Warning Banner */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex gap-3">
          <AlertTriangle className="flex-shrink-0" />
          <div className="text-sm">
            <p className="font-bold mb-1">Legal Notice</p>
            <p>Only import images when you have verified that the image's license or permission permits your intended use. Public availability does not automatically mean permission to republish. SpecLab does not automatically determine legal rights from a URL.</p>
          </div>
        </div>

        {/* Search */}
        <div className={`p-6 rounded-xl border shadow-sm ${isDark ? 'bg-gray-900 border-white/10' : 'bg-white border-black/10'}`}>
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products (e.g., NVIDIA GeForce RTX 4090)"
                className="w-full pl-12 pr-4 py-3 rounded-lg border bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                style={{ borderColor: 'var(--sl-border)' }}
              />
            </div>
            <button 
              type="submit"
              disabled={isSearching || !query}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50 transition-colors"
            >
              {isSearching ? 'Searching...' : 'Search Open Sources'}
            </button>
          </form>
        </div>

        {/* Results Grid */}
        {results.length > 0 && !selectedImage && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {results.map(candidate => (
              <div key={candidate.id} className={`flex flex-col rounded-xl border overflow-hidden transition-all hover:shadow-lg ${isDark ? 'bg-gray-900 border-white/10' : 'bg-white border-black/10'}`}>
                <div className="aspect-video bg-black/5 relative overflow-hidden flex items-center justify-center p-2">
                  <img src={candidate.thumbnail_url} alt={candidate.title} className="max-w-full max-h-full object-contain" />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-bold text-sm line-clamp-2 mb-2" title={candidate.title}>{candidate.title}</h3>
                  
                  <div className="text-xs space-y-1 text-gray-500 mb-4 flex-1">
                    <p><span className="font-semibold text-gray-700 dark:text-gray-300">Source:</span> {candidate.source_name}</p>
                    <p><span className="font-semibold text-gray-700 dark:text-gray-300">Creator:</span> {candidate.creator}</p>
                    <p><span className="font-semibold text-gray-700 dark:text-gray-300">License:</span> <span className="text-blue-500">{candidate.license}</span></p>
                  </div>
                  
                  <button 
                    onClick={() => {
                      setSelectedImage(candidate);
                      setChecks({ correctProduct: false, licenseReviewed: false, usagePermitted: false });
                      setProcessedData(null);
                    }}
                    className="w-full py-2 bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 rounded-lg font-medium text-sm transition-colors"
                  >
                    Select for Verification
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Verification Interface */}
        {selectedImage && (
          <div className={`p-8 rounded-xl border shadow-xl ${isDark ? 'bg-gray-900 border-white/10' : 'bg-white border-black/10'}`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <ShieldCheck className="text-blue-500" /> Verify Image
              </h2>
              <button 
                onClick={() => setSelectedImage(null)}
                className="text-sm font-medium px-4 py-2 rounded-lg bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10"
              >
                Cancel / Back to Results
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-1/2 flex flex-col items-center">
                <div className="bg-black/5 rounded-xl p-4 w-full flex items-center justify-center border border-black/10 dark:border-white/10">
                  <img src={selectedImage.image_url} alt="Preview" className="max-w-full max-h-[400px] object-contain rounded-lg shadow-md" />
                </div>
                <a 
                  href={selectedImage.source_url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="mt-4 flex items-center gap-2 text-blue-500 hover:underline font-medium"
                >
                  <ExternalLink size={18} /> Open Original Source Page
                </a>
              </div>

              <div className="w-full lg:w-1/2 space-y-8">
                {/* Provenance Data */}
                <div className="space-y-4 text-sm bg-black/5 dark:bg-white/5 p-6 rounded-xl border border-black/10 dark:border-white/10">
                  <div>
                    <span className="opacity-60 block text-xs uppercase tracking-wider mb-1">Source</span>
                    <div className="font-medium">{selectedImage.source_name}</div>
                  </div>
                  <div>
                    <span className="opacity-60 block text-xs uppercase tracking-wider mb-1">Creator</span>
                    <div className="font-medium">{selectedImage.creator}</div>
                  </div>
                  <div>
                    <span className="opacity-60 block text-xs uppercase tracking-wider mb-1">License</span>
                    <div className="font-medium text-blue-500">
                      {selectedImage.license_url ? (
                        <a href={selectedImage.license_url} target="_blank" rel="noreferrer" className="hover:underline">
                          {selectedImage.license} <ExternalLink size={12} className="inline ml-1" />
                        </a>
                      ) : selectedImage.license}
                    </div>
                  </div>
                  <div>
                    <span className="opacity-60 block text-xs uppercase tracking-wider mb-1">Attribution (Auto-generated)</span>
                    <div className="font-mono text-xs p-3 bg-black/10 dark:bg-black/40 rounded border border-black/10 dark:border-white/10 break-words">
                      {selectedImage.attribution_text}
                    </div>
                  </div>
                </div>

                {/* Administrator Checklist */}
                <div className="space-y-4">
                  <h3 className="font-bold border-b pb-2" style={{ borderColor: 'var(--sl-border)' }}>Administrator Verification</h3>
                  
                  <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <input 
                      type="checkbox" 
                      className="mt-1 w-5 h-5 rounded"
                      checked={checks.correctProduct}
                      onChange={(e) => setChecks(c => ({...c, correctProduct: e.target.checked}))}
                    />
                    <div>
                      <p className="font-medium">Does the image clearly represent the selected product?</p>
                      <p className="text-xs text-gray-500 mt-1">Do not verify if this is a generic series photo or a different board partner model.</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <input 
                      type="checkbox" 
                      className="mt-1 w-5 h-5 rounded"
                      checked={checks.licenseReviewed}
                      onChange={(e) => setChecks(c => ({...c, licenseReviewed: e.target.checked}))}
                    />
                    <div>
                      <p className="font-medium">Have you reviewed the image's license on the source page?</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <input 
                      type="checkbox" 
                      className="mt-1 w-5 h-5 rounded"
                      checked={checks.usagePermitted}
                      onChange={(e) => setChecks(c => ({...c, usagePermitted: e.target.checked}))}
                    />
                    <div>
                      <p className="font-medium">Is the intended use permitted under the license?</p>
                    </div>
                  </label>
                </div>

                {!processedData ? (
                  <button 
                    onClick={handleProcessImage}
                    disabled={!allChecked || isProcessing}
                    className={`w-full py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-all ${
                      allChecked 
                        ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20' 
                        : 'bg-gray-300 dark:bg-gray-800 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isProcessing ? 'Processing Image...' : (
                      <><Download size={20} /> Mark as Verified & Process</>
                    )}
                  </button>
                ) : (
                  <div className="p-6 border border-green-500 bg-green-500/10 rounded-xl space-y-4">
                    <h3 className="font-bold text-green-500 flex items-center gap-2"><CheckCircle /> Image Processed!</h3>
                    <p className="text-sm">Copy this JSON object into your `speclabData.ts` product's <code>primary_image</code> field:</p>
                    <pre className="text-xs font-mono p-4 bg-black/80 text-green-400 rounded-lg overflow-x-auto">
                      {JSON.stringify(processedData, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
      </div>
    </SpecLabShell>
  );
}




