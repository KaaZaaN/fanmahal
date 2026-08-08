import React from 'react';
import { Crown, Sparkles } from 'lucide-react';
import officialLogoImg from '../assets/images/fanmahal_actual_logo_1785989885640.jpg';

interface FanmahalLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  showIgHandle?: boolean;
}

export const FanmahalLogo: React.FC<FanmahalLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  showIgHandle = false,
}) => {
  const logoSrc = officialLogoImg;

  const iconSizes = {
    sm: 'w-9 h-9 rounded-xl',
    md: 'w-11 h-11 rounded-2xl',
    lg: 'w-16 h-16 rounded-3xl',
  };

  const titleSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  return (
    <div className="flex items-center gap-3 group">
      {/* Royal Crown / Logo Image Badge */}
      <div className={`relative ${iconSizes[size]} bg-gradient-to-br from-[#F5C542] via-[#FF1E94] to-[#22034D] p-[2px] rounded-2xl group-hover:scale-105 transition-transform overflow-hidden shrink-0 border border-amber-400/40`}>
        <div className="w-full h-full bg-[#110125] rounded-[inherit] flex items-center justify-center overflow-hidden">
          <img
            src={logoSrc}
            alt="Fanmahal Official Logo"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover rounded-[inherit]"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2">
          <h1 className={`${titleSizes[size]} font-black tracking-tight bg-gradient-to-r from-[#F5C542] via-[#FF1E94] to-yellow-200 bg-clip-text text-transparent font-serif`}>
            FANMAHAL
          </h1>
          <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-[#FF1E94]/20 text-[#FF1E94] border border-[#FF1E94]/40 uppercase tracking-wider">
            REALITY TV
          </span>
        </div>

        {showSubtitle && (
          <p className="text-[11px] text-purple-200/80 -mt-0.5 font-medium flex items-center gap-1.5">
            <span>Fantasy Prediction Palace</span>
            {showIgHandle && (
              <a
                href="https://instagram.com/thefanmahal"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-[#FF1E94] hover:text-amber-300 font-bold underline transition"
              >
                @thefanmahal
              </a>
            )}
          </p>
        )}
      </div>
    </div>
  );
};
