/**
 * Scene boundaries, in frames.
 *
 * The soundtrack runs at 120 BPM, so one musical bar is exactly 2s = 60 frames.
 * Every cut below sits on a bar line, and the track's accents (build at bar 6,
 * impacts at bars 8 / 14 / 16) line up with the matching scene starts.
 */
export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const BAR = 60;

export const SCENES = {
  intro: {from: 0 * BAR, duration: 2 * BAR}, // bars 0-1   atmosphere
  info: {from: 2 * BAR, duration: 4 * BAR}, // bars 2-5   when / where
  callout: {from: 6 * BAR, duration: 2 * BAR}, // bars 6-7   build-up
  teamA: {from: 8 * BAR, duration: 3 * BAR}, // bars 8-10  black line-up
  teamB: {from: 11 * BAR, duration: 3 * BAR}, // bars 11-13 white line-up
  clash: {from: 14 * BAR, duration: 2 * BAR}, // bars 14-15 the face-off
  outro: {from: 16 * BAR, duration: 3 * BAR}, // bars 16-18 call to action
} as const;

export const DURATION_IN_FRAMES = 19 * BAR; // 38s

/** Crossfade length used between consecutive scenes. */
export const CUT = 12;
