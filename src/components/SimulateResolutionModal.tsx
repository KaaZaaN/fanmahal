import React, { useState } from 'react';
import { X, Zap, Trophy, Crown, CheckCircle2, Tv } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const SimulateResolutionModal: React.FC = () => {
  const {
    showSimulatorModal,
    setShowSimulatorModal,
    questions,
    activeSimulatorQuestionId,
    simulateResolveQuestion,
  } = useGame();

  const openQId = activeSimulatorQuestionId || questions.find((q) => !q.resolved)?.id || questions[0]?.id;
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>(openQId || '');

  const activeQuestion = questions.find((q) => q.id === selectedQuestionId);

  const [selectedWinningOptionId, setSelectedWinningOptionId] = useState<string>(
    activeQuestion?.options[0]?.id || ''
  );
  const [customNote, setCustomNote] = useState<string>('');
  const [adminKey, setAdminKey] = useState<string>(() => {
    try {
      return sessionStorage.getItem('fanmahal_admin_key') || '';
    } catch {
      return '';
    }
  });

  const handleAdminKeyChange = (val: string) => {
    setAdminKey(val);
    try {
      if (val) {
        sessionStorage.setItem('fanmahal_admin_key', val);
      } else {
        sessionStorage.removeItem('fanmahal_admin_key');
      }
    } catch {
      // Ignore storage errors in restricted iframe contexts
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!showSimulatorModal) return null;

  const handleResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeQuestion || !selectedWinningOptionId || isSubmitting) return;

    setIsSubmitting(true);
    setFeedback(null);

    const winningOpt = activeQuestion.options.find((o) => o.id === selectedWinningOptionId);
    const defaultNote = `Official Episode Result: ${winningOpt ? winningOpt.text : 'Declared Winner'}`;

    const res = await simulateResolveQuestion(
      activeQuestion.id,
      selectedWinningOptionId,
      customNote || defaultNote,
      adminKey
    );

    setIsSubmitting(false);
    if (!res.success) {
      setFeedback({ type: 'error', text: res.message });
    } else {
      setFeedback({ type: 'success', text: res.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#28045A] to-[#14012C] border border-amber-400/50 rounded-3xl p-6 shadow-2xl text-purple-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setShowSimulatorModal(false)}
          id="sim-modal-close"
          className="absolute top-4 right-4 p-2 text-purple-300 hover:text-white hover:bg-white/10 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-amber-400/20 text-amber-300">
            <Zap className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-serif text-amber-300">
              Episode Simulation & Result Simulator
            </h2>
            <p className="text-xs text-purple-300/80">
              Test how predictions convert staked Fan Coins into Crowns!
            </p>
          </div>
        </div>

        <form onSubmit={handleResolve} className="space-y-4">
          {/* Question Selector */}
          <div>
            <label className="block text-xs font-semibold text-purple-200 mb-1">
              Select Question to Resolve:
            </label>
            <select
              value={selectedQuestionId}
              onChange={(e) => {
                setSelectedQuestionId(e.target.value);
                const q = questions.find((item) => item.id === e.target.value);
                if (q && q.options.length > 0) {
                  setSelectedWinningOptionId(q.options[0].id);
                }
              }}
              className="w-full bg-[#130129] border border-purple-600/50 focus:border-amber-400 rounded-xl px-3 py-2.5 text-xs font-semibold text-amber-200 outline-none"
            >
              {questions.map((q) => (
                <option key={q.id} value={q.id} className="bg-[#1A023B] text-purple-100">
                  {q.resolved ? '[RESOLVED] ' : '[OPEN] '} {q.title}
                </option>
              ))}
            </select>
          </div>

          {activeQuestion && (
            <>
              {/* Question Details Preview */}
              <div className="p-3 bg-[#130129] rounded-2xl border border-purple-800/40 space-y-1">
                <p className="text-xs font-bold text-white">{activeQuestion.title}</p>
                <div className="flex items-center gap-2 text-[11px] text-purple-300/80">
                  <span>Category: {activeQuestion.category}</span>
                  <span>•</span>
                  <span className="text-amber-300 font-bold">{activeQuestion.multiplier}x Multiplier</span>
                </div>
              </div>

              {/* Select Winning Option */}
              <div>
                <label className="block text-xs font-semibold text-purple-200 mb-2">
                  Pick Winning Outcome from Episode:
                </label>
                <div className="space-y-2">
                  {activeQuestion.options.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedWinningOptionId(opt.id)}
                      className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between text-xs font-semibold ${
                        selectedWinningOptionId === opt.id
                          ? 'bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border-emerald-400 text-emerald-200 shadow-md'
                          : 'bg-[#130129] border-purple-800/40 text-purple-300 hover:border-purple-600'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            selectedWinningOptionId === opt.id
                              ? 'border-emerald-400 bg-emerald-400'
                              : 'border-purple-600'
                          }`}
                        >
                          {selectedWinningOptionId === opt.id && (
                            <div className="w-1.5 h-1.5 rounded-full bg-black" />
                          )}
                        </span>
                        {opt.text}
                      </span>
                      <span className="text-[11px] text-purple-400 font-mono">
                        {opt.communityPercent}% predicted
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Admin Authorization Secret Key */}
              <div>
                <label className="block text-xs font-semibold text-amber-300 mb-1">
                  Admin Security Key (Required for Server Verification):
                </label>
                <input
                  type="password"
                  placeholder="Enter ADMIN_SECRET_KEY..."
                  value={adminKey}
                  onChange={(e) => handleAdminKeyChange(e.target.value)}
                  required
                  className="w-full bg-[#130129] border border-amber-500/50 focus:border-amber-400 rounded-xl px-3 py-2.5 text-xs text-white placeholder-purple-400/50 outline-none"
                />
                <p className="text-[10px] text-purple-300/60 mt-1">
                  🔒 Key is cached temporarily in <code className="text-amber-300/80">sessionStorage</code> for this tab session only (automatically erased when the browser tab closes). It is never saved to <code className="text-rose-300/80">localStorage</code>.
                </p>
              </div>

              {/* Resolution Headline / Episode Note */}
              <div>
                <label className="block text-xs font-semibold text-purple-200 mb-1">
                  Custom Resolution Headline (Optional):
                </label>
                <input
                  type="text"
                  placeholder="e.g. Salman Khan announces Karan Veer Mehra is evicted in Weekend Ka Vaar!"
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  className="w-full bg-[#130129] border border-purple-600/40 focus:border-amber-400 rounded-xl px-3 py-2.5 text-xs text-white placeholder-purple-400/50 outline-none"
                />
              </div>

              {feedback && (
                <div
                  className={`p-3 rounded-2xl border text-xs font-semibold ${
                    feedback.type === 'error'
                      ? 'bg-rose-500/10 border-rose-500/40 text-rose-200'
                      : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
                  }`}
                >
                  {feedback.text}
                </div>
              )}

              <div className="p-3 bg-amber-400/10 rounded-2xl border border-amber-400/30 text-xs text-amber-200 flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400 shrink-0" />
                <span>
                  Resolving triggers server-authoritative validation & awards <strong>Crowns</strong> securely!
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                id="confirm-sim-resolve-btn"
                className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:opacity-90 disabled:opacity-50 text-slate-950 font-extrabold py-3 rounded-xl shadow-lg transition text-sm flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5 text-slate-950" />
                <span>{isSubmitting ? 'Verifying on Server...' : 'Declare Winner & Trigger Payouts'}</span>
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
