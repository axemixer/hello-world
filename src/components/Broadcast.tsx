import React from 'react';
import {interpolate} from 'remotion';
import type {Team} from '../data';
import {MATCH} from '../data';
import {COLORS, FONTS} from '../theme';

const GLASS = 'linear-gradient(100deg, rgba(7,14,22,0.96) 0%, rgba(9,19,29,0.80) 62%, rgba(9,19,29,0.52) 100%)';

/**
 * The lower-third that broadcasts put above a tactical board: colour flash,
 * team badge block, name, and the formation on the right.
 */
export const TeamHeader: React.FC<{team: Team; progress: number; letter: string}> = ({
  team,
  progress,
  letter,
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'stretch',
      height: 156,
      // Wipes open from the left like a broadcast strap.
      clipPath: `inset(0 ${(1 - progress) * 100}% 0 0)`,
      background: GLASS,
      borderLeft: `16px solid ${team.accent}`,
      boxShadow: '0 18px 46px rgba(0,0,0,0.55)',
    }}
  >
    <div
      style={{
        width: 128,
        display: 'grid',
        placeItems: 'center',
        background: team.shirt,
        borderRight: `2px solid rgba(255,255,255,0.12)`,
      }}
    >
      <span style={{fontFamily: FONTS.display, fontSize: 84, color: team.ink, lineHeight: 1}}>
        {letter}
      </span>
    </div>

    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 30px',
        gap: 6,
      }}
    >
      <span
        style={{
          fontFamily: FONTS.body,
          fontWeight: 600,
          fontSize: 28,
          letterSpacing: 11,
          color: team.accent,
          lineHeight: 1,
        }}
      >
        {team.subtitle} · KADRO
      </span>
      <span
        style={{
          fontFamily: FONTS.display,
          fontSize: 74,
          color: '#fff',
          letterSpacing: 1,
          lineHeight: 1,
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
        padding: '0 34px',
        borderLeft: '2px solid rgba(255,255,255,0.12)',
        gap: 6,
      }}
    >
      <span
        style={{
          fontFamily: FONTS.body,
          fontWeight: 600,
          fontSize: 24,
          letterSpacing: 8,
          color: 'rgba(255,255,255,0.55)',
          lineHeight: 1,
        }}
      >
        DİZİLİŞ
      </span>
      <span
        style={{
          fontFamily: FONTS.display,
          fontSize: 56,
          color: COLORS.lime,
          letterSpacing: 2,
          lineHeight: 1,
        }}
      >
        {team.formation}
      </span>
    </div>
  </div>
);

/** The fixture strip along the bottom of every in-match graphic. */
export const Ticker: React.FC<{progress: number}> = ({progress}) => {
  const cells = [MATCH.day, MATCH.time, MATCH.venue, MATCH.format];
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        height: 96,
        clipPath: `inset(0 0 0 ${(1 - progress) * 100}%)`,
        background: GLASS,
        borderRight: `16px solid ${COLORS.lime}`,
        boxShadow: '0 -14px 40px rgba(0,0,0,0.5)',
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
            fontSize: 40,
            letterSpacing: 5,
            color: i === 1 ? COLORS.lime : 'rgba(255,255,255,0.92)',
            borderLeft: i === 0 ? 'none' : '2px solid rgba(255,255,255,0.14)',
            lineHeight: 1,
          }}
        >
          {cell}
        </div>
      ))}
    </div>
  );
};

/** Small top-corner tag, the way a channel marks a pre-match graphic. */
export const LiveTag: React.FC<{progress: number; label?: string}> = ({
  progress,
  label = 'MAÇ ÖNÜ',
}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 14,
      padding: '12px 24px',
      borderRadius: 6,
      background: 'rgba(7,14,22,0.88)',
      border: '2px solid rgba(255,255,255,0.16)',
      opacity: progress,
      transform: `translateY(${(1 - progress) * -24}px)`,
    }}
  >
    <span
      style={{
        width: 16,
        height: 16,
        borderRadius: '50%',
        background: COLORS.orange,
        boxShadow: `0 0 18px ${COLORS.orange}`,
      }}
    />
    <span
      style={{
        fontFamily: FONTS.body,
        fontWeight: 700,
        fontSize: 28,
        letterSpacing: 8,
        color: 'rgba(255,255,255,0.88)',
        lineHeight: 1,
      }}
    >
      {label}
    </span>
  </div>
);

/** Thin animated accent rule used to separate broadcast blocks. */
export const AccentRule: React.FC<{progress: number; colors: string[]; width: number}> = ({
  progress,
  colors,
  width,
}) => (
  <div
    style={{
      width: interpolate(progress, [0, 1], [0, width]),
      height: 6,
      background: `linear-gradient(90deg, ${colors.join(', ')})`,
    }}
  />
);
