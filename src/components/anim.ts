import {Easing, interpolate, spring} from 'remotion';

export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);

/** Overshoot used for anything that should land on a beat. Softer than a
 *  sports sting — this cut wants weight, not snap. */
export const punchIn = (frame: number, fps: number, delay = 0) =>
  spring({frame, fps, delay, config: {damping: 16, mass: 0.9, stiffness: 150}});

/** 0 -> 1 over `length` frames starting at `delay`, with a decelerating ease. */
export const reveal = (frame: number, delay: number, length = 14) =>
  interpolate(frame, [delay, delay + length], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });

/**
 * Scene opacity for a cross-dissolve. The star field sits behind every scene
 * and never fades, so ramping the contents in and out reads as a dissolve
 * rather than a cut — which is what an anthem wants.
 */
export const dissolve = (frame: number, duration: number, length = 9) =>
  interpolate(
    frame,
    [0, length, duration - length, duration],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.linear},
  );
