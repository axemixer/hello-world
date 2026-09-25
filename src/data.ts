/** Halı saha mevkileri. Kaleci oynanmıyor, kale önü boş kalıyor. */
export type Position = 'DEF' | 'ORT' | 'FOR';

export type Player = {
  name: string;
  number: number;
  position: Position;
  /**
   * Spot on the team's tactical board, normalised to the pitch rectangle:
   * x 0 = left touchline, 1 = right touchline;
   * y 0 = the goal they attack, 1 = their own goal.
   */
  x: number;
  y: number;
};

export type Team = {
  name: string;
  subtitle: string;
  formation: string;
  shirt: string;
  shirtShade: string;
  ink: string;
  accent: string;
  players: Player[];
};

export const MATCH = {
  day: 'PERŞEMBE',
  time: '20:00',
  venue: 'BALTALİMANI',
  venueNote: 'HALI SAHA',
  format: '6 v 6',
} as const;

export const POSITION_LABEL: Record<Position, string> = {
  DEF: 'DEFANS',
  ORT: 'ORTA SAHA',
  FOR: 'FORVET',
};

/**
 * 2-2-2: nobody keeps goal, so the six outfield players split evenly across
 * the thirds and the area in front of the goal is deliberately left empty.
 */
const SHAPE: Pick<Player, 'position' | 'x' | 'y'>[] = [
  {position: 'DEF', x: 0.27, y: 0.79},
  {position: 'DEF', x: 0.73, y: 0.79},
  {position: 'ORT', x: 0.27, y: 0.52},
  {position: 'ORT', x: 0.73, y: 0.52},
  {position: 'FOR', x: 0.32, y: 0.25},
  {position: 'FOR', x: 0.68, y: 0.25},
];

const lineUp = (names: string[]): Player[] =>
  names.map((name, i) => ({name, number: i + 1, ...SHAPE[i]}));

export const TEAM_A: Team = {
  name: 'SİYAH TAKIM',
  subtitle: 'TAKIM A',
  formation: '2-2-2',
  shirt: '#15161a',
  shirtShade: '#0a0b0e',
  ink: '#ffffff',
  accent: '#ff4d2d',
  players: lineUp(['MERT', 'OĞUZ', 'MURAT', 'PASSUCCI', 'KAMİL', 'YUSUF']),
};

export const TEAM_B: Team = {
  name: 'BEYAZ TAKIM',
  subtitle: 'TAKIM B',
  formation: '2-2-2',
  shirt: '#f5f6f8',
  shirtShade: '#cfd3da',
  ink: '#15161a',
  accent: '#2dd4ff',
  players: lineUp(['ORKUN', 'AYKUT', 'ÖZKAN', 'MUSTAFA', 'ERSAN', 'TUNAHAN']),
};
