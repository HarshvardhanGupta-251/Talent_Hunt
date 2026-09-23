import React from 'react';

export interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
  variant?: 'dark' | 'light';
  layout?: 'horizontal' | 'stacked';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
  variant = 'dark',
  layout = 'horizontal',
}) => {
  const isLight = variant === 'light';
  const isStacked = layout === 'stacked';
  const textColor = isLight ? 'text-[#F8F6F0]' : 'text-[#20201E]';
  const subtextColor = isLight ? 'text-[#EAE4D8]/80' : 'text-[#504C44]';

  const emblemSizes = {
    sm: 'w-8 h-4',
    md: 'w-11 h-5.5',
    lg: 'w-16 h-8',
    xl: 'w-24 h-12',
  };

  const stackedEmblemSizes = {
    sm: 'w-16 h-8',
    md: 'w-24 h-12',
    lg: 'w-36 h-18',
    xl: 'w-48 h-24',
  };

  const titleSizes = {
    sm: 'text-sm tracking-[0.18em]',
    md: 'text-lg sm:text-xl tracking-[0.20em]',
    lg: 'text-2xl sm:text-3xl tracking-[0.22em]',
    xl: 'text-3xl sm:text-5xl tracking-[0.24em]',
  };

  const subtitleSizes = {
    sm: 'text-[8px] tracking-[0.32em]',
    md: 'text-[9.5px] sm:text-[10px] tracking-[0.36em]',
    lg: 'text-xs sm:text-sm tracking-[0.38em]',
    xl: 'text-sm sm:text-base tracking-[0.42em]',
  };

  return (
    <div
      className={`select-none ${
        isStacked
          ? 'flex flex-col items-center text-center gap-3'
          : 'flex items-center gap-3'
      } ${className}`}
    >
      {/* Official EYE WINN Emblem (Solid Eye with Book Pages & Radiant Star Cutouts) */}
      <div
        className={`relative flex items-center justify-center shrink-0 ${
          isStacked ? stackedEmblemSizes[size] : emblemSizes[size]
        }`}
      >
        <svg
          viewBox="0 0 300 150"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          style={{ color: isLight ? '#F8F6F0' : '#20201E' }}
        >
          {/* Solid Eye Silhouette with Open Book Pages & Star Cutouts (fill-rule evenodd) */}
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="
              M 20 75
              C 65 24, 105 18, 150 18
              C 195 18, 235 24, 280 75
              C 235 126, 195 132, 150 132
              C 105 132, 65 126, 20 75
              Z

              M 150 48
              Q 150 70, 168 70
              Q 150 70, 150 92
              Q 150 70, 132 70
              Q 150 70, 150 48
              Z

              M 148 116
              C 126 96, 118 78, 138 46
              C 114 50, 92 68, 86 80
              C 80 92, 102 110, 148 116
              Z

              M 152 116
              C 174 96, 182 78, 162 46
              C 186 50, 208 68, 214 80
              C 220 92, 198 110, 152 116
              Z

              M 147 122
              C 120 120, 100 110, 88 98
              C 98 108, 122 116, 147 119
              Z

              M 153 122
              C 180 120, 200 110, 212 98
              C 202 108, 178 116, 153 119
              Z

              M 149 116
              L 149 126
              L 151 126
              L 151 116
              Z
            "
          />
        </svg>
      </div>

      {/* Official Brand Typography */}
      <div className={`flex flex-col ${isStacked ? 'items-center' : 'justify-center'}`}>
        <span
          className={`font-serif font-bold uppercase leading-none ${textColor} ${titleSizes[size]}`}
          style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}
        >
          EYE WINN
        </span>
        {showSubtitle && (
          <span
            className={`font-semibold uppercase leading-tight mt-1.5 ${subtextColor} ${subtitleSizes[size]}`}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            BOOKS TO BIG SCREENS
          </span>
        )}
      </div>
    </div>
  );
};

