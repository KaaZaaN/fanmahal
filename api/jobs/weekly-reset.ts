import { collection, getDocs, writeBatch } from 'firebase/firestore';
import { db, ADMIN_SECRET } from '../_lib/firebaseServer.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'METHOD_NOT_ALLOWED', message: 'Only POST allowed' });
  }

  try {
    const authHeader = req.headers['x-admin-key'];
    const bodyKey = req.body?.adminKey;
    const serverAdminKey = process.env.ADMIN_SECRET_KEY || ADMIN_SECRET;

    if (!serverAdminKey || serverAdminKey.trim() === '') {
      return res.status(500).json({
        success: false,
        error: 'SERVER_MISCONFIGURATION',
        message: 'Critical Server Error: ADMIN_SECRET_KEY environment variable is missing on server.',
      });
    }

    const providedKey = bodyKey || authHeader;
    if (!providedKey || providedKey !== serverAdminKey) {
      return res.status(403).json({
        success: false,
        error: 'UNAUTHORIZED_JOB_TRIGGER',
        message: 'Security Violation: Invalid or missing authorization key for weekly reset job.',
      });
    }

    const nowIso = new Date().toISOString();
    let usersRefreshedCount = 0;

    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      if (!usersSnap.empty) {
        const userBatch = writeBatch(db);
        usersSnap.forEach((userDoc) => {
          userBatch.update(userDoc.ref, {
            weeklyRefreshAvailable: true,
            adsWatchedThisWeek: 0,
            referralsThisWeek: 0,
            lastWeeklyResetDate: nowIso,
          });
          usersRefreshedCount++;
        });
        await userBatch.commit();
      }
    } catch (err) {
      console.warn('Firestore weekly reset warning:', err);
    }

    return res.status(200).json({
      success: true,
      message: 'Weekly refresh reset executed successfully.',
      timestamp: nowIso,
      stats: { usersRefreshedCount },
    });
  } catch (error: any) {
    console.error('Weekly Reset Job Error:', error);
    return res.status(500).json({
      success: false,
      error: 'WEEKLY_RESET_FAILED',
      message: error.message || 'Failed to complete weekly reset job.',
    });
  }
}
