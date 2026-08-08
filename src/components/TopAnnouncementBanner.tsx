import React, { useState } from 'react';
import { X, ExternalLink, Sparkles, Gift, ShieldCheck, Instagram, Megaphone } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const TopAnnouncementBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const { announcements } = useGame();

  const activeBroadcast = announcements.find((a) => a.active);

  if (!isVisible) return null;

  if (activeBroadcast) {
    return (
      <div className="bg-gradient-to-r from-[#FF1E94] via-[#850849] to-[#C2410C] text-white text-xs py-2 px-8 sm:px-12 relative z-50 border-b border-amber-400/40 shadow-2xl transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <div className="flex flex-wrap items-center justify-center text-center gap-x-2 gap-y-1 text-[11px] sm:text-xs font-bold tracking-wide">
            <span className="inline-flex items-center gap-1 bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full font-black text-[10px] uppercase">
              <Megaphone className="w-3 h-3" />
              ANNOUNCEMENT
            </span>

            <span className="text-white font-extrabold">{activeBroadcast.title}:</span>
            <span className="text-amber-100 font-medium">{activeBroadcast.message}</span>

            {activeBroadcast.linkUrl && (
              <a
                href={activeBroadcast.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white font-bold px-2 py-0.5 rounded-md text-[10px] ml-1 transition"
              >
                <span>View Details</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
          </div>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          aria-label="Close Announcement Banner"
          id="dismiss-top-announcement-banner"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-white/80 hover:text-white hover:bg-black/30 focus:outline-none focus:ring-2 focus:ring-amber-300/80 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-[#210245] via-[#850849] via-60% to-[#C2410C] text-white text-xs py-2 px-8 sm:px-12 relative z-50 border-b border-pink-400/30 shadow-xl transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-center">
        <div className="flex flex-wrap items-center justify-center text-center gap-x-3 gap-y-1.5 text-[11px] sm:text-xs font-semibold tracking-wide py-0.5">
          {/* Badge 1: 100% Free-to-Play */}
          <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 px-3 py-0.5 rounded-full font-black uppercase tracking-wider text-[10px] shadow-md shadow-amber-900/30 ml-1">
            <Sparkles className="w-3 h-3 text-slate-950 fill-amber-950" />
            100% Free-to-Play
          </span>

          {/* India's First Reality TV Prediction Platform */}
          <span className="text-white font-bold tracking-tight">
            India's First Reality TV Prediction Platform
          </span>

          <span className="hidden sm:inline text-amber-300/60 font-bold">•</span>

          {/* Zero Money Staked */}
          <span className="inline-flex items-center gap-1 text-amber-200 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
            Zero Money Staked
          </span>

          <span className="text-amber-300/60 font-bold">•</span>

          {/* Real Hampers, Vouchers & Prizes */}
          <span className="inline-flex items-center gap-1 text-pink-100 font-bold">
            <Gift className="w-3.5 h-3.5 text-pink-300" />
            Real Hampers, Vouchers & Prizes
          </span>

          <span className="hidden sm:inline text-amber-300/60 font-bold">•</span>

          {/* Official IG label + Hyperlinked Handle Badge */}
          <div className="inline-flex items-center gap-1.5 ml-1">
            <span className="text-purple-200 font-medium">Official IG:</span>
            <a
              href="https://instagram.com/thefanmahal"
              target="_blank"
              rel="noopener noreferrer"
              id="banner-ig-link"
              className="inline-flex items-center gap-1 bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 hover:from-purple-500 hover:via-pink-400 hover:to-amber-400 text-white font-extrabold px-2.5 py-0.5 rounded-md shadow-md hover:shadow-pink-500/50 hover:scale-105 transition-all transform duration-200 text-[11px]"
            >
              <Instagram className="w-3.5 h-3.5 text-white shrink-0" />
              <span>@thefanmahal</span>
              <ExternalLink className="w-2.5 h-2.5 text-white/80 shrink-0" />
            </a>
          </div>
        </div>
      </div>

      {/* Close (X) button at top right */}
      <button
        onClick={() => setIsVisible(false)}
        aria-label="Close Announcement Banner"
        id="dismiss-top-announcement-banner"
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-white/80 hover:text-white hover:bg-black/30 focus:outline-none focus:ring-2 focus:ring-amber-300/80 transition cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};


