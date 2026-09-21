import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Team} from '../data';
import {Jersey} from '../components/Jersey';
import {EASE_OUT, impactFlash, punchIn} from '../components/anim';
import {FONTS, shadow} from '../theme';

/**
 * Bars 8-10 and 11-13: one team per scene. The shirt slides in from the side
 * the names will not use, then the six players land two per beat.
 */
export const Lineup: React.FC<{team: Team; side: 'left' | 'right'}> = ({team, side}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const dir = side === 'left' ? -1 : 1;
  const shirt = punchIn(frame, fps, 2);
  const header = punchIn(frame, fps, 6);
  const wipe = interpolate(frame, [0, 16], [0, 1], {
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });

  return (
    <AbsoluteFill>
      {/* Colour wash keyed to the team, wiping in from their side. */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(${side === 'left' ? 100 : 260}deg, ${team.shirt}e6 0%, ${team.shirt}96 46%, transparent 84%)`,
          transform: `translateX(${(1 - wipe) * dir * 1080}px)`,
        }}
      />
      {/* Scrim: the white kit would otherwise wash out the white type. */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(68% 52% at 50% 52%, rgba(6,17,25,0.78) 0%, rgba(6,17,25,0.45) 62%, rgba(6,17,25,0.12) 100%)',
          opacity: wipe,
        }}
      />

      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 64px',
          gap: 26,
        }}
      >
        <div
          style={{
            opacity: shirt,
            transform: `translateX(${(1 - shirt) * dir * -420}px) rotate(${(1 - shirt) * dir * 18}deg)`,
            marginBottom: 6,
          }}
        >
          <Jersey team={team} size={330} number={String(team.players.length)} />
        </div>

        <div
          style={{
            opacity: header,
            transform: `scale(${interpolate(header, [0, 1], [1.35, 1])})`,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontFamily: FONTS.body,
              fontWeight: 700,
              fontSize: 44,
              lineHeight: 1,
              letterSpacing: 18,
              color: team.accent,
              marginBottom: 14,
            }}
          >
            {team.subtitle}
          </div>
          <div
            style={{
              fontFamily: FONTS.display,
              fontSize: 132,
              lineHeight: 1,
              color: '#fff',
              letterSpacing: 3,
              textShadow: `0 6px 26px rgba(0,0,0,0.9), ${shadow(1)}`,
            }}
          >
            {team.name}
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 20,
            width: '100%',
            marginTop: 16,
          }}
        >
          {team.players.map((player, i) => {
            const p = punchIn(frame, fps, 22 + i * 9);
            return (
              <div
                key={player}
                style={{
                  opacity: p,
                  transform: `translateY(${(1 - p) * 90}px) scale(${interpolate(p, [0, 1], [0.8, 1])})`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20,
                  padding: '20px 26px',
                  borderRadius: 24,
                  background: 'rgba(6,17,25,0.74)',
                  border: `3px solid ${team.accent}66`,
                  boxShadow: shadow(0.6),
                }}
              >
                <span
                  style={{
                    fontFamily: FONTS.display,
                    fontSize: 46,
                    color: team.accent,
                    minWidth: 52,
                  }}
                >
                  {i + 1}
                </span>
                <span
                  style={{
                    fontFamily: FONTS.body,
                    fontWeight: 700,
                    fontSize: player.length > 6 ? 54 : 64,
                    letterSpacing: 2,
                    color: '#fff',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {player}
                </span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{background: '#fff', opacity: impactFlash(frame, 8)}} />
    </AbsoluteFill>
  );
};
