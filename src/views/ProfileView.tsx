import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { User, Coins, Crown, Sparkles, Tv, ShieldCheck, RefreshCw, CheckCircle2, Clock, XCircle, Users, Edit3, Save, Gift, AlertTriangle, ExternalLink, Copy, Check, Share2 } from 'lucide-react';
import { PRESET_AVATARS, PRESET_BADGES } from '../data/mockData';
import { calculateRaffleTickets } from '../utils/raffle';

export const ProfileView: React.FC = () => {
  const {
    user,
    questions,
    predictions,
    updateProfile,
    claimWeeklyCoins,
    setShowAdModal,
    setShowReferralModal,
    setShowRaffleModal,
    resetDemoData,
    setShowAuthModal,
  } = useGame();

  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState(user?.username || '');
  const [editInstagramHandle, setEditInstagramHandle] = useState(user?.instagramHandle || '');
  const [editPhoneNumber, setEditPhoneNumber] = useState(user?.phoneNumber || '');
  const [editAvatar, setEditAvatar] = useState(user?.avatar || '👑');
  const [editBadge, setEditBadge] = useState(user?.titleBadge || 'Royal Predictor');
  const [codeCopied, setCodeCopied] = useState(false);

  const handleCopyReferralCode = () => {
    if (!user?.referralCode) return;
    navigator.clipboard.writeText(user.referralCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  if (!user) {
    return (
      <div className="text-center py-16 bg-[#170234] rounded-3xl border border-purple-800/40 p-8 max-w-lg mx-auto">
        <User className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-60" />
        <h2 className="text-2xl font-bold text-white mb-2">Sign In Required</h2>
        <p className="text-xs text-purple-300 mb-6">
          Sign in or create a royal handle to view your Fan Coins, Crowns & Prediction History!
        </p>
        <button
          onClick={() => setShowAuthModal(true)}
          id="profile-signin-btn"
          className="px-6 py-3 bg-gradient-to-r from-[#FF1E94] to-[#8B5CF6] text-white font-bold text-sm rounded-xl shadow-lg"
        >
          Sign In / Create Handle
        </button>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(
      editUsername,
      editAvatar,
      editBadge,
      editInstagramHandle,
      editPhoneNumber
    );
    setIsEditing(false);
  };

  // Compute prediction stats & raffle tickets
  const predList = Object.values(predictions) as import('../types').UserPrediction[];
  const totalPreds = predList.length;
  const wonPreds = predList.filter((p) => p.status === 'WON').length;
  const lostPreds = predList.filter((p) => p.status === 'LOST').length;
  const pendingPreds = predList.filter((p) => p.status === 'PENDING').length;
  const winRate = totalPreds > 0 ? Math.round((wonPreds / totalPreds) * 100) : 0;

  const raffleInfo = calculateRaffleTickets(user.monthlyCrowns || 0);
  const totalFriendsReferred = user.totalReferrals !== undefined ? user.totalReferrals : user.referralsThisWeek;
  const totalReferralCoinsEarned = totalFriendsReferred * 100;

  return (
    <div className="space-y-5 sm:space-y-6 pb-24">
      {/* USER PROFILE CARD */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#2B0460] via-[#1C023E] to-[#380675] border border-[#FF1E94]/30 shadow-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#FF1E94] to-[#F5C542] p-1 shadow-xl">
              <div className="w-full h-full bg-[#1A023B] rounded-[12px] flex items-center justify-center text-4xl">
                {user.avatar}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h1 className="text-2xl font-black text-white">{user.username}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold text-xs border border-amber-400/30">
                  {user.titleBadge}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FF1E94]/20 text-[#FF1E94] font-extrabold text-xs border border-[#FF1E94]/40 flex items-center gap-1">
                  <span>IG: {user.instagramHandle || 'Not set'}</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-900/60 text-purple-200 font-bold text-xs border border-purple-600/40">
                  <span>📱 Phone: {user.phoneNumber || 'Not provided'} <span className="text-[10px] text-amber-300 font-extrabold">(Optional)</span></span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold text-xs border border-blue-500/30">
                  <span>👤 Solo Contender</span>
                </span>
              </div>
              <p className="text-xs text-purple-300/80">
                Email: {user.email} • Joined {user.joinedDate}
              </p>
              <p className="text-[11px] text-purple-400 font-mono">
                Referral Code: <strong className="text-amber-300">{user.referralCode}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              id="edit-profile-toggle-btn"
              className="px-4 py-2 bg-purple-900/60 hover:bg-purple-800 border border-purple-600/50 rounded-xl text-xs font-bold text-purple-200 flex items-center gap-1.5 transition"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>
          </div>
        </div>

        {/* EDIT PROFILE FORM */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="mt-6 p-4 sm:p-6 rounded-2xl bg-[#12012B] border border-purple-700/50 space-y-4 animate-fadeIn">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">Edit Public Profile & Instagram Prize Delivery Details</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-purple-200 mb-1">
                  Public App Handle
                </label>
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="w-full bg-[#1A023B] border border-purple-600/40 rounded-xl px-3 py-2 text-xs font-bold text-amber-300 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-200 mb-1">
                  Title Badge
                </label>
                <select
                  value={editBadge}
                  onChange={(e) => setEditBadge(e.target.value)}
                  className="w-full bg-[#1A023B] border border-purple-600/40 rounded-xl px-3 py-2 text-xs font-semibold text-purple-200 outline-none"
                >
                  {PRESET_BADGES.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* MANDATORY INSTAGRAM HANDLE EDIT FIELD & DISCLAIMER */}
            <div className="p-3.5 rounded-xl bg-amber-400/10 border border-amber-400/40 space-y-2">
              <label className="block text-xs font-bold text-amber-300 flex items-center justify-between">
                <span>Instagram Handle (@username)</span>
                <span className="text-[10px] text-rose-400 font-extrabold uppercase">Mandatory for Prize Delivery</span>
              </label>
              <input
                type="text"
                required
                placeholder="@your_instagram_handle"
                value={editInstagramHandle}
                onChange={(e) => setEditInstagramHandle(e.target.value)}
                className="w-full bg-[#1A023B] border border-[#FF1E94]/60 focus:border-amber-400 rounded-xl px-3 py-2 text-xs font-bold text-white placeholder-purple-400/50 outline-none"
              />
              <p className="text-[11px] text-amber-200/90 leading-relaxed font-medium">
                <strong>⚠️ Mandatory Prize Delivery Disclaimer:</strong> Entering a valid Instagram handle (`@username`) is strictly required to receive physical brand sponsor hampers and raffle ticket prizes. All winner list announcements show Instagram Handles ONLY — your real name, email, and phone number are never shared publicly.
              </p>
            </div>

            {/* PHONE NUMBER FIELD */}
            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-700/40 space-y-1.5">
              <label className="block text-xs font-bold text-purple-200 flex items-center justify-between">
                <span>Phone Number</span>
                <span className="text-[10px] text-amber-300 font-black uppercase bg-amber-400/20 px-2 py-0.5 rounded border border-amber-400/30">(Optional as of now)</span>
              </label>
              <input
                type="tel"
                placeholder="+91 98765 43210 (Optional)"
                value={editPhoneNumber}
                onChange={(e) => setEditPhoneNumber(e.target.value)}
                className="w-full bg-[#1A023B] border border-purple-600/50 focus:border-amber-400 rounded-xl px-3 py-2 text-xs font-bold text-white placeholder-purple-400/50 outline-none"
              />
              <p className="text-[10px] text-purple-300/80 leading-snug">
                *Optional in Phase 1 launch. Phone verification will become mandatory in Phase 2 for internal prize delivery & identity verification.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-purple-200 mb-1">
                Avatar Emoji
              </label>
              <div className="flex gap-2">
                {PRESET_AVATARS.map((item) => (
                  <button
                    key={item.emoji}
                    type="button"
                    onClick={() => setEditAvatar(item.emoji)}
                    className={`p-2 rounded-xl text-xl border transition ${
                      editAvatar === item.emoji
                        ? 'bg-amber-400/20 border-amber-400'
                        : 'bg-[#1A023B] border-purple-800/40'
                    }`}
                  >
                    {item.emoji}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-extrabold text-xs rounded-xl shadow hover:opacity-90 transition"
            >
              Save Profile Changes
            </button>
          </form>
        )}
      </div>

      {/* CURRENCIES & EARNING HUB */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* FAN COINS WALLET CARD */}
        <div className="p-6 rounded-3xl bg-[#170234] border border-amber-400/40 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2.5 rounded-2xl bg-amber-400/20 text-amber-400 border border-amber-400/30">
                <Coins className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-amber-300/80 uppercase tracking-wider font-semibold block">Spending Currency</span>
                <h3 className="text-2xl font-black text-amber-300">{user.fanCoins} Fan Coins</h3>
              </div>
            </div>

            <span className="text-[10px] font-bold px-2 py-1 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
              100% FREE
            </span>
          </div>

          <p className="text-xs text-purple-200 leading-relaxed">
            Fan Coins are spent exclusively to stake on predictions. Coins are NEVER purchased with real money.
          </p>

          <div className="space-y-2 pt-2 border-t border-purple-800/40">
            {/* Action 1: Weekly Claim */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#12012B] border border-purple-800/40">
              <div>
                <p className="text-xs font-bold text-white">Weekly Free Refresh</p>
                <p className="text-[11px] text-purple-300/70">+800 Coins every Monday</p>
              </div>

              {user.weeklyRefreshAvailable ? (
                <button
                  onClick={claimWeeklyCoins}
                  id="profile-claim-weekly-btn"
                  className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs rounded-xl shadow"
                >
                  Claim 800
                </button>
              ) : (
                <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Claimed
                </span>
              )}
            </div>

            {/* Action 2: Watch Ad */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#12012B] border border-purple-800/40">
              <div>
                <p className="text-xs font-bold text-white">Watch Reward Promo Ad</p>
                <p className="text-[11px] text-purple-300/70">+100 Coins ({user.adsWatchedThisWeek}/5 watched)</p>
              </div>

              <button
                onClick={() => setShowAdModal(true)}
                id="profile-watch-ad-btn"
                className="px-3 py-1.5 bg-gradient-to-r from-[#FF1E94] to-[#8B5CF6] text-white font-bold text-xs rounded-xl shadow"
              >
                Watch (+100)
              </button>
            </div>

            {/* Action 3: Invite Friends */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#12012B] border border-purple-800/40">
              <div>
                <p className="text-xs font-bold text-white">Refer Friends</p>
                <p className="text-[11px] text-purple-300/70">+100 Coins per friend code</p>
              </div>

              <button
                onClick={() => setShowReferralModal(true)}
                id="profile-refer-btn"
                className="px-3 py-1.5 bg-purple-900 hover:bg-purple-800 border border-purple-600/50 text-purple-200 font-bold text-xs rounded-xl"
              >
                Invite Code
              </button>
            </div>
          </div>
        </div>

        {/* CROWNS & PERFORMANCE STATS CARD */}
        <div className="p-6 rounded-3xl bg-[#170234] border border-[#FF1E94]/40 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2.5 rounded-2xl bg-[#FF1E94]/20 text-[#FF1E94] border border-[#FF1E94]/30">
                <Crown className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <span className="text-xs text-purple-300 uppercase tracking-wider font-semibold block">Ranking Currency</span>
                <h3 className="text-2xl font-black text-yellow-300">{user.crowns.toLocaleString()} Crowns</h3>
              </div>
            </div>

            <span className="text-[10px] font-bold px-2 py-1 rounded bg-[#FF1E94]/20 text-purple-200 border border-[#FF1E94]/30">
              EARNED-ONLY
            </span>
          </div>

          <p className="text-xs text-purple-200 leading-relaxed">
            Crowns cannot be bought, sold, or spent. They accumulate strictly from correct predictions and determine your Leaderboard Rank!
          </p>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-purple-800/40 text-center">
            <div className="p-3 bg-[#12012B] rounded-2xl border border-purple-800/40">
              <span className="text-[10px] text-purple-300/80 uppercase font-semibold block">Season Crowns</span>
              <span className="text-lg font-black text-[#F5C542]">{user.crowns.toLocaleString()}</span>
            </div>

            <div className="p-3 bg-[#12012B] rounded-2xl border border-purple-800/40">
              <span className="text-[10px] text-purple-300/80 uppercase font-semibold block">Monthly Crowns</span>
              <span className="text-lg font-black text-amber-300">{(user.monthlyCrowns || 0).toLocaleString()}</span>
            </div>

            <div className="p-3 bg-[#12012B] rounded-2xl border border-purple-800/40">
              <span className="text-[10px] text-purple-300/80 uppercase font-semibold block">Win Rate</span>
              <span className="text-lg font-black text-emerald-400">{winRate}%</span>
            </div>
          </div>

          {/* TRACK 2 MONTHLY RAFFLE STANDING CARD */}
          <div className="p-4 rounded-2xl bg-[#12012B] border border-amber-400/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-[#FF1E94]" />
                <span className="text-xs font-black text-white">Reward Track 2: Monthly Raffle Tickets</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                {raffleInfo.tickets} 🎟️ Qualified
              </span>
            </div>

            <p className="text-[11px] text-purple-300/80">
              {raffleInfo.currentTierLabel}. Crowns earned this month automatically qualify you for the end-of-month 5-Round Random.org YouTube live draw!
            </p>

            {raffleInfo.nextTierThreshold && (
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-purple-300">Progress to Next Ticket</span>
                  <span className="text-amber-300">{raffleInfo.crownsNeededForNextTier.toLocaleString()} Crowns needed</span>
                </div>
                <div className="w-full h-2 bg-purple-950 rounded-full overflow-hidden border border-purple-800/50">
                  <div
                    className="h-full bg-gradient-to-r from-[#FF1E94] to-[#F5C542] rounded-full transition-all duration-500"
                    style={{ width: `${raffleInfo.progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            <button
              onClick={() => setShowRaffleModal(true)}
              id="profile-open-raffle-sim-btn"
              className="w-full py-2 bg-gradient-to-r from-purple-900/80 to-[#22034D] hover:border-amber-400 border border-purple-600/50 rounded-xl text-xs font-bold text-amber-300 flex items-center justify-center gap-1.5 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>View Live YouTube 5-Round Draw Simulator</span>
            </button>
          </div>
        </div>
      </div>

      {/* REFERRAL IMPACT & FRIENDS REFERRED SECTION */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#1E0345] via-[#170234] to-[#2B0460] border border-amber-400/40 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/30">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2 flex-wrap">
                <span>Referral Impact & Friends Invited</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-extrabold uppercase border border-amber-400/30">
                  +100 Coins / Friend
                </span>
              </h3>
              <p className="text-xs text-purple-300/80">
                Track your invited friends and total Fan Coins earned through referral bonuses!
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowReferralModal(true)}
            id="profile-referral-hub-btn"
            className="px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-extrabold text-xs rounded-xl shadow hover:opacity-90 transition flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Invite Friends / Enter Code</span>
          </button>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* FRIENDS REFERRED */}
          <div className="p-4 rounded-2xl bg-[#12012B] border border-purple-800/50 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-900/60 text-purple-300 border border-purple-700/40">
              <Users className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="text-[10px] text-purple-300/80 font-bold uppercase block">Friends Referred</span>
              <span className="text-xl font-black text-white">{totalFriendsReferred} {totalFriendsReferred === 1 ? 'Friend' : 'Friends'}</span>
            </div>
          </div>

          {/* REFERRAL COINS EARNED */}
          <div className="p-4 rounded-2xl bg-[#12012B] border border-amber-400/30 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/30">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-amber-300/80 font-bold uppercase block">Coins Earned</span>
              <span className="text-xl font-black text-amber-300">+{totalReferralCoinsEarned.toLocaleString()} Fan Coins</span>
            </div>
          </div>

          {/* WEEKLY CAP STATUS */}
          <div className="p-4 rounded-2xl bg-[#12012B] border border-purple-800/50 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-purple-300/80 font-bold uppercase block">Weekly Referral Limit</span>
              <span className="text-xl font-black text-emerald-400">{user.referralsThisWeek} / 5 <span className="text-xs font-normal text-purple-300">({user.referralsThisWeek * 100}/500 Coins)</span></span>
            </div>
          </div>
        </div>

        {/* PERSONAL REFERRAL CODE BAR */}
        <div className="p-3.5 rounded-2xl bg-[#130129] border border-purple-700/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-purple-200 font-semibold">Your Personal Referral Code:</span>
            <span className="px-3 py-1 bg-[#1D0343] border border-amber-400/40 rounded-xl text-sm font-extrabold text-amber-300 font-mono tracking-wider">
              {user.referralCode}
            </span>
          </div>

          <button
            onClick={handleCopyReferralCode}
            id="profile-copy-code-btn"
            className="px-3.5 py-1.5 bg-purple-900/80 hover:bg-purple-800 border border-purple-600/50 text-amber-300 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
          >
            {codeCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{codeCopied ? 'Code Copied!' : 'Copy Personal Code'}</span>
          </button>
        </div>
      </div>

      {/* USER PREDICTION HISTORY LOG TABLE */}
      <div className="bg-[#170234] border border-purple-800/40 rounded-3xl p-5 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Tv className="w-5 h-5 text-[#FF1E94]" />
          <span>Your Prediction History & Payouts</span>
        </h3>

        {predList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-purple-800/60 text-[11px] text-purple-300 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-3">Question</th>
                  <th className="py-3 px-3">Chosen Answer</th>
                  <th className="py-3 px-3 text-right">Coins Staked</th>
                  <th className="py-3 px-3 text-right">Potential Crowns</th>
                  <th className="py-3 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-800/30 text-xs font-medium">
                {predList.map((p) => {
                  const q = questions.find((item) => item.id === p.questionId);
                  const opt = q?.options.find((o) => o.id === p.optionId);

                  return (
                    <tr key={p.questionId} className="hover:bg-purple-900/20 transition">
                      <td className="py-3 px-3 max-w-xs truncate text-white font-bold">
                        {q ? q.title : p.questionId}
                      </td>
                      <td className="py-3 px-3 text-purple-200">
                        {opt ? opt.text : p.optionId}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-amber-300">
                        {p.coinsStaked} Coins
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-yellow-300">
                        +{p.potentialCrowns} Crowns
                      </td>
                      <td className="py-3 px-3 text-center">
                        {p.status === 'WON' && (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold border border-emerald-500/30">
                            WON (+{p.crownsEarned || p.potentialCrowns} 👑)
                          </span>
                        )}
                        {p.status === 'LOST' && (
                          <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                            LOST
                          </span>
                        )}
                        {p.status === 'PENDING' && (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                            PENDING
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-purple-300">
            No active predictions yet. Browse the home tab and stake your Fan Coins!
          </div>
        )}
      </div>

      {/* RESET DEMO BUTTON */}
      <div className="text-center pt-4">
        <button
          onClick={resetDemoData}
          id="reset-demo-data-btn"
          className="text-xs text-purple-400/80 hover:text-rose-300 underline font-mono transition"
        >
          Reset All Prototype Demo Data to Default
        </button>
      </div>
    </div>
  );
};
