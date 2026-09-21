/** Halı saha mevkileri: kaleci, defans, orta saha, forvet. */
export type Position = 'KL' | 'DEF' | 'ORT' | 'FOR';

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
  KL: 'KALECİ',
  DEF: 'DEFANS',
  ORT: 'ORTA SAHA',
  FOR: 'FORVET',
};

/** 1-2-2-1: one keeper, two at the back, two in midfield, one up top. */
const SHAPE: Pick<Player, 'position' | 'x' | 'y'>[] = [
  {position: 'KL', x: 0.5, y: 0.9},
  {position: 'DEF', x: 0.25, y: 0.69},
  {position: 'DEF', x: 0.75, y: 0.69},
  {position: 'ORT', x: 0.25, y: 0.45},
  {position: 'ORT', x: 0.75, y: 0.45},
  {position: 'FOR', x: 0.5, y: 0.2},
];

const lineUp = (names: string[]): Player[] =>
  names.map((name, i) => ({name, number: i + 1, ...SHAPE[i]}));

export const TEAM_A: Team = {
  name: 'SİYAH TAKIM',
  subtitle: 'TAKIM A',
  formation: '1-2-2-1',
  shirt: '#15161a',
  shirtShade: '#0a0b0e',
  ink: '#ffffff',
  accent: '#ff4d2d',
  players: lineUp(['MERT', 'OĞUZ', 'MURAT', 'PASSUCCI', 'KAMİL', 'YUSUF']),
};

export const TEAM_B: Team = {
  name: 'BEYAZ TAKIM',
  subtitle: 'TAKIM B',
  formation: '1-2-2-1',
  shirt: '#f5f6f8',
  shirtShade: '#cfd3da',
  ink: '#15161a',
  accent: '#2dd4ff',
  players: lineUp(['ORKUN', 'AYKUT', 'ÖZKAN', 'MUSTAFA', 'ERSAN', 'TUNAHAN']),
};
