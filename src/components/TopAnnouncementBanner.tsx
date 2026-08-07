import React, { useState } from 'react';
import { X, ExternalLink, Sparkles, Gift, ShieldCheck, Instagram } from 'lucide-react';

export const TopAnnouncementBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

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

