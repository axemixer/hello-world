import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS} from '../theme';

const STRIPES = 14;

/**
 * The permanent backdrop: a top-down halı saha with mown stripes, line
 * markings, floodlight bloom and a slow drift so the frame is never static.
 */
export const Pitch: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const id = React.useId();

  const drift = interpolate(frame, [0, durationInFrames], [0, -90]);
  const zoom = interpolate(frame, [0, durationInFrames], [1.1, 1.22]);
  // Floodlights buzz on over the first second, then hold with a faint flicker.
  const lights =
    interpolate(frame, [0, 6, 9, 14, 18, 30], [0, 0.55, 0.2, 0.9, 0.7, 1], {
      extrapolateRight: 'clamp',
    }) *
    (0.96 + 0.04 * Math.sin(frame / 7));

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1080 1920"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id={`${id}-turf`} x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0%" stopColor={COLORS.turfLight} />
            <stop offset="45%" stopColor={COLORS.turf} />
            <stop offset="100%" stopColor={COLORS.turfDark} />
          </linearGradient>
          <radialGradient id={`${id}-flood`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(220,255,225,0.75)" />
            <stop offset="45%" stopColor="rgba(160,230,180,0.22)" />
            <stop offset="100%" stopColor="rgba(160,230,180,0)" />
          </radialGradient>
          <radialGradient id={`${id}-vignette`} cx="50%" cy="46%" r="72%">
            <stop offset="55%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.82)" />
          </radialGradient>
          <filter id={`${id}-grain`} x="0" y="0" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves={3}
              seed={7}
              result="noise"
            />
            <feColorMatrix in="noise" type="saturate" values="0" />
          </filter>
        </defs>

        <g transform={`translate(540 960) scale(${zoom}) translate(-540 ${drift - 960})`}>
          <rect x="-200" y="-200" width="1480" height="2320" fill={`url(#${id}-turf)`} />

          {/* Mown stripes */}
          {Array.from({length: STRIPES}, (_, i) => (
            <rect
              key={`stripe-${i}`}
              x="-200"
              y={-200 + (i * 2320) / STRIPES}
              width="1480"
              height={2320 / STRIPES}
              fill="#ffffff"
              opacity={i % 2 === 0 ? 0.052 : 0.012}
            />
          ))}

          {/* Line markings */}
          <g
            fill="none"
            stroke={COLORS.line}
            strokeWidth={7}
            opacity={0.55}
            strokeLinecap="square"
          >
            <rect x="70" y="120" width="940" height="1680" />
            <line x1="70" y1="960" x2="1010" y2="960" />
            <circle cx="540" cy="960" r="215" />
            <circle cx="540" cy="960" r="12" fill={COLORS.line} stroke="none" />
            <rect x="255" y="120" width="570" height="290" />
            <rect x="255" y="1510" width="570" height="290" />
            <rect x="390" y="120" width="300" height="130" />
            <rect x="390" y="1670" width="300" height="130" />
            <path d="M70 190 A70 70 0 0 0 140 120" />
            <path d="M1010 190 A70 70 0 0 1 940 120" />
            <path d="M70 1730 A70 70 0 0 1 140 1800" />
            <path d="M1010 1730 A70 70 0 0 0 940 1800" />
          </g>
        </g>

        {/* Floodlight bloom from the top corners */}
        <g opacity={lights}>
          <ellipse cx="180" cy="90" rx="620" ry="560" fill={`url(#${id}-flood)`} />
          <ellipse cx="900" cy="90" rx="620" ry="560" fill={`url(#${id}-flood)`} />
          <ellipse cx="540" cy="1880" rx="700" ry="420" fill={`url(#${id}-flood)`} opacity={0.5} />
        </g>

        <rect width="1080" height="1920" fill={`url(#${id}-vignette)`} />
        <rect
          width="1080"
          height="1920"
          filter={`url(#${id}-grain)`}
          opacity={0.055}
          style={{mixBlendMode: 'overlay'}}
        />
      </svg>
    </AbsoluteFill>
  );
};
