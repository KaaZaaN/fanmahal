import React, { useState, useEffect } from 'react';
import { FanmahalLogo } from '../components/FanmahalLogo';
import { TopAnnouncementBanner } from '../components/TopAnnouncementBanner';
import {
  Sparkles,
  Mail,
  CheckCircle2,
  ShieldCheck,
  Gift,
  Trophy,
  Bell,
  ArrowRight,
  Target,
  Coins,
  TrendingUp,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Instagram,
  Tv,
  Check,
  Info,
  Crown,
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { useGame } from '../context/GameContext';

interface ComingSoonViewProps {
  onNavigateTerms: () => void;
  onNavigatePrivacy: () => void;
  onFounderBypass?: () => void;
}

const BASE_WAITLIST_COUNT = 223;
const BIGG_BOSS_20_DATE = new Date('2026-09-06T21:00:00+05:30').getTime();

const SHOWS_COVERED = [
  { name: 'Bigg Boss', accent: 'border-red-500/60 bg-red-950/40 text-red-300', tag: 'Colors TV' },
  { name: 'MTV Roadies', accent: 'border-amber-500/60 bg-amber-950/40 text-amber-300', tag: 'MTV' },
  { name: 'MTV Splitsvilla', accent: 'border-pink-500/60 bg-pink-950/40 text-pink-300', tag: 'MTV' },
  { name: 'Khatron Ke Khiladi', accent: 'border-yellow-500/60 bg-yellow-950/40 text-yellow-300', tag: 'Colors TV' },
  { name: 'Lock Upp', accent: 'border-cyan-500/60 bg-cyan-950/40 text-cyan-300', tag: 'ALTBalaji' },
  { name: "India's Got Latent", accent: 'border-purple-500/60 bg-purple-950/40 text-purple-300', tag: 'YouTube' },
];

const FAQ_ITEMS = [
  {
    question: 'Is this real-money gambling?',
    answer:
      'Fanmahal is 100% free to play — nothing to pay, ever. Use your free Fan Coins to predict outcomes, climb the leaderboard, and win real prize hampers, gift vouchers, and exciting rewards through our monthly raffle draws and season-end prizes.',
  },
  {
    question: 'How do I actually win something?',
    answer:
      'Correct predictions earn you Crowns, which rank you on the leaderboard. Top Crown holders earn entries into monthly raffle draws and win real prize hampers and gift vouchers.',
  },
  {
    question: "What if I miss an episode or can't predict every week?",
    answer:
      'No problem! Each prediction round is independent. You can jump in whenever you watch and still earn Crowns towards weekly and monthly prizes.',
  },
  {
    question: 'Is my data safe / what do you do with my info?',
    answer:
      'Your privacy is 100% protected. We only use your email to alert you when prediction rounds open and to coordinate reward distribution. We never sell or spam your info.',
  },
];

export const ComingSoonView: React.FC<ComingSoonViewProps> = ({
  onNavigateTerms,
  onNavigatePrivacy,
}) => {
  const { user } = useGame();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [waitlistCount, setWaitlistCount] = useState<number>(BASE_WAITLIST_COUNT);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedSampleOption, setSelectedSampleOption] = useState<number>(0);
  const [activeTooltip, setActiveTooltip] = useState<'coins' | 'crowns' | null>(null);

  // Countdown timer state for Bigg Boss 20 Premiere
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = BIGG_BOSS_20_DATE - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  // Subscribe to live waitlist count from Firestore
  useEffect(() => {
    let unsubscribe = () => {};
    try {
      const q = collection(db, 'waitlist');
      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          setWaitlistCount(BASE_WAITLIST_COUNT + snapshot.size);
        },
        (error) => {
          console.warn('Firestore waitlist count listener notice:', error);
          setWaitlistCount(BASE_WAITLIST_COUNT);
        }
      );
    } catch (e) {
      console.warn('Error setting up waitlist listener:', e);
      setWaitlistCount(BASE_WAITLIST_COUNT);
    }
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await addDoc(collection(db, 'waitlist'), {
        email: email.trim().toLowerCase(),
        createdAt: new Date().toISOString(),
        timestamp: serverTimestamp(),
        source: 'coming_soon_landing',
      });

      setSubmitted(true);
      setEmail('');
    } catch (err: any) {
      console.warn('Failed to store waitlist signup to Firestore:', err);
      setSubmitted(true);
      setEmail('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#110125] text-purple-100 font-sans flex flex-col relative overflow-hidden selection:bg-[#FF1E94] selection:text-white">
      {/* Background Radial Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#3A037A]/30 via-[#FF1E94]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -left-32 w-80 h-80 bg-[#31056C]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-[#FF1E94]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner */}
      <TopAnnouncementBanner />

      {/* Main Container */}
      <div className="flex-1 flex flex-col justify-center max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 relative z-10 text-center space-y-10 sm:space-y-12">
        {/* Fanmahal Branding / Logo */}
        <div className="flex flex-col items-center justify-center animate-fadeIn">
          <FanmahalLogo size="xl" showSubtitle={false} showIgHandle={true} />
        </div>

        {/* Headline & Tagline */}
        <div className="space-y-3 sm:space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400/20 via-pink-500/20 to-purple-600/20 border border-amber-400/40 rounded-full px-4 py-1.5 shadow-xl backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-amber-300">
              Platform Pre-Launch
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-500 tracking-tight leading-tight uppercase drop-shadow-lg">
            COMING SOON
          </h1>

          <p className="text-xl sm:text-3xl font-extrabold text-white tracking-wide leading-snug">
            India's First Reality TV Prediction League
          </p>
        </div>

        {/* Countdown Timer to Bigg Boss 20 Premiere */}
        <div className="max-w-xl mx-auto w-full bg-gradient-to-b from-[#260352]/90 to-[#160133]/90 border border-amber-400/50 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-md space-y-3">
          <div className="flex items-center justify-center gap-2 text-amber-300 font-black text-xs sm:text-sm uppercase tracking-wider">
            <Clock className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Bigg Boss Season 20 Premiere Countdown</span>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-4 pt-1">
            <div className="bg-[#120128] border border-purple-700/50 rounded-2xl p-2.5 sm:p-3 text-center shadow-inner">
              <div className="text-2xl sm:text-4xl font-black text-amber-300 font-mono">
                {String(timeLeft.days).padStart(2, '0')}
              </div>
              <div className="text-[10px] sm:text-xs font-bold text-purple-300/70 uppercase tracking-widest mt-0.5">
                Days
              </div>
            </div>

            <div className="bg-[#120128] border border-purple-700/50 rounded-2xl p-2.5 sm:p-3 text-center shadow-inner">
              <div className="text-2xl sm:text-4xl font-black text-amber-300 font-mono">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <div className="text-[10px] sm:text-xs font-bold text-purple-300/70 uppercase tracking-widest mt-0.5">
                Hours
              </div>
            </div>

            <div className="bg-[#120128] border border-purple-700/50 rounded-2xl p-2.5 sm:p-3 text-center shadow-inner">
              <div className="text-2xl sm:text-4xl font-black text-amber-300 font-mono">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <div className="text-[10px] sm:text-xs font-bold text-purple-300/70 uppercase tracking-widest mt-0.5">
                Mins
              </div>
            </div>

            <div className="bg-[#120128] border border-purple-700/50 rounded-2xl p-2.5 sm:p-3 text-center shadow-inner">
              <div className="text-2xl sm:text-4xl font-black text-[#FF1E94] font-mono">
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
              <div className="text-[10px] sm:text-xs font-bold text-purple-300/70 uppercase tracking-widest mt-0.5">
                Secs
              </div>
            </div>
          </div>

          <p className="text-[11px] text-purple-300/80 font-medium">
            Premiering September 6, 2026 • Join the waitlist below for early predictions & free Fan Coins
          </p>

          <div className="pt-2 border-t border-purple-800/40 text-center">
            <p className="text-xs text-amber-200/90 font-medium leading-relaxed bg-purple-950/60 p-2.5 rounded-2xl border border-purple-800/50">
              🚀 <strong className="text-amber-300 font-bold">Launch Show:</strong> We're kicking things off with Bigg Boss Season 20 — India's biggest reality show — and rolling out predictions for Roadies, Splitsvilla, Khatron Ke Khiladi, and more through the season. One platform for every reality show you love!
            </p>
          </div>
        </div>

        {/* Description & Feature Badges */}
        <div className="max-w-xl mx-auto bg-[#1C023E]/80 border border-purple-800/60 rounded-3xl p-6 shadow-2xl backdrop-blur-md space-y-4">
          <p className="text-sm sm:text-base text-purple-200/90 leading-relaxed font-medium">
            Predict reality TV outcomes, earn crowns, and win real prize hampers & gift vouchers.
          </p>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-1 text-center text-xs font-bold text-amber-200">
            <div className="p-2 sm:p-3 bg-purple-950/60 rounded-2xl border border-purple-800/40 flex flex-col items-center gap-1">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span className="text-[11px] leading-tight">100% Free-to-Play</span>
            </div>
            <div className="p-2 sm:p-3 bg-purple-950/60 rounded-2xl border border-purple-800/40 flex flex-col items-center gap-1">
              <Trophy className="w-5 h-5 text-pink-400" />
              <span className="text-[11px] leading-tight">Crown Leaderboards</span>
            </div>
            <div className="p-2 sm:p-3 bg-purple-950/60 rounded-2xl border border-purple-800/40 flex flex-col items-center gap-1">
              <Gift className="w-5 h-5 text-yellow-400" />
              <span className="text-[11px] leading-tight">Prize Hampers & Vouchers</span>
            </div>
          </div>
        </div>

        {/* SHOWS WE COVER SECTION */}
        <div className="max-w-2xl mx-auto w-full space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider text-purple-300">
            <Tv className="w-4 h-4 text-amber-400" />
            <span>Shows We Cover</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
            {SHOWS_COVERED.map((show, idx) => (
              <div
                key={idx}
                className={`px-3.5 py-2 rounded-2xl border ${show.accent} shadow-md transition hover:scale-105 flex items-center gap-2`}
              >
                <span className="text-xs font-black tracking-wide">{show.name}</span>
                <span className="text-[9px] font-bold uppercase tracking-wider opacity-60 bg-black/30 px-1.5 py-0.5 rounded-full">
                  {show.tag}
                </span>
              </div>
            ))}
          </div>

          {/* Stand-out summary statement element */}
          <div className="pt-1 flex items-center justify-center">
            <span className="text-[11px] sm:text-xs font-semibold text-purple-200/90 bg-purple-950/40 border border-dashed border-amber-400/50 px-4 py-1.5 rounded-full backdrop-blur-sm flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>Plus more hit reality TV shows added throughout the season!</span>
            </span>
          </div>
        </div>

        {/* Email Capture Form & Live Waitlist */}
        <div className="max-w-md mx-auto w-full space-y-4">
          {user ? (
            <div className="p-6 bg-gradient-to-r from-amber-500/20 via-purple-900/60 to-pink-500/20 border border-amber-400/60 rounded-3xl text-center space-y-3 shadow-2xl backdrop-blur-md animate-fadeIn">
              <div className="text-4xl">{user.avatar}</div>
              <h3 className="text-xl font-black text-amber-300">
                Welcome to the Palace, {user.username}!
              </h3>
              <p className="text-xs text-purple-200/90 leading-relaxed max-w-sm mx-auto font-medium">
                Your account is ready with <strong className="text-amber-300">800 Free Fan Coins</strong>! We'll notify you at <span className="text-white font-bold">{user.email}</span> the instant predictions go live.
              </p>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-400/10 border border-amber-400/40 rounded-full text-xs font-extrabold text-amber-300 shadow">
                <span>Badge: {user.titleBadge}</span>
              </div>
            </div>
          ) : submitted ? (
            <div className="p-6 bg-emerald-950/80 border border-emerald-500/60 rounded-2xl text-emerald-200 text-center space-y-2 shadow-2xl animate-fadeIn">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-black text-white">You're on the VIP Waitlist!</h3>
              <p className="text-xs text-emerald-200/90">
                We'll email you the instant predictions go live for the next big episode.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="relative w-full">
                  <Mail className="w-5 h-5 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    disabled={isSubmitting}
                    className="w-full bg-[#1A023B] text-white placeholder-purple-400/70 border border-purple-700/60 focus:border-amber-400 focus:outline-none rounded-2xl pl-11 pr-4 py-3.5 text-sm font-medium transition shadow-inner"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  id="btn-coming-soon-notify-me"
                  className="w-full sm:w-auto shrink-0 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:opacity-95 text-slate-950 font-black px-6 py-3.5 rounded-2xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer border border-amber-300/50"
                >
                  {isSubmitting ? (
                    <span>Joining...</span>
                  ) : (
                    <>
                      <span>NOTIFY ME</span>
                      <Bell className="w-4 h-4 text-slate-950" />
                    </>
                  )}
                </button>
              </div>

              {errorMessage && (
                <p className="text-xs text-rose-400 font-bold">{errorMessage}</p>
              )}
            </form>
          )}

          {/* LIVE Waitlist Counter */}
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-purple-300/90 bg-purple-950/40 border border-purple-800/40 rounded-full px-4 py-1.5 w-fit mx-auto shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-amber-300 font-extrabold">{waitlistCount.toLocaleString()}</span>
            <span>Reality TV Superfans on the VIP Waitlist</span>
          </div>

          {/* INSTAGRAM SNEAK PEEKS LINK */}
          <div className="pt-1">
            <a
              href="https://instagram.com/thefanmahal"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-pink-300 hover:text-amber-300 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 px-4 py-2 rounded-full transition shadow"
            >
              <Instagram className="w-4 h-4 text-[#FF1E94]" />
              <span>Want sneak peeks & updates? Follow us on IG <strong className="underline text-amber-300">@thefanmahal</strong></span>
            </a>
          </div>
        </div>

        {/* HOW IT WORKS SECTION */}
        <div className="max-w-3xl mx-auto w-full pt-6 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-amber-300 font-serif uppercase tracking-wide">
              How It Works
            </h2>
            <p className="text-xs sm:text-sm text-purple-200/80 font-medium max-w-lg mx-auto">
              Join India's ultimate reality TV prediction game in 4 simple steps
            </p>
            <div className="pt-1">
              <span className="inline-block text-xs text-amber-300 font-bold bg-amber-400/10 border border-amber-400/30 rounded-xl px-3.5 py-1.5 shadow">
                🎁 Everyone gets free Fan Coins to play — refreshed weekly, no purchase ever required!
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* Step 1 */}
            <div className="bg-[#1B023A]/90 border border-purple-700/50 hover:border-amber-400/60 rounded-2xl p-4 text-left space-y-2 transition shadow-xl relative overflow-hidden group">
              <div className="absolute top-2 right-3 text-2xl font-black text-purple-800/40 font-mono">
                01
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/40 flex items-center justify-center text-amber-400 group-hover:scale-110 transition">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-white">1. Predict</h3>
              <p className="text-xs text-purple-200/80 leading-snug">
                When you sign up, you get free Fan Coins every week. Use them to bet on what happens next in the show.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#1B023A]/90 border border-purple-700/50 hover:border-amber-400/60 rounded-2xl p-4 text-left space-y-2 transition shadow-xl relative overflow-hidden group">
              <div className="absolute top-2 right-3 text-2xl font-black text-purple-800/40 font-mono">
                02
              </div>
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/40 flex items-center justify-center text-[#FF1E94] group-hover:scale-110 transition">
                <Coins className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-white">2. Earn</h3>
              <p className="text-xs text-purple-200/80 leading-snug">
                Guessed right? You win Crowns — think of them as your score.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#1B023A]/90 border border-purple-700/50 hover:border-amber-400/60 rounded-2xl p-4 text-left space-y-2 transition shadow-xl relative overflow-hidden group">
              <div className="absolute top-2 right-3 text-2xl font-black text-purple-800/40 font-mono">
                03
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/40 flex items-center justify-center text-purple-300 group-hover:scale-110 transition">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-white">3. Climb</h3>
              <p className="text-xs text-purple-200/80 leading-snug">
                The more Crowns you collect, the higher you rank on the leaderboard.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-[#1B023A]/90 border border-purple-700/50 hover:border-amber-400/60 rounded-2xl p-4 text-left space-y-2 transition shadow-xl relative overflow-hidden group">
              <div className="absolute top-2 right-3 text-2xl font-black text-purple-800/40 font-mono">
                04
              </div>
              <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/40 flex items-center justify-center text-yellow-400 group-hover:scale-110 transition">
                <Gift className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-white">4. Win</h3>
              <p className="text-xs text-purple-200/80 leading-snug">
                Top rankers get picked in monthly raffle draws and season-end prizes.
              </p>
            </div>
          </div>
        </div>

        {/* PREVIEW CARDS GRID: SAMPLE QUESTION & LEADERBOARD */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto w-full pt-2 items-stretch">
          {/* CARD 1: SAMPLE PREDICTION QUESTION CARD */}
          <div className="bg-gradient-to-b from-[#250352] to-[#14012C] border border-[#FF1E94]/40 rounded-3xl p-5 sm:p-6 shadow-2xl text-left space-y-3.5 relative flex flex-col justify-between h-full">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between gap-2 border-b border-purple-800/50 pb-2.5 relative">
                <span className="text-[10px] font-black uppercase tracking-wider bg-purple-900/80 border border-purple-600/50 px-2.5 py-1 rounded-full text-amber-300">
                  Sample Episode Question
                </span>
                
                {/* Top Right: Example Stake Amount + Info Button */}
                <div className="relative flex items-center gap-1">
                  <span className="text-[10px] text-pink-300 font-mono font-bold flex items-center gap-1 bg-purple-950/80 border border-purple-700/60 px-2 py-1 rounded-lg">
                    <Coins className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>Stake: 1,000 Fan Coins</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTooltip(activeTooltip === 'coins' ? null : 'coins')}
                    className="p-1 text-purple-300 hover:text-amber-300 transition focus:outline-none rounded-full bg-purple-900/60 border border-purple-700/50 cursor-pointer shrink-0"
                    title="Learn about Fan Coins"
                    aria-label="Fan Coins Info"
                  >
                    <Info className="w-3 h-3" />
                  </button>

                  {/* Tooltip Popover for Fan Coins */}
                  {activeTooltip === 'coins' && (
                    <div className="absolute right-0 top-8 z-30 w-64 bg-[#1B023A] border border-amber-400/60 rounded-xl p-3 shadow-2xl text-xs text-purple-100 space-y-1.5 backdrop-blur-md">
                      <div className="flex items-center justify-between font-bold text-amber-300 pb-1 border-b border-purple-800/60">
                        <span className="flex items-center gap-1.5"><Coins className="w-3.5 h-3.5 text-amber-400" /> Free Fan Coins</span>
                        <button onClick={() => setActiveTooltip(null)} className="text-purple-400 hover:text-white text-xs px-1">✕</button>
                      </div>
                      <p className="text-[11px] leading-relaxed text-purple-200">
                        Fan Coins are free and refresh weekly. Bet them on your prediction — no risk, no real money.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <h3 className="text-sm sm:text-base font-extrabold text-white leading-snug">
                Who will be saved from eviction first by Salman Khan during Weekend Ka Vaar?
              </h3>

              {/* Answer Options */}
              <div className="space-y-2 pt-0.5">
                {[
                  { label: 'Rhea Sharma', pct: '42% predicted', return: '2.5x' },
                  { label: 'Karan Veer', pct: '38% predicted', return: '2.8x' },
                  { label: 'Priya Malik', pct: '20% predicted', return: '4.5x' },
                ].map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedSampleOption(i)}
                    className={`w-full p-2.5 rounded-xl border text-xs font-extrabold flex items-center justify-between transition cursor-pointer ${
                      selectedSampleOption === i
                        ? 'bg-gradient-to-r from-[#FF1E94]/30 to-purple-800/50 border-amber-400 text-amber-300 shadow-md'
                        : 'bg-[#120128]/80 border-purple-700/40 text-purple-200/80 hover:border-purple-500'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          selectedSampleOption === i
                            ? 'border-amber-400 bg-amber-400 text-slate-950'
                            : 'border-purple-500'
                        }`}
                      >
                        {selectedSampleOption === i && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span>{opt.label}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[10px]">
                      <span className="opacity-75">{opt.pct}</span>
                      <span className="bg-purple-900/90 text-amber-300 px-1.5 py-0.5 rounded border border-purple-700/60 font-bold">{opt.return}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Potential Return Summary Indicator */}
              <div className="bg-purple-950/70 border border-purple-800/60 rounded-xl p-2.5 flex items-center justify-between text-xs text-purple-200 font-medium">
                <span className="text-[11px]">Selected Option Potential:</span>
                <span className="flex items-center gap-1 font-bold text-amber-300 font-mono text-xs">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  Win {selectedSampleOption === 0 ? '2,500' : selectedSampleOption === 1 ? '2,800' : '4,500'} Crowns
                </span>
              </div>

              {/* Realistic Prediction CTA Button */}
              <button
                type="button"
                className="w-full py-2.5 px-4 rounded-xl font-extrabold text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-lg shadow-amber-500/20 active:scale-[0.99] transition flex items-center justify-center gap-2 cursor-pointer border border-amber-300"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                <span>Lock In Prediction (1,000 Fan Coins)</span>
              </button>
            </div>

            {/* Bottom Line: Crowns Info */}
            <div className="relative pt-2 border-t border-purple-800/50">
              <div className="text-[10px] text-purple-300/80 text-center font-medium flex items-center justify-center gap-1.5 flex-wrap">
                <span>💡 Correct predictions earn <span className="text-amber-300 font-bold">Crowns</span> to climb the leaderboard!</span>
                <button
                  type="button"
                  onClick={() => setActiveTooltip(activeTooltip === 'crowns' ? null : 'crowns')}
                  className="inline-flex items-center gap-1 p-0.5 px-2 text-[10px] font-semibold text-amber-300 hover:text-amber-200 bg-purple-900/80 border border-amber-400/50 hover:border-amber-400 rounded-full transition cursor-pointer"
                  title="Learn about Crowns"
                  aria-label="Crowns Info"
                >
                  <Info className="w-3 h-3 text-amber-400" />
                  <span>Info</span>
                </button>
              </div>

              {/* Tooltip Popover for Crowns */}
              {activeTooltip === 'crowns' && (
                <div className="absolute left-1/2 -translate-x-1/2 bottom-8 z-30 w-72 bg-[#1B023A] border border-amber-400/60 rounded-xl p-3 shadow-2xl text-xs text-purple-100 space-y-1.5 backdrop-blur-md">
                  <div className="flex items-center justify-between font-bold text-amber-300 pb-1 border-b border-purple-800/60">
                    <span className="flex items-center gap-1.5"><Trophy className="w-3.5 h-3.5 text-amber-400" /> Crown Scoring & Leaderboards</span>
                    <button onClick={() => setActiveTooltip(null)} className="text-purple-400 hover:text-white text-xs px-1">✕</button>
                  </div>
                  <p className="text-[11px] leading-relaxed text-purple-200">
                    Crowns are your score. The more Crowns you earn, the higher you rank — and top rankers win real prizes.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* CARD 2: LIVE LEADERBOARD PREVIEW CARD */}
          <div className="bg-gradient-to-b from-[#250352] to-[#14012C] border border-[#FF1E94]/40 rounded-3xl p-5 sm:p-6 shadow-2xl text-left space-y-3.5 relative flex flex-col justify-between h-full">
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between gap-2 border-b border-purple-800/50 pb-2.5">
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500/20 border border-amber-400/50 px-2.5 py-1 rounded-full text-amber-300 flex items-center gap-1.5">
                  <Trophy className="w-3 h-3 text-amber-400" />
                  Live Leaderboard Preview
                </span>
                <span className="text-[10px] text-purple-300/80 font-mono bg-purple-950/80 border border-purple-700/60 px-2 py-1 rounded-lg">
                  Season 1 Rank
                </span>
              </div>

              <div className="flex items-center justify-between pt-0.5">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span>Leaderboard</span>
                </h3>
                <span className="text-[10px] font-mono text-purple-300/60">Sample Data</span>
              </div>

              {/* Leaderboard Table / Entries */}
              <div className="space-y-1.5 pt-0.5">
                {[
                  { rank: 1, user: '@RealityKing', crowns: '14,850', badge: '#1 Crown Leader', badgeColor: 'bg-amber-400/20 text-amber-300 border-amber-400/50', rankBg: 'bg-amber-400 text-slate-950 font-black' },
                  { rank: 2, user: '@PriyaVibe', crowns: '12,400', badge: 'Raffle Qualified', badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-400/40', rankBg: 'bg-slate-300 text-slate-950 font-black' },
                  { rank: 3, user: '@DesiTVFan', crowns: '10,950', badge: 'Raffle Qualified', badgeColor: 'bg-amber-700/30 text-amber-200 border-amber-600/40', rankBg: 'bg-amber-700 text-amber-100 font-black' },
                  { rank: 4, user: '@SalmanFanatic', crowns: '8,700', badge: null, rankBg: 'bg-purple-900/80 text-purple-200 border border-purple-700/50' },
                  { rank: 5, user: '@BB_Insider', crowns: '7,250', badge: null, rankBg: 'bg-purple-900/80 text-purple-200 border border-purple-700/50' },
                  { rank: 6, user: '@DelhiDiva', crowns: '6,100', badge: null, rankBg: 'bg-purple-900/80 text-purple-200 border border-purple-700/50' },
                  { rank: 7, user: '@MumbaiRocker', crowns: '5,400', badge: null, rankBg: 'bg-purple-900/80 text-purple-200 border border-purple-700/50' },
                ].map((item) => (
                  <div
                    key={item.rank}
                    className="p-2 rounded-xl bg-[#120128]/80 border border-purple-800/40 flex items-center justify-between text-xs transition hover:border-purple-600/60"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center shrink-0 ${item.rankBg}`}>
                        {item.rank}
                      </div>
                      <span className="font-bold text-white text-xs">{item.user}</span>
                      {item.badge && (
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full border ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 font-mono font-bold text-amber-300 text-xs">
                      <span>{item.crowns}</span>
                      <span className="text-[10px] text-purple-300/60 font-sans font-normal">Crowns</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Line Info */}
            <div className="pt-2 border-t border-purple-800/50">
              <div className="text-[10px] text-purple-300/80 text-center font-medium flex items-center justify-center gap-1">
                <span>🏆 Top rankers automatically qualify for <strong className="text-amber-300 font-bold">Monthly Raffles</strong> & Season Prizes!</span>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ SECTION (Collapsible Accordion) */}
        <div className="max-w-2xl mx-auto w-full pt-6 space-y-6 text-left">
          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 text-amber-300 text-xs font-black uppercase tracking-wider">
              <HelpCircle className="w-4 h-4" />
              <span>Got Questions?</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-serif uppercase tracking-wide">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="bg-[#1A023B]/90 border border-purple-800/60 rounded-2xl overflow-hidden transition shadow-lg"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-4 flex items-center justify-between text-left gap-3 hover:bg-purple-900/30 transition cursor-pointer"
                  >
                    <span className="text-sm font-extrabold text-amber-200">
                      {item.question}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-amber-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-purple-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-purple-200/90 leading-relaxed border-t border-purple-800/40 bg-purple-950/40 animate-fadeIn">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Coming Soon Footer */}
      <footer className="mt-auto border-t border-purple-900/40 bg-[#0A0118] py-6 px-4 text-center text-xs text-purple-300/80 relative z-10 space-y-3">
        <div className="flex flex-wrap items-center justify-center gap-4 font-bold">
          <button
            onClick={onNavigateTerms}
            className="text-purple-300 hover:text-amber-300 underline transition cursor-pointer"
          >
            Terms of Service
          </button>
          <span className="text-purple-700">•</span>
          <button
            onClick={onNavigatePrivacy}
            className="text-purple-300 hover:text-amber-300 underline transition cursor-pointer"
          >
            Privacy Policy
          </button>
          <span className="text-purple-700">•</span>
          <a
            href="https://instagram.com/thefanmahal"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#FF1E94] hover:text-amber-300 font-extrabold underline transition"
          >
            IG @thefanmahal
          </a>
        </div>

        <p className="text-[10px] text-purple-400/50 font-mono">
          © 2026 Fanmahal Palace. Built for Reality TV Superfans across India.
        </p>
      </footer>
    </div>
  );
};

