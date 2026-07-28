import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export const hasRealFirebaseConfig = !!import.meta.env.VITE_FIREBASE_API_KEY;

export const app = hasRealFirebaseConfig ? initializeApp(firebaseConfig) : null as any;
export const auth = hasRealFirebaseConfig ? getAuth(app) : null as any;
export const db = hasRealFirebaseConfig ? getFirestore(app) : null as any;
