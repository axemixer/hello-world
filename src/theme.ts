/**
 * European-cup-night palette: midnight navy, polished silver and a cold
 * electric blue, with gold reserved for the crest.
 */
export const COLORS = {
  void: '#01040c',
  navyDeep: '#03091c',
  navy: '#07143a',
  navyMid: '#0d2561',
  navyLit: '#1b4594',
  blue: '#4aa8ff',
  blueGlow: 'rgba(74,168,255,0.55)',
  silver: '#eef3fd',
  silverDim: '#9fb2d4',
  silverFaint: 'rgba(205,219,245,0.42)',
  gold: '#ffd36e',
  turf: '#0f4a2a',
  turfLit: '#17663a',
} as const;

/** A metallic sweep used for the big display type and the crest rim. */
export const SILVER_SHEEN =
  'linear-gradient(176deg, #ffffff 0%, #dde7fb 26%, #9cb0d6 48%, #ffffff 62%, #c3d2ee 82%, #8ea4cc 100%)';

export const silverText = {
  backgroundImage: SILVER_SHEEN,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
} as const;

/** Frosted navy used by every strap and panel. */
export const GLASS =
  'linear-gradient(170deg, rgba(10,26,66,0.94) 0%, rgba(5,14,38,0.88) 55%, rgba(3,9,26,0.92) 100%)';

export const FONTS = {
  display: '"Anton", "Arial Narrow", Impact, sans-serif',
  body: '"Barlow Condensed", "Arial Narrow", Helvetica, sans-serif',
} as const;

export const shadow = (strength = 1) =>
  `0 ${8 * strength}px ${34 * strength}px rgba(0,0,0,${0.55 * strength})`;

/** Thin double hairline that tops and tails broadcast panels. */
export const hairline = (color = COLORS.silverFaint) => ({
  borderTop: `1px solid ${color}`,
  boxShadow: `inset 0 3px 0 -2px ${color}`,
});
