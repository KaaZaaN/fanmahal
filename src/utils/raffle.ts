export interface RaffleTierInfo {
  tickets: number;
  nextTierThreshold: number | null;
  crownsNeededForNextTier: number;
  progressPercent: number;
  currentTierLabel: string;
}

export function calculateRaffleTickets(monthlyCrowns: number): RaffleTierInfo {
  const crowns = Math.max(0, monthlyCrowns || 0);

  if (crowns >= 10000) {
    return {
      tickets: 5,
      nextTierThreshold: null,
      crownsNeededForNextTier: 0,
      progressPercent: 100,
      currentTierLabel: 'Tier 5 (5 Raffle Tickets - Maximum Odds)',
    };
  }
  if (crowns >= 9000) {
    return {
      tickets: 4,
      nextTierThreshold: 10000,
      crownsNeededForNextTier: 10000 - crowns,
      progressPercent: Math.min(100, Math.round(((crowns - 9000) / 1000) * 100)),
      currentTierLabel: 'Tier 4 (4 Raffle Tickets)',
    };
  }
  if (crowns >= 7500) {
    return {
      tickets: 3,
      nextTierThreshold: 9000,
      crownsNeededForNextTier: 9000 - crowns,
      progressPercent: Math.min(100, Math.round(((crowns - 7500) / 1500) * 100)),
      currentTierLabel: 'Tier 3 (3 Raffle Tickets)',
    };
  }
  if (crowns >= 6000) {
    return {
      tickets: 2,
      nextTierThreshold: 7500,
      crownsNeededForNextTier: 7500 - crowns,
      progressPercent: Math.min(100, Math.round(((crowns - 6000) / 1500) * 100)),
      currentTierLabel: 'Tier 2 (2 Raffle Tickets)',
    };
  }
  if (crowns >= 4000) {
    return {
      tickets: 1,
      nextTierThreshold: 6000,
      crownsNeededForNextTier: 6000 - crowns,
      progressPercent: Math.min(100, Math.round(((crowns - 4000) / 2000) * 100)),
      currentTierLabel: 'Tier 1 (1 Raffle Ticket)',
    };
  }

  return {
    tickets: 0,
    nextTierThreshold: 4000,
    crownsNeededForNextTier: 4000 - crowns,
    progressPercent: Math.min(100, Math.round((crowns / 4000) * 100)),
    currentTierLabel: '0 Tickets (4,000 Crowns needed for 1st ticket)',
  };
}

export const RAFFLE_ROUNDS = [
  {
    round: 1,
    minTickets: 1,
    prizeTitle: 'Rs. 4,000 Shopping Voucher (Amazon/Flipkart)',
    eligibleLabel: 'Everyone with 1+ Tickets',
    afterAction: 'Winner removed + all 1-ticket holders eliminated from later rounds',
    color: 'from-amber-400 to-yellow-500',
  },
  {
    round: 2,
    minTickets: 2,
    prizeTitle: 'Rs. 2,500 Shopping Voucher (Amazon/Flipkart)',
    eligibleLabel: 'Remaining w/ 2+ Tickets',
    afterAction: 'Winner removed + all 2-ticket holders eliminated from later rounds',
    color: 'from-pink-500 to-rose-500',
  },
  {
    round: 3,
    minTickets: 3,
    prizeTitle: 'Rs. 1,500 Shopping Voucher (Amazon/Flipkart)',
    eligibleLabel: 'Remaining w/ 3+ Tickets',
    afterAction: 'Winner removed + all 3-ticket holders eliminated from later rounds',
    color: 'from-purple-500 to-indigo-500',
  },
  {
    round: 4,
    minTickets: 4,
    prizeTitle: 'Rs. 1,200 Shopping Voucher (Amazon/Flipkart)',
    eligibleLabel: 'Remaining w/ 4+ Tickets',
    afterAction: 'Winner removed + all 4-ticket holders eliminated from later rounds',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    round: 5,
    minTickets: 5,
    prizeTitle: 'Rs. 800 Shopping Voucher (Amazon/Flipkart)',
    eligibleLabel: 'Remaining w/ exactly 5 Tickets',
    afterAction: 'Monthly Draw Complete! All prizes distributed.',
    color: 'from-emerald-400 to-teal-500',
  },
];
