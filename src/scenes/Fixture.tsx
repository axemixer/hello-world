import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {MATCH} from '../data';
import {Crest} from '../components/Crest';
import {CompetitionTag, Hairline, Headline} from '../components/Broadcast';
import {EASE_OUT, punchIn, reveal} from '../components/anim';
import {COLORS, FONTS, GLASS, silverText} from '../theme';

const Row: React.FC<{label: string; value: string; p: number; accent?: boolean}> = ({
  label,
  value,
  p,
  accent,
}) => (
  <div
    style={{
      width: '100%',
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      padding: '22px 36px 30px',
      opacity: p,
      transform: `translateX(${(1 - p) * -40}px)`,
    }}
  >
    <span
      style={{
        fontFamily: FONTS.body,
        fontWeight: 600,
        fontSize: 30,
        letterSpacing: 11,
        color: COLORS.silverDim,
        lineHeight: 1,
      }}
    >
      {label}
    </span>
    <span
      style={
        accent
          ? {
              fontFamily: FONTS.display,
              fontSize: 92,
              letterSpacing: 3,
              color: COLORS.blue,
              lineHeight: 1.4,
            }
          : {
              ...silverText,
              fontFamily: FONTS.display,
              fontSize: 72,
              letterSpacing: 2,
              lineHeight: 1.4, // the Ş in PERŞEMBE hangs below the baseline
            }
      }
    >
      {value}
    </span>
  </div>
);

/** Bar 4: the kick-off card — the frame people screenshot for the group. */
export const Fixture: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const card = interpolate(frame, [4, 24], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const headline = punchIn(frame, fps, 0);
  const call = punchIn(frame, fps, 48);

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(56% 30% at 50% 46%, rgba(74,168,255,0.22) 0%, transparent 74%)',
        }}
      />

      <AbsoluteFill
        style={{
          padding: '58px 52px 56px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <CompetitionTag progress={reveal(frame, 0, 12)} />

        <div
          style={{
            flex: 1,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 34,
          }}
        >
          <div style={{filter: `drop-shadow(0 0 40px ${COLORS.blueGlow})`}}>
            <Crest size={230} progress={1} spin={frame * 0.9} />
          </div>

          <Headline size={104} progress={headline}>
            MAÇ GÜNÜ
          </Headline>

          <div
            style={{
              width: '100%',
              opacity: card,
              transform: `translateY(${(1 - card) * 60}px)`,
              background: GLASS,
              border: `2px solid ${COLORS.silverFaint}`,
              boxShadow: '0 28px 70px rgba(0,0,0,0.7)',
            }}
          >
            <Hairline progress={card} />
            <Row label="GÜN" value={MATCH.day} p={punchIn(frame, fps, 18)} />
            <div style={{opacity: 0.4}}>
              <Hairline progress={card} />
            </div>
            <Row label="SAAT" value={MATCH.time} p={punchIn(frame, fps, 24)} accent />
            <div style={{opacity: 0.4}}>
              <Hairline progress={card} />
            </div>
            <Row label="SAHA" value={MATCH.venue} p={punchIn(frame, fps, 30)} />
            <Hairline progress={card} />
          </div>
        </div>

        <div
          style={{
            opacity: call,
            transform: `translateY(${(1 - call) * 20}px)`,
            fontFamily: FONTS.body,
            fontWeight: 700,
            fontSize: 46,
            letterSpacing: 10,
            color: COLORS.silver,
            lineHeight: 1,
          }}
        >
          FORMANI AL, SAHAYA GEL!
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
