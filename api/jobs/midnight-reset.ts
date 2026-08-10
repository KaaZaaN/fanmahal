import { collection, getDocs, writeBatch, query, where } from 'firebase/firestore';
import { db, ADMIN_SECRET } from '../_lib/firebaseServer.js';
import { QUESTIONS_REGISTRY } from '../_lib/questions.js';

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
        message: 'Critical Server Error: ADMIN_SECRET_KEY is missing on server.',
      });
    }

    const providedKey = bodyKey || authHeader;
    if (!providedKey || providedKey !== serverAdminKey) {
      return res.status(403).json({
        success: false,
        error: 'UNAUTHORIZED_JOB_TRIGGER',
        message: 'Security Violation: Invalid or missing authorization key for reset job.',
      });
    }

    const nowIso = new Date().toISOString();
    const nowMs = Date.now();
    const todayIST = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });

    let usersResetCount = 0;
    let questionsTransitionedCount = 0;

    // 1. BATCH RESET AD COUNTERS FOR ALL USERS
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      if (!usersSnap.empty) {
        const userBatch = writeBatch(db);
        usersSnap.forEach((userDoc) => {
          userBatch.update(userDoc.ref, {
            adsWatchedToday: 0,
            lastAdResetDate: todayIST,
          });
          usersResetCount++;
        });
        await userBatch.commit();
      }
    } catch (err) {
      console.warn('Firestore users batch reset warning:', err);
    }

    // 2. BATCH TRANSITION EXPIRED UNRESOLVED QUESTIONS TO 'PENDING_RESOLUTION'
    try {
      const qQuery = query(collection(db, 'questions'), where('resolved', '==', false));
      const qSnap = await getDocs(qQuery);
      if (!qSnap.empty) {
        const qBatch = writeBatch(db);
        qSnap.forEach((qDoc) => {
          const data = qDoc.data();
          const deadlineTs = Number(data.deadlineTimestamp) || 0;
          if (deadlineTs > 0 && deadlineTs <= nowMs && data.status !== 'PENDING_RESOLUTION') {
            qBatch.update(qDoc.ref, {
              status: 'PENDING_RESOLUTION',
              pendingResolution: true,
              updatedAt: nowIso,
            });
            questionsTransitionedCount++;

            if (QUESTIONS_REGISTRY[qDoc.id]) {
              (QUESTIONS_REGISTRY[qDoc.id] as any).status = 'PENDING_RESOLUTION';
            }
          }
        });
        if (questionsTransitionedCount > 0) {
          await qBatch.commit();
        }
      }
    } catch (err) {
      console.warn('Firestore questions status transition warning:', err);
    }

    return res.status(200).json({
      success: true,
      message: 'Midnight reset executed successfully.',
      timestamp: nowIso,
      resetDateIST: todayIST,
      stats: {
        usersResetCount,
        questionsTransitionedCount,
      },
    });
  } catch (error: any) {
    console.error('Midnight Reset Job Error:', error);
    return res.status(500).json({
      success: false,
      error: 'MIDNIGHT_RESET_FAILED',
      message: error.message || 'Failed to complete midnight reset job.',
    });
  }
}
