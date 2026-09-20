import React from 'react';

interface TalentSourceLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const TalentSourceLogo: React.FC<TalentSourceLogoProps> = ({ 
  size = 'md', 
  showText = true,
  className = ''
}) => {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  }[size];

  const textSize = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl'
  }[size];

  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      {/* Brand Icon: Clean, Flat 2D Sun & Emerald Source Emblem (No 3D effects) */}
      <div className={`relative ${iconDimensions} shrink-0`}>
        <svg 
          viewBox="0 0 40 40" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* 1. Flat 2D Orange Sun (Top-Right) */}
          <circle cx="28" cy="12" r="8" fill="#F97316" />
          
          {/* Flat 2D Sun Rays */}
          <path d="M28 1V3" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
          <path d="M36 4L34.5 5.5" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
          <path d="M39 12H37" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
          <path d="M36 20L34.5 18.5" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
          <path d="M20 4L21.5 5.5" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />

          {/* 2. Flat 2D Emerald Green Emblem (Foreground) */}
          <rect 
            x="4" 
            y="12" 
            width="24" 
            height="24" 
            rx="6" 
            fill="#059669" 
          />

          {/* Clean Flat 2D "T" + Center Node */}
          <path 
            d="M9 19H23M16 19V30" 
            stroke="#FFFFFF" 
            strokeWidth="2.8" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <circle cx="16" cy="19" r="2" fill="#FDE047" />
        </svg>
      </div>

      {/* Brand Text: Talent in Green, Source in Orange, Subtitle: "Talent and creative need meet" */}
      {showText && (
        <div className="leading-none">
          <div className="flex items-center gap-1">
            <span className={`font-black tracking-tight ${textSize}`}>
              <span className="text-emerald-700">Talent</span>
              <span className="text-orange-500">Source</span>
            </span>
          </div>
          <span className="text-[10px] font-medium text-stone-500 block tracking-tight mt-0.5 whitespace-nowrap">
            Talent and creative need meet
          </span>
        </div>
      )}
    </div>
  );
};
