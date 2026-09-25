import React from 'react';
import type {Team} from '../data';

/**
 * A halı saha shirt: body + sleeves + collar, with the team's number on the
 * back. Drawn as one path so it scales cleanly at any size.
 */
export const Jersey: React.FC<{
  team: Team;
  size: number;
  number?: string;
  style?: React.CSSProperties;
}> = ({team, size, number = '10', style}) => {
  const id = React.useId();
  const height = size * 1.06;

  return (
    <svg width={size} height={height} viewBox="0 0 320 340" style={style}>
      <defs>
        <linearGradient id={`${id}-fabric`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={team.shirt} />
          <stop offset="55%" stopColor={team.shirt} />
          <stop offset="100%" stopColor={team.shirtShade} />
        </linearGradient>
        <filter id={`${id}-drop`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="14" stdDeviation="16" floodColor="rgba(0,0,0,0.55)" />
        </filter>
      </defs>

      <g filter={`url(#${id}-drop)`}>
        <path
          d="M110 18 L60 40 L18 78 L58 126 L82 108 L82 318
             Q160 332 238 318 L238 108 L262 126 L302 78 L260 40 L210 18
             Q160 62 110 18 Z"
          fill={`url(#${id}-fabric)`}
          stroke={team.shirtShade}
          strokeWidth={3}
          strokeLinejoin="round"
        />
        {/* Collar */}
        <path
          d="M110 18 Q160 62 210 18 L196 12 Q160 46 124 12 Z"
          fill={team.accent}
          opacity={0.95}
        />
        {/* Sleeve cuffs */}
        <path d="M18 78 L58 126 L68 116 L30 70 Z" fill={team.accent} opacity={0.9} />
        <path d="M302 78 L262 126 L252 116 L290 70 Z" fill={team.accent} opacity={0.9} />
        {/* Hem */}
        <path
          d="M82 300 L82 318 Q160 332 238 318 L238 300 Q160 314 82 300 Z"
          fill={team.accent}
          opacity={0.85}
        />
      </g>

      <text
        x="160"
        y="238"
        textAnchor="middle"
        fontFamily='"Anton", sans-serif'
        fontSize={150}
        fill={team.ink}
        opacity={0.95}
      >
        {number}
      </text>
    </svg>
  );
};
