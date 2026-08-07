import React, { useState } from 'react';
import { X, Share2, Copy, Check, Users, Sparkles, Gift } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const ReferralModal: React.FC = () => {
  const { showReferralModal, setShowReferralModal, user, claimReferralBonus } = useGame();
  const [friendCode, setFriendCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!showReferralModal) return null;

  const userCode = user?.referralCode || 'PALACE-782';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(userCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClaimReferral = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    const res = claimReferralBonus(friendCode);
    if (res.success) {
      setFeedback({ type: 'success', text: res.message });
      setFriendCode('');
    } else {
      setFeedback({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#28045A] to-[#14012C] border border-[#FF1E94]/40 rounded-3xl p-6 shadow-2xl text-purple-100">
        <button
          onClick={() => setShowReferralModal(false)}
          id="referral-modal-close"
          className="absolute top-4 right-4 p-2 text-purple-300 hover:text-white hover:bg-white/10 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF1E94] to-[#F5C542] p-0.5 shadow-lg mb-3">
            <div className="w-full h-full bg-[#1A023B] rounded-[14px] flex items-center justify-center">
              <Users className="w-6 h-6 text-[#F5C542]" />
            </div>
          </div>
          <h2 className="text-xl font-bold font-serif text-amber-300">
            Invite Friends & Earn Coins
          </h2>
          <p className="text-xs text-purple-300/80 mt-1">
            Get 100 Fan Coins per referral (Max 5/week = 500 Coins)
          </p>
        </div>

        {/* User's Referral Code Box */}
        <div className="p-4 bg-[#130129] rounded-2xl border border-purple-700/50 mb-5">
          <p className="text-xs font-semibold text-purple-200 mb-2">
            Your Personal Royal Referral Code:
          </p>
          <div className="flex items-center justify-between bg-[#1D0343] border border-amber-400/40 rounded-xl p-2.5">
            <span className="text-base font-extrabold tracking-wider text-amber-300 font-mono">
              {userCode}
            </span>
            <button
              onClick={handleCopyCode}
              id="copy-referral-code-btn"
              className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1 hover:opacity-90 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>
        </div>

        {/* Enter Friend's Referral Code */}
        <form onSubmit={handleClaimReferral} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-purple-200 mb-1">
              Have a friend's referral code?
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. PALACE-991"
                value={friendCode}
                onChange={(e) => setFriendCode(e.target.value.toUpperCase())}
                id="referral-input-code"
                className="flex-1 bg-[#130129] border border-purple-600/40 focus:border-[#FF1E94] rounded-xl px-3 py-2 text-xs font-bold text-amber-300 outline-none uppercase"
              />
              <button
                type="submit"
                id="claim-referral-btn"
                className="px-4 py-2 bg-gradient-to-r from-[#FF1E94] to-[#8B5CF6] hover:opacity-90 text-white font-bold text-xs rounded-xl shadow transition"
              >
                Claim +100
              </button>
            </div>
          </div>

          {feedback && (
            <p
              className={`text-xs p-2.5 rounded-xl text-center font-semibold ${
                feedback.type === 'success'
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                  : 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
              }`}
            >
              {feedback.text}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};
