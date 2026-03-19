export type Region = 'EAST' | 'WEST' | 'SOUTH' | 'MIDWEST';

export interface KenPom {
  rank: number;
  adjEM: number;
  adjO: number;
  adjOrank: number;
  adjD: number;
  adjDrank: number;
  tempo: number;
  sosEM: number;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  seed: number;
  region: Region;
  conference: string;
  record: string;
  espnId: number;
  kenpom: KenPom;
}

export interface Matchup {
  id: string;
  round: number;
  regionSlot: number;
  teamA: Team | null;
  teamB: Team | null;
  winner: Team | null;
  probA: number;
  probB: number;
}

export interface BracketState {
  teams: Record<string, Team>;
  matchups: Record<string, Matchup>;
  finalFour: Matchup[];
  championship: Matchup | null;
  champion: Team | null;
  currentSimMatchup: Matchup | null;
  simulationDone: boolean;
  isSimulating: boolean;
}
