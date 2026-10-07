import React from 'react';
import {interpolate} from 'remotion';
import type {Team} from '../data';
import {MATCH} from '../data';
import {COLORS, FONTS, GLASS, silverText} from '../theme';

/** The thin silver rule that tops and tails every panel. */
export const Hairline: React.FC<{progress?: number; width?: number | string}> = ({
  progress = 1,
  width = '100%',
}) => (
  <div
    style={{
      width,
      height: 2,
      transform: `scaleX(${progress})`,
      background: `linear-gradient(90deg, transparent, ${COLORS.silverDim} 18%, ${COLORS.silver} 50%, ${COLORS.silverDim} 82%, transparent)`,
    }}
  />
);

/**
 * The team strap above a line-up board: silver rules, a colour chip for the
 * kit, the name in brushed silver and the shape on the right.
 */
export const TeamStrap: React.FC<{team: Team; progress: number; letter: string}> = ({
  team,
  progress,
  letter,
}) => (
  <div style={{width: '100%'}}>
    <Hairline progress={progress} />
    <div
      style={{
        display: 'flex',
        alignItems: 'stretch',
        height: 150,
        clipPath: `inset(0 ${(1 - progress) * 100}% 0 0)`,
        background: GLASS,
      }}
    >
      <div
        style={{
          width: 120,
          display: 'grid',
          placeItems: 'center',
          background: team.shirt,
          borderRight: `2px solid ${COLORS.silverFaint}`,
        }}
      >
        <span style={{fontFamily: FONTS.display, fontSize: 76, color: team.ink, lineHeight: 1}}>
          {letter}
        </span>
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 28px',
          gap: 8,
        }}
      >
        <span
          style={{
            fontFamily: FONTS.body,
            fontWeight: 600,
            fontSize: 26,
            letterSpacing: 12,
            color: COLORS.blue,
            lineHeight: 1,
          }}
        >
          {team.subtitle} · KADRO
        </span>
        <span
          style={{
            ...silverText,
            fontFamily: FONTS.display,
            fontSize: 70,
            letterSpacing: 2,
            lineHeight: 1.24, // room for the dot on İ and the tail on Ş
          }}
        >
          {team.name}
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          justifyContent: 'center',
          padding: '0 30px',
          borderLeft: `2px solid ${COLORS.silverFaint}`,
          gap: 8,
        }}
      >
        <span
          style={{
            fontFamily: FONTS.body,
            fontWeight: 600,
            fontSize: 22,
            letterSpacing: 9,
            color: COLORS.silverDim,
            lineHeight: 1.3,
          }}
        >
          DİZİLİŞ
        </span>
        <span
          style={{
            ...silverText,
            fontFamily: FONTS.display,
            fontSize: 54,
            letterSpacing: 2,
            lineHeight: 1,
          }}
        >
          {team.formation}
        </span>
      </div>
    </div>
    <Hairline progress={progress} />
  </div>
);

/** Centred fixture strip along the bottom of every graphic. */
export const Ticker: React.FC<{progress: number}> = ({progress}) => {
  const cells = [MATCH.day, MATCH.time, MATCH.venue, MATCH.format];
  return (
    <div style={{width: '100%'}}>
      <Hairline progress={progress} />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          height: 92,
          opacity: progress,
          background: GLASS,
        }}
      >
        {cells.map((cell, i) => (
          <div
            key={cell}
            style={{
              flex: 1,
              textAlign: 'center',
              fontFamily: FONTS.body,
              fontWeight: 700,
              fontSize: 34,
              letterSpacing: 4,
              color: i === 1 ? COLORS.blue : COLORS.silver,
              borderLeft: i === 0 ? 'none' : `2px solid ${COLORS.silverFaint}`,
              lineHeight: 1.3,
            }}
          >
            {cell}
          </div>
        ))}
      </div>
      <Hairline progress={progress} />
    </div>
  );
};

/** Small competition tag that sits above every graphic. */
export const CompetitionTag: React.FC<{progress: number}> = ({progress}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 10,
      opacity: progress,
      transform: `translateY(${(1 - progress) * -18}px)`,
    }}
  >
    <span
      style={{
        fontFamily: FONTS.body,
        fontWeight: 700,
        fontSize: 30,
        letterSpacing: 16,
        color: COLORS.silverDim,
        lineHeight: 1.3,
      }}
    >
      {MATCH.competition}
    </span>
    <Hairline progress={progress} width={420} />
  </div>
);

/** Shared helper for the metal-sheen headline used in the big scenes. */
export const Headline: React.FC<{
  children: React.ReactNode;
  size: number;
  progress: number;
}> = ({children, size, progress}) => (
  <div
    style={{
      ...silverText,
      fontFamily: FONTS.display,
      fontSize: size,
      letterSpacing: 4,
      lineHeight: 1.32,
      textAlign: 'center',
      opacity: progress,
      transform: `scale(${interpolate(progress, [0, 1], [1.18, 1])})`,
      filter: `drop-shadow(0 10px 32px rgba(0,0,0,0.75))`,
    }}
  >
    {children}
  </div>
);
