import React from 'react';

interface BoltLogoProps {
  className?: string;
  isLight?: boolean;
}

export const BoltLogo: React.FC<BoltLogoProps> = ({ className = '', isLight = false }) => {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Precision Geometric Monogram B with integrated electric lightning strike */}
      <div className="w-10 h-10 rounded-xl bg-[#201F1D] text-white flex items-center justify-center shadow-xs border border-[#2E2C29] shrink-0 relative overflow-hidden group-hover:border-[#205BE8]/40 transition-colors">
        <svg
          className="w-5.5 h-5.5"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="boltGrad" x1="12" y1="4" x2="16" y2="24" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3B82F6" />
              <stop offset="1" stopColor="#1D4ED8" />
            </linearGradient>
          </defs>
          {/* Geometric B contour */}
          <path
            d="M6 5.5H15.2C18.2 5.5 20.5 7.6 20.5 10.4C20.5 12.1 19.4 13.6 17.8 14.4C19.8 15.2 21.2 17 21.2 19.2C21.2 22.3 18.7 24.5 15.5 24.5H6V5.5Z"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Dynamic lightning bolt core cutting through */}
          <path
            d="M15.5 4.5L9.5 14H15L12 24.5L20 12.5H14.5L17.5 4.5H15.5Z"
            fill="url(#boltGrad)"
            stroke="#205BE8"
            strokeWidth="0.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="flex items-baseline">
        <span
          className={`text-2xl font-black tracking-tight font-['Plus_Jakarta_Sans'] ${
            isLight ? 'text-white' : 'text-[#201F1D]'
          }`}
        >
          BOLT
        </span>
        <span className="ml-1.5 text-[10px] font-mono font-black text-[#205BE8] tracking-widest bg-[#205BE8]/10 px-1.5 py-0.5 rounded border border-[#205BE8]/25 uppercase">
          2.0
        </span>
      </div>
    </div>
  );
};
