import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const isConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.apiKey.length > 5);

export let app: FirebaseApp;
export let db: Firestore;
export let auth: Auth;
export let storage: FirebaseStorage;
export let adminApp: FirebaseApp;
export let adminAuth: Auth;
export let adminDb: Firestore;

try {
  if (!isConfigured) throw new Error("Firebase not configured");
  
  app = initializeApp(firebaseConfig, 'portfolio-public');
  db = getFirestore(app);
  auth = getAuth(app);
  storage = getStorage(app);

  const adminConfig = {
    ...firebaseConfig,
    appId: import.meta.env.VITE_FIREBASE_ADMIN_APP_ID || firebaseConfig.appId
  };

  adminApp = initializeApp(adminConfig, 'portfolio-dashboard');
  adminAuth = getAuth(adminApp);
  adminDb = getFirestore(adminApp);
} catch (error) {
  console.warn("Firebase initialization skipped or failed. Using mock objects.", error);
  // Create mock objects to prevent UI crashes when variables are missing
  app = {} as FirebaseApp;
  db = {} as Firestore;
  auth = { onAuthStateChanged: () => () => {}, currentUser: null } as unknown as Auth;
  storage = {} as FirebaseStorage;
  adminApp = {} as FirebaseApp;
  adminAuth = { onAuthStateChanged: () => () => {}, currentUser: null } as unknown as Auth;
  adminDb = {} as Firestore;
}
