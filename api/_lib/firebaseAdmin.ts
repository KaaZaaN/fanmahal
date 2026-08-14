import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import firebaseConfig from '../../firebase-applet-config.json' with { type: 'json' };

let adminApp: App | null = null;

export function getFirebaseAdmin(): App {
  const existingApps = getApps();
  if (existingApps.length > 0 && existingApps[0]) {
    adminApp = existingApps[0];
    return adminApp;
  }

  // 1. Check for single JSON string environment variable (Recommended in Vercel)
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (serviceAccountJson) {
    try {
      const parsed = typeof serviceAccountJson === 'string' ? JSON.parse(serviceAccountJson) : serviceAccountJson;
      adminApp = initializeApp({
        credential: cert(parsed),
        projectId: parsed.project_id || firebaseConfig.projectId,
      });
      return adminApp;
    } catch (err) {
      console.warn('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY JSON:', err);
    }
  }

  // 2. Check for individual environment variables
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const projectId = process.env.FIREBASE_PROJECT_ID || firebaseConfig.projectId;

  if (clientEmail && privateKey) {
    adminApp = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      projectId,
    });
    return adminApp;
  }

  // 3. Fallback to default credentials or project ID initialization
  try {
    adminApp = initializeApp({
      projectId,
    });
    return adminApp;
  } catch {
    adminApp = initializeApp();
    return adminApp;
  }
}

export function getAdminFirestore() {
  getFirebaseAdmin();
  return getFirestore();
}

export { FieldValue };
