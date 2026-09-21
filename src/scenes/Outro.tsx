import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {MATCH} from '../data';
import {Ball} from '../components/Ball';
import {impactFlash, punchIn, reveal} from '../components/anim';
import {COLORS, FONTS, shadow} from '../theme';

const CONFETTI = Array.from({length: 46}, (_, i) => ({
  seed: i,
  x: random(`x-${i}`) * 1080,
  delay: random(`d-${i}`) * 26,
  speed: 5 + random(`s-${i}`) * 7,
  size: 12 + random(`w-${i}`) * 20,
  tint: [COLORS.lime, COLORS.orange, COLORS.ice, '#ffffff'][i % 4],
}));

/** Bars 16-18: the recap you can screenshot and send to the group chat. */
export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const headline = punchIn(frame, fps, 4);
  const card = punchIn(frame, fps, 18);
  const note = punchIn(frame, fps, 52);
  const rule = reveal(frame, 34, 22);
  const ballSpin = frame * 2.6;

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 40}}>
      <AbsoluteFill style={{background: 'rgba(6,17,25,0.55)'}} />

      {CONFETTI.map(({seed, x, delay, speed, size, tint}) => {
        const t = Math.max(0, frame - delay);
        const y = -120 + t * speed;
        if (y > 2040) return null;
        return (
          <div
            key={seed}
            style={{
              position: 'absolute',
              left: x + Math.sin((t + seed) / 12) * 60,
              top: y,
              width: size,
              height: size * 0.5,
              background: tint,
              opacity: 0.85,
              borderRadius: 3,
              transform: `rotate(${t * (4 + (seed % 5))}deg)`,
            }}
          />
        );
      })}

      <div
        style={{
          opacity: headline,
          transform: `scale(${interpolate(headline, [0, 1], [1.4, 1])})`,
          fontFamily: FONTS.display,
          fontSize: 176,
          color: '#fff',
          letterSpacing: 3,
          textShadow: shadow(1),
          textAlign: 'center',
          lineHeight: 1.02,
        }}
      >
        HAZIR MISIN?
      </div>

      <div
        style={{
          width: 640 * rule,
          height: 10,
          borderRadius: 5,
          background: `linear-gradient(90deg, ${COLORS.orange}, ${COLORS.lime}, ${COLORS.ice})`,
        }}
      />

      <div
        style={{
          opacity: card,
          transform: `translateY(${(1 - card) * 120}px)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 18,
          padding: '50px 74px',
          borderRadius: 40,
          background: 'rgba(6,17,25,0.82)',
          border: `5px solid ${COLORS.lime}`,
          boxShadow: `${shadow(1)}, 0 0 90px rgba(200,255,46,0.28)`,
        }}
      >
        <span
          style={{
            fontFamily: FONTS.display,
            fontSize: 136,
            color: COLORS.lime,
            letterSpacing: 2,
            lineHeight: 1.3, // reserves the Ş descender in PERŞEMBE
          }}
        >
          {MATCH.day}
        </span>
        <span
          style={{
            fontFamily: FONTS.display,
            fontSize: 190,
            color: '#fff',
            letterSpacing: 4,
            lineHeight: 1,
          }}
        >
          {MATCH.time}
        </span>
        <span
          style={{
            fontFamily: FONTS.body,
            fontWeight: 700,
            fontSize: 66,
            letterSpacing: 10,
            color: 'rgba(255,255,255,0.88)',
          }}
        >
          {MATCH.venue}
        </span>
      </div>

      <div
        style={{
          opacity: note,
          display: 'flex',
          alignItems: 'center',
          gap: 26,
          marginTop: 6,
        }}
      >
        <Ball size={92} rotation={ballSpin} />
        <span
          style={{
            fontFamily: FONTS.body,
            fontWeight: 700,
            fontSize: 56,
            letterSpacing: 6,
            color: '#fff',
          }}
        >
          FORMANI AL, SAHAYA GEL!
        </span>
      </div>

      <AbsoluteFill style={{background: '#fff', opacity: impactFlash(frame, 8)}} />
    </AbsoluteFill>
  );
};
