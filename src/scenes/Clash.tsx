import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {TEAM_A, TEAM_B} from '../data';
import {Jersey} from '../components/Jersey';
import {EASE_OUT, impactFlash, punchIn} from '../components/anim';
import {COLORS, FONTS, shadow} from '../theme';

/** Bar 6: the pre-match face-off card. One bar, so it hits and moves on. */
export const Clash: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const slam = interpolate(frame, [0, 14], [0, 1], {
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const vs = punchIn(frame, fps, 8);
  const shake = frame < 20 ? Math.sin(frame * 3.6) * (1 - slam) * 22 : 0;

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          background: `linear-gradient(160deg, ${TEAM_A.shirt}, #000)`,
          clipPath: 'polygon(0 0, 100% 0, 100% 46%, 0 58%)',
          transform: `translateY(${(1 - slam) * -1000}px)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `linear-gradient(340deg, ${TEAM_B.shirt}, #b9bec7)`,
          clipPath: 'polygon(0 58%, 100% 46%, 100% 100%, 0 100%)',
          transform: `translateY(${(1 - slam) * 1000}px)`,
        }}
      />
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
            top: 300,
            left: 0,
            right: 0,
            textAlign: 'center',
            opacity: punchIn(frame, fps, 4),
          }}
        >
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <Jersey team={TEAM_A} size={300} number="A" />
          </div>
          <div
            style={{
              fontFamily: FONTS.display,
              fontSize: 124,
              color: '#fff',
              letterSpacing: 4,
              textShadow: shadow(1),
              lineHeight: 1.1,
            }}
          >
            SİYAH
          </div>
          <div
            style={{
              fontFamily: FONTS.body,
              fontWeight: 600,
              fontSize: 30,
              letterSpacing: 10,
              color: TEAM_A.accent,
              lineHeight: 1,
            }}
          >
            {TEAM_A.formation}
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 258,
            left: 0,
            right: 0,
            textAlign: 'center',
            opacity: punchIn(frame, fps, 7),
          }}
        >
          <div
            style={{
              fontFamily: FONTS.body,
              fontWeight: 600,
              fontSize: 30,
              letterSpacing: 10,
              color: '#1b7f9c',
              lineHeight: 1,
            }}
          >
            {TEAM_B.formation}
          </div>
          <div
            style={{
              fontFamily: FONTS.display,
              fontSize: 124,
              color: TEAM_B.ink,
              letterSpacing: 4,
              lineHeight: 1.1,
            }}
          >
            BEYAZ
          </div>
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <Jersey team={TEAM_B} size={300} number="B" />
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) scale(${vs}) rotate(-7deg)`,
            fontFamily: FONTS.display,
            fontSize: 290,
            color: COLORS.orange,
            WebkitTextStroke: '10px #fff',
            textShadow: '0 24px 60px rgba(0,0,0,0.65)',
            lineHeight: 1,
          }}
        >
          VS
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{background: '#fff', opacity: impactFlash(frame, 8)}} />
    </AbsoluteFill>
  );
};
