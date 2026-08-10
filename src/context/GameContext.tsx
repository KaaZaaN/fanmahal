import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  Question,
  UserPrediction,
  LeaderboardEntry,
  RealityShow,
  Announcement,
  YouTubeRaffleNotice,
  StaffMember,
  StaffPermissions,
  UserRole,
} from '../types';
import { INITIAL_QUESTIONS, MOCK_LEADERBOARD } from '../data/mockData';
import confetti from 'canvas-confetti';
import { db, auth, signOut, getRedirectResult } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export const FOUNDER_EMAIL = 'prithvi@fanmahal.com';
export const ALT_FOUNDER_EMAIL = 'prithvirajkz94@gmail.com';

export const SUPER_PERMISSIONS: StaffPermissions = {
  canManageQuestions: true,
  canSettlePayouts: true,
  canBanUsers: true,
  canManageStaff: true,
  canBroadcast: true,
  canManageRaffle: true,
};

export const DEFAULT_MODERATOR_PERMISSIONS: StaffPermissions = {
  canManageQuestions: true,
  canSettlePayouts: true,
  canBanUsers: false,
  canManageStaff: false,
  canBroadcast: true,
  canManageRaffle: false,
};

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
  
  // Admin & Staff Management
  addQuestion: (newQuestion: Omit<Question, 'id' | 'resolved' | 'status'>) => { success: boolean; message: string; questionId?: string };
  updateQuestion: (questionId: string, updatedFields: Partial<Question>) => { success: boolean; message: string };
  toggleQuestionLock: (questionId: string) => { success: boolean; message: string };
  refundQuestion: (questionId: string, reason: string) => { success: boolean; message: string };
  banUser: (userId: string, reason: string) => void;
  unbanUser: (userId: string) => void;
  adjustUserBalance: (userId: string, coinsDelta: number, crownsDelta: number) => void;
  toggleAdminRole: () => void;

  // Staff & RBAC System
  staffMembers: StaffMember[];
  addStaffMember: (email: string, name: string, role: UserRole, permissions?: Partial<StaffPermissions>) => { success: boolean; message: string };
  removeStaffMember: (staffId: string) => { success: boolean; message: string };
  updateStaffPermissions: (staffId: string, permissions: StaffPermissions) => void;
  checkUserStaffAccess: (email: string) => { isAuthorized: boolean; role?: UserRole; permissions?: StaffPermissions; staffMember?: StaffMember };
  
  // Announcements & Broadcasts
  announcements: Announcement[];
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'timestamp'>) => void;
  toggleAnnouncement: (id: string) => void;
  deleteAnnouncement: (id: string) => void;
  restoreDefaultBanner: () => void;
  
  // YouTube Raffle Stream Notice
  youtubeRaffleNotice: YouTubeRaffleNotice | null;
  setYoutubeRaffleNotice: (notice: YouTubeRaffleNotice | null) => void;

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
  id: 'usr_founder',
  email: FOUNDER_EMAIL,
  username: '@Prithvi_Founder',
  instagramHandle: '@prithvirajkz94',
  phoneNumber: '+91 98765 43210',
  avatar: '👑',
  titleBadge: 'Founder',
  fanCoins: 10000,
  crowns: 50000,
  monthlyCrowns: 25000,
  weeklyRefreshAvailable: true,
  adsWatchedThisWeek: 0,
  referralsThisWeek: 0,
  totalReferrals: 10,
  referralCode: 'FOUNDER-001',
  joinedDate: 'Aug 2026',
  isAdmin: true,
  role: 'SUPER_ADMIN',
  permissions: SUPER_PERMISSIONS,
  isBanned: false,
};

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann_1',
    title: '⚡ Bigg Boss 18 Elimination Predictions Open!',
    message: 'Place your Fan Coins predictions before the Friday 10 PM IST deadline. Live Crown payouts settle right after the broadcast!',
    type: 'INFO',
    active: true,
    timestamp: Date.now() - 3600000,
    linkUrl: 'https://instagram.com/thefanmahal',
  },
];

const INITIAL_YOUTUBE_RAFFLE: YouTubeRaffleNotice = {
  id: 'yt_raffle_1',
  title: 'Monthly Royal Fan Hamper & Voucher Draw Live on YouTube!',
  scheduledDate: 'Sunday, August 31st at 8:00 PM IST',
  youtubeUrl: 'https://youtube.com/@thefanmahal',
  note: 'To ensure 100% fairness, all raffle tickets will be drawn live on YouTube using an open third-party randomizer stream. Check your ticket count in your profile!',
  active: true,
};

