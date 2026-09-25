import React from 'react';
import {Composition} from 'remotion';
import {MatchVideo} from './MatchVideo';
import {DURATION_IN_FRAMES, FPS, HEIGHT, WIDTH} from './timeline';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="MatchVideo"
    component={MatchVideo}
    durationInFrames={DURATION_IN_FRAMES}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
  />
);
