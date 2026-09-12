import React from 'react';

export const EasyTaskiFyLogo = ({
  className = "h-8",
  showText = true,
  theme = "dark", // 'dark' (for dark bg) or 'light' (for white bg)
  textSize = "text-2xl",
  textClassName
}) => {
  const isLight = theme === 'light';

  // Colors based on theme
  const mainStroke = isLight ? '#09090B' : '#FFFFFF';
  const dotColor = isLight ? '#18181B' : '#FFFFFF';
  const defaultTextColor = isLight ? 'text-zinc-900' : 'text-white';

  const gradientStart = isLight ? '#475569' : '#FFFFFF';
  const gradientMid = isLight ? '#64748B' : '#E2E8F0';
  const gradientEnd = isLight ? '#0F172A' : '#94A3B8';

  const gradId = `easyTaskiFyGrad_${theme}`;

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* EasyTaskiFy Icon Symbol */}
      <svg
        viewBox="0 0 120 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto shrink-0 drop-shadow-sm"
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={gradientStart} />
            <stop offset="50%" stopColor={gradientMid} />
            <stop offset="100%" stopColor={gradientEnd} />
          </linearGradient>
        </defs>

        {/* Lower Checkmark Arm */}
        <path
          d="M 16 48 L 44 74 C 47 77 53 77 56 74 L 102 24"
          stroke={mainStroke}
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Upper Ribbon Loop Layer */}
        <path
          d="M 32 24 C 32 14, 82 10, 94 22 C 102 30, 80 44, 42 46"
          stroke={`url(#${gradId})`}
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Top-Right Accent Dot */}
        <circle cx="102" cy="14" r="6" fill={dotColor} />

        {/* Bottom-Right Accent Dot */}
        <circle cx="94" cy="67" r="6" fill={dotColor} />
      </svg>

      {/* Brand Text */}
      {showText && (
        <span className={`font-bold tracking-tight ${textSize} font-lato leading-none ${textClassName || defaultTextColor}`}>
          Easy<span className="font-extrabold">TaskiFy</span>
        </span>
      )}
    </div>
  );
};

export default EasyTaskiFyLogo;
