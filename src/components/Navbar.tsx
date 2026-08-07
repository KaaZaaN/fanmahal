import React, { useRef } from 'react';
import { Crown, Coins, Sparkles, User, Tv, Trophy, Zap, Plus, ShieldAlert, Gift, Upload, Image, RotateCcw } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { FanmahalLogo } from './FanmahalLogo';
import { calculateRaffleTickets } from '../utils/raffle';

interface NavbarProps {
  currentView: 'predictions' | 'leaderboard' | 'profile';
  setCurrentView: (view: 'predictions' | 'leaderboard' | 'profile') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView }) => {
  const { user, setShowAuthModal, setShowAdModal, setShowSimulatorModal, setShowRaffleModal, customLogoUrl, setCustomLogoUrl } = useGame();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB. Please select a smaller logo image.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setCustomLogoUrl(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#110125]/95 backdrop-blur-md border-b border-[#FF1E94]/20 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Brand / Logo + Upload Custom Logo button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView('predictions')}
              className="flex items-center group text-left transition"
              id="brand-logo-btn"
            >
              <FanmahalLogo size="md" showSubtitle={true} showIgHandle={false} />
            </button>

            {/* Hidden File Input for Custom Logo */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleLogoFileUpload}
              className="hidden"
              id="custom-logo-file-input"
            />

            {/* Quick Logo Upload Button */}
            <div className="hidden lg:flex items-center gap-1 ml-1">
              <button
                onClick={() => fileInputRef.current?.click()}
                id="upload-custom-logo-btn"
                className="p-1.5 bg-[#1C023E] hover:bg-purple-800/60 text-purple-300 hover:text-amber-300 rounded-lg border border-purple-700/50 transition flex items-center gap-1 text-[10px] font-semibold"
                title="Upload your own custom logo file (PNG/JPG)"
              >
                <Upload className="w-3 h-3 text-amber-400" />
                <span>Upload Logo</span>
              </button>

              {customLogoUrl && (
                <button
                  onClick={() => setCustomLogoUrl(null)}
                  id="reset-custom-logo-btn"
                  className="p-1.5 bg-[#1C023E] hover:bg-rose-900/60 text-rose-300 rounded-lg border border-rose-700/40 transition text-[10px]"
                  title="Reset to default Fanmahal logo"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-[#12012B] p-1.5 rounded-full border border-purple-800/40">
            <button
              onClick={() => setCurrentView('predictions')}
              id="nav-predictions-btn"
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                currentView === 'predictions'
                  ? 'bg-gradient-to-r from-[#FF1E94] to-[#8B5CF6] text-white shadow-md shadow-[#FF1E94]/20'
                  : 'text-purple-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              Weekly Predictions
            </button>

            <button
              onClick={() => setCurrentView('leaderboard')}
              id="nav-leaderboard-btn"
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                currentView === 'leaderboard'
                  ? 'bg-gradient-to-r from-[#FF1E94] to-[#8B5CF6] text-white shadow-md shadow-[#FF1E94]/20'
                  : 'text-purple-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              Leaderboard & Prizes
            </button>

            <button
              onClick={() => setCurrentView('profile')}
              id="nav-profile-btn"
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                currentView === 'profile'
                  ? 'bg-gradient-to-r from-[#FF1E94] to-[#8B5CF6] text-white shadow-md shadow-[#FF1E94]/20'
                  : 'text-purple-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Profile & Wallet
            </button>
          </nav>

          {/* Right Section: Currencies & User */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <>
                {/* Fan Coins Wallet Badge */}
                <button
                  onClick={() => setShowAdModal(true)}
                  id="navbar-coins-badge"
                  className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500/10 via-yellow-500/20 to-amber-500/10 border border-amber-400/40 hover:border-amber-400 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-300 transition shadow-inner group"
                  title="Click to earn +100 free Fan Coins!"
                >
                  <Coins className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
                  <div className="flex flex-col text-left leading-none">
                    <span className="text-[10px] text-amber-300/70 uppercase tracking-wider font-semibold">Fan Coins</span>
                    <span className="text-amber-200 font-extrabold text-xs">{user.fanCoins}</span>
                  </div>
                  <span className="ml-1 px-1.5 py-0.5 rounded-md bg-amber-400/20 text-amber-300 text-[10px] font-bold flex items-center gap-0.5">
                    <Plus className="w-2.5 h-2.5" /> Earn
                  </span>
                </button>

                {/* Crowns & Tickets Badge */}
                <div
                  id="navbar-crowns-badge"
                  className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-[#FF1E94]/15 to-[#8B5CF6]/20 border border-[#FF1E94]/30 px-3 py-1.5 rounded-xl text-xs font-bold text-purple-200 shadow-inner"
                >
                  <div className="flex items-center gap-1">
                    <Crown className="w-4 h-4 text-amber-400 drop-shadow-[0_1px_2px_rgba(245,197,66,0.8)]" />
                    <div className="flex flex-col text-left leading-none">
                      <span className="text-[9px] text-purple-300/70 uppercase tracking-wider font-semibold">Crowns</span>
                      <span className="text-yellow-300 font-extrabold text-xs">{user.crowns.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="h-3.5 w-[1px] bg-purple-600/40" />
                  <div className="flex items-center gap-1">
                    <span className="text-xs">🎟️</span>
                    <div className="flex flex-col text-left leading-none">
                      <span className="text-[9px] text-purple-300/70 uppercase tracking-wider font-semibold">Tickets</span>
                      <span className="text-[#FF1E94] font-extrabold text-xs">{calculateRaffleTickets(user.monthlyCrowns || 0).tickets}</span>
                    </div>
                  </div>
                </div>

                {/* User Profile Button */}
                <button
                  onClick={() => setCurrentView('profile')}
                  id="navbar-user-btn"
                  className="flex items-center gap-2 bg-[#260554] border border-purple-500/30 hover:border-[#FF1E94] px-2.5 py-1.5 rounded-xl transition"
                >
                  <span className="text-lg leading-none">{user.avatar}</span>
                  <span className="hidden lg:inline text-xs font-semibold text-purple-100 max-w-[100px] truncate">
                    {user.username}
                  </span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                id="navbar-login-btn"
                className="bg-gradient-to-r from-[#FF1E94] via-[#D946EF] to-[#8B5CF6] hover:opacity-90 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-[#FF1E94]/30 transition"
              >
                Sign In / Register
              </button>
            )}

            {/* Test Simulator Trigger Button */}
            <button
              onClick={() => setShowRaffleModal(true)}
              id="navbar-raffle-btn"
              className="bg-[#22034D] hover:bg-[#2B0460] border border-[#FF1E94]/50 text-[#FF1E94] hover:text-amber-300 text-[11px] font-bold px-2.5 py-1.5 rounded-xl flex items-center gap-1 transition shadow"
              title="View Reward Track 2 Monthly Raffle & Live YouTube Draw Simulator"
            >
              <Gift className="w-3.5 h-3.5 text-[#FF1E94]" />
              <span className="hidden sm:inline">Monthly Raffle</span>
            </button>

            <button
              onClick={() => setShowSimulatorModal(true)}
              id="navbar-sim-btn"
              className="bg-purple-900/60 hover:bg-purple-800/80 border border-amber-400/50 text-amber-300 text-[11px] font-bold px-2.5 py-1.5 rounded-xl flex items-center gap-1 transition"
              title="Simulate Bigg Boss Episode Resolution"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
              <span className="hidden sm:inline">Sim Episode</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Bar (Bottom Fixed) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#12012B]/95 backdrop-blur-lg border-t border-[#FF1E94]/30 px-3 py-2 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => setCurrentView('predictions')}
          id="mobile-nav-predictions"
          className={`flex flex-col items-center gap-1 text-[11px] font-semibold transition ${
            currentView === 'predictions' ? 'text-[#FF1E94]' : 'text-purple-300/70 hover:text-white'
          }`}
        >
          <Tv className="w-5 h-5" />
          <span>Predictions</span>
        </button>

        <button
          onClick={() => setCurrentView('leaderboard')}
          id="mobile-nav-leaderboard"
          className={`flex flex-col items-center gap-1 text-[11px] font-semibold transition ${
            currentView === 'leaderboard' ? 'text-amber-400' : 'text-purple-300/70 hover:text-white'
          }`}
        >
          <Trophy className="w-5 h-5" />
          <span>Leaderboard</span>
        </button>

        <button
          onClick={() => setCurrentView('profile')}
          id="mobile-nav-profile"
          className={`flex flex-col items-center gap-1 text-[11px] font-semibold transition ${
            currentView === 'profile' ? 'text-[#FF1E94]' : 'text-purple-300/70 hover:text-white'
          }`}
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </button>
      </div>
    </header>
  );
};
