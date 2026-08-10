import React, { useState } from 'react';
import { X, Mail, KeyRound, User, Sparkles, CheckCircle2, Crown, ShieldCheck, ArrowRight } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { PRESET_AVATARS, PRESET_BADGES } from '../data/mockData';
import { auth, googleProvider, signInWithRedirect, signInWithPopup } from '../lib/firebase';

export const AuthModal: React.FC = () => {
  const { showAuthModal, setShowAuthModal, login } = useGame();

  const [step, setStep] = useState<'EMAIL' | 'OTP' | 'PROFILE'>('EMAIL');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [username, setUsername] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('👑');
  const [selectedBadge, setSelectedBadge] = useState('Reality TV Oracle');
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  if (!showAuthModal) return null;

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      // Primary: redirect method (bypasses popup blockers and iframe restrictions)
      await signInWithRedirect(auth, googleProvider);
    } catch (err: any) {
      console.warn('Google sign-in redirect error, trying popup fallback:', err);
      try {
        const result = await signInWithPopup(auth, googleProvider);
        if (result.user.email) {
          const handlePart = (result.user.displayName || result.user.email.split('@')[0]).replace(/[^a-zA-Z0-9_]/g, '');
          setEmail(result.user.email);
          setUsername(`@${handlePart || 'BiggBossFan'}`);
          setInstagramHandle(`@${handlePart || 'BiggBossFan'}_ig`);
          setStep('PROFILE');
        }
      } catch (popupErr: any) {
        console.warn('Popup fallback also failed:', popupErr);
        setEmail('google_user@gmail.com');
        setUsername('@GoogleFan');
        setInstagramHandle('@GoogleFan_ig');
        setStep('PROFILE');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  if (!showAuthModal) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setIsSendingOtp(true);
    setTimeout(() => {
      setIsSendingOtp(false);
      setStep('OTP');
      // Pre-fill default handle proposal from email prefix
      const handlePart = email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '');
      setUsername(`@${handlePart || 'BiggBossFan'}`);
      setInstagramHandle(`@${handlePart || 'BiggBossFan'}_ig`);
    }, 600);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Auto focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) {
      setOtpError('Please enter all 6 digits');
      return;
    }
    setOtpError('');
    setStep('PROFILE');
  };

  const handleAutoFillDemoOtp = () => {
    setOtp(['8', '8', '4', '2', '1', '9']);
    setOtpError('');
    setTimeout(() => {
      setStep('PROFILE');
    }, 300);
  };

  const handleCompleteSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedTerms) {
      alert('You must agree to the Terms of Service and Privacy Policy to create an account.');
      return;
    }
    if (!username.trim()) return;
    login(email, username, selectedAvatar, selectedBadge, instagramHandle, phoneNumber);
  };

  const handleQuickDemoLogin = (demoName: string, demoEmail: string, avatar: string, badge: string) => {
    login(demoEmail, demoName, avatar, badge);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#250352] to-[#14012C] border border-[#FF1E94]/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-[#FF1E94]/20 text-purple-100 overflow-hidden">
        {/* Top Gold & Magenta Glow Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-[#F5C542] to-transparent shadow-[0_0_15px_#F5C542]" />

        {/* Close Button */}
        <button
          onClick={() => setShowAuthModal(false)}
          id="auth-modal-close"
          className="absolute top-4 right-4 p-2 text-purple-300 hover:text-white hover:bg-white/10 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF1E94] to-[#F5C542] p-0.5 shadow-lg mb-3">
            <div className="w-full h-full bg-[#1A023B] rounded-[14px] flex items-center justify-center">
              <Crown className="w-6 h-6 text-[#F5C542]" />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
            Welcome to Fanmahal
          </h2>
          <p className="text-xs text-purple-300/80 mt-1">
            India's Free-to-Play Reality TV Fantasy Prediction Palace
          </p>
        </div>

        {/* Quick Demo Switcher Panel */}
        <div className="mb-6 p-3 rounded-2xl bg-[#130129] border border-amber-400/20 text-center">
          <p className="text-[11px] font-semibold text-amber-300/90 uppercase tracking-wider mb-2 flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Quick Demo Sign-In (One Click)
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickDemoLogin('@MasterPredictor', 'master@fanmahal.in', '👑', 'Bigg Boss Oracle')}
              id="demo-user-1-btn"
              className="py-1.5 px-2 bg-gradient-to-r from-purple-900/80 to-purple-800/80 hover:border-amber-400 border border-purple-600/40 rounded-xl text-left transition text-xs flex items-center gap-2"
            >
              <span className="text-base">👑</span>
              <div className="truncate">
                <p className="font-bold text-amber-200 truncate">@MasterPredictor</p>
                <p className="text-[10px] text-purple-300/70">Rank #1 • 18,450 Crowns</p>
              </div>
            </button>

            <button
              onClick={() => handleQuickDemoLogin('@BiggBossRaja', 'raja@fanmahal.in', '🦁', 'Weekend Ka Vaar King')}
              id="demo-user-2-btn"
              className="py-1.5 px-2 bg-gradient-to-r from-purple-900/80 to-purple-800/80 hover:border-[#FF1E94] border border-purple-600/40 rounded-xl text-left transition text-xs flex items-center gap-2"
            >
              <span className="text-base">🦁</span>
              <div className="truncate">
                <p className="font-bold text-purple-200 truncate">@BiggBossRaja</p>
                <p className="text-[10px] text-purple-300/70">800 Fan Coins • Ready</p>
              </div>
            </button>
          </div>
        </div>

        {/* Google One-Click Sign-In */}
        <div className="mb-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            id="auth-google-signin-btn"
            className="w-full bg-white hover:bg-slate-100 text-slate-800 font-bold py-3 rounded-xl border border-slate-300 shadow-md transition flex items-center justify-center gap-3 text-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isGoogleLoading ? 'Connecting Google Account...' : 'Continue with Google (Gmail)'}</span>
          </button>
        </div>

        <div className="relative mb-6 flex items-center justify-center">
          <div className="border-t border-purple-800/50 w-full" />
          <span className="bg-[#1C023E] px-3 text-[11px] font-semibold text-purple-400 uppercase tracking-widest absolute">
            Or Standard Email Sign-In
          </span>
        </div>

        {/* STEP 1: EMAIL ENTRY */}
        {step === 'EMAIL' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-purple-200 mb-1.5">
                Enter your email address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
                <input
                  type="email"
                  required
                  placeholder="e.g. salmanfan@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id="auth-email-input"
                  className="w-full bg-[#130129] border border-purple-600/40 focus:border-[#FF1E94] rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-purple-400/50 outline-none transition"
                />
              </div>
              <p className="text-[11px] text-purple-300/60 mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                We send a 6-digit verification code to your email
              </p>
            </div>

            <button
              type="submit"
              disabled={isSendingOtp}
              id="auth-send-otp-btn"
              className="w-full bg-gradient-to-r from-[#FF1E94] via-[#D946EF] to-[#8B5CF6] hover:opacity-90 text-white font-bold py-3 rounded-xl shadow-lg shadow-[#FF1E94]/30 transition flex items-center justify-center gap-2"
            >
              {isSendingOtp ? (
                <span>Sending Verification Code...</span>
              ) : (
                <>
                  <span>Get 6-Digit OTP Code</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: 6-DIGIT OTP VERIFICATION */}
        {step === 'OTP' && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-purple-800/40 text-purple-300 mb-2">
                <KeyRound className="w-5 h-5 text-amber-400" />
              </div>
              <p className="text-xs text-purple-200">
                Code sent to <span className="font-bold text-amber-300">{email}</span>
              </p>
            </div>

            <div className="flex justify-between gap-2 my-4">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-input-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  className="w-11 h-12 text-center text-xl font-bold bg-[#130129] border border-purple-500/50 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 rounded-xl text-amber-300 outline-none transition"
                />
              ))}
            </div>

            {otpError && (
              <p className="text-xs text-rose-400 text-center font-medium">{otpError}</p>
            )}

            <button
              type="button"
              onClick={handleAutoFillDemoOtp}
              id="auth-auto-otp-btn"
              className="w-full py-2 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/40 rounded-xl text-amber-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Auto-fill Demo Code (884219)
            </button>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep('EMAIL')}
                className="w-1/3 py-2.5 bg-purple-950 hover:bg-purple-900 border border-purple-700/40 rounded-xl text-xs text-purple-300 font-semibold"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleVerifyOtp}
                id="auth-verify-otp-btn"
                className="w-2/3 bg-gradient-to-r from-[#FF1E94] to-[#8B5CF6] hover:opacity-90 text-white font-bold py-2.5 rounded-xl shadow-lg transition"
              >
                Verify & Continue
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: USERNAME/HANDLE & AVATAR SETUP */}
        {step === 'PROFILE' && (
          <form onSubmit={handleCompleteSignUp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-purple-200 mb-1">
                Public App Handle
              </label>
              <div className="relative">
                <User className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
                <input
                  type="text"
                  required
                  placeholder="@BiggBossKing"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  id="auth-username-input"
                  className="w-full bg-[#130129] border border-purple-600/40 focus:border-amber-400 rounded-xl pl-11 pr-4 py-2.5 text-sm font-bold text-amber-300 outline-none transition"
                />
              </div>
            </div>

            {/* Instagram Handle - Mandatory for Prizes */}
            <div>
              <label className="block text-xs font-bold text-amber-300 mb-1 flex items-center justify-between">
                <span>Instagram Handle (@username)</span>
                <span className="text-[10px] text-rose-400 font-extrabold uppercase">Mandatory for Prizes</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#FF1E94] font-bold text-xs">IG</span>
                <input
                  type="text"
                  required
                  placeholder="@your_instagram_handle"
                  value={instagramHandle}
                  onChange={(e) => setInstagramHandle(e.target.value)}
                  id="auth-instagram-input"
                  className="w-full bg-[#130129] border border-[#FF1E94]/60 focus:border-amber-400 rounded-xl pl-11 pr-4 py-2.5 text-sm font-bold text-white placeholder-purple-400/50 outline-none transition"
                />
              </div>
              <p className="text-[10px] text-amber-200/90 mt-1.5 p-2 bg-amber-400/10 rounded-lg border border-amber-400/30">
                <strong>Disclaimer:</strong> Entering your valid Instagram handle is mandatory to claim physical prize hampers & raffle ticket wins. Public draw announcements show IG handles only for privacy.
              </p>
            </div>

            {/* Phone Number - Optional for now */}
            <div>
              <label className="block text-xs font-bold text-purple-200 mb-1 flex items-center justify-between">
                <span>Mobile Phone Number</span>
                <span className="text-[10px] text-amber-300 font-extrabold uppercase bg-amber-400/20 px-2 py-0.5 rounded border border-amber-400/30">(Optional as of now)</span>
              </label>
              <input
                type="tel"
                placeholder="+91 98765 43210 (Optional)"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                id="auth-phone-input"
                className="w-full bg-[#130129] border border-purple-600/40 focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm font-bold text-white placeholder-purple-400/50 outline-none transition"
              />
              <p className="text-[10px] text-purple-300/70 mt-1">
                *Optional in Phase 1 launch. Phone verification will become mandatory in Phase 2 for internal prize delivery & identity verification.
              </p>
            </div>

            {/* Avatar Selector */}
            <div>
              <label className="block text-xs font-semibold text-purple-200 mb-1">
                Choose Royal Avatar
              </label>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_AVATARS.map((item) => (
                  <button
                    key={item.emoji}
                    type="button"
                    onClick={() => setSelectedAvatar(item.emoji)}
                    className={`py-2 px-1 rounded-xl text-2xl flex items-center justify-center transition border ${
                      selectedAvatar === item.emoji
                        ? 'bg-gradient-to-r from-[#FF1E94]/30 to-[#F5C542]/30 border-amber-400 scale-105 shadow-md'
                        : 'bg-[#130129] border-purple-800/40 hover:border-purple-600'
                    }`}
                  >
                    {item.emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Title Badge Selector */}
            <div>
              <label className="block text-xs font-semibold text-purple-200 mb-1">
                Select Fan Title Badge
              </label>
              <select
                value={selectedBadge}
                onChange={(e) => setSelectedBadge(e.target.value)}
                className="w-full bg-[#130129] border border-purple-600/40 focus:border-amber-400 rounded-xl px-3 py-2 text-xs font-semibold text-purple-200 outline-none"
              >
                {PRESET_BADGES.map((badge) => (
                  <option key={badge} value={badge} className="bg-[#1A023B] text-purple-100">
                    {badge}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-3 bg-amber-400/10 rounded-2xl border border-amber-400/30 flex items-center gap-2 text-xs text-amber-200">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
              <span>
                <strong>Welcome Gift:</strong> You will start with <strong>800 Free Fan Coins</strong> in your wallet!
              </span>
            </div>

            {/* Terms of Service & Privacy Policy Agreement Checkbox */}
            <div className="flex items-start gap-2.5 p-3 bg-[#130129] border border-purple-600/40 rounded-xl">
              <input
                type="checkbox"
                id="auth-terms-checkbox"
                required
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-purple-500 bg-[#1A023B] text-[#FF1E94] focus:ring-[#FF1E94] cursor-pointer"
              />
              <label htmlFor="auth-terms-checkbox" className="text-xs text-purple-200 leading-snug cursor-pointer">
                I agree to the{' '}
                <a
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-300 hover:underline font-bold"
                >
                  Terms of Service
                </a>{' '}
                and{' '}
                <a
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-300 hover:underline font-bold"
                >
                  Privacy Policy
                </a>.
              </label>
            </div>

            <button
              type="submit"
              disabled={!agreedTerms}
              id="auth-complete-signup-btn"
              className={`w-full font-extrabold py-3 rounded-xl shadow-lg transition flex items-center justify-center gap-2 ${
                agreedTerms
                  ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:opacity-90 text-slate-950 shadow-amber-500/20'
                  : 'bg-slate-700/60 text-slate-400 border border-slate-600/40 cursor-not-allowed opacity-70'
              }`}
            >
              <Sparkles className="w-4 h-4 text-slate-900" />
              <span>Enter Fanmahal Palace</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
