import { onCall, HttpsError, onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

admin.initializeApp();
const db = getFirestore();

// ----------------------------------------------------------------------------
// PUBLIC AD SERVING
// ----------------------------------------------------------------------------

export const getActiveAds = onCall(async (request) => {
  const { placement } = request.data;
  
  if (!placement) {
    throw new HttpsError('invalid-argument', 'Placement is required');
  }

  const now = new Date().toISOString();

  // We query all LIVE ads for the placement, but then strictly verify server-side
  const adsSnapshot = await db.collection('ads')
    .where('status', '==', 'LIVE')
    .where('placement', '==', placement)
    .get();

  const eligibleAds: any[] = [];

  adsSnapshot.forEach((doc: any) => {
    const ad = doc.data();
    
    // Server-side verification (source of truth)
    if (
      ad.status === 'LIVE' &&
      ad.start_at <= now &&
      ad.end_at > now &&
      ad.review_status === 'APPROVED'
      // Note: Payment status checks or disabled checks can be added here
    ) {
      // Strip sensitive info before sending to client
      eligibleAds.push({
        id: doc.id,
        title: ad.title,
        description: ad.description,
        image_url: ad.image_url,
        cta_text: ad.cta_text,
        weight: ad.weight || 10,
        destination_url: ad.destination_url // We send this if using client-side redirect, or we can hide it and use /api/ads/click
      });
    }
  });

  return { ads: eligibleAds };
});

// ----------------------------------------------------------------------------
// IMPRESSION TRACKING
// ----------------------------------------------------------------------------

export const recordImpression = onCall(async (request) => {
  const { adId, placement } = request.data;
  
  if (!adId || !placement) {
    throw new HttpsError('invalid-argument', 'Ad ID and Placement are required');
  }

  // Deduplication check (simple example: using IP/Hash could be done here)
  const eventHash = `imp_${adId}_${Date.now()}_${Math.random().toString(36).substring(7)}`;

  await db.collection('ad_events').add({
    ad_id: adId,
    event_type: 'impression',
    placement: placement,
    timestamp: new Date().toISOString(),
    event_hash: eventHash
  });

  // Increment aggregate analytics
  const analyticsRef = db.collection('ad_analytics').doc(adId);
  await db.runTransaction(async (t: any) => {
    const doc = await t.get(analyticsRef);
    if (!doc.exists) {
      t.set(analyticsRef, { ad_id: adId, impressions: 1, clicks: 0, ctr: 0 });
    } else {
      const current = doc.data();
      const impressions = (current?.impressions || 0) + 1;
      const clicks = current?.clicks || 0;
      const ctr = (clicks / impressions) * 100;
      t.update(analyticsRef, { impressions, ctr });
    }
  });

  return { success: true };
});

// ----------------------------------------------------------------------------
// CLICK TRACKING (HTTP Redirect)
// ----------------------------------------------------------------------------

export const clickAd = onRequest(async (req, res) => {
  const adId = req.query.id as string;
  
  if (!adId) {
    res.status(400).send("Missing ad ID");
    return;
  }

  const adDoc = await db.collection('ads').doc(adId).get();
  
  if (!adDoc.exists) {
    res.status(404).send("Ad not found");
    return;
  }

  const ad = adDoc.data();
  const now = new Date().toISOString();

  // Validate eligible
  if (ad?.status !== 'LIVE' || ad?.start_at > now || ad?.end_at <= now) {
    // If expired, maybe still redirect but don't charge? 
    // Usually, we redirect anyway for UX but don't count it.
  }

  // Record click event
  const eventHash = `click_${adId}_${Date.now()}`;
  await db.collection('ad_events').add({
    ad_id: adId,
    event_type: 'click',
    placement: ad?.placement || 'UNKNOWN',
    timestamp: now,
    event_hash: eventHash
  });

  // Increment analytics
  const analyticsRef = db.collection('ad_analytics').doc(adId);
  await db.runTransaction(async (t: any) => {
    const doc = await t.get(analyticsRef);
    if (doc.exists) {
      const current = doc.data();
      const impressions = current?.impressions || 1;
      const clicks = (current?.clicks || 0) + 1;
      const ctr = (clicks / impressions) * 100;
      t.update(analyticsRef, { clicks, ctr });
    }
  });

  // Perform secure redirect
  res.redirect(302, ad?.destination_url || '/');
});

// ----------------------------------------------------------------------------
// ADMIN OPERATIONS
// ----------------------------------------------------------------------------

export const approveAd = onCall(async (request) => {
  // Verify admin
  if (!request.auth || !request.auth.token.admin) {
    throw new HttpsError('permission-denied', 'Only admins can approve ads.');
  }

  const { adId } = request.data;
  await db.collection('ads').doc(adId).update({
    review_status: 'APPROVED',
    status: 'PAYMENT_PENDING' // Moves to payment pending
  });

  return { success: true };
});

// Add more functions: rejectAd, createOrder, verifyPaymentWebhook, etc.
