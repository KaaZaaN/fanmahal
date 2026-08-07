import React from 'react';
import { useGame } from '../context/GameContext';
import { PRIZE_HAMPERS } from '../data/mockData';
import { Trophy, Crown, Sparkles, Gift, ShieldAlert, Award, User, Zap, CheckCircle2 } from 'lucide-react';
import { calculateRaffleTickets } from '../utils/raffle';

export const LeaderboardView: React.FC = () => {
  const { leaderboard, user, setShowRaffleModal } = useGame();

  const top3 = leaderboard.slice(0, 3);
  const remainingRanks = leaderboard.slice(3);

  return (
    <div className="space-y-5 sm:space-y-6 pb-24">
      {/* HEADER BANNER */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#31056C] via-[#1E0242] to-[#430784] border border-[#FF1E94]/30 shadow-2xl p-6 sm:p-8 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold mb-2">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Bigg Boss Season 19 Official Hall of Fame</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-serif text-white">
              Royal Crown Leaderboard & Prize Hub
            </h1>
            <p className="text-xs sm:text-sm text-purple-200/90 mt-1 max-w-xl">
              Two reward tracks run side-by-side: Season Skill Leaderboard & Monthly Tier-Elimination Raffle! Official Instagram:{' '}
              <a
                href="https://instagram.com/thefanmahal"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FF1E94] font-bold underline"
              >
                @thefanmahal
              </a>
            </p>
          </div>

          {/* Current User Rank Card */}
          {user && (
            <div className="bg-[#12012B] border border-amber-400/40 rounded-2xl p-4 min-w-[240px] text-center shadow-xl">
              <span className="text-[10px] text-purple-300 uppercase tracking-widest font-semibold block">Your Current Standings</span>
              <div className="flex items-center justify-center gap-2 my-1">
                <span className="text-2xl">{user.avatar}</span>
                <span className="font-extrabold text-white text-sm">{user.username}</span>
              </div>
              <div className="grid grid-cols-3 gap-1 pt-1 border-t border-purple-800/40 text-xs">
                <div>
                  <span className="text-[10px] text-purple-300 block">Rank</span>
                  <span className="font-black text-amber-300">
                    #{leaderboard.find((e) => e.isCurrentUser)?.rank || 1}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-purple-300 block">Crowns</span>
                  <span className="font-black text-yellow-300 flex items-center justify-center gap-0.5">
                    {user.crowns.toLocaleString()} 👑
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-purple-300 block">Tickets</span>
                  <span className="font-black text-[#FF1E94] flex items-center justify-center gap-0.5">
                    {calculateRaffleTickets(user.monthlyCrowns || 0).tickets} 🎟️
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* TWO SEPARATE REWARD TRACKS EXPLANATION BANNER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* REWARD TRACK 1 CARD */}
        <div className="p-6 rounded-3xl bg-gradient-to-b from-[#2B0460] to-[#12012B] border border-amber-400/40 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-400" />
              <h3 className="text-lg font-black text-amber-300">Reward Track 1 — Season Leaderboard</h3>
            </div>
          </div>
          <p className="text-xs text-purple-200 leading-relaxed">
            Ranked by total <strong>Crowns</strong> earned across the entire season (never resets). Top 3 finishers win physical gift hampers from brand sponsors!
          </p>
          <div className="p-3 bg-[#12012B] rounded-2xl border border-purple-800/40 text-xs space-y-1 text-purple-300">
            <p>🏆 <strong>1st Place:</strong> Mega Electronics & Apparel Sponsor Hamper</p>
            <p>🥈 <strong>2nd Place:</strong> Premium Beauty & Grooming Sponsor Hamper</p>
            <p>🥉 <strong>3rd Place:</strong> Gourmet Snacks & Fitness Gift Hamper</p>
          </div>
        </div>

        {/* REWARD TRACK 2 CARD */}
        <div className="p-6 rounded-3xl bg-gradient-to-b from-[#31056C] to-[#12012B] border border-[#FF1E94]/40 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift className="w-6 h-6 text-[#FF1E94]" />
              <h3 className="text-lg font-black text-[#FF1E94]">Reward Track 2 — Monthly Raffle</h3>
            </div>
          </div>
          <p className="text-xs text-purple-200 leading-relaxed">
            Earn 1 to 5 Raffle Tickets monthly based on Crowns earned this month. Drawn in <strong>5 Sequential Elimination Rounds</strong> on YouTube live using Random.org's list randomizer!
          </p>
          <div className="pt-2">
            <span className="text-xs text-purple-300/80 font-semibold block">5 Shopping Vouchers (Amazon and Flipkart) worth 10K</span>
          </div>
        </div>
      </div>

      {/* TOP 3 PODIUM CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        {/* RANK #2 - SILVER */}
        {top3[1] && (
          <div className="order-2 md:order-1 bg-gradient-to-b from-slate-800/80 via-[#1C023E] to-[#12012B] border border-slate-400/40 rounded-3xl p-5 shadow-xl text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 px-3 py-1 bg-slate-300 text-slate-950 font-black text-xs rounded-bl-2xl">
              2nd Place
            </div>
            <div className="w-16 h-16 rounded-full bg-slate-200/20 border-2 border-slate-300 flex items-center justify-center text-3xl mx-auto mb-3 shadow-lg">
              {top3[1].avatar}
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-300/20 text-slate-200 font-bold border border-slate-400/30">
              {top3[1].titleBadge}
            </span>
            <h3 className="text-lg font-extrabold text-white mt-2 truncate">
              {top3[1].username}
            </h3>
            <div className="my-3 py-2 bg-slate-950/40 rounded-2xl border border-slate-700/50">
              <span className="text-xs text-slate-300 block uppercase tracking-wider">Crowns & Tickets</span>
              <span className="text-lg font-black text-slate-200 flex items-center justify-center gap-1.5">
                <Crown className="w-4 h-4 text-slate-300" />
                {top3[1].crowns.toLocaleString()} 👑
                <span className="text-purple-300 font-normal">|</span>
                <span className="text-[#FF1E94]">{calculateRaffleTickets(top3[1].crowns).tickets} 🎟️</span>
              </span>
            </div>
            <p className="text-[11px] text-purple-300/80">
              Win Rate: <strong>{top3[1].winRate}%</strong> ({top3[1].predictionsWon} wins)
            </p>
          </div>
        )}

        {/* RANK #1 - GOLD CHAMPION */}
        {top3[0] && (
          <div className="order-1 md:order-2 bg-gradient-to-b from-[#3D0A7A] via-[#2A0558] to-[#14012C] border-2 border-amber-400 rounded-3xl p-6 shadow-2xl shadow-amber-500/20 text-center relative overflow-hidden transform md:-translate-y-4">
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs rounded-bl-2xl shadow">
              👑 1st Place Champion
            </div>
            <div className="w-20 h-20 rounded-full bg-amber-400/20 border-4 border-amber-400 flex items-center justify-center text-4xl mx-auto mb-3 shadow-xl animate-pulse">
              {top3[0].avatar}
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 font-extrabold border border-amber-400/40">
              {top3[0].titleBadge}
            </span>
            <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 mt-2 truncate">
              {top3[0].username}
            </h3>
            <div className="my-3 py-2.5 bg-gradient-to-r from-amber-500/20 via-purple-900/40 to-amber-500/20 rounded-2xl border border-amber-400/50">
              <span className="text-xs text-amber-300/80 block uppercase tracking-wider font-semibold">Leaderboard Leader</span>
              <span className="text-xl font-black text-yellow-300 flex items-center justify-center gap-1.5">
                <Crown className="w-5 h-5 text-amber-400 drop-shadow-[0_2px_4px_rgba(245,197,66,0.8)]" />
                {top3[0].crowns.toLocaleString()} 👑
                <span className="text-purple-300 font-normal">|</span>
                <span className="text-[#FF1E94]">{calculateRaffleTickets(top3[0].crowns).tickets} 🎟️</span>
              </span>
            </div>
            <p className="text-xs text-purple-200">
              Win Rate: <strong className="text-emerald-400">{top3[0].winRate}%</strong> ({top3[0].predictionsWon} wins)
            </p>
          </div>
        )}

        {/* RANK #3 - BRONZE */}
        {top3[2] && (
          <div className="order-3 bg-gradient-to-b from-amber-900/60 via-[#1C023E] to-[#12012B] border border-amber-600/40 rounded-3xl p-5 shadow-xl text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 px-3 py-1 bg-amber-700 text-white font-black text-xs rounded-bl-2xl">
              3rd Place
            </div>
            <div className="w-16 h-16 rounded-full bg-amber-700/20 border-2 border-amber-600 flex items-center justify-center text-3xl mx-auto mb-3 shadow-lg">
              {top3[2].avatar}
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-700/20 text-amber-300 font-bold border border-amber-600/30">
              {top3[2].titleBadge}
            </span>
            <h3 className="text-lg font-extrabold text-white mt-2 truncate">
              {top3[2].username}
            </h3>
            <div className="my-3 py-2 bg-slate-950/40 rounded-2xl border border-amber-800/50">
              <span className="text-xs text-amber-300/80 block uppercase tracking-wider">Crowns & Tickets</span>
              <span className="text-lg font-black text-amber-400 flex items-center justify-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-500" />
                {top3[2].crowns.toLocaleString()} 👑
                <span className="text-purple-300 font-normal">|</span>
                <span className="text-[#FF1E94]">{calculateRaffleTickets(top3[2].crowns).tickets} 🎟️</span>
              </span>
            </div>
            <p className="text-[11px] text-purple-300/80">
              Win Rate: <strong>{top3[2].winRate}%</strong> ({top3[2].predictionsWon} wins)
            </p>
          </div>
        )}
      </div>

      {/* PHYSICAL PRIZE HAMPERS HIGHLIGHT SECTION */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#22034D] via-[#1A023B] to-[#2B0460] border border-amber-400/40 shadow-2xl">
        <div className="flex items-center gap-2 mb-4">
          <Gift className="w-6 h-6 text-amber-400" />
          <h2 className="text-xl font-extrabold text-amber-300 font-serif">
            Physical Brand Sponsor Prize Hampers (End of Season)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PRIZE_HAMPERS.map((hamper, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#12012B] border border-purple-800/50 space-y-2 hover:border-amber-400/60 transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{hamper.image}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {hamper.rankRange}
                </span>
              </div>
              <h4 className="font-bold text-sm text-white">{hamper.title}</h4>
              <p className="text-[11px] text-purple-300/70 font-medium">{hamper.sponsor}</p>

              <ul className="space-y-1 pt-2 border-t border-purple-800/40">
                {hamper.items.map((item, i) => (
                  <li key={i} className="text-[11px] text-purple-200 flex items-start gap-1">
                    <span>•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* FULL RANKS TABLE (RANKS 4+) */}
      <div className="bg-[#170234] border border-purple-800/40 rounded-3xl p-5 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          <span>Full Leaderboard Rankings</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-purple-800/60 text-[11px] text-purple-300 uppercase tracking-wider font-semibold">
                <th className="py-3 px-3">Rank</th>
                <th className="py-3 px-3">User & Handle</th>
                <th className="py-3 px-3">Fan Title</th>
                <th className="py-3 px-3 text-right">Crowns</th>
                <th className="py-3 px-3 text-right">Raffle Tickets</th>
                <th className="py-3 px-3 text-right">Win Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-800/30 text-xs font-medium">
              {remainingRanks.map((entry) => (
                <tr
                  key={entry.id}
                  className={`transition ${
                    entry.isCurrentUser
                      ? 'bg-gradient-to-r from-amber-500/20 via-purple-900/40 to-amber-500/10 border-l-4 border-amber-400 font-bold'
                      : 'hover:bg-purple-900/20'
                  }`}
                >
                  <td className="py-3 px-3 font-extrabold text-amber-300">
                    #{entry.rank}
                  </td>
                  <td className="py-3 px-3 flex items-center gap-2">
                    <span className="text-xl">{entry.avatar}</span>
                    <div>
                      <p className="text-white font-bold">{entry.username}</p>
                      {entry.isCurrentUser && (
                        <span className="text-[10px] text-amber-300 font-bold bg-amber-400/20 px-1.5 py-0.2 rounded">
                          YOU
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-purple-300/80">
                    {entry.titleBadge}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-yellow-300">
                    {entry.crowns.toLocaleString()} 👑
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-[#FF1E94]">
                    {calculateRaffleTickets(entry.crowns).tickets} 🎟️
                  </td>
                  <td className="py-3 px-3 text-right text-purple-200">
                    {entry.winRate}% ({entry.predictionsWon}W)
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
