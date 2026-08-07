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
}

export interface UserPrediction {
  questionId: string;
  optionId: string;
  coinsStaked: number;
  potentialCrowns: number;
  timestamp: number;
  status: 'PENDING' | 'WON' | 'LOST';
  crownsEarned?: number;
}

export type RealityShow = 'BIGG_BOSS' | 'ROADIES' | 'SPLITSVILLA';

export interface UserProfile {
  id: string;
  email: string;
  username: string; // e.g., @BiggBossRaja
  instagramHandle?: string; // e.g., @thefanmahal or @salman_fan_1 (mandatory for prize delivery)
  phoneNumber?: string; // Optional for now, mandatory in Phase 2 for prize delivery
  avatar: string;
  titleBadge: string;
  fanCoins: number;
  crowns: number; // Season total crowns
  monthlyCrowns: number; // Monthly crowns for raffle tickets (resets 1st of each month)
  weeklyRefreshAvailable: boolean;
  weeklyCoinsClaimedDate?: string;
  adsWatchedThisWeek: number; // max 5
  adsWatchedToday?: number; // max daily limit
  lastAdResetDate?: string; // YYYY-MM-DD in IST timezone
  referralsThisWeek: number; // max 5
  totalReferrals?: number; // total friends referred
  referralCode: string;
  joinedDate: string;
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
}

export interface PrizeHamper {
  rankRange: string;
  title: string;
  sponsor: string;
  items: string[];
  image: string;
  color: string;
}
