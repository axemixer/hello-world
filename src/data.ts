export type Team = {
  name: string;
  subtitle: string;
  shirt: string;
  shirtShade: string;
  shorts: string;
  ink: string;
  accent: string;
  players: string[];
};

export const MATCH = {
  day: 'PERŞEMBE',
  time: '20:00',
  venue: 'BALTALİMANI',
  venueNote: 'HALI SAHA',
} as const;

export const TEAM_A: Team = {
  name: 'SİYAH TAKIM',
  subtitle: 'TAKIM A',
  shirt: '#15161a',
  shirtShade: '#0a0b0e',
  shorts: '#0a0b0e',
  ink: '#ffffff',
  accent: '#ff4d2d',
  players: ['MERT', 'OĞUZ', 'MURAT', 'PASSUCCI', 'KAMİL', 'YUSUF'],
};

export const TEAM_B: Team = {
  name: 'BEYAZ TAKIM',
  subtitle: 'TAKIM B',
  shirt: '#f5f6f8',
  shirtShade: '#cfd3da',
  shorts: '#e4e7ec',
  ink: '#15161a',
  accent: '#2dd4ff',
  players: ['ORKUN', 'AYKUT', 'ÖZKAN', 'MISTIK', 'ERSAN', 'TUNA'],
};
