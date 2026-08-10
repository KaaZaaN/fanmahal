import React, { useState, useEffect } from 'react';
import { FanmahalLogo } from '../components/FanmahalLogo';
import { TopAnnouncementBanner } from '../components/TopAnnouncementBanner';
import { Sparkles, Mail, CheckCircle2, ShieldCheck, Gift, Trophy, Bell, Lock, ArrowRight, Heart } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { useGame } from '../context/GameContext';

interface ComingSoonViewProps {
  onNavigateTerms: () => void;
  onNavigatePrivacy: () => void;
  onFounderBypass?: () => void;
}

const BASE_WAITLIST_COUNT = 223;

export const ComingSoonView: React.FC<ComingSoonViewProps> = ({
  onNavigateTerms,
  onNavigatePrivacy,
}) => {
  const { user, setShowAuthModal } = useGame();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [waitlistCount, setWaitlistCount] = useState<number>(BASE_WAITLIST_COUNT);

  // Subscribe to live waitlist count from Firestore, starting from base 223
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
      // Even if offline/network hiccup, treat as accepted for user UX
      setSubmitted(true);
      setEmail('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#110125] text-purple-100 font-sans flex flex-col relative overflow-hidden selection:bg-[#FF1E94] selection:text-white">
      {/* Background Radial Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#3A037A]/30 via-[#FF1E94]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -left-32 w-80 h-80 bg-[#31056C]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-[#FF1E94]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner (Unchanged Default Banner) */}
      <TopAnnouncementBanner />

      {/* Main Container */}
      <div className="flex-1 flex flex-col justify-center max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 relative z-10 text-center space-y-8 sm:space-y-10">
        
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

          <p className="text-lg sm:text-2xl font-extrabold text-white tracking-wide leading-snug">
            India's First Reality TV Fantasy Prediction Platform
          </p>
        </div>

        {/* Description */}
        <div className="max-w-xl mx-auto bg-[#1C023E]/80 border border-purple-800/60 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-4">
          <p className="text-sm sm:text-base text-purple-200/90 leading-relaxed font-medium">
            Predict reality TV outcomes, stake free Fan Coins, win real hampers, vouchers & prizes — <strong className="text-amber-300 font-black">100% free forever, zero money staked.</strong>
          </p>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-2 text-center text-xs font-bold text-amber-200">
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
              <span className="text-[11px] leading-tight">Real Prize Hampers</span>
            </div>
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
