export type AdStatus = 'DRAFT' | 'PENDING_REVIEW' | 'REJECTED' | 'APPROVED' | 'PAYMENT_PENDING' | 'SCHEDULED' | 'LIVE' | 'PAUSED' | 'EXPIRED' | 'CANCELLED';
export type AdPlacement = 'LEARNING_HUB_BANNER' | 'LEARNING_HUB_FEATURED' | 'SIDEBAR' | 'PREMIUM_PARTNER';

export interface Advertiser {
  id: string; // Auth UID
  name: string;
  company_name: string;
  email: string;
  phone?: string;
  status: 'ACTIVE' | 'SUSPENDED';
  created_at: string;
  updated_at: string;
}

export interface Ad {
  id: string;
  advertiser_id: string;
  title: string;
  description: string;
  image_url: string;
  destination_url: string;
  cta_text: string;
  category: string;
  placement: AdPlacement;
  status: AdStatus;
  review_status: 'PENDING' | 'APPROVED' | 'REJECTED';
  start_at: string; // ISO String UTC
  end_at: string; // ISO String UTC
  weight: number;
  package_id?: string;
  created_at: string;
  updated_at: string;
}

export interface AdPackage {
  id: string;
  name: string;
  placement: AdPlacement;
  duration_days: number;
  price: number;
  currency: string;
  is_active: boolean;
  features: string[];
}

export interface AdOrder {
  id: string;
  advertiser_id: string;
  ad_id: string;
  package_id: string;
  amount: number;
  currency: string;
  payment_status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  payment_reference?: string;
  created_at: string;
  updated_at: string;
}

export interface AdEvent {
  id: string;
  ad_id: string;
  event_type: 'impression' | 'click';
  placement: AdPlacement;
  timestamp: string;
  event_hash: string;
  ip_address?: string; // Optional, only stored securely back-end for deduplication
}

export interface AdAnalytics {
  ad_id: string;
  impressions: number;
  clicks: number;
  ctr: number;
}
