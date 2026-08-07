import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Category, UserPrediction } from '../types';
import { PredictionCard } from '../components/PredictionCard';
import { Crown, Coins, Sparkles, Tv, Flame, Search, Filter, ShieldCheck, Zap, Gift, Clock } from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    user,
    questions,
    predictions,
    selectedShow,
    setSelectedShow,
    claimWeeklyCoins,
    setShowAdModal,
    setShowReferralModal,
    setShowSimulatorModal,
  } = useGame();

  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: (Category | 'All')[] = [
    'All',
    'Eviction',
    'Captaincy',
    'Fights & Drama',
    'Tasks',
    'Weekend Ka Vaar',
    'Season Long',
  ];

  const filteredQuestions = questions.filter((q) => {
    const matchesCat = selectedCategory === 'All' || q.category === selectedCategory;
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.subtitle && q.subtitle.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const activePredictionsCount = Object.keys(predictions).length;
  const totalPotentialCrowns = (Object.values(predictions) as UserPrediction[]).reduce((acc, p) => acc + p.potentialCrowns, 0);

  return (
    <div className="space-y-4 sm:space-y-5 pb-20">
      {/* REALITY TV SHOW SELECTOR BANNER */}
      <div className="p-3 rounded-2xl bg-[#130129] border border-purple-800/50 shadow-lg">
        <div className="flex items-center justify-between gap-2 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1 shrink-0 px-2">
              <Tv className="w-4 h-4 text-[#FF1E94]" />
              <span>Reality TV Shows:</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedShow('BIGG_BOSS')}
                id="show-select-bigg-boss"
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 shrink-0 border ${
                  selectedShow === 'BIGG_BOSS'
                    ? 'bg-gradient-to-r from-[#FF1E94] to-[#8B5CF6] text-white border-[#FF1E94] shadow-md'
                    : 'bg-[#1C023E] text-purple-300 border-purple-800/50 hover:border-purple-600'
                }`}
              >
                <span>👁️ Bigg Boss 20</span>
                <span className="px-1.5 py-0.2 text-[9px] bg-emerald-500 text-slate-950 font-black rounded-full uppercase">LIVE</span>
              </button>

              <button
                onClick={() => setSelectedShow('ROADIES')}
                id="show-select-roadies"
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 border ${
                  selectedShow === 'ROADIES'
                    ? 'bg-gradient-to-r from-[#FF1E94] to-[#8B5CF6] text-white border-[#FF1E94] shadow-md'
                    : 'bg-[#1C023E] text-purple-300 border-purple-800/50 hover:border-purple-600'
                }`}
              >
                <span>🏍️ MTV Roadies</span>
                <span className="px-1.5 py-0.2 text-[9px] bg-amber-400/20 text-amber-300 font-extrabold rounded-full">Phase 2</span>
              </button>

              <button
                onClick={() => setSelectedShow('SPLITSVILLA')}
                id="show-select-splitsvilla"
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 border ${
                  selectedShow === 'SPLITSVILLA'
                    ? 'bg-gradient-to-r from-[#FF1E94] to-[#8B5CF6] text-white border-[#FF1E94] shadow-md'
                    : 'bg-[#1C023E] text-purple-300 border-purple-800/50 hover:border-purple-600'
                }`}
              >
                <span>💘 Splitsvilla</span>
                <span className="px-1.5 py-0.2 text-[9px] bg-amber-400/20 text-amber-300 font-extrabold rounded-full">Phase 2</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SHOW COMING SOON BANNER FOR NON-BIGG-BOSS SHOWS */}
      {selectedShow !== 'BIGG_BOSS' && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-[#2B0460] to-[#170234] border border-amber-400/40 text-center space-y-3">
          <div className="inline-flex p-3 rounded-2xl bg-amber-400/20 text-amber-300">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-white">
            {selectedShow === 'ROADIES' && '🏍️ MTV Roadies League — Coming Soon in Phase 2!'}
            {selectedShow === 'SPLITSVILLA' && '💘 Splitsvilla League — Coming Soon in Phase 2!'}
          </h3>
          <p className="text-xs text-purple-200 max-w-md mx-auto leading-relaxed">
            Fanmahal is India's home for Reality TV fans. Phase 1 launch anchors with <strong>Bigg Boss 20</strong> (premiering Sept 21, 2026), and upcoming seasons of {selectedShow.replace('_', ' ')} will unlock predictions, weekly slates, and crown leaderboards upon premiere!
          </p>
          <button
            onClick={() => setSelectedShow('BIGG_BOSS')}
            id="back-to-bigg-boss-btn"
            className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-extrabold text-xs rounded-xl shadow hover:opacity-90 transition inline-flex items-center gap-2"
          >
            <span>Switch to Bigg Boss Live Predictions</span>
          </button>
        </div>
      )}

      {/* ROYAL PALACE HERO BANNER */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#2B0460] via-[#1A023B] to-[#380675] border border-[#FF1E94]/30 shadow-2xl p-6 sm:p-8">
        {/* Background Decorative Lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF1E94]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#FF1E94]/20 to-purple-800/40 border border-[#FF1E94]/40 text-amber-300 text-xs font-bold">
              <Flame className="w-3.5 h-3.5 text-[#FF1E94] animate-bounce" />
              <span>🔥 India's Home for Reality TV Fans • Weekly Prediction Palace</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold font-serif leading-tight text-white">
              Predict Reality TV Outcomes, Stake Coins & Win{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
                Royal Crowns!
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-purple-200/90 leading-relaxed">
              Choose your weekly predictions across evictions, captaincy tasks & house drama. Stake your free weekly Fan Coins to climb the Season Leaderboard and earn Monthly Raffle Tickets for Brand Hampers & Shopping Vouchers!
            </p>

            {/* Quick Stats Pill */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#12012B] border border-purple-800/40 text-xs">
                <Tv className="w-4 h-4 text-[#FF1E94]" />
                <span className="text-purple-200">
                  <strong>7 Questions</strong> Live This Week
                </span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#12012B] border border-purple-800/40 text-xs">
                <Crown className="w-4 h-4 text-amber-400" />
                <span className="text-amber-300">
                  Your Active Stakes: <strong>{activePredictionsCount} Predictions</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Right Action Box: Weekly Free Coin Refresher */}
          <div className="w-full md:w-auto bg-[#130129]/90 border border-amber-400/40 rounded-2xl p-4 shadow-xl text-center md:min-w-[260px] space-y-3">
            <div className="flex items-center justify-between border-b border-purple-800/40 pb-2">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                <Coins className="w-4 h-4 text-amber-400" />
                Weekly Free Coins
              </span>
              <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded font-mono font-bold">
                100% FREE
              </span>
            </div>

            {user?.weeklyRefreshAvailable ? (
              <div className="space-y-2">
                <p className="text-xs text-purple-200">
                  Your 800 Weekly Fan Coins are ready to collect!
                </p>
                <button
                  onClick={claimWeeklyCoins}
                  id="home-claim-weekly-btn"
                  className="w-full py-2.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:opacity-90 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Claim 800 Free Coins</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2 text-left">
                <div className="flex justify-between text-xs text-purple-300 font-medium">
                  <span>Weekly Refresh Claimed</span>
                  <span className="text-emerald-400 font-bold">✓ 800 Coins Added</span>
                </div>
                <p className="text-[11px] text-purple-300/70 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-purple-400" />
                  Next refresh: Monday 12:00 AM IST
                </p>
              </div>
            )}

            {/* Quick Earn extra buttons */}
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <button
                onClick={() => setShowAdModal(true)}
                id="home-watch-ad-btn"
                className="py-1.5 px-2 bg-purple-950 hover:bg-purple-900 border border-purple-700/50 rounded-xl text-[11px] text-amber-300 font-bold flex items-center justify-center gap-1 transition"
              >
                <span>+100 Watch Ad</span>
              </button>
              <button
                onClick={() => setShowReferralModal(true)}
                id="home-refer-friend-btn"
                className="py-1.5 px-2 bg-purple-950 hover:bg-purple-900 border border-purple-700/50 rounded-xl text-[11px] text-purple-200 font-bold flex items-center justify-center gap-1 transition"
              >
                <span>+100 Invite</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER BAR & SEARCH */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#170234] p-4 rounded-2xl border border-purple-800/40">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              id={`filter-cat-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-[#FF1E94] to-[#8B5CF6] text-white border-[#FF1E94] shadow-md'
                  : 'bg-[#12012B] text-purple-300 border-purple-800/50 hover:border-purple-600'
              }`}
            >
              {cat === 'All' ? '🔥 All 7 Questions' : cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
          <input
            type="text"
            placeholder="Search contestants, tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="home-search-input"
            className="w-full bg-[#12012B] border border-purple-800/50 focus:border-[#FF1E94] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-purple-400/50 outline-none"
          />
        </div>
      </div>

      {/* QUESTION CARDS LIST */}
      {filteredQuestions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredQuestions.map((q) => (
            <PredictionCard key={q.id} question={q} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-[#170234] rounded-3xl border border-purple-800/40 p-8">
          <Tv className="w-12 h-12 text-purple-400 mx-auto mb-3 opacity-60" />
          <p className="text-base font-bold text-white">No questions found</p>
          <p className="text-xs text-purple-300 mt-1">Try resetting search query or category filters.</p>
        </div>
      )}

      {/* Bottom Tester Helper Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/40 via-purple-800/30 to-purple-900/40 border border-amber-400/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-purple-200">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400 shrink-0" />
          <span>
            <strong>Testing Episode Resolutions:</strong> Use the <strong>"Sim Episode"</strong> button on any question card to simulate Bigg Boss outcomes and see live Crown payouts!
          </span>
        </div>
        <button
          onClick={() => setShowSimulatorModal(true)}
          id="home-bottom-sim-btn"
          className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl whitespace-nowrap shadow transition"
        >
          Open Episode Simulator
        </button>
      </div>
    </div>
  );
};
