import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {EASE_OUT} from '../components/anim';
import {Ball} from '../components/Ball';
import {COLORS, FONTS} from '../theme';

const WORD = 'KADROLAR';

/**
 * Bars 6-7: the build-up. Diagonal bars sweep past, the word scales up with
 * the riser, and everything blows out white right before the bar-8 impact.
 */
export const Callout: React.FC = () => {
  const frame = useCurrentFrame();

  const sweep = interpolate(frame, [0, 120], [0, 1]);
  const scale = interpolate(frame, [0, 96, 118], [0.55, 1.05, 1.9], {
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const blur = interpolate(frame, [96, 120], [0, 26], {extrapolateLeft: 'clamp'});
  const whiteOut = interpolate(frame, [100, 120], [0, 0.95], {extrapolateLeft: 'clamp'});
  const shake = frame > 80 ? Math.sin(frame * 2.7) * (frame - 80) * 0.7 : 0;

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
      {/* Diagonal speed bars */}
      <AbsoluteFill style={{transform: 'rotate(-18deg) scale(1.6)'}}>
        {Array.from({length: 9}, (_, i) => {
          const offset = ((sweep * 2 + i / 9) % 1) * 2400 - 600;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: offset,
                left: -400,
                width: 2200,
                height: i % 3 === 0 ? 26 : 10,
                background:
                  i % 3 === 0
                    ? `linear-gradient(90deg, transparent, ${COLORS.lime}, transparent)`
                    : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)',
                opacity: 0.6,
              }}
            />
          );
        })}
      </AbsoluteFill>

      <div
        style={{
          position: 'absolute',
          opacity: 0.22,
          transform: `translateY(${-interpolate(frame, [0, 120], [0, 120])}px)`,
        }}
      >
        <Ball size={900} rotation={frame * 3} />
      </div>

      {/* Scrim so the word keeps its punch against the bright sweep. */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(58% 26% at 50% 50%, rgba(6,17,25,0.82) 0%, rgba(6,17,25,0.35) 60%, transparent 100%)',
        }}
      />

      <div
        style={{
          transform: `translateX(${shake}px) scale(${scale})`,
          filter: `blur(${blur}px)`,
          fontFamily: FONTS.display,
          fontSize: 190,
          color: '#fff',
          letterSpacing: 6,
          textShadow: `0 0 70px ${COLORS.lime}, 0 20px 60px rgba(0,0,0,0.8)`,
          textAlign: 'center',
          lineHeight: 0.95,
        }}
      >
        {WORD}
        <div
          style={{
            fontFamily: FONTS.body,
            fontWeight: 700,
            fontSize: 58,
            letterSpacing: 20,
            color: COLORS.lime,
            textShadow: 'none',
            marginTop: 14,
          }}
        >
          AÇIKLANDI
        </div>
      </div>

      <AbsoluteFill style={{background: '#fff', opacity: whiteOut}} />
    </AbsoluteFill>
  );
};
