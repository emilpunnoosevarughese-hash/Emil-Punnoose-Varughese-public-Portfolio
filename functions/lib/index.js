"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.approveAd = exports.clickAd = exports.recordImpression = exports.getActiveAds = void 0;
const https_1 = require("firebase-functions/v2/https");
const admin = __importStar(require("firebase-admin"));
const firestore_1 = require("firebase-admin/firestore");
admin.initializeApp();
const db = (0, firestore_1.getFirestore)();
// ----------------------------------------------------------------------------
// PUBLIC AD SERVING
// ----------------------------------------------------------------------------
exports.getActiveAds = (0, https_1.onCall)(async (request) => {
    const { placement } = request.data;
    if (!placement) {
        throw new https_1.HttpsError('invalid-argument', 'Placement is required');
    }
    const now = new Date().toISOString();
    // We query all LIVE ads for the placement, but then strictly verify server-side
    const adsSnapshot = await db.collection('ads')
        .where('status', '==', 'LIVE')
        .where('placement', '==', placement)
        .get();
    const eligibleAds = [];
    adsSnapshot.forEach((doc) => {
        const ad = doc.data();
        // Server-side verification (source of truth)
        if (ad.status === 'LIVE' &&
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
exports.recordImpression = (0, https_1.onCall)(async (request) => {
    const { adId, placement } = request.data;
    if (!adId || !placement) {
        throw new https_1.HttpsError('invalid-argument', 'Ad ID and Placement are required');
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
    await db.runTransaction(async (t) => {
        const doc = await t.get(analyticsRef);
        if (!doc.exists) {
            t.set(analyticsRef, { ad_id: adId, impressions: 1, clicks: 0, ctr: 0 });
        }
        else {
            const current = doc.data();
            const impressions = ((current === null || current === void 0 ? void 0 : current.impressions) || 0) + 1;
            const clicks = (current === null || current === void 0 ? void 0 : current.clicks) || 0;
            const ctr = (clicks / impressions) * 100;
            t.update(analyticsRef, { impressions, ctr });
        }
    });
    return { success: true };
});
// ----------------------------------------------------------------------------
// CLICK TRACKING (HTTP Redirect)
// ----------------------------------------------------------------------------
exports.clickAd = (0, https_1.onRequest)(async (req, res) => {
    const adId = req.query.id;
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
    if ((ad === null || ad === void 0 ? void 0 : ad.status) !== 'LIVE' || (ad === null || ad === void 0 ? void 0 : ad.start_at) > now || (ad === null || ad === void 0 ? void 0 : ad.end_at) <= now) {
        // If expired, maybe still redirect but don't charge? 
        // Usually, we redirect anyway for UX but don't count it.
    }
    // Record click event
    const eventHash = `click_${adId}_${Date.now()}`;
    await db.collection('ad_events').add({
        ad_id: adId,
        event_type: 'click',
        placement: (ad === null || ad === void 0 ? void 0 : ad.placement) || 'UNKNOWN',
        timestamp: now,
        event_hash: eventHash
    });
    // Increment analytics
    const analyticsRef = db.collection('ad_analytics').doc(adId);
    await db.runTransaction(async (t) => {
        const doc = await t.get(analyticsRef);
        if (doc.exists) {
            const current = doc.data();
            const impressions = (current === null || current === void 0 ? void 0 : current.impressions) || 1;
            const clicks = ((current === null || current === void 0 ? void 0 : current.clicks) || 0) + 1;
            const ctr = (clicks / impressions) * 100;
            t.update(analyticsRef, { clicks, ctr });
        }
    });
    // Perform secure redirect
    res.redirect(302, (ad === null || ad === void 0 ? void 0 : ad.destination_url) || '/');
});
// ----------------------------------------------------------------------------
// ADMIN OPERATIONS
// ----------------------------------------------------------------------------
exports.approveAd = (0, https_1.onCall)(async (request) => {
    // Verify admin
    if (!request.auth || !request.auth.token.admin) {
        throw new https_1.HttpsError('permission-denied', 'Only admins can approve ads.');
    }
    const { adId } = request.data;
    await db.collection('ads').doc(adId).update({
        review_status: 'APPROVED',
        status: 'PAYMENT_PENDING' // Moves to payment pending
    });
    return { success: true };
});
// Add more functions: rejectAd, createOrder, verifyPaymentWebhook, etc.
//# sourceMappingURL=index.js.map