import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Team} from '../data';
import {FormationBoard} from '../components/FormationBoard';
import {LiveTag, TeamHeader, Ticker} from '../components/Broadcast';
import {EASE_OUT, impactFlash, punchIn, reveal} from '../components/anim';

/**
 * Bars 2-3 and 4-5: one team per scene, as a broadcast tactical board.
 * Markers land two per beat so the squad fills in with the music.
 */
export const Lineup: React.FC<{team: Team; letter: string}> = ({team, letter}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const board = interpolate(frame, [0, 14], [0, 1], {
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const header = reveal(frame, 2, 12);
  const ticker = reveal(frame, 8, 12);

  return (
    <AbsoluteFill>
      {/* Team colour wash so the black and white boards read differently. */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(170deg, ${team.shirt}d9 0%, rgba(6,17,25,0.86) 52%, ${team.shirt}73 100%)`,
          opacity: board,
        }}
      />

      <AbsoluteFill
        style={{
          padding: '74px 44px 64px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: 22}}>
          <LiveTag progress={punchIn(frame, fps, 6)} />
        </div>

        <TeamHeader team={team} progress={header} letter={letter} />

        <div style={{flex: 1, display: 'grid', placeItems: 'center'}}>
          <FormationBoard
            team={team}
            boardProgress={board}
            progressFor={(i) => punchIn(frame, fps, 12 + i * 4)}
          />
        </div>

        <Ticker progress={ticker} />
      </AbsoluteFill>

      <AbsoluteFill style={{background: '#fff', opacity: impactFlash(frame, 7)}} />
    </AbsoluteFill>
  );
};
