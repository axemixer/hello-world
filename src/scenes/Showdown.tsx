import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {MATCH, TEAM_A, TEAM_B} from '../data';
import type {Team} from '../data';
import {CompetitionTag, Hairline} from '../components/Broadcast';
import {EASE_OUT, punchIn} from '../components/anim';
import {COLORS, FONTS, silverText} from '../theme';

const Medallion: React.FC<{team: Team; letter: string; p: number; from: number}> = ({
  team,
  letter,
  p,
  from,
}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 22,
      opacity: p,
      transform: `translateY(${(1 - p) * from}px)`,
    }}
  >
    <div
      style={{
        width: 268,
        height: 268,
        borderRadius: '50%',
        background: team.shirt,
        border: `9px solid ${COLORS.silverDim}`,
        display: 'grid',
        placeItems: 'center',
        boxShadow: `0 26px 60px rgba(0,0,0,0.75), 0 0 54px ${COLORS.blueGlow}`,
      }}
    >
      <span style={{fontFamily: FONTS.display, fontSize: 150, color: team.ink, lineHeight: 1}}>
        {letter}
      </span>
    </div>

    <span
      style={{
        ...silverText,
        fontFamily: FONTS.display,
        fontSize: 92,
        letterSpacing: 3,
        lineHeight: 1.18,
      }}
    >
      {team.name}
    </span>

    <span
      style={{
        fontFamily: FONTS.body,
        fontWeight: 700,
        fontSize: 32,
        letterSpacing: 12,
        color: COLORS.blue,
        lineHeight: 1.3,
      }}
    >
      {team.formation}
    </span>
  </div>
);

/** Bar 3: the head-to-head. Both sides arrive on the timpani, VS lands between. */
export const Showdown: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const top = punchIn(frame, fps, 2);
  const bottom = punchIn(frame, fps, 8);
  const vs = punchIn(frame, fps, 16);
  const sweep = interpolate(frame, [12, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const pulse = 1 + 0.03 * Math.sin((frame - 16) / 7);

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `radial-gradient(50% 26% at 50% 50%, rgba(74,168,255,0.26) 0%, transparent 74%)`,
          opacity: sweep,
        }}
      />

      <AbsoluteFill
        style={{
          padding: '58px 42px 54px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <CompetitionTag progress={punchIn(frame, fps, 0)} />

        <div
          style={{
            flex: 1,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
          }}
        >
          <Medallion team={TEAM_A} letter="A" p={top} from={-150} />

          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 22,
              margin: '26px 0',
            }}
          >
            <Hairline progress={sweep} width={760} />
            <span
              style={{
                ...silverText,
                fontFamily: FONTS.display,
                fontSize: 128,
                letterSpacing: 10,
                lineHeight: 1,
                opacity: vs,
                transform: `scale(${vs * pulse})`,
                filter: `drop-shadow(0 0 30px ${COLORS.blueGlow})`,
              }}
            >
              VS
            </span>
            <Hairline progress={sweep} width={760} />
          </div>

          <Medallion team={TEAM_B} letter="B" p={bottom} from={150} />
        </div>

        <div
          style={{
            opacity: punchIn(frame, fps, 30),
            fontFamily: FONTS.body,
            fontWeight: 700,
            fontSize: 40,
            letterSpacing: 14,
            color: COLORS.silverDim,
            lineHeight: 1.3,
          }}
        >
          {MATCH.venue.toUpperCase()}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
