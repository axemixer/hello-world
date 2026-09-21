import {Easing, interpolate, spring} from 'remotion';

export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);

/** Snappy overshoot used for anything that should land on a beat. */
export const punchIn = (frame: number, fps: number, delay = 0) =>
  spring({frame, fps, delay, config: {damping: 13, mass: 0.7, stiffness: 190}});

/** 0 -> 1 over `length` frames starting at `delay`, with a decelerating ease. */
export const reveal = (frame: number, delay: number, length = 14) =>
  interpolate(frame, [delay, delay + length], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });

/** A short bright flash, for hard cuts that sit on a musical impact. */
export const impactFlash = (frame: number, length = 9) =>
  interpolate(frame, [0, 1, length], [0, 0.55, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
