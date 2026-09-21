import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Pitch} from './components/Pitch';
import {Intro} from './scenes/Intro';
import {Lineup} from './scenes/Lineup';
import {Clash} from './scenes/Clash';
import {Outro} from './scenes/Outro';
import {TEAM_A, TEAM_B} from './data';
import {DURATION_IN_FRAMES, SCENES} from './timeline';
import {loadFonts} from './fonts';

loadFonts();

export const MatchVideo: React.FC = () => {
  const frame = useCurrentFrame();

  // The track runs 1.2s past the last frame, so fade rather than hard-cut it.
  const volume = interpolate(
    frame,
    [0, 5, DURATION_IN_FRAMES - 22, DURATION_IN_FRAMES],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  return (
    <AbsoluteFill style={{backgroundColor: '#061119'}}>
      <Audio src={staticFile('music.mp3')} volume={volume} />

      <Pitch />

      <Sequence from={SCENES.intro.from} durationInFrames={SCENES.intro.duration}>
        <Intro />
      </Sequence>
      <Sequence from={SCENES.teamA.from} durationInFrames={SCENES.teamA.duration}>
        <Lineup team={TEAM_A} letter="A" />
      </Sequence>
      <Sequence from={SCENES.teamB.from} durationInFrames={SCENES.teamB.duration}>
        <Lineup team={TEAM_B} letter="B" />
      </Sequence>
      <Sequence from={SCENES.clash.from} durationInFrames={SCENES.clash.duration}>
        <Clash />
      </Sequence>
      <Sequence from={SCENES.outro.from} durationInFrames={SCENES.outro.duration}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};
