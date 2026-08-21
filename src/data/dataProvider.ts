import { db } from '../lib/firebase';
import { collection, getDocs, doc, getDoc, Firestore, query, orderBy } from 'firebase/firestore';

// Local Fallbacks
import { profileData as localProfile } from './profile';
import { portfolioProjects as localProjects } from './projects';
import { tutorialsData as localTutorials } from './tutorials';
import { adsData as localAds } from './ads';
import { socialLinks as localSocials } from './socials';

export const dataProvider = {
  async getProfile() {
    if (!db) return localProfile;
    try {
      const docRef = doc(db as Firestore, 'profile', 'main');
      const snap = await getDoc(docRef);
      if (!snap.exists()) return localProfile;
      return snap.data();
    } catch {
      return localProfile;
    }
  },

  async getProjects() {
    if (!db) return localProjects;
    try {
      const q = query(collection(db as Firestore, 'projects'), orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return localProjects;
      
      const projects = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter((p: any) => {
          // If no status or isVisible is provided, default to showing it for backwards compatibility
          if (p.isVisible === undefined && p.status === undefined) return true;
          const isPublished = p.status === 'published' || (!p.status && p.isVisible !== false);
          return isPublished && p.archived !== true;
        });
        
      return projects.length > 0 ? projects : localProjects;
    } catch {
      return localProjects;
    }
  },

  async getTutorials() {
    if (!db) return localTutorials;
    try {
      const q = query(collection(db as Firestore, 'tutorials'), orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return localTutorials;
      
      return snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter((t: any) => {
          const isPublished = t.status === 'published' || (!t.status && t.isVisible === true);
          return isPublished && t.isVisible === true && t.archived !== true;
        });
    } catch {
      return localTutorials;
    }
  },

  async getAds() {
    if (!db) return localAds;
    try {
      const q = query(collection(db as Firestore, 'ads'), orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return localAds;
      return snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter((a: any) => a.isVisible === true && a.archived !== true);
    } catch {
      return localAds;
    }
  },

  async getSocials() {
    if (!db) return localSocials;
    try {
      const q = query(collection(db as Firestore, 'socials'), orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return localSocials;
      return snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter((s: any) => {
          const isPublished = s.status === 'published' || (!s.status && s.isVisible === true);
          return isPublished && s.isVisible === true && s.archived !== true;
        });
    } catch {
      return localSocials;
    }
  },

  async getMedia() {
    if (!db) return [];
    try {
      const q = query(collection(db as Firestore, 'media'), orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return [];
      return snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter((m: any) => {
          const isPublished = m.status === 'published' || (!m.status && m.isVisible === true);
          return isPublished && m.isVisible === true && m.archived !== true;
        });
    } catch {
      return [];
    }
  },

  async getSettings() {
    if (!db) return null;
    try {
      const docRef = doc(db as Firestore, 'settings', 'public');
      const snap = await getDoc(docRef);
      if (!snap.exists()) return null;
      return snap.data();
    } catch {
      return null;
    }
  }
};
