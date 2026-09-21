import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Ball} from '../components/Ball';
import {EASE_OUT, punchIn, reveal} from '../components/anim';
import {COLORS, FONTS, shadow} from '../theme';

/** Bars 0-1: floodlights snap on, the ball rolls in, the title lands. */
export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const ballIn = interpolate(frame, [6, 46], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const ballY = interpolate(ballIn, [0, 1], [520, 0]);
  const ballScale = interpolate(ballIn, [0, 1], [0.25, 1]);
  const spin = interpolate(frame, [0, 120], [0, 430]);

  const kicker = punchIn(frame, fps, 40);
  const title = punchIn(frame, fps, 50);
  const rule = reveal(frame, 66, 20);

  return (
    <AbsoluteFill
      style={{alignItems: 'center', justifyContent: 'center', gap: 0}}
    >
      <div
        style={{
          transform: `translateY(${ballY - 180}px) scale(${ballScale})`,
          filter: `drop-shadow(0 40px 60px rgba(0,0,0,0.6))`,
          opacity: ballIn,
        }}
      >
        <Ball size={420} rotation={spin} />
      </div>

      <div
        style={{
          marginTop: -60,
          opacity: kicker,
          transform: `translateY(${(1 - kicker) * 40}px)`,
          fontFamily: FONTS.body,
          fontWeight: 700,
          fontSize: 62,
          letterSpacing: 18,
          color: COLORS.lime,
          textShadow: shadow(0.7),
          marginBottom: 12,
        }}
      >
        HALI SAHA
      </div>

      <div
        style={{
          opacity: title,
          transform: `scale(${interpolate(title, [0, 1], [1.5, 1])})`,
          fontFamily: FONTS.display,
          fontSize: 230,
          // Reserves the deep Ç cedilla, which otherwise crosses the rule.
          lineHeight: 1.3,
          color: '#fff',
          letterSpacing: 4,
          textShadow: `0 18px 50px rgba(0,0,0,0.75)`,
        }}
      >
        MAÇ GÜNÜ
      </div>

      <div
        style={{
          // Clears Anton's unusually deep Ç cedilla in "MAÇ".
          marginTop: 46,
          width: 620 * rule,
          height: 10,
          borderRadius: 5,
          background: `linear-gradient(90deg, ${COLORS.orange}, ${COLORS.lime})`,
        }}
      />
    </AbsoluteFill>
  );
};
