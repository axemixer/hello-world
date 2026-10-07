import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Team} from '../data';
import {FormationBoard} from '../components/FormationBoard';
import {CompetitionTag, TeamStrap, Ticker} from '../components/Broadcast';
import {EASE_OUT, punchIn, reveal} from '../components/anim';

/**
 * Bars 1 and 2: one team per bar, as a broadcast tactical board. The six
 * markers land across the first half of the bar, on the harp figure.
 */
export const Lineup: React.FC<{team: Team; letter: string}> = ({team, letter}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const board = interpolate(frame, [0, 18], [0, 1], {
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });

  return (
    <AbsoluteFill>
      {/* A breath of the kit colour from the top corner keeps the two boards
          distinguishable without lighting up the whole navy frame. */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(58% 32% at 50% 0%, ${team.shirt}6e 0%, transparent 70%)`,
          opacity: board,
        }}
      />

      <AbsoluteFill
        style={{padding: '58px 42px 54px', display: 'flex', flexDirection: 'column'}}
      >
        <div style={{display: 'flex', justifyContent: 'center', marginBottom: 24}}>
          <CompetitionTag progress={reveal(frame, 0, 12)} />
        </div>

        <TeamStrap team={team} progress={reveal(frame, 3, 13)} letter={letter} />

        <div style={{flex: 1, display: 'grid', placeItems: 'center'}}>
          <FormationBoard
            team={team}
            boardProgress={board}
            progressFor={(i) => punchIn(frame, fps, 14 + i * 5)}
          />
        </div>

        <Ticker progress={reveal(frame, 10, 14)} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
