export interface Option {
  id: string;
  text: string;
  isNeutral?: boolean;
  communityPercent: number; // percentage of predictions
}

export type Category = 'Eviction' | 'Captaincy' | 'Fights & Drama' | 'Tasks' | 'Weekend Ka Vaar' | 'Season Long';

export interface Question {
  id: string;
  title: string;
  subtitle?: string;
  category: Category;
  multiplier: number; // e.g. 1.5, 2.5, 3.5, 10.0
  deadline: string; // ISO date or display string
  deadlineTimestamp: number;
  options: Option[];
  resolved: boolean;
  status?: 'ACTIVE' | 'PENDING_RESOLUTION' | 'RESOLVED';
  winningOptionId?: string;
  resolutionNote?: string;
  episodeName?: string;
  isLockedManual?: boolean;
  isRefunded?: boolean;
  createdAt?: number;
}

export interface UserPrediction {
  questionId: string;
  optionId: string;
  coinsStaked: number;
  potentialCrowns: number;
  timestamp: number;
  status: 'PENDING' | 'WON' | 'LOST' | 'REFUNDED';
  crownsEarned?: number;
}

export type RealityShow = 'BIGG_BOSS' | 'ROADIES' | 'SPLITSVILLA';

export type UserRole = 'SUPER_ADMIN' | 'MODERATOR' | 'USER';

export interface StaffPermissions {
  canManageQuestions: boolean;
  canSettlePayouts: boolean;
  canBanUsers: boolean;
  canManageStaff: boolean;
  canBroadcast: boolean;
  canManageRaffle: boolean;
}

export interface StaffMember {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: StaffPermissions;
  addedBy: string;
  dateAdded: string;
}

export interface UserProfile {
  id: string;
  email: string;
  username: string; // e.g., @BiggBossRaja
  instagramHandle?: string; // e.g., @thefanmahal
  phoneNumber?: string;
  avatar: string;
  titleBadge: string;
  fanCoins: number;
  crowns: number; // Season total crowns
  monthlyCrowns: number; // Monthly crowns for raffle tickets
  weeklyRefreshAvailable: boolean;
  weeklyCoinsClaimedDate?: string;
  adsWatchedThisWeek: number; // max 5
  adsWatchedToday?: number; // max daily limit
  lastAdResetDate?: string; // YYYY-MM-DD in IST timezone
  referralsThisWeek: number; // max 5
  totalReferrals?: number;
  referralCode: string;
  joinedDate: string;
  isAdmin?: boolean;
  role?: UserRole;
  permissions?: StaffPermissions;
  isBanned?: boolean;
  banReason?: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'ALERT' | 'CELEBRATION';
  active: boolean;
  timestamp: number;
  linkUrl?: string;
}

export interface YouTubeRaffleNotice {
  id: string;
  title: string;
  scheduledDate: string;
  youtubeUrl: string;
  note?: string;
  active: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  username: string;
  avatar: string;
  titleBadge: string;
  crowns: number;
  predictionsWon: number;
  totalPredictions: number;
  winRate: number;
  isCurrentUser?: boolean;
  isBanned?: boolean;
}

export interface PrizeHamper {
  rankRange: string;
  title: string;
  sponsor: string;
  items: string[];
  image: string;
  color: string;
}

