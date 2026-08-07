import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { TopAnnouncementBanner } from './components/TopAnnouncementBanner';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { SimulateResolutionModal } from './components/SimulateResolutionModal';
import { RewardAdModal } from './components/RewardAdModal';
import { ReferralModal } from './components/ReferralModal';
import { RaffleSimulatorModal } from './components/RaffleSimulatorModal';
import { HomeView } from './views/HomeView';
import { LeaderboardView } from './views/LeaderboardView';
import { ProfileView } from './views/ProfileView';
import { FanmahalLogo } from './components/FanmahalLogo';
import { Crown, Sparkles, ShieldCheck, Heart, Tv, ExternalLink } from 'lucide-react';

function MainLayout() {
  const [currentView, setCurrentView] = useState<'predictions' | 'leaderboard' | 'profile'>('predictions');

  return (
    <div className="min-h-screen bg-[#110125] text-purple-100 font-sans selection:bg-[#FF1E94] selection:text-white flex flex-col relative overflow-hidden">
      {/* Immersive Background Radial Glowing Gradients */}
      <div className="absolute top-20 -left-40 w-96 h-96 bg-[#31056C]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-[#FF1E94]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#22034D]/60 rounded-full blur-3xl pointer-events-none" />

      {/* Top Announcement Banner */}
      <TopAnnouncementBanner />

      {/* Top Navbar */}
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 relative z-10">
        {currentView === 'predictions' && <HomeView />}
        {currentView === 'leaderboard' && <LeaderboardView />}
        {currentView === 'profile' && <ProfileView />}
      </main>

      {/* Global Modals */}
      <AuthModal />
      <SimulateResolutionModal />
      <RewardAdModal />
      <ReferralModal />
      <RaffleSimulatorModal />

      {/* Footer */}
      <footer className="mt-auto border-t border-[#FF1E94]/20 bg-[#0A0118] py-8 px-4 text-center text-xs text-purple-300/80 relative z-10">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center justify-center">
            <FanmahalLogo size="md" showSubtitle={true} showIgHandle={false} />
          </div>

          <p className="max-w-2xl mx-auto text-purple-300/80 text-xs leading-relaxed font-medium">
            Fanmahal is a free-to-play fantasy prediction league for Indian reality TV fans. No real money is involved anywhere in this app. Predictions earn virtual Crowns for season leaderboards and monthly tier raffle tickets.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-amber-300">
            <a
              href="https://instagram.com/thefanmahal"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#FF1E94] hover:text-amber-300 font-extrabold underline transition"
            >
              <span>Follow Official IG @thefanmahal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <span className="text-purple-600">•</span>
            <span>Free 800 Fan Coins added every week on Monday mornings.</span>
            <span className="text-purple-600">•</span>
            <span>Zero Cash / Physical Hampers & Shopping Vouchers and more</span>
            <span className="text-purple-600">•</span>
            <span>India Online Gaming Act 2025 Compliant</span>
          </div>

          <p className="text-[10px] text-purple-400/60 pt-2 font-mono">
            © 2026 Fanmahal Palace. Built for Reality TV Superfans across India.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <MainLayout />
    </GameProvider>
  );
}
