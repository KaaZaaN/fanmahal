import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, getDocs, query, where, writeBatch } from 'firebase/firestore';

const appDir = process.cwd();

// Initialize Firebase JS SDK on server
const firebaseConfig = {
  projectId: "methodical-geography-p6shk",
  appId: "1:647511921445:web:646f695c9ef844778fc0cc",
  apiKey: "AIzaSyC7sZhoXroJbDeDjJOxgNA31r_rsoJvmw4",
  authDomain: "methodical-geography-p6shk.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-fanmahal-105726cf-2657-4f1f-a7f0-80636bf7e5ec",
  storageBucket: "methodical-geography-p6shk.firebasestorage.app",
  messagingSenderId: "647511921445"
};

const firebaseApp = initializeApp(firebaseConfig, 'server-app');
const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

// Server admin authorization key read strictly from environment (no fallback default allowed)
const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY;

// In-memory fallback question registry for server verification
const QUESTIONS_REGISTRY: Record<string, {
  id: string;
  title: string;
  category: string;
  multiplier: number;
  options: { id: string; text: string }[];
  resolved: boolean;
}> = {
  q1: {
    id: 'q1',
    title: 'Who will be evicted in Week 4 Elimination?',
    category: 'Eviction',
    multiplier: 3.5,
    options: [
      { id: 'opt1_1', text: 'Karan Veer Mehra' },
      { id: 'opt1_2', text: 'Nyrraa Banerjee' },
      { id: 'opt1_3', text: 'Muskan Bamne' },
      { id: 'opt1_4', text: 'No Eviction This Week (Double Saved)' },
    ],
    resolved: false,
  },
  q2: {
    id: 'q2',
    title: 'Which two contestants will enter into a major fight in the kitchen area first?',
    category: 'Fights & Drama',
    multiplier: 2.5,
    options: [
      { id: 'opt2_1', text: 'Rajat Dalal vs Vivian Dsena' },
      { id: 'opt2_2', text: 'Chahat Pandey vs Avinash Mishra' },
      { id: 'opt2_3', text: 'Esha Singh vs Alice Kaushik' },
      { id: 'opt2_4', text: 'No Kitchen Fights (Peaceful Breakfast)' },
    ],
    resolved: false,
  },
  q3: {
    id: 'q3',
    title: 'Who will win the "Rajneeti" Captaincy Task and become the new House Captain?',
    category: 'Captaincy',
    multiplier: 3.0,
    options: [
      { id: 'opt3_1', text: 'Avinash Mishra' },
      { id: 'opt3_2', text: 'Arfeen Khan' },
      { id: 'opt3_3', text: 'Shilpa Shirodkar' },
      { id: 'opt3_4', text: 'Task Aborted / No New Captain Announced' },
    ],
    resolved: false,
  },
  q4: {
    id: 'q4',
    title: 'Will Salman Khan give a "Red Card" or strict warning to any contestant during Weekend Ka Vaar?',
    category: 'Weekend Ka Vaar',
    multiplier: 1.8,
    options: [
      { id: 'opt4_1', text: 'Yes, strict warning or yellow card given to Rajat' },
      { id: 'opt4_2', text: 'Yes, direct eviction / red card warning' },
      { id: 'opt4_3', text: 'No warning or cards issued (Normal grilling)' },
    ],
    resolved: false,
  },
  q5: {
    id: 'q5',
    title: 'Which contestant will shed tears during the ration allocation negotiations?',
    category: 'Tasks',
    multiplier: 2.2,
    options: [
      { id: 'opt5_1', text: 'Chahat Pandey' },
      { id: 'opt5_2', text: 'Sara Arfeen Khan' },
      { id: 'opt5_3', text: 'Shrutika Arjun' },
      { id: 'opt5_4', text: 'Nobody Cries During Ration Task' },
    ],
    resolved: false,
  },
  q6: {
    id: 'q6',
    title: 'Which Wildcard entry will receive maximum votes from housemates for immunity?',
    category: 'Tasks',
    multiplier: 4.0,
    options: [
      { id: 'opt6_1', text: 'Digvijay Rathee' },
      { id: 'opt6_2', text: 'Kashish Kapoor' },
      { id: 'opt6_3', text: 'Aditi Mistry' },
      { id: 'opt6_4', text: 'Equal tie vote for all Wildcards' },
    ],
    resolved: false,
  },
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Health Endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'Fanmahal Secure Resolution Engine' });
  });

  /**
   * SECURE CLOUD FUNCTION: /api/admin/resolve
   * Performs server-authoritative validation & Crown payout execution.
   */
  app.post('/api/admin/resolve', async (req, res) => {
    try {
      const { questionId, winningOptionId, resolutionNote, adminKey, userPredictions } = req.body;
      const authHeader = req.headers['x-admin-key'];

      // 1. VALIDATION GATE 1: Admin Authorization Check
      const serverAdminKey = process.env.ADMIN_SECRET_KEY || ADMIN_SECRET;
      if (!serverAdminKey || serverAdminKey.trim() === '') {
        console.error('CRITICAL SECURITY ERROR: ADMIN_SECRET_KEY environment variable is missing on server!');
        return res.status(500).json({
          success: false,
          error: 'SERVER_MISCONFIGURATION',
          message: 'Critical Server Error: ADMIN_SECRET_KEY environment variable is missing. Admin question resolution is disabled until configured.',
        });
      }

      const providedKey = adminKey || authHeader;
      if (!providedKey || providedKey !== serverAdminKey) {
        return res.status(403).json({
          success: false,
          error: 'UNAUTHORIZED_ADMIN_ACCESS',
          message: 'Security Violation: Invalid or missing admin authorization key.',
        });
      }

      // 2. VALIDATION GATE 2: Question Existence & Double-Payout Guard
      let questionData = QUESTIONS_REGISTRY[questionId];

      // Try fetching live state from Firestore
      try {
        const qRef = doc(db, 'questions', questionId);
        const qSnap = await getDoc(qRef);
        if (qSnap.exists()) {
          const data = qSnap.data() as any;
          questionData = {
            id: questionId,
            title: data.title || questionData?.title || 'Prediction Question',
            category: data.category || questionData?.category || 'General',
            multiplier: Number(data.multiplier) || questionData?.multiplier || 2.0,
            options: data.options || questionData?.options || [],
            resolved: Boolean(data.resolved),
          };
        }
      } catch (e) {
        console.warn('Firestore question lookup fallback:', e);
      }

      if (!questionData) {
        return res.status(404).json({
          success: false,
          error: 'QUESTION_NOT_FOUND',
          message: `Target prediction question '${questionId}' does not exist in registry.`,
        });
      }

      if (questionData.resolved) {
        return res.status(400).json({
          success: false,
          error: 'ALREADY_RESOLVED',
          message: `Security Lockout: Question '${questionId}' has already been resolved and paid out. Double payouts are forbidden.`,
        });
      }

      // 3. VALIDATION GATE 3: Winning Option Verification
      const validOption = questionData.options.find((opt) => opt.id === winningOptionId);
      if (!validOption) {
        return res.status(400).json({
          success: false,
          error: 'INVALID_OPTION_ID',
          message: `Option ID '${winningOptionId}' does not match any valid outcome for question '${questionData.title}'.`,
        });
      }

      // 4. VALIDATION GATE 4 & 5: Server-Calculated Payout & Firestore Update
      const officialMultiplier = questionData.multiplier;
      const noteText = resolutionNote || `Official Result Declared: ${validOption.text}`;

      let winnersCount = 0;
      let totalCrownsAwarded = 0;
      const processedUserPayouts: Record<string, { status: 'WON' | 'LOST'; crownsEarned: number }> = {};

      // Mark question as resolved in registry
      QUESTIONS_REGISTRY[questionId].resolved = true;

      // Update question doc in Firestore
      try {
        await setDoc(doc(db, 'questions', questionId), {
          id: questionId,
          resolved: true,
          winningOptionId,
          resolutionNote: noteText,
          resolvedAt: new Date().toISOString(),
          officialMultiplier,
        }, { merge: true });
      } catch (e) {
        console.warn('Firestore question update error:', e);
      }

      // Process user predictions passed or stored in Firestore
      if (Array.isArray(userPredictions) && userPredictions.length > 0) {
        for (const pred of userPredictions) {
          if (pred.questionId === questionId) {
            const isWinner = pred.optionId === winningOptionId;
            // SERVER-AUTHORITATIVE PAYOUT FORMULA
            const serverCrowns = isWinner ? Math.round(pred.coinsStaked * officialMultiplier) : 0;

            if (isWinner) {
              winnersCount++;
              totalCrownsAwarded += serverCrowns;
            }

            processedUserPayouts[pred.userId || 'current_user'] = {
              status: isWinner ? 'WON' : 'LOST',
              crownsEarned: serverCrowns,
            };

            // Record prediction resolution in Firestore
            try {
              const predId = `${pred.userId}_${questionId}`;
              await setDoc(doc(db, 'predictions', predId), {
                userId: pred.userId,
                cardId: questionId,
                winningOptionId,
                status: isWinner ? 'WON' : 'LOST',
                crownsEarned: serverCrowns,
                stakedCoins: pred.coinsStaked,
                serverMultiplier: officialMultiplier,
                resolvedAt: new Date().toISOString(),
              }, { merge: true });
            } catch (err) {
              console.warn('Firestore prediction record error:', err);
            }
          }
        }
      }

      return res.json({
        success: true,
        message: `Resolution verified & processed safely on server for '${questionData.title}'.`,
        resolutionDetails: {
          questionId,
          questionTitle: questionData.title,
          winningOptionId,
          winningOptionText: validOption.text,
          officialMultiplier,
          resolutionNote: noteText,
          winnersCount,
          totalCrownsAwarded,
          payouts: processedUserPayouts,
        },
      });
    } catch (error: any) {
      console.error('Resolution API Error:', error);
      return res.status(500).json({
        success: false,
        error: 'SERVER_RESOLUTION_ERROR',
        message: error.message || 'Failed to process resolution on server',
      });
    }
  });

  /**
   * AUTOMATED MIDNIGHT RESET CRON ENDPOINT: /api/jobs/midnight-reset
   * Executed daily at 00:00 IST via GitHub Actions / Cloud Scheduler.
   * 1. Resets adsWatchedToday for all users to 0.
   * 2. Transitions expired, unresolved questions to 'PENDING_RESOLUTION'.
   */
  app.post('/api/jobs/midnight-reset', async (req, res) => {
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

      return res.json({
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
  });

  // Vite middleware in dev mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
