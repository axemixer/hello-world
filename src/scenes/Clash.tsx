import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {TEAM_A, TEAM_B} from '../data';
import {Jersey} from '../components/Jersey';
import {EASE_OUT, impactFlash, punchIn} from '../components/anim';
import {COLORS, FONTS, shadow} from '../theme';

/** Bars 14-15: the two halves slam together and VS lands between them. */
export const Clash: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const slam = interpolate(frame, [0, 22], [0, 1], {
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const vs = punchIn(frame, fps, 18);
  const vsPulse = 1 + 0.045 * Math.sin((frame - 18) / 5);
  const shake = frame < 30 ? Math.sin(frame * 3.4) * (1 - slam) * 26 : 0;

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      {/* Black half, sliding down from the top on a diagonal cut. */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(160deg, ${TEAM_A.shirt}, #000)`,
          clipPath: 'polygon(0 0, 100% 0, 100% 46%, 0 58%)',
          transform: `translateY(${(1 - slam) * -1000}px)`,
        }}
      />
      {/* White half, sliding up from the bottom. */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(340deg, ${TEAM_B.shirt}, #b9bec7)`,
          clipPath: 'polygon(0 58%, 100% 46%, 100% 100%, 0 100%)',
          transform: `translateY(${(1 - slam) * 1000}px)`,
        }}
      />
      {/* The seam between them. */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(94deg, ${COLORS.orange}, ${COLORS.lime}, ${COLORS.ice})`,
          clipPath: 'polygon(0 57%, 100% 45%, 100% 47%, 0 59%)',
          opacity: slam,
        }}
      />

      <AbsoluteFill style={{transform: `translateX(${shake}px)`}}>
        <div
          style={{
            position: 'absolute',
            top: 270,
            left: 0,
            right: 0,
            textAlign: 'center',
            opacity: punchIn(frame, fps, 10),
          }}
        >
          <div style={{display: 'flex', justifyContent: 'center', marginBottom: 6}}>
            <Jersey team={TEAM_A} size={300} number="A" />
          </div>
          <div
            style={{
              fontFamily: FONTS.display,
              fontSize: 118,
              color: '#fff',
              letterSpacing: 4,
              textShadow: shadow(1),
            }}
          >
            SİYAH
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 230,
            left: 0,
            right: 0,
            textAlign: 'center',
            opacity: punchIn(frame, fps, 14),
          }}
        >
          <div
            style={{
              fontFamily: FONTS.display,
              fontSize: 118,
              color: TEAM_B.ink,
              letterSpacing: 4,
            }}
          >
            BEYAZ
          </div>
          <div style={{display: 'flex', justifyContent: 'center', marginTop: 6}}>
            <Jersey team={TEAM_B} size={300} number="B" />
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) scale(${vs * vsPulse}) rotate(-7deg)`,
            fontFamily: FONTS.display,
            fontSize: 300,
            color: COLORS.orange,
            WebkitTextStroke: '10px #fff',
            textShadow: '0 24px 60px rgba(0,0,0,0.65)',
            lineHeight: 1,
          }}
        >
          VS
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{background: '#fff', opacity: impactFlash(frame, 10)}} />
    </AbsoluteFill>
  );
};
