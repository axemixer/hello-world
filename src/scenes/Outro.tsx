import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {MATCH, TEAM_A, TEAM_B} from '../data';
import {Ball} from '../components/Ball';
import {AccentRule, LiveTag} from '../components/Broadcast';
import {impactFlash, punchIn, reveal} from '../components/anim';
import {COLORS, FONTS, shadow} from '../theme';

const CONFETTI = Array.from({length: 40}, (_, i) => ({
  seed: i,
  x: random(`x-${i}`) * 1080,
  delay: random(`d-${i}`) * 18,
  speed: 7 + random(`s-${i}`) * 9,
  size: 12 + random(`w-${i}`) * 20,
  tint: [COLORS.lime, COLORS.orange, COLORS.ice, '#ffffff'][i % 4],
}));

const TeamBlock: React.FC<{
  name: string;
  shirt: string;
  ink: string;
  accent: string;
  letter: string;
  progress: number;
  from: number;
}> = ({name, shirt, ink, accent, letter, progress, from}) => (
  <div
    style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 14,
      opacity: progress,
      transform: `translateX(${(1 - progress) * from}px)`,
    }}
  >
    <div
      style={{
        width: 148,
        height: 148,
        borderRadius: '50%',
        background: shirt,
        border: `6px solid ${accent}`,
        display: 'grid',
        placeItems: 'center',
        boxShadow: shadow(0.8),
      }}
    >
      <span style={{fontFamily: FONTS.display, fontSize: 84, color: ink, lineHeight: 1}}>
        {letter}
      </span>
    </div>
    <span
      style={{
        fontFamily: FONTS.display,
        fontSize: 58,
        color: '#fff',
        letterSpacing: 1,
        lineHeight: 1.1,
        textAlign: 'center',
      }}
    >
      {name}
    </span>
  </div>
);

/** Bars 7-9: the fixture card people screenshot and send to the group. */
export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const headline = punchIn(frame, fps, 2);
  const matchup = punchIn(frame, fps, 10);
  const card = punchIn(frame, fps, 20);
  const note = punchIn(frame, fps, 44);
  const rule = reveal(frame, 14, 16);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'rgba(6,17,25,0.72)'}} />

      {CONFETTI.map(({seed, x, delay, speed, size, tint}) => {
        const t = Math.max(0, frame - delay);
        const y = -120 + t * speed;
        if (y > 2040) return null;
        return (
          <div
            key={seed}
            style={{
              position: 'absolute',
              left: x + Math.sin((t + seed) / 10) * 54,
              top: y,
              width: size,
              height: size * 0.5,
              background: tint,
              opacity: 0.85,
              borderRadius: 3,
              transform: `rotate(${t * (5 + (seed % 5))}deg)`,
            }}
          />
        );
      })}

      <AbsoluteFill
        style={{
          padding: '74px 56px 74px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div style={{alignSelf: 'flex-end'}}>
          <LiveTag progress={punchIn(frame, fps, 0)} label="MAÇ ÖNÜ" />
        </div>

        {/* The card stack centres in whatever is left between tag and note. */}
        <div
          style={{
            flex: 1,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
        <div
          style={{
            opacity: headline,
            transform: `scale(${interpolate(headline, [0, 1], [1.35, 1])})`,
            fontFamily: FONTS.display,
            fontSize: 152,
            color: '#fff',
            letterSpacing: 3,
            textShadow: shadow(1),
            lineHeight: 1.1,
          }}
        >
          HAZIR MISIN?
        </div>

        <div style={{marginTop: 18}}>
          <AccentRule
            progress={rule}
            width={640}
            colors={[COLORS.orange, COLORS.lime, COLORS.ice]}
          />
        </div>

        <div
          style={{
            marginTop: 54,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <TeamBlock
            name={TEAM_A.name}
            shirt={TEAM_A.shirt}
            ink={TEAM_A.ink}
            accent={TEAM_A.accent}
            letter="A"
            progress={matchup}
            from={-220}
          />
          <span
            style={{
              fontFamily: FONTS.display,
              fontSize: 96,
              color: COLORS.orange,
              opacity: matchup,
              lineHeight: 1,
            }}
          >
            VS
          </span>
          <TeamBlock
            name={TEAM_B.name}
            shirt={TEAM_B.shirt}
            ink={TEAM_B.ink}
            accent={TEAM_B.accent}
            letter="B"
            progress={matchup}
            from={220}
          />
        </div>

        <div
          style={{
            opacity: card,
            transform: `translateY(${(1 - card) * 90}px)`,
            marginTop: 56,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '38px 40px 42px',
            borderRadius: 26,
            background: 'rgba(7,14,22,0.9)',
            border: `4px solid ${COLORS.lime}`,
            boxShadow: `${shadow(1)}, 0 0 80px rgba(200,255,46,0.24)`,
          }}
        >
          <span
            style={{
              fontFamily: FONTS.display,
              fontSize: 118,
              color: COLORS.lime,
              letterSpacing: 2,
              lineHeight: 1.3,
            }}
          >
            {MATCH.day}
          </span>
          <span
            style={{
              fontFamily: FONTS.display,
              fontSize: 168,
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
              fontSize: 60,
              letterSpacing: 10,
              color: 'rgba(255,255,255,0.88)',
              marginTop: 8,
              lineHeight: 1,
            }}
          >
            {MATCH.venue}
          </span>
        </div>
        </div>

        <div
          style={{
            opacity: note,
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            paddingTop: 24,
          }}
        >
          <Ball size={80} rotation={frame * 3.2} />
          <span
            style={{
              fontFamily: FONTS.body,
              fontWeight: 700,
              fontSize: 52,
              letterSpacing: 6,
              color: '#fff',
              lineHeight: 1,
            }}
          >
            FORMANI AL, SAHAYA GEL!
          </span>
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{background: '#fff', opacity: impactFlash(frame, 7)}} />
    </AbsoluteFill>
  );
};
