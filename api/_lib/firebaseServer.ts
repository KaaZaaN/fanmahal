import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "methodical-geography-p6shk",
  appId: "1:647511921445:web:646f695c9ef844778fc0cc",
  apiKey: "AIzaSyC7sZhoXroJbDeDjJOxgNA31r_rsoJvmw4",
  authDomain: "methodical-geography-p6shk.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-fanmahal-105726cf-2657-4f1f-a7f0-80636bf7e5ec",
  storageBucket: "methodical-geography-p6shk.firebasestorage.app",
  messagingSenderId: "647511921445"
};

const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);
export const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || 'fanmahal_admin_secret_2026';
