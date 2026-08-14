import { Question, LeaderboardEntry, PrizeHamper } from '../types';

export const INITIAL_QUESTIONS: Question[] = [];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [];

export const PRIZE_HAMPERS: PrizeHamper[] = [
  {
    rankRange: '1st Place Winner',
    title: 'The Royal Fan Palace Trophy, Brand Vouchers & Mega Hamper',
    sponsor: 'Powered by Royal Brands & Fanmahal',
    items: [
      '🏆 Official Gold Plated Fanmahal Champion Trophy',
      '🛒 ₹10,000 Vouchers (brands like Myntra, Amazon, Flipkart, Blinkit, Swiggy, District & more)',
      '📱 Premium Brand Smartwatch & Wireless Earbuds',
      '👕 Exclusive Signed Reality TV Merchandise',
      '🎟️ VIP Pass for Live Finale Screening Event',
      '🎁 ₹15,000 Luxury Snack & Pamper Hamper Basket',
    ],
    image: '🏆',
    color: 'from-amber-400 via-amber-300 to-yellow-600',
  },
  {
    rankRange: '2nd Place Winner',
    title: 'Silver Crown Fan Hamper & Brand Vouchers',
    sponsor: 'Sponsored by Official Merch Partners',
    items: [
      '🥈 Official Silver Fanmahal Crown Plaque',
      '🛍️ ₹5,000 Vouchers (brands like Myntra, Amazon, Flipkart, Blinkit, Swiggy, District & more)',
      '🧥 Custom Embroidered Reality TV Season Hoodie',
      '🎧 Premium Noise Cancelling Headphones',
      '🎁 ₹8,000 Gourmet Food & Beverage Gift Basket',
    ],
    image: '🥈',
    color: 'from-slate-300 via-slate-100 to-slate-400',
  },
  {
    rankRange: '3rd Place Winner',
    title: 'Bronze Star Fan Hamper & Brand Vouchers',
    sponsor: 'Sponsored by Fanmahal Community',
    items: [
      '🥉 Official Bronze Fanmahal Medal',
      '🛍️ ₹3,000 Vouchers (brands like Myntra, Amazon, Flipkart, Blinkit, Swiggy, District & more)',
      '☕ Custom Royal Mug & T-Shirt Pack',
      '🎁 ₹5,000 Premium Snack & Goodies Basket',
    ],
    image: '🥉',
    color: 'from-amber-700 via-amber-600 to-yellow-800',
  },
];

export const PRESET_AVATARS = [
  { emoji: '👑', label: 'Royal Crown' },
  { emoji: '🔥', label: 'Fire Fan' },
  { emoji: '🐯', label: 'Tiger' },
  { emoji: '💃', label: 'Queen' },
  { emoji: '🎭', label: 'Drama Guru' },
  { emoji: '⚡', label: 'Lightning' },
  { emoji: '🦁', label: 'Lion' },
  { emoji: '✨', label: 'Star' },
];

export const PRESET_BADGES = [
  'Reality TV Oracle',
  'Master Predictor',
  'Weekend Specialist',
  'Eviction Specialist',
  'Captaincy Analyst',
  'Royal Predictor',
  'Squad Leader',
];
