import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Pitch} from './components/Pitch';
import {Intro} from './scenes/Intro';
import {MatchInfo} from './scenes/MatchInfo';
import {Callout} from './scenes/Callout';
import {Lineup} from './scenes/Lineup';
import {Clash} from './scenes/Clash';
import {Outro} from './scenes/Outro';
import {TEAM_A, TEAM_B} from './data';
import {DURATION_IN_FRAMES, SCENES} from './timeline';
import {loadFonts} from './fonts';

loadFonts();

export const MatchVideo: React.FC = () => {
  const frame = useCurrentFrame();

  // The track is 40s and the video is 38s, so fade the tail rather than cut it.
  const volume = interpolate(
    frame,
    [0, 8, DURATION_IN_FRAMES - 34, DURATION_IN_FRAMES],
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
      <Sequence from={SCENES.info.from} durationInFrames={SCENES.info.duration}>
        <MatchInfo />
      </Sequence>
      <Sequence from={SCENES.callout.from} durationInFrames={SCENES.callout.duration}>
        <Callout />
      </Sequence>
      <Sequence from={SCENES.teamA.from} durationInFrames={SCENES.teamA.duration}>
        <Lineup team={TEAM_A} side="left" />
      </Sequence>
      <Sequence from={SCENES.teamB.from} durationInFrames={SCENES.teamB.duration}>
        <Lineup team={TEAM_B} side="right" />
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
