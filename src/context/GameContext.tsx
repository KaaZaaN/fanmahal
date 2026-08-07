import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Question, UserPrediction, LeaderboardEntry, RealityShow } from '../types';
import { INITIAL_QUESTIONS, MOCK_LEADERBOARD } from '../data/mockData';
import confetti from 'canvas-confetti';
import { db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

interface GameContextType {
  user: UserProfile | null;
  questions: Question[];
  predictions: Record<string, UserPrediction>;
  leaderboard: LeaderboardEntry[];
  selectedShow: RealityShow;
  setSelectedShow: (show: RealityShow) => void;
  login: (
    email: string,
    username: string,
    avatar: string,
    titleBadge?: string,
    instagramHandle?: string,
    phoneNumber?: string,
    playTier?: 'SOLO' | 'SQUAD',
    squadName?: string
  ) => void;
  logout: () => void;
  updateProfile: (
    username: string,
    avatar: string,
    titleBadge: string,
    instagramHandle?: string,
    phoneNumber?: string,
    playTier?: 'SOLO' | 'SQUAD',
    squadName?: string
  ) => void;
  placePrediction: (questionId: string, optionId: string, coinsStaked: number) => { success: boolean; message: string };
  cancelPrediction: (questionId: string) => void;
  claimWeeklyCoins: () => void;
  watchRewardAd: () => { success: boolean; message: string };
  claimReferralBonus: (codeEntered: string) => { success: boolean; message: string };
  simulateResolveQuestion: (
    questionId: string,
    winningOptionId: string,
    resolutionNote: string,
    adminKey?: string
  ) => Promise<{ success: boolean; message: string }>;
  resetDemoData: () => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  showAdModal: boolean;
  setShowAdModal: (show: boolean) => void;
  showReferralModal: boolean;
  setShowReferralModal: (show: boolean) => void;
  showSimulatorModal: boolean;
  setShowSimulatorModal: (show: boolean) => void;
  activeSimulatorQuestionId: string | null;
  setActiveSimulatorQuestionId: (id: string | null) => void;
  showRaffleModal: boolean;
  setShowRaffleModal: (show: boolean) => void;
  customLogoUrl: string | null;
  setCustomLogoUrl: (url: string | null) => void;
}

const DEFAULT_USER: UserProfile = {
  id: 'usr_default',
  email: 'salmanfan@fanmahal.in',
  username: '@BiggBossRaja',
  instagramHandle: '@BiggBossRaja_Official',
  phoneNumber: '+91 98765 43210',
  avatar: '👑',
  titleBadge: 'Royal Predictor',
  fanCoins: 800,
  crowns: 8250,
  monthlyCrowns: 6400,
  weeklyRefreshAvailable: true,
  adsWatchedThisWeek: 1,
  referralsThisWeek: 2,
  totalReferrals: 3,
  referralCode: 'PALACE-782',
  joinedDate: 'Aug 2026',
};

const GameContext = createContext<GameContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_USER = 'fanmahal_user_v2';
const LOCAL_STORAGE_KEY_QUESTIONS = 'fanmahal_questions_v2';
const LOCAL_STORAGE_KEY_PREDICTIONS = 'fanmahal_predictions_v2';

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_USER);
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [questions, setQuestions] = useState<Question[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_QUESTIONS);
      return saved ? JSON.parse(saved) : INITIAL_QUESTIONS;
    } catch {
      return INITIAL_QUESTIONS;
    }
  });

  const [predictions, setPredictions] = useState<Record<string, UserPrediction>>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PREDICTIONS);
      if (saved) return JSON.parse(saved);
      // default 1 active prediction for demo feel
      return {
        q2: {
          questionId: 'q2',
          optionId: 'opt2_1',
          coinsStaked: 100,
          potentialCrowns: 250,
          timestamp: Date.now() - 3600000,
          status: 'PENDING',
        }
      };
    } catch {
      return {};
    }
  });

  const [selectedShow, setSelectedShow] = useState<RealityShow>('BIGG_BOSS');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [showSimulatorModal, setShowSimulatorModal] = useState(false);
  const [showRaffleModal, setShowRaffleModal] = useState(false);
  const [activeSimulatorQuestionId, setActiveSimulatorQuestionId] = useState<string | null>(null);
  const [customLogoUrl, setCustomLogoUrlState] = useState<string | null>(() => {
    return localStorage.getItem('fanmahal_custom_logo') || null;
  });

  const setCustomLogoUrl = (url: string | null) => {
    setCustomLogoUrlState(url);
    if (url) {
      localStorage.setItem('fanmahal_custom_logo', url);
    } else {
      localStorage.removeItem('fanmahal_custom_logo');
    }
  };

  // Lazy Self-Healing Catch-Up Guard (Executes automatically on initial load or user action)
  useEffect(() => {
    const todayIST = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });

    // 1. Lazy catch-up for User Ad Reset
    if (user && user.lastAdResetDate !== todayIST) {
      setUser((prev) =>
        prev
          ? {
              ...prev,
              adsWatchedToday: 0,
              lastAdResetDate: todayIST,
            }
          : null
      );
    }

    // 2. Lazy catch-up for Question Deadline Expiry Transition
    const nowMs = Date.now();
    setQuestions((prevQuestions) => {
      let needsUpdate = false;
      const updated = prevQuestions.map((q) => {
        if (!q.resolved && q.deadlineTimestamp > 0 && q.deadlineTimestamp <= nowMs && q.status !== 'PENDING_RESOLUTION') {
          needsUpdate = true;
          return {
            ...q,
            status: 'PENDING_RESOLUTION' as const,
          };
        }
        return q;
      });
      return needsUpdate ? updated : prevQuestions;
    });
  }, [user?.lastAdResetDate]);

  // Sync to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY_USER);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_QUESTIONS, JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREDICTIONS, JSON.stringify(predictions));
  }, [predictions]);

  // Compute leaderboard with current user dynamic crowns
  const leaderboard: LeaderboardEntry[] = React.useMemo(() => {
    const list = [...MOCK_LEADERBOARD];
    if (user) {
      const userPreds = Object.values(predictions) as UserPrediction[];
      const wonPreds = userPreds.filter((p) => p.status === 'WON').length;
      const totalPreds = userPreds.length;
      const winRate = totalPreds > 0 ? Math.round((wonPreds / totalPreds) * 100) : 0;

      const userEntry: LeaderboardEntry = {
        rank: 0,
        id: user.id,
        username: user.username,
        avatar: user.avatar,
        titleBadge: user.titleBadge,
        crowns: user.crowns,
        predictionsWon: wonPreds + 3, // demo history boost
        totalPredictions: totalPreds + 4,
        winRate: winRate || 75,
        isCurrentUser: true,
      };

      // Filter out if user exists in list
      const filtered = list.filter((e) => e.username.toLowerCase() !== user.username.toLowerCase());
      filtered.push(userEntry);
      filtered.sort((a, b) => b.crowns - a.crowns);

      // Re-assign rank numbers
      return filtered.map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }));
    }
    return list;
  }, [user, predictions]);

  const login = (
    email: string,
    username: string,
    avatar: string,
    titleBadge: string = 'Royal Fan',
    instagramHandle?: string,
    phoneNumber?: string
  ) => {
    const formattedHandle = username.startsWith('@') ? username : `@${username}`;
    const formattedIg = instagramHandle
      ? (instagramHandle.startsWith('@') ? instagramHandle : `@${instagramHandle}`)
      : `@${username.replace(/^@/, '')}_ig`;

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      email,
      username: formattedHandle,
      instagramHandle: formattedIg,
      phoneNumber: phoneNumber || '',
      avatar,
      titleBadge,
      fanCoins: 800,
      crowns: 500,
      monthlyCrowns: 500,
      weeklyRefreshAvailable: false,
      adsWatchedThisWeek: 0,
      referralsThisWeek: 0,
      totalReferrals: 0,
      referralCode: `PALACE-${Math.floor(100 + Math.random() * 900)}`,
      joinedDate: 'Aug 2026',
    };
    setUser(newUser);
    setShowAuthModal(false);

    // Asynchronously save user profile to Firestore
    try {
      setDoc(doc(db, 'users', newUser.id), {
        uid: newUser.id,
        displayName: newUser.username,
        email: newUser.email,
        fanCoins: newUser.fanCoins,
        crowns: newUser.crowns,
        createdAt: new Date().toISOString()
      }, { merge: true }).catch((e) => console.warn('Firestore user save warning:', e));
    } catch (e) {
      console.warn('Firestore user doc create error:', e);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (
    username: string,
    avatar: string,
    titleBadge: string,
    instagramHandle?: string,
    phoneNumber?: string
  ) => {
    if (!user) return;
    const formattedHandle = username.startsWith('@') ? username : `@${username}`;
    const formattedIg = instagramHandle
      ? (instagramHandle.startsWith('@') ? instagramHandle : `@${instagramHandle}`)
      : user.instagramHandle || `@${username.replace(/^@/, '')}_ig`;

    setUser({
      ...user,
      username: formattedHandle,
      instagramHandle: formattedIg,
      phoneNumber: phoneNumber !== undefined ? phoneNumber : user.phoneNumber,
      avatar,
      titleBadge,
    });
  };

  const placePrediction = (questionId: string, optionId: string, coinsStaked: number) => {
    if (!user) {
      setShowAuthModal(true);
      return { success: false, message: 'Please sign in to place predictions' };
    }

    if (coinsStaked <= 0) {
      return { success: false, message: 'Please enter a valid coin stake' };
    }

    const question = questions.find((q) => q.id === questionId);
    if (!question) {
      return { success: false, message: 'Question not found' };
    }

    if (question.resolved) {
      return { success: false, message: 'This question has already been resolved' };
    }

    const existingPred = predictions[questionId];
    const coinDiff = coinsStaked - (existingPred ? existingPred.coinsStaked : 0);

    if (user.fanCoins < coinDiff) {
      return { success: false, message: `Insufficient Fan Coins! You need ${coinDiff} more coins.` };
    }

    // Deduct coins & record prediction
    const potentialCrowns = Math.round(coinsStaked * question.multiplier);

    setUser((prev) => prev ? { ...prev, fanCoins: prev.fanCoins - coinDiff } : null);

    const newPred: UserPrediction = {
      questionId,
      optionId,
      coinsStaked,
      potentialCrowns,
      timestamp: Date.now(),
      status: 'PENDING',
    };

    setPredictions((prev) => ({
      ...prev,
      [questionId]: newPred,
    }));

    // Save prediction to Firestore
    try {
      const predDocId = `${user.id}_${questionId}`;
      setDoc(doc(db, 'predictions', predDocId), {
        userId: user.id,
        cardId: questionId,
        optionId,
        stakedCoins: coinsStaked,
        potentialCrowns,
        status: 'PENDING',
        createdAt: new Date().toISOString()
      }, { merge: true }).catch((e) => console.warn('Firestore prediction save warning:', e));
    } catch (e) {
      console.warn('Firestore prediction write error:', e);
    }

    return { success: true, message: `Prediction saved! ${coinsStaked} Fan Coins staked for ${potentialCrowns} potential Crowns.` };
  };

  const cancelPrediction = (questionId: string) => {
    const existingPred = predictions[questionId];
    if (!existingPred || existingPred.status !== 'PENDING') return;

    // Refund coins
    setUser((prev) => prev ? { ...prev, fanCoins: prev.fanCoins + existingPred.coinsStaked } : null);

    setPredictions((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  };

  const claimWeeklyCoins = () => {
    if (!user || !user.weeklyRefreshAvailable) return;

    setUser({
      ...user,
      fanCoins: user.fanCoins + 800,
      weeklyRefreshAvailable: false,
      weeklyCoinsClaimedDate: new Date().toISOString(),
    });

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F5C542', '#FF1E94', '#22034D'],
    });
  };

  const watchRewardAd = () => {
    if (!user) return { success: false, message: 'Sign in required' };
    if (user.adsWatchedThisWeek >= 5) {
      return { success: false, message: 'Weekly reward ad cap reached (5/5 watched this week).' };
    }

    setUser({
      ...user,
      fanCoins: user.fanCoins + 100,
      adsWatchedThisWeek: user.adsWatchedThisWeek + 1,
    });

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#F5C542', '#34D399'],
    });

    return { success: true, message: '+100 Fan Coins added to your wallet!' };
  };

  const claimReferralBonus = (codeEntered: string) => {
    if (!user) return { success: false, message: 'Sign in required' };
    if (!codeEntered.trim()) {
      return { success: false, message: 'Please enter a valid referral code.' };
    }
    if (user.referralsThisWeek >= 5) {
      return { success: false, message: 'Weekly referral cap reached (5/5 referrals claimed).' };
    }

    setUser({
      ...user,
      fanCoins: user.fanCoins + 100,
      referralsThisWeek: user.referralsThisWeek + 1,
      totalReferrals: (user.totalReferrals !== undefined ? user.totalReferrals : user.referralsThisWeek) + 1,
    });

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#F5C542', '#FF1E94'],
    });

    return { success: true, message: 'Referral verified! +100 Fan Coins awarded to both you and your friend.' };
  };

  const simulateResolveQuestion = async (
    questionId: string,
    winningOptionId: string,
    resolutionNote: string,
    adminKey?: string
  ): Promise<{ success: boolean; message: string }> => {
    const targetQ = questions.find((q) => q.id === questionId);
    if (!targetQ) return { success: false, message: 'Question not found' };

    try {
      const predictionsPayload = (Object.values(predictions) as UserPrediction[]).map((p) => ({
        userId: user ? user.id : 'usr_default',
        questionId: p.questionId,
        optionId: p.optionId,
        coinsStaked: p.coinsStaked,
      }));

      // Call secure server resolution endpoint
      const res = await fetch('/api/admin/resolve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(adminKey ? { 'X-Admin-Key': adminKey } : {}),
        },
        body: JSON.stringify({
          questionId,
          winningOptionId,
          resolutionNote,
          adminKey: adminKey || '',
          userPredictions: predictionsPayload,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return {
          success: false,
          message: data.message || 'Server rejected resolution request.',
        };
      }

      // Update Question state with server-validated result
      const winningOption = targetQ.options.find((o) => o.id === winningOptionId);
      const winningText = winningOption ? winningOption.text : 'Selected Option';
      const finalNote = resolutionNote || `Result declared! Winner: ${winningText}`;

      setQuestions((prevQ) =>
        prevQ.map((q) =>
          q.id === questionId
            ? {
                ...q,
                resolved: true,
                winningOptionId,
                resolutionNote: finalNote,
              }
            : q
        )
      );

      // Update User Prediction status & Crowns using server-calculated payout
      const userPred = predictions[questionId];
      if (userPred && userPred.status === 'PENDING') {
        const isWinner = userPred.optionId === winningOptionId;
        const serverPayout = data.resolutionDetails?.payouts?.[user?.id || 'usr_default']?.crownsEarned ??
          (isWinner ? Math.round(userPred.coinsStaked * targetQ.multiplier) : 0);

        setPredictions((prevP) => ({
          ...prevP,
          [questionId]: {
            ...userPred,
            status: isWinner ? 'WON' : 'LOST',
            crownsEarned: serverPayout,
          },
        }));

        if (isWinner && serverPayout > 0) {
          setUser((prev) =>
            prev
              ? {
                  ...prev,
                  crowns: prev.crowns + serverPayout,
                  monthlyCrowns: (prev.monthlyCrowns || 0) + serverPayout,
                }
              : null
          );

          setTimeout(() => {
            confetti({
              particleCount: 150,
              spread: 90,
              origin: { y: 0.5 },
              colors: ['#F5C542', '#FF1E94', '#8B5CF6', '#10B981'],
            });
          }, 100);
        }
      }

      setShowSimulatorModal(false);
      setActiveSimulatorQuestionId(null);

      return {
        success: true,
        message: data.message || 'Question successfully resolved on server!',
      };
    } catch (err: any) {
      console.error('Resolution API error:', err);
      return {
        success: false,
        message: 'Failed to communicate with resolution server.',
      };
    }
  };

  const resetDemoData = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY_USER);
    localStorage.removeItem(LOCAL_STORAGE_KEY_QUESTIONS);
    localStorage.removeItem(LOCAL_STORAGE_KEY_PREDICTIONS);
    setUser(DEFAULT_USER);
    setQuestions(INITIAL_QUESTIONS);
    setPredictions({
      q2: {
        questionId: 'q2',
        optionId: 'opt2_1',
        coinsStaked: 100,
        potentialCrowns: 250,
        timestamp: Date.now() - 3600000,
        status: 'PENDING',
      }
    });
  };

  return (
    <GameContext.Provider
      value={{
        user,
        questions,
        predictions,
        leaderboard,
        selectedShow,
        setSelectedShow,
        login,
        logout,
        updateProfile,
        placePrediction,
        cancelPrediction,
        claimWeeklyCoins,
        watchRewardAd,
        claimReferralBonus,
        simulateResolveQuestion,
        resetDemoData,
        showAuthModal,
        setShowAuthModal,
        showAdModal,
        setShowAdModal,
        showReferralModal,
        setShowReferralModal,
        showSimulatorModal,
        setShowSimulatorModal,
        activeSimulatorQuestionId,
        setActiveSimulatorQuestionId,
        showRaffleModal,
        setShowRaffleModal,
        customLogoUrl,
        setCustomLogoUrl,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
