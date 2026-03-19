import { Team, Region } from './types';

// 2026 NCAA Tournament – real bracket data (sports-reference.com)
// KenPom stats are estimated pre-tournament ratings for 2025-26 season
// ESPN IDs for logo CDN: https://a.espncdn.com/i/teamlogos/ncaa/500/{id}.png
// First Four results (March 17-18, 2026):
//   Howard beat UMBC 86-83        → Midwest 16-seed
//   Miami OH beat SMU 89-79       → Midwest 11-seed
//   Prairie View beat Lehigh 67-55 → South 16-seed
//   Texas beat NC State 68-66     → West 11-seed

type TeamDef = Omit<Team, 'id' | 'region'>;

const TEAMS: Record<Region, TeamDef[]> = {
  // ─── SOUTH (Florida #1) ──────────────────────────────────────────────────
  SOUTH: [
    { seed: 1,  name: 'Florida',        shortName: 'Florida',     conference: 'SEC',       record: '28-5',  espnId: 57,   kenpom: { rank: 3,   adjEM: 27.5, adjO: 121.5, adjOrank: 4,   adjD: 94.0, adjDrank: 8,   tempo: 70.5, sosEM: 13.8 } },
    { seed: 2,  name: 'Houston',         shortName: 'Houston',     conference: 'Big 12',    record: '27-6',  espnId: 248,  kenpom: { rank: 8,   adjEM: 24.2, adjO: 119.2, adjOrank: 14,  adjD: 95.0, adjDrank: 15,  tempo: 65.2, sosEM: 13.5 } },
    { seed: 3,  name: 'Illinois',        shortName: 'Illinois',    conference: 'Big Ten',   record: '26-7',  espnId: 356,  kenpom: { rank: 15,  adjEM: 21.8, adjO: 117.5, adjOrank: 22,  adjD: 95.7, adjDrank: 20,  tempo: 70.2, sosEM: 12.8 } },
    { seed: 4,  name: 'Nebraska',        shortName: 'Nebraska',    conference: 'Big Ten',   record: '24-9',  espnId: 158,  kenpom: { rank: 22,  adjEM: 19.5, adjO: 116.2, adjOrank: 28,  adjD: 96.7, adjDrank: 30,  tempo: 68.4, sosEM: 12.5 } },
    { seed: 5,  name: 'Vanderbilt',      shortName: 'Vanderbilt',  conference: 'SEC',       record: '23-10', espnId: 238,  kenpom: { rank: 32,  adjEM: 17.2, adjO: 115.1, adjOrank: 38,  adjD: 97.9, adjDrank: 45,  tempo: 69.8, sosEM: 12.2 } },
    { seed: 6,  name: 'North Carolina',  shortName: 'UNC',         conference: 'ACC',       record: '22-11', espnId: 153,  kenpom: { rank: 38,  adjEM: 15.8, adjO: 114.5, adjOrank: 44,  adjD: 98.7, adjDrank: 58,  tempo: 71.2, sosEM: 12.0 } },
    { seed: 7,  name: "Saint Mary's",    shortName: "St Mary's",   conference: 'WCC',       record: '25-7',  espnId: 2608, kenpom: { rank: 42,  adjEM: 15.2, adjO: 112.8, adjOrank: 62,  adjD: 97.6, adjDrank: 40,  tempo: 61.5, sosEM: 5.2  } },
    { seed: 8,  name: 'Clemson',         shortName: 'Clemson',     conference: 'ACC',       record: '22-11', espnId: 228,  kenpom: { rank: 58,  adjEM: 12.8, adjO: 113.2, adjOrank: 60,  adjD: 100.4, adjDrank: 85, tempo: 68.2, sosEM: 12.0 } },
    { seed: 9,  name: 'Iowa',            shortName: 'Iowa',        conference: 'Big Ten',   record: '21-12', espnId: 2294, kenpom: { rank: 65,  adjEM: 11.5, adjO: 112.5, adjOrank: 68,  adjD: 101.0, adjDrank: 88, tempo: 69.5, sosEM: 12.2 } },
    { seed: 10, name: 'Texas A&M',       shortName: 'Texas A&M',   conference: 'SEC',       record: '20-13', espnId: 245,  kenpom: { rank: 72,  adjEM: 10.2, adjO: 111.8, adjOrank: 80,  adjD: 101.6, adjDrank: 110, tempo: 67.2, sosEM: 12.0 } },
    { seed: 11, name: 'VCU',             shortName: 'VCU',         conference: 'A-10',      record: '24-9',  espnId: 2670, kenpom: { rank: 80,  adjEM: 8.5,  adjO: 110.5, adjOrank: 98,  adjD: 102.0, adjDrank: 128, tempo: 73.5, sosEM: 5.5  } },
    { seed: 12, name: 'McNeese',         shortName: 'McNeese',     conference: 'Southland', record: '26-7',  espnId: 2377, kenpom: { rank: 105, adjEM: 5.8,  adjO: 108.2, adjOrank: 125, adjD: 102.4, adjDrank: 148, tempo: 65.8, sosEM: -1.2 } },
    { seed: 13, name: 'Troy',            shortName: 'Troy',        conference: 'Sun Belt',  record: '23-12', espnId: 2653, kenpom: { rank: 145, adjEM: 2.2,  adjO: 104.5, adjOrank: 182, adjD: 102.3, adjDrank: 142, tempo: 68.5, sosEM: -3.2 } },
    { seed: 14, name: 'Penn',            shortName: 'Penn',        conference: 'Ivy',       record: '20-9',  espnId: 219,  kenpom: { rank: 168, adjEM: 0.5,  adjO: 102.8, adjOrank: 205, adjD: 102.3, adjDrank: 140, tempo: 64.2, sosEM: -0.5 } },
    { seed: 15, name: 'Idaho',           shortName: 'Idaho',       conference: 'Big Sky',   record: '22-11', espnId: 70,   kenpom: { rank: 205, adjEM: -2.5, adjO: 99.8,  adjOrank: 228, adjD: 102.3, adjDrank: 140, tempo: 68.8, sosEM: -4.5 } },
    { seed: 16, name: 'Prairie View',     shortName: 'Prairie View', conference: 'SWAC',      record: '17-17', espnId: 2504, kenpom: { rank: 238, adjEM: -5.5, adjO: 97.2,  adjOrank: 265, adjD: 102.7, adjDrank: 158, tempo: 71.5, sosEM: -7.2 } },
  ],

  // ─── WEST (Arizona #1) ───────────────────────────────────────────────────
  WEST: [
    { seed: 1,  name: 'Arizona',         shortName: 'Arizona',     conference: 'Big 12',    record: '29-4',  espnId: 12,   kenpom: { rank: 5,   adjEM: 26.2, adjO: 120.8, adjOrank: 8,   adjD: 94.6, adjDrank: 12,  tempo: 70.2, sosEM: 13.5 } },
    { seed: 2,  name: 'Purdue',          shortName: 'Purdue',      conference: 'Big Ten',   record: '27-6',  espnId: 2509, kenpom: { rank: 10,  adjEM: 23.5, adjO: 118.8, adjOrank: 16,  adjD: 95.3, adjDrank: 18,  tempo: 66.2, sosEM: 12.8 } },
    { seed: 3,  name: 'Gonzaga',         shortName: 'Gonzaga',     conference: 'WCC',       record: '28-5',  espnId: 2250, kenpom: { rank: 18,  adjEM: 21.0, adjO: 119.5, adjOrank: 12,  adjD: 98.5, adjDrank: 62,  tempo: 72.5, sosEM: 5.8  } },
    { seed: 4,  name: 'Arkansas',        shortName: 'Arkansas',    conference: 'SEC',       record: '24-9',  espnId: 8,    kenpom: { rank: 24,  adjEM: 19.2, adjO: 116.8, adjOrank: 26,  adjD: 97.6, adjDrank: 42,  tempo: 71.5, sosEM: 12.5 } },
    { seed: 5,  name: 'Wisconsin',       shortName: 'Wisconsin',   conference: 'Big Ten',   record: '25-8',  espnId: 275,  kenpom: { rank: 34,  adjEM: 17.0, adjO: 115.2, adjOrank: 38,  adjD: 98.2, adjDrank: 52,  tempo: 63.5, sosEM: 12.2 } },
    { seed: 6,  name: 'BYU',             shortName: 'BYU',         conference: 'Big 12',    record: '24-9',  espnId: 252,  kenpom: { rank: 40,  adjEM: 15.5, adjO: 114.8, adjOrank: 44,  adjD: 99.3, adjDrank: 70,  tempo: 64.8, sosEM: 12.8 } },
    { seed: 7,  name: 'Miami FL',        shortName: 'Miami FL',    conference: 'ACC',       record: '22-11', espnId: 2390, kenpom: { rank: 48,  adjEM: 14.2, adjO: 113.8, adjOrank: 58,  adjD: 99.6, adjDrank: 75,  tempo: 67.5, sosEM: 11.8 } },
    { seed: 8,  name: 'Villanova',       shortName: 'Villanova',   conference: 'Big East',  record: '21-12', espnId: 222,  kenpom: { rank: 62,  adjEM: 12.5, adjO: 113.0, adjOrank: 64,  adjD: 100.5, adjDrank: 88, tempo: 66.2, sosEM: 11.5 } },
    { seed: 9,  name: 'Utah State',      shortName: 'Utah State',  conference: 'MWC',       record: '22-11', espnId: 328,  kenpom: { rank: 70,  adjEM: 11.0, adjO: 112.2, adjOrank: 72,  adjD: 101.2, adjDrank: 100, tempo: 64.5, sosEM: 4.2  } },
    { seed: 10, name: 'Missouri',        shortName: 'Missouri',    conference: 'SEC',       record: '20-13', espnId: 142,  kenpom: { rank: 78,  adjEM: 9.8,  adjO: 111.2, adjOrank: 88,  adjD: 101.4, adjDrank: 105, tempo: 68.8, sosEM: 12.0 } },
    { seed: 11, name: 'Texas',           shortName: 'Texas',       conference: 'SEC',       record: '19-14', espnId: 251,  kenpom: { rank: 88,  adjEM: 8.2,  adjO: 110.5, adjOrank: 98,  adjD: 102.3, adjDrank: 142, tempo: 70.5, sosEM: 12.2 } },
    { seed: 12, name: 'High Point',      shortName: 'High Point',  conference: 'Big South', record: '27-6',  espnId: 2272, kenpom: { rank: 115, adjEM: 5.2,  adjO: 107.8, adjOrank: 130, adjD: 102.6, adjDrank: 152, tempo: 68.8, sosEM: -1.5 } },
    { seed: 13, name: 'Hawaii',          shortName: 'Hawaii',      conference: 'Big West',  record: '22-11', espnId: 2229, kenpom: { rank: 148, adjEM: 1.8,  adjO: 104.2, adjOrank: 185, adjD: 102.4, adjDrank: 148, tempo: 72.8, sosEM: -2.2 } },
    { seed: 14, name: 'Kennesaw State',  shortName: 'Kennesaw St', conference: 'CUSA',      record: '23-10', espnId: 2320, kenpom: { rank: 172, adjEM: -0.2, adjO: 102.5, adjOrank: 218, adjD: 102.7, adjDrank: 158, tempo: 68.2, sosEM: -3.5 } },
    { seed: 15, name: 'Queens (NC)',     shortName: 'Queens',      conference: 'ASUN',      record: '21-12', espnId: 2511, kenpom: { rank: 208, adjEM: -2.8, adjO: 100.2, adjOrank: 232, adjD: 103.0, adjDrank: 172, tempo: 69.5, sosEM: -5.5 } },
    { seed: 16, name: 'LIU',             shortName: 'LIU',         conference: 'NEC',       record: '20-13', espnId: 2350, kenpom: { rank: 242, adjEM: -5.8, adjO: 97.0,  adjOrank: 262, adjD: 102.8, adjDrank: 162, tempo: 72.2, sosEM: -7.8 } },
  ],

  // ─── EAST (Duke #1) ──────────────────────────────────────────────────────
  EAST: [
    { seed: 1,  name: 'Duke',            shortName: 'Duke',        conference: 'ACC',       record: '30-4',  espnId: 150,  kenpom: { rank: 1,   adjEM: 29.5, adjO: 122.8, adjOrank: 2,   adjD: 93.3, adjDrank: 5,   tempo: 68.5, sosEM: 14.0 } },
    { seed: 2,  name: 'UConn',           shortName: 'UConn',       conference: 'Big East',  record: '27-6',  espnId: 41,   kenpom: { rank: 9,   adjEM: 24.0, adjO: 119.5, adjOrank: 12,  adjD: 95.5, adjDrank: 18,  tempo: 66.8, sosEM: 12.5 } },
    { seed: 3,  name: 'Michigan State',  shortName: 'Mich State',  conference: 'Big Ten',   record: '25-8',  espnId: 127,  kenpom: { rank: 16,  adjEM: 21.5, adjO: 117.8, adjOrank: 22,  adjD: 96.3, adjDrank: 28,  tempo: 68.5, sosEM: 12.8 } },
    { seed: 4,  name: 'Kansas',          shortName: 'Kansas',      conference: 'Big 12',    record: '24-9',  espnId: 2305, kenpom: { rank: 20,  adjEM: 20.2, adjO: 116.5, adjOrank: 30,  adjD: 96.3, adjDrank: 28,  tempo: 69.2, sosEM: 13.5 } },
    { seed: 5,  name: "St. John's",      shortName: "St John's",   conference: 'Big East',  record: '26-7',  espnId: 2599, kenpom: { rank: 30,  adjEM: 17.5, adjO: 115.5, adjOrank: 38,  adjD: 98.0, adjDrank: 50,  tempo: 71.2, sosEM: 12.0 } },
    { seed: 6,  name: 'Louisville',      shortName: 'Louisville',  conference: 'ACC',       record: '23-10', espnId: 97,   kenpom: { rank: 38,  adjEM: 15.8, adjO: 114.5, adjOrank: 44,  adjD: 98.7, adjDrank: 60,  tempo: 70.5, sosEM: 12.0 } },
    { seed: 7,  name: 'UCLA',            shortName: 'UCLA',        conference: 'Big Ten',   record: '22-11', espnId: 26,   kenpom: { rank: 45,  adjEM: 14.8, adjO: 113.8, adjOrank: 58,  adjD: 99.0, adjDrank: 65,  tempo: 67.8, sosEM: 12.5 } },
    { seed: 8,  name: 'Ohio State',      shortName: 'Ohio State',  conference: 'Big Ten',   record: '20-13', espnId: 194,  kenpom: { rank: 60,  adjEM: 13.0, adjO: 113.5, adjOrank: 60,  adjD: 100.5, adjDrank: 88, tempo: 68.2, sosEM: 12.8 } },
    { seed: 9,  name: 'TCU',             shortName: 'TCU',         conference: 'Big 12',    record: '21-12', espnId: 2628, kenpom: { rank: 68,  adjEM: 11.2, adjO: 112.0, adjOrank: 82,  adjD: 100.8, adjDrank: 92, tempo: 70.5, sosEM: 13.0 } },
    { seed: 10, name: 'UCF',             shortName: 'UCF',         conference: 'Big 12',    record: '20-13', espnId: 2116, kenpom: { rank: 82,  adjEM: 9.2,  adjO: 110.8, adjOrank: 95,  adjD: 101.6, adjDrank: 110, tempo: 68.5, sosEM: 12.5 } },
    { seed: 11, name: 'South Florida',   shortName: 'S Florida',   conference: 'AAC',       record: '22-11', espnId: 58,   kenpom: { rank: 90,  adjEM: 8.0,  adjO: 110.2, adjOrank: 100, adjD: 102.2, adjDrank: 135, tempo: 69.8, sosEM: 8.2  } },
    { seed: 12, name: 'Northern Iowa',   shortName: 'N Iowa',      conference: 'MVC',       record: '24-9',  espnId: 2460, kenpom: { rank: 108, adjEM: 6.0,  adjO: 108.5, adjOrank: 122, adjD: 102.5, adjDrank: 148, tempo: 62.8, sosEM: 2.5  } },
    { seed: 13, name: 'Cal Baptist',     shortName: 'Cal Baptist', conference: 'WAC',       record: '23-10', espnId: 2856, kenpom: { rank: 142, adjEM: 2.5,  adjO: 104.8, adjOrank: 182, adjD: 102.3, adjDrank: 140, tempo: 67.5, sosEM: -1.8 } },
    { seed: 14, name: 'N Dakota State',  shortName: 'NDSU',        conference: 'Summit',    record: '22-11', espnId: 2449, kenpom: { rank: 165, adjEM: 0.2,  adjO: 102.5, adjOrank: 218, adjD: 102.3, adjDrank: 140, tempo: 66.2, sosEM: -3.2 } },
    { seed: 15, name: 'Furman',          shortName: 'Furman',      conference: 'SoCon',     record: '22-10', espnId: 231,  kenpom: { rank: 198, adjEM: -2.2, adjO: 100.5, adjOrank: 228, adjD: 102.7, adjDrank: 158, tempo: 67.8, sosEM: -4.8 } },
    { seed: 16, name: 'Siena',           shortName: 'Siena',       conference: 'MAAC',      record: '19-14', espnId: 2561, kenpom: { rank: 232, adjEM: -5.2, adjO: 97.5,  adjOrank: 258, adjD: 102.7, adjDrank: 158, tempo: 70.2, sosEM: -7.0 } },
  ],

  // ─── MIDWEST (Michigan #1) ───────────────────────────────────────────────
  MIDWEST: [
    { seed: 1,  name: 'Michigan',        shortName: 'Michigan',    conference: 'Big Ten',   record: '28-5',  espnId: 130,  kenpom: { rank: 4,   adjEM: 27.2, adjO: 121.2, adjOrank: 6,   adjD: 94.0, adjDrank: 8,   tempo: 69.5, sosEM: 13.5 } },
    { seed: 2,  name: 'Iowa State',      shortName: 'Iowa State',  conference: 'Big 12',    record: '27-6',  espnId: 66,   kenpom: { rank: 7,   adjEM: 24.8, adjO: 120.2, adjOrank: 10,  adjD: 95.4, adjDrank: 18,  tempo: 66.2, sosEM: 13.2 } },
    { seed: 3,  name: 'Virginia',        shortName: 'Virginia',    conference: 'ACC',       record: '25-8',  espnId: 258,  kenpom: { rank: 14,  adjEM: 22.0, adjO: 116.5, adjOrank: 30,  adjD: 94.5, adjDrank: 10,  tempo: 58.5, sosEM: 12.5 } },
    { seed: 4,  name: 'Alabama',         shortName: 'Alabama',     conference: 'SEC',       record: '24-9',  espnId: 333,  kenpom: { rank: 19,  adjEM: 20.8, adjO: 117.8, adjOrank: 22,  adjD: 97.0, adjDrank: 38,  tempo: 72.5, sosEM: 12.5 } },
    { seed: 5,  name: 'Texas Tech',      shortName: 'Texas Tech',  conference: 'Big 12',    record: '23-10', espnId: 2641, kenpom: { rank: 28,  adjEM: 18.2, adjO: 115.8, adjOrank: 36,  adjD: 97.6, adjDrank: 42,  tempo: 65.5, sosEM: 13.0 } },
    { seed: 6,  name: 'Tennessee',       shortName: 'Tennessee',   conference: 'SEC',       record: '23-10', espnId: 2633, kenpom: { rank: 36,  adjEM: 16.2, adjO: 114.5, adjOrank: 44,  adjD: 98.3, adjDrank: 55,  tempo: 63.8, sosEM: 13.2 } },
    { seed: 7,  name: 'Kentucky',        shortName: 'Kentucky',    conference: 'SEC',       record: '22-11', espnId: 96,   kenpom: { rank: 42,  adjEM: 15.0, adjO: 114.2, adjOrank: 48,  adjD: 99.2, adjDrank: 68,  tempo: 70.8, sosEM: 12.8 } },
    { seed: 8,  name: 'Georgia',         shortName: 'Georgia',     conference: 'SEC',       record: '20-13', espnId: 61,   kenpom: { rank: 62,  adjEM: 12.8, adjO: 112.8, adjOrank: 68,  adjD: 100.0, adjDrank: 78, tempo: 68.5, sosEM: 12.2 } },
    { seed: 9,  name: 'Saint Louis',     shortName: 'Saint Louis', conference: 'A-10',      record: '22-11', espnId: 139,  kenpom: { rank: 75,  adjEM: 10.5, adjO: 111.5, adjOrank: 85,  adjD: 101.0, adjDrank: 88, tempo: 68.2, sosEM: 5.8  } },
    { seed: 10, name: 'Santa Clara',     shortName: 'Santa Clara', conference: 'WCC',       record: '23-8',  espnId: 2541, kenpom: { rank: 85,  adjEM: 9.0,  adjO: 110.8, adjOrank: 95,  adjD: 101.8, adjDrank: 118, tempo: 66.5, sosEM: 4.5  } },
    { seed: 11, name: 'Miami OH',         shortName: 'Miami OH',    conference: 'MAC',       record: '21-13', espnId: 193,  kenpom: { rank: 95,  adjEM: 7.5,  adjO: 110.2, adjOrank: 100, adjD: 102.7, adjDrank: 158, tempo: 70.2, sosEM: 11.5 } },
    { seed: 12, name: 'Akron',           shortName: 'Akron',       conference: 'MAC',       record: '25-8',  espnId: 2006, kenpom: { rank: 118, adjEM: 4.8,  adjO: 107.5, adjOrank: 128, adjD: 102.7, adjDrank: 158, tempo: 64.8, sosEM: 1.8  } },
    { seed: 13, name: 'Hofstra',         shortName: 'Hofstra',     conference: 'CAA',       record: '24-9',  espnId: 2275, kenpom: { rank: 152, adjEM: 1.5,  adjO: 103.8, adjOrank: 192, adjD: 102.3, adjDrank: 140, tempo: 68.2, sosEM: -2.5 } },
    { seed: 14, name: 'Wright State',    shortName: 'Wright St',   conference: 'Horizon',   record: '23-10', espnId: 2750, kenpom: { rank: 175, adjEM: -0.5, adjO: 102.0, adjOrank: 222, adjD: 102.5, adjDrank: 148, tempo: 68.8, sosEM: -3.8 } },
    { seed: 15, name: 'Tennessee State', shortName: 'TN State',    conference: 'ASUN',      record: '20-13', espnId: 2635, kenpom: { rank: 212, adjEM: -3.5, adjO: 99.5,  adjOrank: 235, adjD: 103.0, adjDrank: 172, tempo: 72.5, sosEM: -6.8 } },
    { seed: 16, name: 'Howard',          shortName: 'Howard',      conference: 'MEAC',      record: '18-16', espnId: 47,   kenpom: { rank: 248, adjEM: -6.5, adjO: 96.8,  adjOrank: 275, adjD: 103.3, adjDrank: 182, tempo: 73.8, sosEM: -8.5 } },
  ],
};

export function generateTeams(): Team[] {
  const teams: Team[] = [];
  const regions: Region[] = ['EAST', 'WEST', 'SOUTH', 'MIDWEST'];
  for (const region of regions) {
    TEAMS[region].forEach(t => {
      teams.push({ ...t, id: `${region}-${t.seed}`, region });
    });
  }
  return teams;
}

// Standard NCAA bracket matchup order per region
// [1v16, 8v9, 5v12, 4v13, 6v11, 3v14, 7v10, 2v15]
export const SEED_ORDER = [1, 16, 8, 9, 5, 12, 4, 13, 6, 11, 3, 14, 7, 10, 2, 15];

export function getLogoUrl(espnId: number): string {
  return `https://a.espncdn.com/i/teamlogos/ncaa/500/${espnId}.png`;
}
