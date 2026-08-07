import React, { useState } from 'react';
import { Question, Option } from '../types';
import { useGame } from '../context/GameContext';
import { Crown, Coins, Clock, Sparkles, CheckCircle2, Zap, AlertCircle, RefreshCw, XCircle } from 'lucide-react';

interface PredictionCardProps {
  question: Question;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({ question }) => {
  const { user, predictions, placePrediction, cancelPrediction, setShowSimulatorModal, setActiveSimulatorQuestionId } = useGame();

  const userPred = predictions[question.id];

  const [selectedOptionId, setSelectedOptionId] = useState<string>(
    userPred ? userPred.optionId : question.options[0]?.id || ''
  );
  const [stakeAmount, setStakeAmount] = useState<number>(userPred ? userPred.coinsStaked : 100);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const selectedOptionObj = question.options.find((o) => o.id === selectedOptionId);
  const potentialCrowns = Math.round(stakeAmount * question.multiplier);

  const handleQuickStake = (amount: number) => {
    setStakeAmount(amount);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const result = placePrediction(question.id, selectedOptionId, stakeAmount);
    if (result.success) {
      setFeedback({ type: 'success', text: result.message });
      setTimeout(() => setFeedback(null), 4000);
    } else {
      setFeedback({ type: 'error', text: result.message });
    }
  };

  const handleSimulateThisQuestion = () => {
    setActiveSimulatorQuestionId(question.id);
    setShowSimulatorModal(true);
  };

  // Category Color Badges
  const categoryStyles: Record<string, string> = {
    Eviction: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    Captaincy: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    'Fights & Drama': 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30',
    Tasks: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    'Weekend Ka Vaar': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    'Season Long': 'bg-yellow-400/20 text-yellow-200 border-yellow-400/40 font-bold',
  };

  return (
    <div
      id={`prediction-card-${question.id}`}
      className={`relative rounded-3xl p-5 sm:p-6 transition-all border-2 shadow-2xl ${
        question.resolved
          ? 'bg-black/90 border-purple-800/60 opacity-95 shadow-purple-950/40'
          : userPred
          ? 'bg-gradient-to-b from-[#15012a] via-[#0b0018] to-black border-[#FF1E94] shadow-2xl shadow-[#FF1E94]/20'
          : 'bg-gradient-to-b from-[#0e0222] via-[#070014] to-black border-purple-600/60 hover:border-[#FF1E94]/80 shadow-2xl shadow-purple-950/80'
      }`}
    >
      {/* Top Bar: Category, Deadline & Multiplier Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
              categoryStyles[question.category] || 'bg-purple-800/40 text-purple-200 border-purple-700/50'
            }`}
          >
            {question.category}
          </span>
          {question.episodeName && (
            <span className="text-[11px] text-purple-300/70 font-medium hidden sm:inline">
              • {question.episodeName}
            </span>
          )}
        </div>

        {/* Crown Multiplier Tag */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/40 text-amber-300 font-extrabold text-xs shadow-inner">
          <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>{question.multiplier}x Crowns Multiplier</span>
        </div>
      </div>

      {/* Question Title */}
      <h3 className="text-lg sm:text-xl font-bold text-white mb-1 leading-snug">
        {question.title}
      </h3>
      {question.subtitle && (
        <p className="text-xs text-purple-300/80 mb-4">{question.subtitle}</p>
      )}

      {/* Deadline Bar */}
      <div className="flex items-center gap-1.5 text-xs text-amber-200/90 bg-[#090017] px-3 py-1.5 rounded-xl border border-amber-400/30 mb-4 w-fit">
        <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>Deadline: <strong>{question.deadline}</strong></span>
      </div>

      {/* RESOLVED STATUS CARD */}
      {question.resolved ? (
        <div className="mt-4 p-4 rounded-2xl bg-[#090017] border border-purple-700/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Episode Outcome Declared
            </span>
            <span className="text-xs text-purple-400 font-mono">Status: Closed</span>
          </div>

          <p className="text-sm font-semibold text-emerald-300 mb-3 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-500/30">
            {question.resolutionNote}
          </p>

          {/* User Result */}
          {userPred ? (
            userPred.status === 'WON' ? (
              <div className="p-3 bg-gradient-to-r from-amber-500/20 to-emerald-500/20 rounded-xl border border-amber-400/50 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-amber-300 flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    PREDICTION WON!
                  </p>
                  <p className="text-xs text-purple-200">
                    You staked {userPred.coinsStaked} Fan Coins on "{selectedOptionObj?.text}"
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-extrabold text-yellow-300 flex items-center gap-1">
                    <Crown className="w-5 h-5 text-amber-400" />
                    +{userPred.crownsEarned || userPred.potentialCrowns} Crowns
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-rose-950/40 rounded-xl border border-rose-500/30 flex items-center justify-between text-xs text-rose-300">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Your prediction was incorrect ({userPred.coinsStaked} Fan Coins staked)</span>
                </div>
                <span className="font-bold text-rose-400">0 Crowns</span>
              </div>
            )
          ) : (
            <p className="text-xs text-purple-400 italic">You did not make a prediction for this question.</p>
          )}
        </div>
      ) : (
        /* OPEN / ACTIVE PREDICTION FORM */
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Options Selection List */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-purple-200 flex items-center justify-between">
              <span>Select Your Prediction:</span>
              <span className="text-[11px] text-purple-400 font-normal">
                Includes neutral option
              </span>
            </p>

            <div className="space-y-2">
              {question.options.map((opt: Option) => {
                const isSelected = selectedOptionId === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedOptionId(opt.id)}
                    id={`option-${question.id}-${opt.id}`}
                    className={`w-full text-left p-3 rounded-2xl transition relative overflow-hidden border ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#FF1E94]/30 via-purple-900/50 to-[#FF1E94]/20 border-2 border-[#FF1E94] shadow-md'
                        : 'bg-[#150a2a] border-purple-700/50 hover:border-purple-400 text-purple-100'
                    }`}
                  >
                    {/* Progress Bar Background for Community Consensus */}
                    <div
                      className="absolute left-0 top-0 bottom-0 bg-purple-700/15 transition-all pointer-events-none"
                      style={{ width: `${opt.communityPercent}%` }}
                    />

                    <div className="relative flex items-center justify-between gap-2 z-10">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'border-[#FF1E94] bg-[#FF1E94]'
                              : 'border-purple-500/50 bg-transparent'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>

                        <div>
                          <span className={`text-xs sm:text-sm font-semibold ${isSelected ? 'text-white' : 'text-purple-200'}`}>
                            {opt.text}
                          </span>
                          {opt.isNeutral && (
                            <span className="ml-2 text-[10px] px-1.5 py-0.2 rounded bg-purple-800/60 text-purple-300 font-mono">
                              Neutral Option
                            </span>
                          )}
                        </div>
                      </div>

                      <span className="text-xs font-medium text-purple-300 shrink-0">
                        {opt.communityPercent}% fans
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Staking Section */}
          <div className="p-4 rounded-2xl bg-[#0d031c] border border-purple-700/50 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-purple-200 flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-amber-400" />
                <span>Play Free Fan Coins:</span>
              </label>

              <div className="text-xs text-amber-300 font-bold flex items-center gap-1">
                <span>Available: {user ? user.fanCoins : 0}</span>
                <Coins className="w-3.5 h-3.5 text-amber-400" />
              </div>
            </div>

            {/* Quick Stake Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {[50, 100, 200, 500].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleQuickStake(amt)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition border ${
                    stakeAmount === amt
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm'
                      : 'bg-[#1a0c33] text-purple-200 border-purple-600/50 hover:border-amber-400/60'
                  }`}
                >
                  {amt} Coins
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleQuickStake(user ? user.fanCoins : 500)}
                className="px-3 py-1 rounded-xl text-xs font-extrabold bg-gradient-to-r from-[#FF1E94] to-[#8B5CF6] text-white transition border border-[#FF1E94]"
              >
                Max
              </button>
            </div>

            {/* Stake Input Slider */}
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={10}
                max={Math.max(user ? user.fanCoins : 1000, 100)}
                step={10}
                value={stakeAmount}
                onChange={(e) => setStakeAmount(Number(e.target.value))}
                className="w-full accent-[#FF1E94] cursor-pointer"
              />
              <input
                type="number"
                min={10}
                max={user ? user.fanCoins : 10000}
                value={stakeAmount}
                onChange={(e) => setStakeAmount(Number(e.target.value))}
                className="w-20 bg-[#160630] border border-purple-600/50 rounded-xl px-2.5 py-1 text-xs font-bold text-amber-300 text-center outline-none"
              />
            </div>

            {/* Potential Crown Reward Calculation Box */}
            <div className="p-3 bg-gradient-to-r from-[#FF1E94]/20 via-purple-950/60 to-[#F5C542]/20 rounded-xl border border-amber-400/40 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-purple-300/80 uppercase tracking-wider font-semibold">
                  Potential Crown Payout
                </p>
                <p className="text-xs text-purple-200 font-medium">
                  {stakeAmount} Coins × {question.multiplier}x Multiplier
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <Crown className="w-5 h-5 text-amber-400 drop-shadow-[0_1px_3px_rgba(245,197,66,0.8)]" />
                <span className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
                  +{potentialCrowns.toLocaleString()} Crowns
                </span>
              </div>
            </div>
          </div>

          {/* Feedback message */}
          {feedback && (
            <div
              className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                feedback.type === 'success'
                  ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300'
                  : 'bg-rose-950/80 border border-rose-500/50 text-rose-300'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              )}
              <span>{feedback.text}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            {userPred ? (
              <>
                <button
                  type="submit"
                  id={`submit-prediction-${question.id}`}
                  className="flex-1 bg-gradient-to-r from-[#FF1E94] via-[#D946EF] to-[#8B5CF6] hover:opacity-90 text-white font-bold py-3 rounded-xl shadow-lg transition text-xs sm:text-sm flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Update Prediction ({stakeAmount} Coins)</span>
                </button>

                <button
                  type="button"
                  onClick={() => cancelPrediction(question.id)}
                  id={`cancel-prediction-${question.id}`}
                  className="px-3 py-3 bg-purple-950 hover:bg-rose-900/60 border border-purple-700/40 hover:border-rose-500 text-purple-300 hover:text-rose-200 font-semibold rounded-xl text-xs transition"
                  title="Cancel & Refund Staked Coins"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="submit"
                id={`submit-prediction-${question.id}`}
                className="w-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:opacity-90 text-slate-950 font-extrabold py-3.5 rounded-xl shadow-lg shadow-amber-500/20 transition text-sm flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-slate-900" />
                <span>Lock Prediction ({stakeAmount} Coins) for +{potentialCrowns} Crowns</span>
              </button>
            )}

            {/* Test Simulation Button */}
            <button
              type="button"
              onClick={handleSimulateThisQuestion}
              id={`sim-btn-${question.id}`}
              className="p-3 bg-purple-900/50 hover:bg-purple-800 border border-amber-400/40 text-amber-300 rounded-xl text-xs font-semibold shrink-0 flex items-center gap-1 transition"
              title="Simulate Bigg Boss episode outcome for this question"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Sim Result</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
