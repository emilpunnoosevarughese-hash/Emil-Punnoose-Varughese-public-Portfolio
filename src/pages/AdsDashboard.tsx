import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Clock, CheckCircle2, XCircle, PauseCircle, Plus, Lock, LogIn } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import type { Ad } from '../types/ads';
import { useNavigate } from 'react-router-dom';

export function AdsDashboard() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      
      if (currentUser) {
        fetchAds(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchAds = async (uid: string) => {
    try {
      const q = query(
        collection(db, 'ads'),
        where('advertiser_id', '==', uid)
      );
      const snapshot = await getDocs(q);
      const fetchedAds = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ad));
      
      // Sort in memory as composite index might be needed otherwise
      fetchedAds.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setAds(fetchedAds);
    } catch (error) {
      console.error("Error fetching ads:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'LIVE': return <div className="flex items-center text-success"><span className="w-2 h-2 rounded-full bg-success mr-2 animate-pulse" /> LIVE</div>;
      case 'APPROVED': return <div className="flex items-center text-success"><CheckCircle2 className="w-4 h-4 mr-1" /> Approved</div>;
      case 'PENDING_REVIEW': return <div className="flex items-center text-warning"><Clock className="w-4 h-4 mr-1" /> In Review</div>;
      case 'REJECTED': return <div className="flex items-center text-red-500"><XCircle className="w-4 h-4 mr-1" /> Rejected</div>;
      case 'PAUSED': return <div className="flex items-center text-[var(--color-text-muted)]"><PauseCircle className="w-4 h-4 mr-1" /> Paused</div>;
      case 'PAYMENT_PENDING': return <div className="flex items-center text-blue-400"><Clock className="w-4 h-4 mr-1" /> Awaiting Payment</div>;
      default: return <span className="text-[var(--color-text-muted)]">{status}</span>;
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
          You need to log in to manage advertisement campaigns.
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

  return (
    <div className="min-h-[calc(100vh-var(--nav-height))] pt-12 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-black text-[var(--color-text-primary)] mb-2">Advertiser Dashboard</h1>
          <p className="text-[var(--color-text-muted)]">Manage your campaigns and view analytics.</p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="mt-6 md:mt-0">
          <button onClick={() => navigate('/ads/create')} className="premium-button premium-button-primary py-3 px-6 flex items-center font-bold">
            <Plus className="w-5 h-5 mr-2" />
            New Campaign
          </button>
        </motion.div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : ads.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-effect p-12 rounded-[2rem] border border-[var(--color-border)] text-center">
          <BarChart3 className="w-16 h-16 text-[var(--color-text-muted)] opacity-30 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">No Campaigns Yet</h2>
          <p className="text-[var(--color-text-muted)] mb-8 max-w-md mx-auto">You haven't created any advertising campaigns. Create your first campaign to reach developers.</p>
          <button onClick={() => navigate('/ads/create')} className="premium-button premium-button-primary py-3 px-8 font-bold mx-auto flex items-center justify-center">
            Create Campaign
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {ads.map((ad, idx) => (
            <motion.div 
              key={ad.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-effect p-6 rounded-2xl border border-[var(--color-border)] hover:border-primary/30 transition-all flex flex-col md:flex-row gap-6 items-start"
            >
              <div className="w-full md:w-48 h-32 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden shrink-0 flex items-center justify-center relative">
                {ad.image_url ? (
                  <img src={ad.image_url} alt={ad.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[var(--color-text-muted)] text-xs">No Image</span>
                )}
              </div>
              
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)]">{ad.title}</h3>
                  <div className="bg-[var(--color-surface)] px-3 py-1 rounded-full text-xs font-bold font-mono">
                    {getStatusIcon(ad.status)}
                  </div>
                </div>
                <p className="text-[var(--color-text-muted)] mb-4 max-w-2xl text-sm">{ad.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-[var(--color-surface)] p-3 rounded-lg border border-[var(--color-border)]">
                    <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Placement</p>
                    <p className="font-bold text-sm text-[var(--color-text-primary)]">{ad.placement.replace(/_/g, ' ')}</p>
                  </div>
                  <div className="bg-[var(--color-surface)] p-3 rounded-lg border border-[var(--color-border)]">
                    <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Duration</p>
                    <p className="font-bold text-sm text-[var(--color-text-primary)]">{new Date(ad.start_at).toLocaleDateString()} - {new Date(ad.end_at).toLocaleDateString()}</p>
                  </div>
                  <div className="bg-[var(--color-surface)] p-3 rounded-lg border border-[var(--color-border)]">
                    <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Impressions</p>
                    <p className="font-bold text-sm text-[var(--color-text-primary)]">0</p>
                  </div>
                  <div className="bg-[var(--color-surface)] p-3 rounded-lg border border-[var(--color-border)]">
                    <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Clicks (CTR)</p>
                    <p className="font-bold text-sm text-[var(--color-text-primary)]">0 (0.0%)</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  {ad.status === 'PAYMENT_PENDING' && (
                    <button className="text-primary hover:text-primary/80 font-bold transition-colors">Complete Payment</button>
                  )}
                  {ad.status === 'LIVE' && (
                    <button className="text-[var(--color-text-muted)] hover:text-warning transition-colors">Pause Campaign</button>
                  )}
                  {(ad.status === 'DRAFT' || ad.status === 'REJECTED') && (
                    <button className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">Edit Draft</button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
