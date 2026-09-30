import React from 'react';

interface LegalEaseLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  light?: boolean;
}

export const LegalEaseLogo: React.FC<LegalEaseLogoProps> = ({
  className = '',
  size = 'md',
  showTagline = false,
  light = false,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Logo Emblem: Page silhouette with embedded scales of justice / shield emblem */}
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 shadow-sm text-white ${iconSizes[size]}`}>
        {/* Document corner fold subtle indicator */}
        <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-blue-400/40 rounded-bl-sm pointer-events-none" />
        
        {/* Combined Scale & Page Emblem */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5/9 h-5/9"
        >
          {/* Document outline */}
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeWidth="1.75" />
          <polyline points="14 2 14 8 20 8" strokeWidth="1.75" />
          {/* Subtle balance beam */}
          <path d="M8 13h8" strokeWidth="1.75" />
          <path d="M12 11v5" strokeWidth="1.75" />
          <circle cx="8" cy="15" r="1.5" strokeWidth="1.5" />
          <circle cx="16" cy="15" r="1.5" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-semibold tracking-tight ${textSizes[size]} ${light ? 'text-white' : 'text-slate-900'}`}>
            Legal<span className="text-blue-600 font-bold">Ease</span>
          </span>
          <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200/60 hidden sm:inline-block">
            AI
          </span>
        </div>
        {showTagline && (
          <span className={`text-xs ${light ? 'text-slate-300' : 'text-slate-500'} font-medium`}>
            Create professional legal documents with AI
          </span>
        )}
      </div>
    </div>
  );
};
