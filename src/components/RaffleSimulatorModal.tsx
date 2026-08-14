import React, { useState } from 'react';
import { X, Sparkles, Trophy, Crown, Play, CheckCircle2, AlertTriangle, ShieldCheck, Youtube, ExternalLink, RefreshCw } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { RAFFLE_ROUNDS, calculateRaffleTickets, ENABLE_MONTHLY_RAFFLE } from '../utils/raffle';
import confetti from 'canvas-confetti';

interface DrawnWinner {
  round: number;
  prizeTitle: string;
  handle: string;
  ticketsHeld: number;
  eliminationNote: string;
}

export const RaffleSimulatorModal: React.FC = () => {
  const { showRaffleModal, setShowRaffleModal, user } = useGame();
  const [isRunningDraw, setIsRunningDraw] = useState(false);
  const [currentRoundIndex, setCurrentRoundIndex] = useState<number | null>(null);
  const [drawHistory, setDrawHistory] = useState<DrawnWinner[]>([]);

  if (!ENABLE_MONTHLY_RAFFLE || !showRaffleModal) return null;

  const userRaffleInfo = user ? calculateRaffleTickets(user.monthlyCrowns || 0) : null;

  // Mock pool of players with IG handles and ticket counts
  const initialPool = [
    { handle: user?.instagramHandle || '@BiggBossRaja_IG', tickets: userRaffleInfo?.tickets || 2 },
    { handle: '@salman_fan_mumbai', tickets: 5 },
    { handle: '@oracle_queen_bb19', tickets: 5 },
    { handle: '@bb_mastermind', tickets: 4 },
    { handle: '@desipredictor_07', tickets: 4 },
    { handle: '@delhi_reality_king', tickets: 3 },
    { handle: '@punjab_sher_fan', tickets: 3 },
    { handle: '@reality_tv_guru', tickets: 2 },
    { handle: '@mumbai_glam_fan', tickets: 2 },
    { handle: '@bb19_oracle_star', tickets: 1 },
    { handle: '@weekend_vaar_fan', tickets: 1 },
  ];

  const handleStartSimulatedDraw = () => {
    setIsRunningDraw(true);
    setDrawHistory([]);
    setCurrentRoundIndex(0);

    let activePool = [...initialPool];
    const winners: DrawnWinner[] = [];

    let delay = 0;

    RAFFLE_ROUNDS.forEach((roundInfo, idx) => {
      delay += 1200;

      setTimeout(() => {
        setCurrentRoundIndex(idx);

        // Filter eligible players for this round
        const eligible = activePool.filter((p) => p.tickets >= roundInfo.minTickets);

        if (eligible.length > 0) {
          // Pick winner using Random.org list randomizer logic
          const winnerIndex = Math.floor(Math.random() * eligible.length);
          const winner = eligible[winnerIndex];

          winners.push({
            round: roundInfo.round,
            prizeTitle: roundInfo.prizeTitle,
            handle: winner.handle,
            ticketsHeld: winner.tickets,
            eliminationNote: roundInfo.afterAction,
          });

          // Remove winner + eliminate everyone with exactly minTickets
          activePool = activePool.filter(
            (p) => p.handle !== winner.handle && p.tickets > roundInfo.minTickets
          );
        }

        setDrawHistory([...winners]);

        if (idx === RAFFLE_ROUNDS.length - 1) {
          setIsRunningDraw(false);
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#F5C542', '#FF1E94', '#10B981'],
          });
        }
      }, delay);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#2B0460] via-[#1C023E] to-[#12012B] border border-amber-400/50 rounded-3xl p-6 sm:p-8 shadow-2xl text-purple-100 my-8 max-h-[90vh] overflow-y-auto">
        {/* Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-[#FF1E94] to-yellow-300 rounded-t-3xl" />

        {/* Close Button */}
        <button
          onClick={() => setShowRaffleModal(false)}
          id="raffle-modal-close-btn"
          className="absolute top-4 right-4 p-2 text-purple-300 hover:text-white hover:bg-white/10 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-tr from-amber-400 to-[#FF1E94] rounded-2xl shadow-lg">
            <Trophy className="w-7 h-7 text-slate-950" />
          </div>
          <div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40 uppercase tracking-widest">
              REWARD TRACK 2 — MONTHLY RAFFLE
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-serif text-white">
              Monthly Tier-Elimination Raffle (Live YouTube Draw)
            </h2>
          </div>
        </div>

        {/* USER'S TICKET STATUS CARD */}
        {user && userRaffleInfo && (
          <div className="p-4 rounded-2xl bg-[#12012B] border border-amber-400/40 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs text-purple-300/80 uppercase tracking-wider font-semibold">Your Monthly Raffle Standing</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-bold text-white">{user.instagramHandle || user.username}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-extrabold border border-amber-400/30">
                  {userRaffleInfo.currentTierLabel}
                </span>
              </div>
              <p className="text-[11px] text-purple-300/70 mt-1">
                Earned <strong>{user.monthlyCrowns.toLocaleString()} Crowns</strong> this month • Qualified for <strong>{userRaffleInfo.tickets} Raffle Tickets</strong>
              </p>
            </div>

            <div className="text-center sm:text-right bg-amber-400/10 px-4 py-2 rounded-xl border border-amber-400/30">
              <span className="text-[10px] text-amber-300/90 font-bold uppercase block">Raffle Ticket Count</span>
              <span className="text-2xl font-black text-amber-300">{userRaffleInfo.tickets} 🎟️</span>
            </div>
          </div>
        )}

        {/* TIER TICKET THRESHOLDS */}
        <div className="mb-6 space-y-2">
          <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
            Monthly Ticket Thresholds (Crowns earned in current month)
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs font-bold">
            <div className="p-2 bg-[#170234] border border-purple-800/40 rounded-xl">
              <span className="text-amber-300 block">4,000 Crowns</span>
              <span className="text-[10px] text-purple-200 font-normal">1 Ticket</span>
            </div>
            <div className="p-2 bg-[#170234] border border-purple-800/40 rounded-xl">
              <span className="text-amber-300 block">6,000 Crowns</span>
              <span className="text-[10px] text-purple-200 font-normal">2 Tickets</span>
            </div>
            <div className="p-2 bg-[#170234] border border-purple-800/40 rounded-xl">
              <span className="text-amber-300 block">7,500 Crowns</span>
              <span className="text-[10px] text-purple-200 font-normal">3 Tickets</span>
            </div>
            <div className="p-2 bg-[#170234] border border-purple-800/40 rounded-xl">
              <span className="text-amber-300 block">9,000 Crowns</span>
              <span className="text-[10px] text-purple-200 font-normal">4 Tickets</span>
            </div>
            <div className="p-2 bg-gradient-to-r from-amber-500/20 to-purple-900/40 border border-amber-400/50 rounded-xl">
              <span className="text-amber-300 block">10,000+ Crowns</span>
              <span className="text-[10px] text-yellow-300 font-black">5 Tickets Max</span>
            </div>
          </div>
        </div>

        {/* 5 SEQUENTIAL ROUNDS BREAKDOWN */}
        <div className="space-y-3 mb-6">
          <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center justify-between">
            <span>5 Sequential Elimination Rounds (Random.org List Randomizer)</span>
            <span className="text-[10px] font-normal text-purple-300 flex items-center gap-1">
              <Youtube className="w-3.5 h-3.5 text-rose-500" /> Live on YouTube
            </span>
          </h4>

          <div className="space-y-2">
            {RAFFLE_ROUNDS.map((r) => (
              <div
                key={r.round}
                className={`p-3 rounded-xl bg-[#12012B] border transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 ${
                  currentRoundIndex === r.round - 1
                    ? 'border-amber-400 bg-amber-400/10 shadow-md'
                    : 'border-purple-800/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-r ${r.color} text-slate-950 font-black text-xs flex items-center justify-center shrink-0`}>
                    R{r.round}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white flex items-center gap-2">
                      <span>{r.prizeTitle}</span>
                      <span className="text-[10px] text-purple-300 font-medium">({r.eligibleLabel})</span>
                    </p>
                    <p className="text-[11px] text-purple-300/70">{r.afterAction}</p>
                  </div>
                </div>

                {drawHistory.find((w) => w.round === r.round) ? (
                  <div className="bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-1 rounded-lg text-emerald-300 text-xs font-bold shrink-0">
                    🏆 Winner: {drawHistory.find((w) => w.round === r.round)?.handle}
                  </div>
                ) : (
                  <span className="text-[10px] text-purple-400 font-mono">Pending Draw</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* LEGAL & PRIVACY GUARDRAILS */}
        <div className="p-4 rounded-2xl bg-[#12012B] border border-emerald-500/30 text-xs space-y-2 mb-6">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Legal Guardrails & Identity Protection</span>
          </div>
          <ul className="text-[11px] text-purple-200/90 space-y-1 list-disc pl-4">
            <li>
              <strong>Zero Cash Ever Changes Hands:</strong> No entry fee, no coin top-ups, no cash prizes. Only physical brand hampers & gift vouchers are distributed, complying with India's Online Gaming Act 2025.
            </li>
            <li>
              <strong>Instagram Handle Privacy:</strong> Public announcements and YouTube live draws use <strong>Instagram Handle ONLY</strong> (`@username`). Real names, emails, and phone numbers are never shared publicly.
            </li>
            <li>
              <strong>Transparent Randomizer:</strong> Drawn using Random.org's official List Randomizer live on YouTube at the end of every month.
            </li>
          </ul>
        </div>

        {/* INTERACTIVE SIMULATION CONTROLS */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-purple-800/50">
          <button
            onClick={handleStartSimulatedDraw}
            disabled={isRunningDraw}
            id="start-raffle-sim-btn"
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg hover:opacity-90 transition flex items-center justify-center gap-2"
          >
            {isRunningDraw ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running Random.org 5-Round Draw...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Run 5-Round Raffle Draw</span>
              </>
            )}
          </button>

          <a
            href="https://instagram.com/thefanmahal"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#FF1E94] hover:text-amber-300 font-bold flex items-center gap-1.5 transition"
          >
            <span>Follow @thefanmahal on Instagram</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
