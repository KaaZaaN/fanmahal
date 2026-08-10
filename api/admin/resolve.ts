import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, ADMIN_SECRET } from '../_lib/firebaseServer.js';
import { QUESTIONS_REGISTRY } from '../_lib/questions.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'METHOD_NOT_ALLOWED', message: 'Only POST allowed' });
  }

  try {
    const { questionId, winningOptionId, resolutionNote, adminKey, userPredictions } = req.body || {};
    const authHeader = req.headers['x-admin-key'];

    // 1. VALIDATION GATE 1: Admin Authorization Check
    const serverAdminKey = process.env.ADMIN_SECRET_KEY || ADMIN_SECRET;
    if (!serverAdminKey || serverAdminKey.trim() === '') {
      return res.status(500).json({
        success: false,
        error: 'SERVER_MISCONFIGURATION',
        message: 'Critical Server Error: ADMIN_SECRET_KEY environment variable is missing on server.',
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
    if (!QUESTIONS_REGISTRY[questionId]) {
      QUESTIONS_REGISTRY[questionId] = questionData;
    }
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
          const serverCrowns = isWinner ? Math.round(pred.coinsStaked * officialMultiplier) : 0;

          if (isWinner) {
            winnersCount++;
            totalCrownsAwarded += serverCrowns;
          }

          processedUserPayouts[pred.userId || 'current_user'] = {
            status: isWinner ? 'WON' : 'LOST',
            crownsEarned: serverCrowns,
          };

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

    return res.status(200).json({
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
}
