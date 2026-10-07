import React from 'react';
import {COLORS} from '../theme';

/** Five-pointed star centred on (cx, cy). */
const star = (cx: number, cy: number, r: number, rotation = -90) => {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const rad = ((rotation + i * 36) * Math.PI) / 180;
    const rr = i % 2 === 0 ? r : r * 0.42;
    pts.push(`${(cx + rr * Math.cos(rad)).toFixed(2)},${(cy + rr * Math.sin(rad)).toFixed(2)}`);
  }
  return pts.join(' ');
};

/** The five stars sit on an arc across the shoulders of the shield. */
const STAR_ARC = [-62, -31, 0, 31, 62].map((deg) => {
  const rad = ((deg - 90) * Math.PI) / 180;
  return {deg, x: 200 + Math.cos(rad) * 132, y: 212 + Math.sin(rad) * 132};
});

/**
 * The competition crest — an original silver shield with a star arc over a
 * football. `progress` drives the build-on: rim, then stars, then the ball.
 */
export const Crest: React.FC<{size: number; progress: number; spin?: number}> = ({
  size,
  progress,
  spin = 0,
}) => {
  const id = React.useId();
  const p = Math.max(0, Math.min(1, progress));

  const rim = Math.min(1, p / 0.45);
  const ball = Math.max(0, Math.min(1, (p - 0.3) / 0.45));

  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 400 440" style={{overflow: 'visible'}}>
      <defs>
        <linearGradient id={`${id}-silver`} x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="28%" stopColor="#dbe6fb" />
          <stop offset="52%" stopColor="#92a8d2" />
          <stop offset="70%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#7d93bd" />
        </linearGradient>
        <linearGradient id={`${id}-field`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor={COLORS.navyMid} />
          <stop offset="60%" stopColor={COLORS.navy} />
          <stop offset="100%" stopColor={COLORS.navyDeep} />
        </linearGradient>
        <radialGradient id={`${id}-inner`} cx="50%" cy="34%" r="62%">
          <stop offset="0%" stopColor="rgba(74,168,255,0.42)" />
          <stop offset="100%" stopColor="rgba(74,168,255,0)" />
        </radialGradient>
        <radialGradient id={`${id}-ball`} cx="36%" cy="30%" r="74%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="62%" stopColor="#e2e8f4" />
          <stop offset="100%" stopColor="#8e9bb2" />
        </radialGradient>
      </defs>

      <g opacity={rim}>
        {/* Shield: square shoulders tapering to a point. */}
        <path
          d="M200 26 L372 86 Q372 268 200 414 Q28 268 28 86 Z"
          fill={`url(#${id}-field)`}
          stroke={`url(#${id}-silver)`}
          strokeWidth={11}
          strokeLinejoin="round"
        />
        <path
          d="M200 56 L346 107 Q346 258 200 378 Q54 258 54 107 Z"
          fill="none"
          stroke={COLORS.silverFaint}
          strokeWidth={3}
        />
        <path
          d="M200 26 L372 86 Q372 268 200 414 Q28 268 28 86 Z"
          fill={`url(#${id}-inner)`}
        />
      </g>

      {STAR_ARC.map(({deg, x, y}, i) => {
        // Stars light up one after another as the crest assembles.
        const s = Math.max(0, Math.min(1, (p - 0.34 - i * 0.07) / 0.2));
        return (
          <polygon
            key={deg}
            points={star(x, y, 25, -90 + deg * 0.5)}
            fill={`url(#${id}-silver)`}
            opacity={s}
            transform={`translate(${x} ${y}) scale(${0.5 + 0.5 * s}) translate(${-x} ${-y})`}
            style={{filter: `drop-shadow(0 0 ${10 * s}px ${COLORS.blueGlow})`}}
          />
        );
      })}

      <g
        opacity={ball}
        transform={`translate(200 268) scale(${0.55 + 0.45 * ball}) rotate(${spin}) translate(-200 -268)`}
      >
        <circle cx="200" cy="268" r="74" fill={`url(#${id}-ball)`} />
        {/* Panels: one centre pentagon ringed by five more. */}
        <polygon points={pent(200, 268, 27, -90)} fill="#101a30" />
        {[-90, -18, 54, 126, 198].map((a) => {
          const rad = (a * Math.PI) / 180;
          return (
            <polygon
              key={a}
              points={pent(200 + Math.cos(rad) * 54, 268 + Math.sin(rad) * 54, 20, a + 90)}
              fill="#101a30"
              opacity={0.95}
            />
          );
        })}
        <circle cx="200" cy="268" r="74" fill="none" stroke={COLORS.silverFaint} strokeWidth={4} />
      </g>
    </svg>
  );
};

/** Regular pentagon, used for the ball panels. */
function pent(cx: number, cy: number, r: number, rotation: number) {
  return Array.from({length: 5}, (_, i) => {
    const a = ((rotation + i * 72) * Math.PI) / 180;
    return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`;
  }).join(' ');
}
