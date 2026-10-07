import React from 'react';
import type {Player, Team} from '../data';
import {POSITION_LABEL} from '../data';
import {COLORS, FONTS} from '../theme';

const BOARD_W = 940;
const BOARD_H = 1400;

/** How far the board is laid back. Each marker counter-rotates by the same
 *  angle so it stands upright, the way broadcast tactical boards do it.
 *  Kept shallow, with a long perspective, so the near touchline does not
 *  balloon out of frame. */
const TILT = 38;

const PitchSurface: React.FC<{team: Team}> = ({team}) => {
  const id = React.useId();
  return (
    <svg
      width={BOARD_W}
      height={BOARD_H}
      viewBox={`0 0 ${BOARD_W} ${BOARD_H}`}
      style={{position: 'absolute', inset: 0}}
    >
      <defs>
        {/* A night-match pitch: cool, deep green with the floodlight falling
            on the far half. */}
        <linearGradient id={`${id}-turf`} x1="0" y1="0" x2="0.18" y2="1">
          <stop offset="0%" stopColor="#1a7340" />
          <stop offset="48%" stopColor={COLORS.turfLit} />
          <stop offset="100%" stopColor="#0a3a20" />
        </linearGradient>
        <radialGradient id={`${id}-flood`} cx="50%" cy="8%" r="62%">
          <stop offset="0%" stopColor="rgba(190,230,255,0.26)" />
          <stop offset="100%" stopColor="rgba(190,230,255,0)" />
        </radialGradient>
        <linearGradient id={`${id}-tint`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={team.accent} stopOpacity="0.2" />
          <stop offset="100%" stopColor={team.accent} stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width={BOARD_W} height={BOARD_H} fill={`url(#${id}-turf)`} />

      {Array.from({length: 12}, (_, i) => (
        <rect
          key={i}
          x="0"
          y={(i * BOARD_H) / 12}
          width={BOARD_W}
          height={BOARD_H / 12}
          fill="#ffffff"
          opacity={i % 2 === 0 ? 0.05 : 0.014}
        />
      ))}

      <rect width={BOARD_W} height={BOARD_H} fill={`url(#${id}-flood)`} />
      {/* Attacking half carries the team colour, so the board reads
          bottom-to-top as "this is the way they play". */}
      <rect width={BOARD_W} height={BOARD_H * 0.5} fill={`url(#${id}-tint)`} />

      <g fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth={5}>
        <rect x="26" y="26" width={BOARD_W - 52} height={BOARD_H - 52} />
        <line x1="26" y1={BOARD_H / 2} x2={BOARD_W - 26} y2={BOARD_H / 2} />
        <circle cx={BOARD_W / 2} cy={BOARD_H / 2} r="150" />
        <circle cx={BOARD_W / 2} cy={BOARD_H / 2} r="9" fill="rgba(255,255,255,0.8)" />
        {/* Own penalty area (bottom) and the one they attack (top). */}
        <rect x="240" y={BOARD_H - 250} width="460" height="224" />
        <rect x="350" y={BOARD_H - 112} width="240" height="86" />
        <rect x="240" y="26" width="460" height="224" />
        <rect x="350" y="26" width="240" height="86" />
        <path d="M26 86 A60 60 0 0 0 86 26" />
        <path d={`M${BOARD_W - 26} 86 A60 60 0 0 1 ${BOARD_W - 86} 26`} />
        <path d={`M26 ${BOARD_H - 86} A60 60 0 0 1 86 ${BOARD_H - 26}`} />
        <path
          d={`M${BOARD_W - 26} ${BOARD_H - 86} A60 60 0 0 0 ${BOARD_W - 86} ${BOARD_H - 26}`}
        />
      </g>

      {/* Silver trim around the board, the way the graphic is framed on air. */}
      <rect
        x="3"
        y="3"
        width={BOARD_W - 6}
        height={BOARD_H - 6}
        fill="none"
        stroke={COLORS.silverDim}
        strokeWidth={6}
        opacity={0.75}
      />
    </svg>
  );
};

const Marker: React.FC<{team: Team; player: Player; p: number}> = ({team, player, p}) => (
  <>
    {/* Contact spot, left flat on the turf. */}
    <div
      style={{
        position: 'absolute',
        left: player.x * BOARD_W,
        top: player.y * BOARD_H,
        width: 170,
        height: 170,
        marginLeft: -85,
        marginTop: -85,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(170,215,255,0.5) 0%, rgba(120,180,255,0.16) 46%, transparent 70%)`,
        opacity: p,
      }}
    />

    {/* Number chip + name plate, standing upright out of the board. */}
    <div
      style={{
        position: 'absolute',
        left: player.x * BOARD_W,
        top: player.y * BOARD_H,
        transformOrigin: 'center bottom',
        transform: `translate(-50%, -100%) rotateX(${-TILT}deg) scale(${0.8 + 0.2 * p})`,
        transformStyle: 'preserve-3d',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        opacity: p,
      }}
    >
      <div
        style={{
          width: 86,
          height: 86,
          borderRadius: 10,
          background: `linear-gradient(165deg, ${COLORS.navyMid}, ${COLORS.navyDeep})`,
          border: `3px solid ${COLORS.silverDim}`,
          boxShadow: `0 14px 30px rgba(0,0,0,0.65), 0 0 22px ${COLORS.blueGlow}`,
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <span
          style={{
            fontFamily: FONTS.display,
            fontSize: 50,
            color: COLORS.silver,
            lineHeight: 1,
          }}
        >
          {player.number}
        </span>
      </div>

      <div
        style={{
          marginTop: -8,
          padding: '10px 22px 11px',
          background: `linear-gradient(170deg, rgba(10,26,66,0.97), rgba(3,9,26,0.95))`,
          borderTop: `2px solid ${COLORS.silverDim}`,
          borderBottom: `4px solid ${team.accent}`,
          boxShadow: '0 12px 28px rgba(0,0,0,0.6)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
          whiteSpace: 'nowrap',
        }}
      >
        <span
          style={{
            fontFamily: FONTS.body,
            fontWeight: 700,
            fontSize: player.name.length > 7 ? 42 : 50,
            letterSpacing: 3,
            color: COLORS.silver,
            lineHeight: 1,
          }}
        >
          {player.name}
        </span>
        <span
          style={{
            fontFamily: FONTS.body,
            fontWeight: 600,
            fontSize: 21,
            letterSpacing: 6,
            color: COLORS.blue,
            lineHeight: 1,
          }}
        >
          {POSITION_LABEL[player.position]}
        </span>
      </div>
    </div>
  </>
);

/**
 * The tactical board: a laid-back pitch with each player pinned to the spot
 * they actually play. `progressFor` staggers the markers in by squad number.
 */
export const FormationBoard: React.FC<{
  team: Team;
  progressFor: (index: number) => number;
  boardProgress: number;
}> = ({team, progressFor, boardProgress}) => (
  <div
    style={{
      perspective: 2400,
      perspectiveOrigin: '50% 50%',
      width: '100%',
      height: 1200,
      display: 'grid',
      placeItems: 'center',
    }}
  >
    <div
      style={{
        position: 'relative',
        width: BOARD_W,
        height: BOARD_H,
        transformStyle: 'preserve-3d',
        // The tilt magnifies the near touchline, so the projection hangs lower
        // than the element's box; lift it back into the middle of the frame.
        transform: `translateY(-235px) rotateX(${TILT}deg) scale(${0.94 + 0.06 * boardProgress})`,
        opacity: boardProgress,
        filter: 'drop-shadow(0 40px 70px rgba(0,0,0,0.75))',
      }}
    >
      <PitchSurface team={team} />
      {team.players.map((player, i) => (
        <Marker key={player.name} team={team} player={player} p={progressFor(i)} />
      ))}
    </div>
  </div>
);
