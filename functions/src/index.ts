import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import * as logger from 'firebase-functions/logger';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const app = initializeApp();
const DATABASE_ID = 'ai-studio-fanmahal-105726cf-2657-4f1f-a7f0-80636bf7e5ec';
const db = getFirestore(app, DATABASE_ID);

/**
 * Triggered automatically when a new document is created in the /waitlist collection.
 * Atomically increments /public_stats/waitlist_counter.count by 1 via Firebase Admin SDK.
 * Bypasses client security rules (which are set to allow write: if false).
 */
export const onWaitlistSignup = onDocumentCreated(
  {
    document: 'waitlist/{entryId}',
    database: DATABASE_ID,
  },
  async (event) => {
    const snap = event.data;
    if (!snap) {
      logger.warn('No snapshot associated with the waitlist event');
      return;
    }

    const newEntry = snap.data();
    logger.info(`New waitlist signup received: ${snap.id}`, { email: newEntry?.email });

    const counterRef = db.collection('public_stats').doc('waitlist_counter');

    try {
      await counterRef.set(
        {
          count: FieldValue.increment(1),
          lastUpdated: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
      logger.info(`Successfully incremented /public_stats/waitlist_counter for signup: ${snap.id}`);
    } catch (error) {
      logger.error('Failed to increment waitlist counter:', error);
      throw error;
    }
  }
);