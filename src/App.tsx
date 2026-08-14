import React, { useState, useEffect } from 'react';
import { GameProvider, useGame, FOUNDER_EMAIL, ALT_FOUNDER_EMAIL } from './context/GameContext';
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
import { AdminView } from './views/AdminView';
import { PrivacyView } from './views/PrivacyView';
import { TermsView } from './views/TermsView';
import { ComingSoonView } from './views/ComingSoonView';
import { FanmahalLogo } from './components/FanmahalLogo';
import { Lock, ShieldAlert, ExternalLink } from 'lucide-react';

type ViewType = 'predictions' | 'leaderboard' | 'profile' | 'admin' | 'privacy' | 'terms' | 'coming_soon';

function MainLayout() {
  const getInitialView = (): ViewType => {
    if (typeof window === 'undefined') return 'predictions';
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    if (path.includes('/moderator') || hash.includes('moderator') || search.includes('route=moderator')) {
      return 'admin';
    }
    if (path.includes('/privacy') || hash.includes('privacy')) return 'privacy';
    if (path.includes('/terms') || hash.includes('terms')) return 'terms';
    if (path.includes('/leaderboard') || hash.includes('leaderboard')) return 'leaderboard';
    if (path.includes('/profile') || hash.includes('profile')) return 'profile';
    return 'predictions';
  };

  const [currentView, setCurrentView] = useState<ViewType>(getInitialView);
  const { user, setShowAuthModal } = useGame();

  useEffect(() => {
    const checkAndTriggerFounderLogin = () => {
      if (typeof window === 'undefined') return;
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (path.includes('/founder-login') || hash.includes('founder-login') || search.includes('founder-login')) {
        setShowAuthModal(true);
      }
    };

    checkAndTriggerFounderLogin();

    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (path.includes('/founder-login') || hash.includes('founder-login') || search.includes('founder-login')) {
        setShowAuthModal(true);
      } else if (path.includes('/moderator') || hash.includes('moderator')) {
        setCurrentView('admin');
      } else if (path.includes('/leaderboard') || hash.includes('leaderboard')) {
        setCurrentView('leaderboard');
      } else if (path.includes('/profile') || hash.includes('profile')) {
        setCurrentView('profile');
      } else if (path.includes('/privacy') || hash.includes('privacy')) {
        setCurrentView('privacy');
      } else if (path.includes('/terms') || hash.includes('terms')) {
        setCurrentView('terms');
      } else {
        setCurrentView('predictions');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setShowAuthModal]);

  const handleNavigate = (view: ViewType) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      if (view === 'admin') {
        window.history.pushState({}, '', '/moderator');
      } else if (view === 'predictions') {
        window.history.pushState({}, '', '/');
      } else {
        window.history.pushState({}, '', `/${view}`);
      }
    } catch {
      // Ignore in iframe sandboxes
    }
  };

  const isFounderUser = Boolean(
    user && (
      user.email?.trim().toLowerCase() === FOUNDER_EMAIL.toLowerCase() ||
      user.email?.trim().toLowerCase() === ALT_FOUNDER_EMAIL.toLowerCase() ||
      user.role === 'SUPER_ADMIN' ||
      user.isAdmin
    )
  );

  // ROUTE EXCEPTIONS:
  // 1. Direct /terms page
  if (currentView === 'terms') {
    return <TermsView onNavigateBack={() => handleNavigate('predictions')} />;
  }

  // 2. Direct /privacy page
  if (currentView === 'privacy') {
    return <PrivacyView onNavigateBack={() => handleNavigate('predictions')} />;
  }

  // 3. Direct /moderator page
  if (currentView === 'admin') {
    return (
      <div className="min-h-screen bg-[#110125] text-purple-100 font-sans selection:bg-[#FF1E94] selection:text-white flex flex-col relative overflow-hidden">
        <TopAnnouncementBanner />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 relative z-10">
          <AdminView />
        </main>
        <AuthModal />
      </div>
    );
  }

  // PUBLIC VISITORS -> Show Coming Soon Page unless Founder is Authenticated
  if (!isFounderUser) {
    return (
      <>
        <ComingSoonView
          onNavigateTerms={() => handleNavigate('terms')}
          onNavigatePrivacy={() => handleNavigate('privacy')}
          onFounderBypass={() => {
            setShowAuthModal(true);
          }}
        />
        <AuthModal />
      </>
    );
  }

  // FOUNDER / BYPASSED ACCESS -> Render Full App
  return (
    <div className="min-h-screen bg-[#110125] text-purple-100 font-sans selection:bg-[#FF1E94] selection:text-white flex flex-col relative overflow-hidden">
      {/* Background Radial Glowing Gradients */}
      <div className="absolute top-20 -left-40 w-96 h-96 bg-[#31056C]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-[#FF1E94]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#22034D]/60 rounded-full blur-3xl pointer-events-none" />

      {/* Founder Live Testing Watermark Badge */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 px-4 py-1.5 text-xs font-black text-center flex items-center justify-center gap-2 relative z-50 shadow-lg">
        <Lock className="w-3.5 h-3.5 text-slate-950" />
        <span>
          FOUNDER PREVIEW MODE: Full App Active for Founder Prithvi (@KaaZaaN). Regular visitors see the Coming Soon landing page.
        </span>
      </div>

      {/* Top Announcement Banner */}
      <TopAnnouncementBanner />

      {/* Account Restricted Banner if Banned */}
      {user?.isBanned && (
        <div className="bg-rose-950 border-b border-rose-500 text-rose-200 px-4 py-3 text-xs font-bold text-center flex items-center justify-center gap-2 relative z-50">
          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
          <span>
            <strong>Account Restricted:</strong> {user.banReason || 'Your account is restricted from placing predictions due to Terms of Service violation.'}
          </span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar currentView={currentView as any} setCurrentView={handleNavigate as any} />

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
            Fanmahal is a free-to-play fantasy prediction league for Indian reality TV fans. No real money is involved anywhere in this app. Predictions earn virtual Crowns for weekly leaderboards and season prizes.
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
            <span>Zero Cash / Physical Hampers & Shopping Vouchers</span>
            <span className="text-purple-600">•</span>
            <span>India Online Gaming Act 2025 Compliant</span>
          </div>

          {/* Legal Links Footer Bar */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold pt-2 border-t border-purple-900/40 max-w-md mx-auto">
            <a
              href="/terms"
              onClick={(e) => {
                e.preventDefault();
                handleNavigate('terms');
              }}
              className="text-purple-300 hover:text-amber-300 underline transition"
            >
              Terms of Service
            </a>
            <span className="text-purple-600">•</span>
            <a
              href="/privacy"
              onClick={(e) => {
                e.preventDefault();
                handleNavigate('privacy');
              }}
              className="text-purple-300 hover:text-amber-300 underline transition"
            >
              Privacy Policy
            </a>
          </div>

          <p className="text-[10px] text-purple-400/60 pt-1 font-mono">
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

