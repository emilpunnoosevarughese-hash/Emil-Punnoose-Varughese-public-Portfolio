import { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

import { adminDb } from '../lib/firebase';
import type { Ad } from '../types/ads';
import { Check, X, Pause, Play, AlertTriangle } from 'lucide-react';

export function AdminAds() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(collection(adminDb, 'ads'));
      const fetchedAds = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ad));
      fetchedAds.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setAds(fetchedAds);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch ads. Ensure you have admin privileges.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (adId: string) => {
    try {
      setProcessingId(adId);
      // Change status to PAYMENT_PENDING or LIVE depending on package
      await updateDoc(doc(adminDb, 'ads', adId), {
        review_status: 'APPROVED',
        status: 'PAYMENT_PENDING', // Assume payment is next step
        notification_read: false
      });
      await fetchAds();
    } catch (err: any) {
      alert(err.message || 'Failed to approve ad');
    } finally {
      setProcessingId(null);
    }
  };

  const handleStatusChange = async (adId: string, newStatus: string) => {
    try {
      setProcessingId(adId);
      // In production, use Cloud Functions for all status changes. 
      // Using client update here assuming Admin SDK privileges via rules or custom claims.
      const updateData: any = { status: newStatus };
      if (newStatus === 'REJECTED') {
        updateData.review_status = 'REJECTED';
        updateData.notification_read = false;
      }
      
      await updateDoc(doc(adminDb, 'ads', adId), updateData);
      await fetchAds();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="min-h-[calc(100vh-var(--nav-height))] pt-12 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[var(--color-text-primary)] mb-2">Ads Admin Dashboard</h1>
        <p className="text-[var(--color-text-muted)]">Review, moderate, and manage advertising campaigns.</p>
      </div>

      {error && (
        <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start">
          <AlertTriangle className="w-5 h-5 text-red-400 mr-3 mt-0.5" />
          <p className="text-red-200">{error}</p>
        </div>
      )}

      <div className="glass-effect rounded-2xl border border-[var(--color-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[var(--color-text-muted)]">
            <thead className="text-xs text-[var(--color-text-primary)] uppercase bg-[var(--color-surface)]/50 border-b border-[var(--color-border)]">
              <tr>
                <th className="px-6 py-4">Advertiser / Title</th>
                <th className="px-6 py-4">Placement & Dates</th>
                <th className="px-6 py-4">Review Status</th>
                <th className="px-6 py-4">Live Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">Loading campaigns...</td>
                </tr>
              ) : ads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[var(--color-text-muted)]">No advertisements found.</td>
                </tr>
              ) : (
                ads.map((ad) => (
                  <tr key={ad.id} className="border-b border-[var(--color-border)]/50 hover:bg-[var(--color-surface)]/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {ad.image_url && <img src={ad.image_url} alt="" className="w-10 h-10 rounded object-cover" />}
                        <div>
                          <div className="font-bold text-[var(--color-text-primary)]">{ad.title}</div>
                          <div className="text-xs opacity-70">{ad.advertiser_id.slice(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-mono text-xs text-primary mb-1">{ad.placement}</div>
                      <div className="text-xs">{new Date(ad.start_at).toLocaleDateString()} - {new Date(ad.end_at).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${ad.review_status === 'APPROVED' ? 'bg-success/10 text-success' : ad.review_status === 'REJECTED' ? 'bg-red-500/10 text-red-500' : 'bg-warning/10 text-warning'}`}>
                        {ad.review_status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold">{ad.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {ad.review_status === 'PENDING' && (
                          <>
                            <button 
                              disabled={processingId === ad.id}
                              onClick={() => handleApprove(ad.id)}
                              className="p-2 rounded bg-success/20 text-success hover:bg-success/30 disabled:opacity-50" title="Approve"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button 
                              disabled={processingId === ad.id}
                              onClick={() => handleStatusChange(ad.id, 'REJECTED')}
                              className="p-2 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 disabled:opacity-50" title="Reject"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {ad.status === 'LIVE' && (
                          <button 
                            disabled={processingId === ad.id}
                            onClick={() => handleStatusChange(ad.id, 'PAUSED')}
                            className="p-2 rounded bg-warning/20 text-warning hover:bg-warning/30 disabled:opacity-50" title="Pause"
                          >
                            <Pause className="w-4 h-4" />
                          </button>
                        )}
                        {ad.status === 'PAUSED' && (
                          <button 
                            disabled={processingId === ad.id}
                            onClick={() => handleStatusChange(ad.id, 'LIVE')}
                            className="p-2 rounded bg-success/20 text-success hover:bg-success/30 disabled:opacity-50" title="Resume"
                          >
                            <Play className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
