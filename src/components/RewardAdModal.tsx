import React, { useState, useEffect } from 'react';
import { X, PlayCircle, Coins, Sparkles, CheckCircle2, ShieldCheck, Tv } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const RewardAdModal: React.FC = () => {
  const { showAdModal, setShowAdModal, user, watchRewardAd } = useGame();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [resultMsg, setResultMsg] = useState('');

  useEffect(() => {
    let interval: any;
    if (isPlaying && progress < 100) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsPlaying(false);
            setIsCompleted(true);
            return 100;
          }
          return prev + 20; // 5 steps (5 seconds)
        });
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isPlaying, progress]);

  if (!showAdModal) return null;

  const handleStartAd = () => {
    setIsPlaying(true);
    setProgress(0);
    setIsCompleted(false);
    setResultMsg('');
  };

  const handleClaimReward = () => {
    const res = watchRewardAd();
    if (res.success) {
      setResultMsg(res.message);
      setTimeout(() => {
        setShowAdModal(false);
        setIsCompleted(false);
        setProgress(0);
        setResultMsg('');
      }, 1500);
    } else {
      setResultMsg(res.message);
    }
  };

  const adsRemaining = user ? Math.max(0, 5 - user.adsWatchedThisWeek) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#28045A] to-[#14012C] border border-amber-400/50 rounded-3xl p-6 shadow-2xl text-purple-100">
        <button
          onClick={() => {
            setShowAdModal(false);
            setIsPlaying(false);
            setProgress(0);
          }}
          id="ad-modal-close"
          className="absolute top-4 right-4 p-2 text-purple-300 hover:text-white hover:bg-white/10 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/40 mb-3">
            <Coins className="w-6 h-6 text-amber-400" />
          </div>
          <h2 className="text-xl font-bold font-serif text-amber-300">
            Watch Promo & Earn +100 Fan Coins
          </h2>
          <p className="text-xs text-purple-300/80 mt-1">
            Free Coins • No Purchase Required ({user?.adsWatchedThisWeek || 0}/5 watched this week)
          </p>
        </div>

        {/* Video Player Box */}
        <div className="relative aspect-video bg-[#0E0121] rounded-2xl border border-purple-700/50 overflow-hidden flex flex-col items-center justify-center p-4 mb-5 shadow-inner">
          {!isPlaying && !isCompleted && (
            <div className="text-center">
              <Tv className="w-10 h-10 text-amber-400 mx-auto mb-2 opacity-80" />
              <p className="text-xs font-bold text-white mb-1">
                Bigg Boss Season 19 Official Teaser
              </p>
              <p className="text-[11px] text-purple-300/70 mb-3">
                Watch short 5-second teaser clip to earn +100 Fan Coins
              </p>
              <button
                onClick={handleStartAd}
                disabled={adsRemaining <= 0}
                id="start-ad-btn"
                className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:opacity-90 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 mx-auto transition disabled:opacity-50"
              >
                <PlayCircle className="w-4 h-4 fill-slate-950 text-amber-400" />
                <span>{adsRemaining > 0 ? 'Watch Teaser Ad' : 'Weekly Cap Reached'}</span>
              </button>
            </div>
          )}

          {isPlaying && (
            <div className="w-full text-center space-y-3">
              <div className="animate-pulse">
                <span className="text-xs font-bold text-amber-300">
                  ▶ Playing Teaser Video... {Math.round(progress / 20)}s / 5s
                </span>
              </div>
              <div className="w-full bg-purple-950 rounded-full h-3 border border-purple-700/50 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-400 to-[#FF1E94] h-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {isCompleted && (
            <div className="text-center animate-fadeIn">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-emerald-300 mb-2">
                Video Complete!
              </p>
              <button
                onClick={handleClaimReward}
                id="claim-ad-reward-btn"
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-400 to-teal-500 hover:opacity-90 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 mx-auto transition"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Claim +100 Fan Coins</span>
              </button>
            </div>
          )}
        </div>

        {resultMsg && (
          <p className="text-xs text-center font-bold text-amber-300 mb-3 bg-amber-400/10 p-2.5 rounded-xl border border-amber-400/30">
            {resultMsg}
          </p>
        )}

        <div className="text-[11px] text-purple-300/70 text-center flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Earn up to 500 Fan Coins/week watching reward promo clips.</span>
        </div>
      </div>
    </div>
  );
};
