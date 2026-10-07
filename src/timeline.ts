/**
 * Scene boundaries, in frames.
 *
 * The anthem runs at 80 BPM, so one bar is exactly 3s = 90 frames, and every
 * bar opens on a timpani + crash. One bar per scene keeps every cut on an
 * accent: crest, black sheet, white sheet, head-to-head, fixture card.
 */
export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const BAR = 90;

export const SCENES = {
  opening: {from: 0 * BAR, duration: BAR}, // bar 0  crest + competition
  teamA: {from: 1 * BAR, duration: BAR}, // bar 1  black line-up
  teamB: {from: 2 * BAR, duration: BAR}, // bar 2  white line-up
  showdown: {from: 3 * BAR, duration: BAR}, // bar 3  head-to-head
  fixture: {from: 4 * BAR, duration: BAR}, // bar 4  kick-off card
} as const;

export const DURATION_IN_FRAMES = 5 * BAR; // 450 frames = 15s