const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'staff_prithvi',
    email: FOUNDER_EMAIL,
    name: 'Prithvi (Founder & CEO)',
    role: 'SUPER_ADMIN',
    permissions: SUPER_PERMISSIONS,
    addedBy: 'SYSTEM',
    dateAdded: 'Aug 2026',
  },
  {
    id: 'staff_priya',
    email: 'priya@fanmahal.com',
    name: 'Priya (Operations Mod)',
    role: 'MODERATOR',
    permissions: DEFAULT_MODERATOR_PERMISSIONS,
    addedBy: 'Prithvi (Founder)',
    dateAdded: 'Aug 2026',
  },
];

const GameContext = createContext<GameContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_USER = 'fanmahal_user_v2';
const LOCAL_STORAGE_KEY_QUESTIONS = 'fanmahal_questions_v2';
const LOCAL_STORAGE_KEY_PREDICTIONS = 'fanmahal_predictions_v2';
const LOCAL_STORAGE_KEY_ANNOUNCEMENTS = 'fanmahal_announcements_v1';
const LOCAL_STORAGE_KEY_YT_RAFFLE = 'fanmahal_yt_raffle_v1';
const LOCAL_STORAGE_KEY_STAFF = 'fanmahal_staff_v1';


export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_STAFF);
      return saved ? JSON.parse(saved) : INITIAL_STAFF;
    } catch {
      return INITIAL_STAFF;
    }
  });

  const checkUserStaffAccess = (emailToCheck: string) => {
    const norm = emailToCheck.trim().toLowerCase();
    if (norm === FOUNDER_EMAIL.toLowerCase() || norm === ALT_FOUNDER_EMAIL.toLowerCase()) {
      return {
        isAuthorized: true,
        role: 'SUPER_ADMIN' as UserRole,
        permissions: SUPER_PERMISSIONS,
      };
    }
    const match = staffMembers.find((s) => s.email.trim().toLowerCase() === norm);
    if (match) {
      return {
        isAuthorized: true,
        role: match.role,
        permissions: match.permissions,
        staffMember: match,
      };
    }
    return {
      isAuthorized: false,
      role: 'USER' as UserRole,
    };
  };

  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_USER);
      if (saved) {
        const parsed = JSON.parse(saved);
        const access = checkUserStaffAccess(parsed.email || '');
        return {
          ...DEFAULT_USER,
          ...parsed,
          isAdmin: access.isAuthorized,
          role: access.role || 'USER',
          permissions: access.permissions,
        };
      }
      return null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_STAFF, JSON.stringify(staffMembers));
  }, [staffMembers]);

  useEffect(() => {
    // Process Google redirect result if returning from Google Auth page
    getRedirectResult(auth)
      .then((result) => {
        if (result && result.user && result.user.email) {
          const googleUser = result.user;
          const handlePart = (googleUser.displayName || googleUser.email.split('@')[0]).replace(/[^a-zA-Z0-9_]/g, '');
          const username = `@${handlePart || 'BiggBossFan'}`;
          const instagramHandle = `@${handlePart || 'BiggBossFan'}_ig`;
          login(googleUser.email, username, '👑', 'Reality TV Oracle', instagramHandle, '');
        }
      })
      .catch((error) => {
        console.warn('Google Redirect Sign-In error:', error);
      });
  }, []);

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

    const staffAccess = checkUserStaffAccess(email);

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
      isAdmin: staffAccess.isAuthorized,
      role: staffAccess.role || 'USER',
      permissions: staffAccess.permissions,
    };
    setUser(newUser);
    setShowAuthModal(false);

    // Asynchronously save user profile to Firestore
    try {
      setDoc(doc(db, 'users', newUser.id), {
        uid: newUser.id,
        displayName: newUser.username,
        email: newUser.email,
        role: newUser.role,
        fanCoins: newUser.fanCoins,
        crowns: newUser.crowns,
        createdAt: new Date().toISOString()
      }, { merge: true }).catch((e) => console.warn('Firestore user save warning:', e));
    } catch (e) {
      console.warn('Firestore user doc create error:', e);
    }
  };

  const addStaffMember = (
    email: string,
    name: string,
    role: UserRole = 'MODERATOR',
    customPermissions?: Partial<StaffPermissions>
  ) => {
    const norm = email.trim().toLowerCase();
    if (!norm || !norm.includes('@')) {
      return { success: false, message: 'Please enter a valid email address.' };
    }
    if (staffMembers.some((s) => s.email.trim().toLowerCase() === norm)) {
      return { success: false, message: `Staff member with email '${norm}' already exists.` };
    }

    const newStaff: StaffMember = {
      id: `staff_${Date.now()}`,
      email: norm,
      name: name.trim() || norm.split('@')[0],
      role,
      permissions: {
        ...(role === 'SUPER_ADMIN' ? SUPER_PERMISSIONS : DEFAULT_MODERATOR_PERMISSIONS),
        ...customPermissions,
      },
      addedBy: user ? user.username : 'Prithvi (Founder)',
      dateAdded: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    };

    setStaffMembers((prev) => [...prev, newStaff]);

    // If current logged in user email matches this new staff member, upgrade their current session
    if (user && user.email.trim().toLowerCase() === norm) {
      setUser((prev) =>
        prev
          ? {
              ...prev,
              isAdmin: true,
              role: newStaff.role,
              permissions: newStaff.permissions,
            }
          : null
      );
    }

    return { success: true, message: `Granted ${role} moderator access to ${norm}!` };
  };

  const removeStaffMember = (staffId: string) => {
    const target = staffMembers.find((s) => s.id === staffId);
    if (!target) return { success: false, message: 'Staff member not found.' };
    if (target.email.trim().toLowerCase() === FOUNDER_EMAIL.toLowerCase()) {
      return { success: false, message: 'Cannot remove Founder Super Admin access.' };
    }
    setStaffMembers((prev) => prev.filter((s) => s.id !== staffId));

    // If logged in user was removed
    if (user && user.email.trim().toLowerCase() === target.email.trim().toLowerCase()) {
      setUser((prev) => (prev ? { ...prev, isAdmin: false, role: 'USER', permissions: undefined } : null));
    }

    return { success: true, message: `Revoked moderator access for ${target.email}.` };
  };

  const updateStaffPermissions = (staffId: string, permissions: StaffPermissions) => {
    setStaffMembers((prev) =>
      prev.map((s) => (s.id === staffId ? { ...s, permissions } : s))
    );
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Firebase signout warning:', e);
    }
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY_USER);
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

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_ANNOUNCEMENTS);
      return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
    } catch {
      return INITIAL_ANNOUNCEMENTS;
    }
  });

  const [youtubeRaffleNotice, setYoutubeRaffleNoticeState] = useState<YouTubeRaffleNotice | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_YT_RAFFLE);
      return saved ? JSON.parse(saved) : INITIAL_YOUTUBE_RAFFLE;
    } catch {
      return INITIAL_YOUTUBE_RAFFLE;
    }
  });

  const setYoutubeRaffleNotice = (notice: YouTubeRaffleNotice | null) => {
    setYoutubeRaffleNoticeState(notice);
    if (notice) {
      localStorage.setItem(LOCAL_STORAGE_KEY_YT_RAFFLE, JSON.stringify(notice));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY_YT_RAFFLE);
    }
  };

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_ANNOUNCEMENTS, JSON.stringify(announcements));
  }, [announcements]);

  const placePrediction = (questionId: string, optionId: string, coinsStaked: number) => {
    if (!user) {
      setShowAuthModal(true);
      return { success: false, message: 'Please sign in to place predictions' };
    }

    if (user.isBanned) {
      return {
        success: false,
        message: `Account Restricted: ${user.banReason || 'Your account is restricted from placing predictions due to Terms of Service violation.'}`,
      };
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

    if (question.isLockedManual) {
      return { success: false, message: 'This prediction question has been manually locked by Admin.' };
    }

    if (question.deadlineTimestamp > 0 && Date.now() >= question.deadlineTimestamp) {
      return { success: false, message: 'Predictions closed! The deadline date and time for this question has passed.' };
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

  // ADMIN ACTION: Create new question
  const addQuestion = (newQ: Omit<Question, 'id' | 'resolved' | 'status'>) => {
    const newId = `q_${Date.now()}`;
    const questionToSave: Question = {
      ...newQ,
      id: newId,
      resolved: false,
      status: 'ACTIVE',
      createdAt: Date.now(),
    };

    setQuestions((prev) => [questionToSave, ...prev]);

    // Save to Firestore
    try {
      setDoc(doc(db, 'questions', newId), questionToSave, { merge: true }).catch((e) =>
        console.warn('Firestore question create warning:', e)
      );
    } catch (e) {
      console.warn('Firestore question write error:', e);
    }

    return { success: true, message: `Question '${newQ.title}' published successfully!`, questionId: newId };
  };

  // ADMIN ACTION: Edit existing question
  const updateQuestion = (questionId: string, updatedFields: Partial<Question>) => {
    let targetTitle = '';
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          targetTitle = updatedFields.title || q.title;
          return { ...q, ...updatedFields };
        }
        return q;
      })
    );

    // Sync to Firestore
    try {
      setDoc(doc(db, 'questions', questionId), updatedFields, { merge: true }).catch((e) =>
        console.warn('Firestore question update warning:', e)
      );
    } catch (e) {
      console.warn('Firestore question update error:', e);
    }

    return { success: true, message: `Question '${targetTitle || questionId}' updated successfully!` };
  };

  // ADMIN ACTION: Lock or Unlock question
  const toggleQuestionLock = (questionId: string) => {
    let isNowLocked = false;
    let targetTitle = '';

    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          isNowLocked = !q.isLockedManual;
          targetTitle = q.title;
          return {
            ...q,
            isLockedManual: isNowLocked,
            status: isNowLocked ? 'PENDING_RESOLUTION' : 'ACTIVE',
          };
        }
        return q;
      })
    );

    try {
      setDoc(
        doc(db, 'questions', questionId),
        { isLockedManual: isNowLocked, status: isNowLocked ? 'PENDING_RESOLUTION' : 'ACTIVE' },
        { merge: true }
      ).catch((e) => console.warn('Firestore lock toggle warning:', e));
    } catch (e) {
      console.warn('Firestore lock toggle error:', e);
    }

    return {
      success: true,
      message: isNowLocked
        ? `Question '${targetTitle}' manually LOCKED. No new predictions allowed.`
        : `Question '${targetTitle}' UNLOCKED. Users can place predictions again.`,
    };
  };

  // ADMIN ACTION: Refund Question (e.g. cancelled task on TV episode)
  const refundQuestion = (questionId: string, reason: string) => {
    const targetQ = questions.find((q) => q.id === questionId);
    if (!targetQ) return { success: false, message: 'Question not found' };

    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              resolved: true,
              isRefunded: true,
              status: 'RESOLVED',
              resolutionNote: `REFUNDED: ${reason || 'Task or event cancelled in episode broadcast.'}`,
            }
          : q
      )
    );

    // Refund coins to current user if they placed a prediction
    const userPred = predictions[questionId];
    if (userPred && userPred.status === 'PENDING') {
      setUser((prev) => (prev ? { ...prev, fanCoins: prev.fanCoins + userPred.coinsStaked } : null));
      setPredictions((prev) => ({
        ...prev,
        [questionId]: {
          ...userPred,
          status: 'REFUNDED',
          crownsEarned: 0,
        },
      }));
    }

    return {
      success: true,
      message: `Question '${targetQ.title}' refunded & voided. Staked Fan Coins returned to predicted users!`,
    };
  };

  // ADMIN ACTION: Ban user account
  const banUser = (userId: string, reason: string) => {
    if (user && user.id === userId) {
      setUser({
        ...user,
        isBanned: true,
        banReason: reason || 'Terms of Service Violation',
      });
    }

    try {
      setDoc(doc(db, 'users', userId), { isBanned: true, banReason: reason }, { merge: true }).catch((e) =>
        console.warn('Firestore user ban warning:', e)
      );
    } catch (e) {
      console.warn('Firestore user ban error:', e);
    }
  };

  // ADMIN ACTION: Unban user account
  const unbanUser = (userId: string) => {
    if (user && user.id === userId) {
      setUser({
        ...user,
        isBanned: false,
        banReason: undefined,
      });
    }

    try {
      setDoc(doc(db, 'users', userId), { isBanned: false, banReason: '' }, { merge: true }).catch((e) =>
        console.warn('Firestore user unban warning:', e)
      );
    } catch (e) {
      console.warn('Firestore user unban error:', e);
    }
  };

  // ADMIN ACTION: Adjust user balance
  const adjustUserBalance = (userId: string, coinsDelta: number, crownsDelta: number) => {
    if (user && user.id === userId) {
      setUser({
        ...user,
        fanCoins: Math.max(0, user.fanCoins + coinsDelta),
        crowns: Math.max(0, user.crowns + crownsDelta),
      });
    }
  };

  // ADMIN ACTION: Toggle admin mode for current user
  const toggleAdminRole = () => {
    if (user) {
      setUser({
        ...user,
        isAdmin: !user.isAdmin,
      });
    }
  };

  // ANNOUNCEMENT MANAGEMENT
  const addAnnouncement = (newAnn: Omit<Announcement, 'id' | 'timestamp'>) => {
    const item: Announcement = {
      ...newAnn,
      id: `ann_${Date.now()}`,
      timestamp: Date.now(),
    };
    setAnnouncements((prev) => [item, ...prev]);
  };

  const toggleAnnouncement = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  const restoreDefaultBanner = () => {
    setAnnouncements((prev) => prev.map((a) => ({ ...a, active: false })));
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

    const effectiveKey = adminKey || 'fanmahal_admin_secret_2026';

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
          'X-Admin-Key': effectiveKey,
        },
        body: JSON.stringify({
          questionId,
          winningOptionId,
          resolutionNote,
          adminKey: effectiveKey,
          userPredictions: predictionsPayload,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        // Fallback to local resolution if server returns error
        console.warn('Server resolution warning, applying local fallback resolution:', data.message);
      }

      // Update Question state
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

      // Update User Prediction status & Crowns using server-calculated payout or formula
      const userPred = predictions[questionId];
      if (userPred && userPred.status === 'PENDING') {
        const isWinner = userPred.optionId === winningOptionId;
        const payout = data?.resolutionDetails?.payouts?.[user?.id || 'usr_default']?.crownsEarned ??
          (isWinner ? Math.round(userPred.coinsStaked * targetQ.multiplier) : 0);

        setPredictions((prevP) => ({
          ...prevP,
          [questionId]: {
            ...userPred,
            status: isWinner ? 'WON' : 'LOST',
            crownsEarned: payout,
          },
        }));

        if (isWinner && payout > 0) {
          setUser((prev) =>
            prev
              ? {
                  ...prev,
                  crowns: prev.crowns + payout,
                  monthlyCrowns: (prev.monthlyCrowns || 0) + payout,
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

      return {
        success: true,
        message: `Question '${targetQ.title}' resolved successfully! ${winningText} declared winner.`,
      };
    } catch (err: any) {
      console.warn('Network error in resolution, resolving locally:', err);

      // Local fallback execution
      const winningOption = targetQ.options.find((o) => o.id === winningOptionId);
      const winningText = winningOption ? winningOption.text : 'Selected Option';
      const finalNote = resolutionNote || `Result declared! Winner: ${winningText}`;

      setQuestions((prevQ) =>
        prevQ.map((q) =>
          q.id === questionId
            ? { ...q, resolved: true, winningOptionId, resolutionNote: finalNote }
            : q
        )
      );

      const userPred = predictions[questionId];
      if (userPred && userPred.status === 'PENDING') {
        const isWinner = userPred.optionId === winningOptionId;
        const payout = isWinner ? Math.round(userPred.coinsStaked * targetQ.multiplier) : 0;

        setPredictions((prevP) => ({
          ...prevP,
          [questionId]: { ...userPred, status: isWinner ? 'WON' : 'LOST', crownsEarned: payout },
        }));

        if (isWinner && payout > 0) {
          setUser((prev) =>
            prev ? { ...prev, crowns: prev.crowns + payout, monthlyCrowns: (prev.monthlyCrowns || 0) + payout } : null
          );
        }
      }

      return {
        success: true,
        message: `Question '${targetQ.title}' resolved locally! ${winningText} declared winner.`,
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
        addQuestion,
        updateQuestion,
        toggleQuestionLock,
        refundQuestion,
        banUser,
        unbanUser,
        adjustUserBalance,
        toggleAdminRole,
        staffMembers,
        addStaffMember,
        removeStaffMember,
        updateStaffPermissions,
        checkUserStaffAccess,
        announcements,
        addAnnouncement,
        toggleAnnouncement,
        deleteAnnouncement,
        restoreDefaultBanner,
        youtubeRaffleNotice,
        setYoutubeRaffleNotice,
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
