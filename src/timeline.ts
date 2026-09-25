/**
 * Scene boundaries, in frames.
 *
 * The soundtrack runs at 160 BPM, so one musical bar is exactly 1.5s = 45
 * frames. Every cut below sits on a bar line, and the track's accents (riser
 * on bar 1, impacts on bars 2 / 4 / 6 / 7) land on the matching scene start.
 */
export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const BAR = 45;

export const SCENES = {
  intro: {from: 0 * BAR, duration: 2 * BAR}, // bars 0-1  opening sting
  teamA: {from: 2 * BAR, duration: 2 * BAR}, // bars 2-3  black board
  teamB: {from: 4 * BAR, duration: 2 * BAR}, // bars 4-5  white board
  clash: {from: 6 * BAR, duration: 1 * BAR}, // bar  6    the face-off bar
  outro: {from: 7 * BAR, duration: 3 * BAR}, // bars 7-9  fixture card
} as const;

export const DURATION_IN_FRAMES = 10 * BAR; // 450 frames = 15s
