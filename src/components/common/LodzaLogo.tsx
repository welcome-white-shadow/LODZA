import React from 'react';

interface LodzaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  light?: boolean;
}

export const LodzaLogo: React.FC<LodzaLogoProps> = ({
  size = 'md',
  showTagline = true,
  className = '',
  light = false
}) => {
  const sizeMap = {
    sm: { width: 110, height: 32, fontSize: 'text-xs' },
    md: { width: 150, height: 44, fontSize: 'text-xs' },
    lg: { width: 200, height: 58, fontSize: 'text-sm' },
    xl: { width: 280, height: 80, fontSize: 'text-base' }
  };

  const dim = sizeMap[size];
  const primaryBlue = light ? '#FFFFFF' : '#155EEF';
  const accentOrange = '#FF8A00';
  const taglineColor = light ? '#E2E8F0' : '#0B1F3A';

  return (
    <div className={`flex flex-col items-start select-none ${className}`}>
      <svg
        width={dim.width}
        height={dim.height}
        viewBox="0 0 320 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        {/* L */}
        <path
          d="M20 18 H48 V64 H82 V78 H20 V18 Z"
          fill={primaryBlue}
        />

        {/* Speed lines before O */}
        <rect x="76" y="38" width="22" height="5.5" rx="2.5" fill={accentOrange} />
        <rect x="70" y="47" width="28" height="5.5" rx="2.5" fill={accentOrange} />
        <rect x="78" y="56" width="20" height="5.5" rx="2.5" fill={accentOrange} />

        {/* O with Truck Cab Silhouette */}
        <circle cx="128" cy="48" r="32" fill={primaryBlue} />
        {/* Inner white truck */}
        <path
          d="M106 58 H134 C134 56 135 54 137 54 C139 54 140 56 140 58 H146 V44 H138 L133 34 H120 V58 Z"
          fill="#FFFFFF"
        />
        {/* Truck wheel wells & details */}
        <circle cx="114" cy="58" r="3" fill={primaryBlue} />
        <circle cx="140" cy="58" r="3" fill={primaryBlue} />
        <rect x="127" y="37" width="8" height="5" rx="1" fill={primaryBlue} />

        {/* D */}
        <path
          d="M172 18 H198 C216 18 228 29 228 48 C228 67 216 78 198 78 H172 V18 Z M197 64 C205 64 212 58 212 48 C212 38 205 32 197 32 H186 V64 H197 Z"
          fill={primaryBlue}
        />

        {/* Z */}
        <path
          d="M236 18 H276 V31 L252 64 H276 V78 H234 V65 L258 32 H236 V18 Z"
          fill={primaryBlue}
        />

        {/* A with orange arrowhead inside */}
        <path
          d="M298 18 L324 78 H309 L304 66 H292 L287 78 H272 L298 18 Z M298 34 L294 54 H302 L298 34 Z"
          fill={primaryBlue}
        />
        {/* Orange Accent Arrowhead in A */}
        <path
          d="M298 52 L286 76 L298 70 L310 76 Z"
          fill={accentOrange}
        />
      </svg>

      {showTagline && (
        <span
          className={`font-bold tracking-wider uppercase pl-2 ${dim.fontSize}`}
          style={{ color: taglineColor }}
        >
          Move. Deliver. Done.
        </span>
      )}
    </div>
  );
};
