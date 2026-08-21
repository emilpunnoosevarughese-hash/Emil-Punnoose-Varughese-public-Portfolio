import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, ArrowRight, ShieldCheck, AlertCircle, Lock, LogIn, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../lib/firebase'; 
import { DatePicker } from '../components/ui/DatePicker';

const AD_PACKAGES = [
  { id: 'starter', name: 'Starter', days: 7, price: 29 },
  { id: 'standard', name: 'Standard', days: 30, price: 99 },
  { id: 'premium', name: 'Premium', days: 30, price: 199 }
];

export function AdsCreate() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    title: '',
    description: '',
    ctaText: 'Learn More',
    destinationUrl: '',
    category: 'Technology',
    placement: 'LEARNING_HUB_BANNER',
    startDate: '',
    endDate: '',
    packageId: 'standard'
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be under 5MB');
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setError('Only JPG, PNG, and WEBP are supported');
        return;
      }
      setError('');
      setImageFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (!auth?.currentUser) {
        throw new Error('You must be logged in to create an ad.');
      }
      
      if (!imageFile) {
        throw new Error('Please upload an advertisement image.');
      }

      if (!formData.destinationUrl.startsWith('https://')) {
        throw new Error('Destination URL must use HTTPS.');
      }

      // Upload Image
      const imageRef = ref(storage, `ads/${auth.currentUser.uid}/${Date.now()}_${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      const imageUrl = await getDownloadURL(imageRef);

      // Create Draft Ad
      await addDoc(collection(db, 'ads'), {
        advertiser_id: auth.currentUser.uid,
        title: formData.title,
        description: formData.description,
        image_url: imageUrl,
        destination_url: formData.destinationUrl,
        cta_text: formData.ctaText,
        category: formData.category,
        placement: formData.placement,
        status: 'PENDING_REVIEW', // Automatically goes into review
        review_status: 'PENDING',
        start_at: formData.startDate ? new Date(formData.startDate).toISOString() : new Date().toISOString(),
        end_at: formData.endDate ? new Date(formData.endDate).toISOString() : new Date().toISOString(),
        weight: 10,
        package_id: formData.packageId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      // Show success screen
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[calc(100vh-var(--nav-height))] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-var(--nav-height))] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mb-6">
          <Lock className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-4">Authentication Required</h2>
        <p className="text-[var(--color-text-muted)] max-w-md mx-auto mb-8">
          You need to log in to create and manage advertisement campaigns.
        </p>
        <button 
          onClick={() => window.dispatchEvent(new Event('open-login-modal'))}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-all flex items-center gap-2"
        >
          <LogIn className="w-5 h-5" />
          Log In Now
        </button>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-[calc(100vh-var(--nav-height))] flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-effect p-8 md:p-12 rounded-[2rem] border border-primary/20 max-w-md w-full text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10 pointer-events-none" />
          
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
            className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10"
          >
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </motion.div>
          
          <h2 className="text-3xl font-black text-[var(--color-text-primary)] mb-4 relative z-10">Submitted!</h2>
          <p className="text-[var(--color-text-muted)] mb-8 relative z-10">
            Your advertisement has been submitted successfully and is currently <strong>Pending Review</strong>. We will notify you once it has been approved.
          </p>

          <button 
            onClick={() => navigate('/ads/dashboard')}
            className="w-full premium-button premium-button-primary py-4 font-bold flex items-center justify-center relative z-10"
          >
            Go to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-var(--nav-height))] pt-12 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto relative overflow-hidden">
      <div className="text-center mb-12 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-[var(--color-text-primary)]">
            Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Advertisement</span>
          </h1>
          <p className="text-[var(--color-text-muted)] text-lg max-w-2xl mx-auto">
            Submit your campaign for review. All advertisements must meet our quality guidelines.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-effect p-8 md:p-10 rounded-[2rem] border border-[var(--color-border)] relative z-10"
      >
        {error && (
          <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start">
            <AlertCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-red-200">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2">Advertiser Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Company Name</label>
                <input required type="text" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text-primary)] focus:outline-none focus:border-primary transition-colors" placeholder="Acme Corp" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Contact Name</label>
                <input required type="text" value={formData.contactName} onChange={e => setFormData({...formData, contactName: e.target.value})} className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text-primary)] focus:outline-none focus:border-primary transition-colors" placeholder="Jane Doe" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2">Campaign Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Advertisement Title</label>
                <input required type="text" maxLength={60} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text-primary)] focus:outline-none focus:border-primary transition-colors" placeholder="Supercharge your workflow" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Short Description</label>
                <textarea required maxLength={120} rows={2} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text-primary)] focus:outline-none focus:border-primary transition-colors resize-none" placeholder="The ultimate tool for developers..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Destination URL</label>
                <input required type="url" pattern="https://.*" value={formData.destinationUrl} onChange={e => setFormData({...formData, destinationUrl: e.target.value})} className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text-primary)] focus:outline-none focus:border-primary transition-colors" placeholder="https://example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">CTA Text</label>
                <input required type="text" maxLength={20} value={formData.ctaText} onChange={e => setFormData({...formData, ctaText: e.target.value})} className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text-primary)] focus:outline-none focus:border-primary transition-colors" placeholder="Learn More" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2">Creative Asset</h2>
            <div className="border-2 border-dashed border-[var(--color-border)] rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
              <input type="file" id="ad-image" accept="image/png, image/jpeg, image/webp" className="hidden" onChange={handleImageChange} />
              <label htmlFor="ad-image" className="cursor-pointer flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <span className="text-[var(--color-text-primary)] font-bold text-lg mb-1">
                  {imageFile ? imageFile.name : 'Click to upload image'}
                </span>
                <span className="text-[var(--color-text-muted)] text-sm">PNG, JPG, WEBP (Max 5MB)</span>
                <span className="text-[var(--color-text-muted)] text-xs mt-2">Recommended: 728x90 or 1200x630 depending on placement</span>
              </label>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2">Scheduling & Package</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-[60]">
              <div className="relative z-[70]">
                <DatePicker 
                  label="Start Date" 
                  value={formData.startDate ? new Date(formData.startDate) : null} 
                  onChange={(date) => setFormData({...formData, startDate: date.toISOString().split('T')[0]})} 
                  minDate={new Date()}
                />
              </div>
              <div className="relative z-[60]">
                <DatePicker 
                  label="End Date" 
                  value={formData.endDate ? new Date(formData.endDate) : null} 
                  onChange={(date) => setFormData({...formData, endDate: date.toISOString().split('T')[0]})} 
                  minDate={formData.startDate ? new Date(formData.startDate) : new Date()}
                />
              </div>
              <div className="md:col-span-2 relative z-10">
                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Select Package</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {AD_PACKAGES.map(pkg => (
                    <div 
                      key={pkg.id}
                      onClick={() => setFormData({...formData, packageId: pkg.id})}
                      className={`cursor-pointer border rounded-xl p-4 transition-all ${formData.packageId === pkg.id ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.2)]' : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-primary/50'}`}
                    >
                      <h3 className="font-bold text-[var(--color-text-primary)] mb-1">{pkg.name}</h3>
                      <p className="text-[var(--color-text-muted)] text-sm mb-2">{pkg.days} Days</p>
                      <p className="text-xl font-black text-primary">₹{pkg.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center text-sm text-[var(--color-text-muted)]">
              <ShieldCheck className="w-4 h-4 text-success mr-2" />
              All submissions are subject to manual review
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting || !formData.startDate || !formData.endDate}
              className="px-8 py-4 bg-gradient-to-r from-primary to-purple-500 text-white rounded-full font-bold hover:opacity-90 transition-opacity flex items-center shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit for Review'} <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>

        </form>
      </motion.div>
    </div>
  );
}
