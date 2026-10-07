import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {MATCH} from '../data';
import {Crest} from '../components/Crest';
import {Hairline, Headline} from '../components/Broadcast';
import {EASE_OUT, punchIn, reveal} from '../components/anim';
import {COLORS, FONTS} from '../theme';

/** Bar 0: the crest assembles out of the dark and the competition is named. */
export const Opening: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const build = interpolate(frame, [0, 46], [0, 1], {
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const lift = interpolate(frame, [0, 90], [40, -14], {easing: EASE_OUT});
  const glow = interpolate(frame, [8, 34, 90], [0, 1, 0.55], {extrapolateRight: 'clamp'});

  const title = punchIn(frame, fps, 34);
  const stage = punchIn(frame, fps, 48);
  const rule = reveal(frame, 44, 18);

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      {/* Halo behind the crest, blooming as it locks together. */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(44% 24% at 50% 40%, rgba(74,168,255,${0.3 * glow}) 0%, transparent 72%)`,
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transform: `translateY(${lift}px)`,
        }}
      >
        <div
          style={{
            filter: `drop-shadow(0 26px 60px rgba(0,0,0,0.8)) drop-shadow(0 0 ${44 * glow}px ${COLORS.blueGlow})`,
            marginBottom: 58,
          }}
        >
          <Crest size={520} progress={build} spin={frame * 1.1} />
        </div>

        <Headline size={96} progress={title}>
          {MATCH.competition}
        </Headline>

        <div style={{marginTop: 26, marginBottom: 26}}>
          <Hairline progress={rule} width={560} />
        </div>

        <div
          style={{
            opacity: stage,
            transform: `translateY(${(1 - stage) * 22}px)`,
            fontFamily: FONTS.body,
            fontWeight: 700,
            fontSize: 44,
            letterSpacing: 18,
            color: COLORS.blue,
            lineHeight: 1,
          }}
        >
          {MATCH.stage}
        </div>
      </div>
    </AbsoluteFill>
  );
};
