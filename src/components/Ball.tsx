import React from 'react';

const pentagon = (cx: number, cy: number, r: number, rotation: number) =>
  Array.from({length: 5}, (_, i) => {
    const a = ((rotation + i * 72) * Math.PI) / 180;
    return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`;
  }).join(' ');

/** The five black panels ringing the centre one, plus five clipped rim panels. */
const RING = Array.from({length: 5}, (_, i) => -90 + i * 72);

export const Ball: React.FC<{
  size: number;
  rotation?: number;
  className?: string;
  style?: React.CSSProperties;
}> = ({size, rotation = 0, style}) => {
  const id = React.useId();
  return (
    <svg
      width={size}
      height={size}
      viewBox="-110 -110 220 220"
      style={{overflow: 'visible', ...style}}
    >
      <defs>
        <radialGradient id={`${id}-shade`} cx="34%" cy="28%" r="78%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#e8ebef" />
          <stop offset="88%" stopColor="#9aa3ad" />
          <stop offset="100%" stopColor="#5b636c" />
        </radialGradient>
        <radialGradient id={`${id}-gloss`} cx="30%" cy="22%" r="42%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        <clipPath id={`${id}-clip`}>
          <circle cx="0" cy="0" r="100" />
        </clipPath>
      </defs>

      <circle cx="0" cy="0" r="100" fill={`url(#${id}-shade)`} />

      <g clipPath={`url(#${id}-clip)`}>
        {/* The panel layout spins with the ball; the shading above does not. */}
        <g transform={`rotate(${rotation})`}>
          <polygon points={pentagon(0, 0, 36, -90)} fill="#16181c" />
          {RING.map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const cx = Math.cos(rad) * 72;
            const cy = Math.sin(rad) * 72;
            return (
              <polygon
                key={`ring-${angle}`}
                points={pentagon(cx, cy, 27, angle + 90)}
                fill="#16181c"
                opacity={0.96}
              />
            );
          })}
          {RING.map((angle) => {
            const rad = ((angle + 36) * Math.PI) / 180;
            const cx = Math.cos(rad) * 124;
            const cy = Math.sin(rad) * 124;
            return (
              <polygon
                key={`rim-${angle}`}
                points={pentagon(cx, cy, 30, angle + 36)}
                fill="#16181c"
                opacity={0.9}
              />
            );
          })}
          {/* Seams between the white hexagons. */}
          <g stroke="#3a4048" strokeWidth={2.4} fill="none" opacity={0.55}>
            {RING.map((angle) => {
              const rad = (angle * Math.PI) / 180;
              return (
                <line
                  key={`seam-${angle}`}
                  x1={Math.cos(rad) * 44}
                  y1={Math.sin(rad) * 44}
                  x2={Math.cos(rad) * 100}
                  y2={Math.sin(rad) * 100}
                />
              );
            })}
          </g>
        </g>
        <circle cx="0" cy="0" r="100" fill={`url(#${id}-gloss)`} />
      </g>

      <circle cx="0" cy="0" r="99" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth={3} />
    </svg>
  );
};
