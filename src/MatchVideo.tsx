import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {Starfield} from './components/Starfield';
import {dissolve} from './components/anim';
import {Opening} from './scenes/Opening';
import {Lineup} from './scenes/Lineup';
import {Showdown} from './scenes/Showdown';
import {Fixture} from './scenes/Fixture';
import {TEAM_A, TEAM_B} from './data';
import {DURATION_IN_FRAMES, SCENES} from './timeline';
import {loadFonts} from './fonts';

loadFonts();

/** Wraps a scene so it dissolves over the shared star field instead of cutting. */
const Scene: React.FC<{
  from: number;
  duration: number;
  children: React.ReactNode;
}> = ({from, duration, children}) => (
  <Sequence from={from} durationInFrames={duration}>
    <Fade duration={duration}>{children}</Fade>
  </Sequence>
);

const Fade: React.FC<{duration: number; children: React.ReactNode}> = ({
  duration,
  children,
}) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{opacity: dissolve(frame, duration)}}>{children}</AbsoluteFill>;
};

export const MatchVideo: React.FC = () => {
  const frame = useCurrentFrame();

  // The anthem rings out 1.6s past the last frame, so fade rather than cut it.
  const volume = interpolate(
    frame,
    [0, 6, DURATION_IN_FRAMES - 26, DURATION_IN_FRAMES],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  return (
    <AbsoluteFill style={{backgroundColor: '#01040c'}}>
      <Audio src={staticFile('music.mp3')} volume={volume} />

      <Starfield />

      <Scene {...SCENES.opening}>
        <Opening />
      </Scene>
      <Scene {...SCENES.teamA}>
        <Lineup team={TEAM_A} letter="A" />
      </Scene>
      <Scene {...SCENES.teamB}>
        <Lineup team={TEAM_B} letter="B" />
      </Scene>
      <Scene {...SCENES.showdown}>
        <Showdown />
      </Scene>
      <Scene {...SCENES.fixture}>
        <Fixture />
      </Scene>
    </AbsoluteFill>
  );
};
