import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS} from '../theme';

const STARS = Array.from({length: 150}, (_, i) => ({
  i,
  x: random(`sx-${i}`) * 1080,
  y: random(`sy-${i}`) * 1920,
  r: 0.8 + random(`sr-${i}`) * 2.6,
  phase: random(`sp-${i}`) * Math.PI * 2,
  speed: 0.5 + random(`ss-${i}`) * 1.8,
}));

/**
 * The permanent backdrop for every scene: a midnight sky with a drifting star
 * field, two cold light shafts and a faint pitch horizon at the bottom.
 */
export const Starfield: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const id = React.useId();

  // Everything creeps very slowly, so no frame is ever completely still.
  const drift = interpolate(frame, [0, durationInFrames], [0, -60]);
  const shaft = 0.5 + 0.5 * Math.sin(frame / 38);

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.void, overflow: 'hidden'}}>
      <svg width="100%" height="100%" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id={`${id}-sky`} cx="50%" cy="34%" r="78%">
            <stop offset="0%" stopColor={COLORS.navyMid} />
            <stop offset="42%" stopColor={COLORS.navy} />
            <stop offset="100%" stopColor={COLORS.void} />
          </radialGradient>
          <linearGradient id={`${id}-shaft`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(120,180,255,0.30)" />
            <stop offset="100%" stopColor="rgba(120,180,255,0)" />
          </linearGradient>
          <radialGradient id={`${id}-horizon`} cx="50%" cy="100%" r="60%">
            <stop offset="0%" stopColor="rgba(40,120,220,0.30)" />
            <stop offset="100%" stopColor="rgba(40,120,220,0)" />
          </radialGradient>
          <radialGradient id={`${id}-vignette`} cx="50%" cy="46%" r="74%">
            <stop offset="52%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.86)" />
          </radialGradient>
        </defs>

        <rect width="1080" height="1920" fill={`url(#${id}-sky)`} />

        {/* Light shafts, as if from the floodlight gantries. */}
        <g opacity={0.5 + 0.3 * shaft}>
          <polygon points="150,-80 420,-80 250,1200 10,1000" fill={`url(#${id}-shaft)`} />
          <polygon points="700,-80 980,-80 1090,1020 820,1200" fill={`url(#${id}-shaft)`} />
        </g>

        <g transform={`translate(0 ${drift})`}>
          {STARS.map(({i, x, y, r, phase, speed}) => {
            const twinkle = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(frame / (9 / speed) + phase));
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={r}
                fill={i % 7 === 0 ? COLORS.blue : '#ffffff'}
                opacity={twinkle * (i % 7 === 0 ? 0.9 : 0.62)}
              />
            );
          })}
        </g>

        <rect y="1340" width="1080" height="580" fill={`url(#${id}-horizon)`} />
        <rect width="1080" height="1920" fill={`url(#${id}-vignette)`} />
      </svg>
    </AbsoluteFill>
  );
};
