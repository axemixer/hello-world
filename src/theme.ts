export const COLORS = {
  turf: '#1d6b3a',
  turfDark: '#0f3d21',
  turfLight: '#2a8b4a',
  night: '#061119',
  line: 'rgba(255,255,255,0.85)',
  lime: '#c8ff2e',
  orange: '#ff4d2d',
  ice: '#2dd4ff',
  sand: '#f5f6f8',
} as const;

/** Font stacks — the display face is loaded in src/fonts.ts. */
export const FONTS = {
  display: '"Anton", "Arial Narrow", Impact, sans-serif',
  body: '"Barlow Condensed", "Arial Narrow", Helvetica, sans-serif',
} as const;

export const shadow = (strength = 1) =>
  `0 ${8 * strength}px ${34 * strength}px rgba(0,0,0,${0.45 * strength})`;
