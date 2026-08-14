import { getAdminFirestore, FieldValue } from './_lib/firebaseAdmin.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'METHOD_NOT_ALLOWED',
      message: 'Method not allowed. Only POST requests are accepted.',
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { email, source } = body;

    // 1. Email validation
    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'EMAIL_REQUIRED',
        message: 'A valid email address is required.',
      });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_EMAIL_FORMAT',
        message: 'Please provide a valid email format.',
      });
    }

    // 2. Initialize Firestore using Firebase Admin SDK
    const firestore = getAdminFirestore();

    // 3. Perform atomic batch write:
    //    a. Insert new waitlist document with metadata
    //    b. Increment public_stats/waitlist_counter.count by 1
    const batch = firestore.batch();
    const waitlistDocRef = firestore.collection('waitlist').doc();
    
    batch.set(waitlistDocRef, {
      email: trimmedEmail,
      createdAt: new Date().toISOString(),
      timestamp: FieldValue.serverTimestamp(),
      source: typeof source === 'string' && source ? source : 'coming_soon_landing',
    });

    const counterDocRef = firestore.collection('public_stats').doc('waitlist_counter');
    batch.set(
      counterDocRef,
      {
        count: FieldValue.increment(1),
        lastUpdated: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    await batch.commit();

    return res.status(200).json({
      success: true,
      message: 'Successfully registered for early access waitlist.',
      id: waitlistDocRef.id,
    });
  } catch (error: any) {
    console.error('Waitlist API Error:', error);
    return res.status(500).json({
      success: false,
      error: 'WAITLIST_REGISTRATION_FAILED',
      message: error?.message || 'Internal server error while processing waitlist registration.',
    });
  }
}
