import { Team, Matchup, BracketState, Region } from './types';
import { generateTeams, SEED_ORDER } from './teams';
import type { GameResult } from '@/app/api/live-results/route';

/**
 * KenPom-based win probability using logistic regression on AdjEM difference.
 * Historically, each ~6.5 AdjEM points ≈ 75/25 win split.
 * Coefficient 0.12 calibrated against actual tournament results.
 */
function getWinProbability(teamA: Team, teamB: Team): number {
  const emDiff = teamA.kenpom.adjEM - teamB.kenpom.adjEM;
  const prob = 1 / (1 + Math.exp(-0.12 * emDiff));
  return Math.min(0.97, Math.max(0.03, prob));
}

export function initializeBracket(): BracketState {
  const teams = generateTeams();
  const teamsMap: Record<string, Team> = {};
  teams.forEach(t => { teamsMap[t.id] = t; });

  const matchups: Record<string, Matchup> = {};
  const regions: Region[] = ['EAST', 'WEST', 'SOUTH', 'MIDWEST'];

  for (const region of regions) {
    const regionTeams = teams.filter(t => t.region === region);
    const seedMap: Record<number, Team> = {};
    regionTeams.forEach(t => { seedMap[t.seed] = t; });

    for (let i = 0; i < 8; i++) {
      const seedA = SEED_ORDER[i * 2];
      const seedB = SEED_ORDER[i * 2 + 1];
      const teamA = seedMap[seedA];
      const teamB = seedMap[seedB];
      const probA = getWinProbability(teamA, teamB);
      const id = `${region}-R1-${i}`;
      matchups[id] = { id, round: 1, regionSlot: i, teamA, teamB, winner: null, probA, probB: 1 - probA };
    }

    for (let round = 2; round <= 4; round++) {
      const count = Math.pow(2, 3 - round);
      for (let i = 0; i < count; i++) {
        const id = `${region}-R${round}-${i}`;
        matchups[id] = { id, round, regionSlot: i, teamA: null, teamB: null, winner: null, probA: 0.5, probB: 0.5 };
      }
    }
  }

  const finalFour: Matchup[] = [
    { id: 'FF-0', round: 5, regionSlot: 0, teamA: null, teamB: null, winner: null, probA: 0.5, probB: 0.5 },
    { id: 'FF-1', round: 5, regionSlot: 1, teamA: null, teamB: null, winner: null, probA: 0.5, probB: 0.5 },
  ];

  const championship: Matchup = {
    id: 'CHAMP', round: 6, regionSlot: 0, teamA: null, teamB: null, winner: null, probA: 0.5, probB: 0.5,
  };

  return { teams: teamsMap, matchups, finalFour, championship, champion: null, currentSimMatchup: null, simulationDone: false, isSimulating: false };
}

function updateProbs(matchup: Matchup): Matchup {
  if (!matchup.teamA || !matchup.teamB) return matchup;
  const probA = getWinProbability(matchup.teamA, matchup.teamB);
  return { ...matchup, probA, probB: 1 - probA };
}

function simulateOne(matchup: Matchup): Team {
  if (!matchup.teamA || !matchup.teamB) throw new Error('Matchup not ready');
  return Math.random() < matchup.probA ? matchup.teamA : matchup.teamB;
}

function cloneMatchups(m: Record<string, Matchup>): Record<string, Matchup> {
  const out: Record<string, Matchup> = {};
  for (const k of Object.keys(m)) out[k] = { ...m[k] };
  return out;
}

export interface SimulationStep {
  matchupId: string;
  matchups: Record<string, Matchup>;
  finalFour: Matchup[];
  championship: Matchup;
  champion: Team | null;
  currentMatchup: Matchup;
}

export function runFullSimulation(state: BracketState): SimulationStep[] {
  const steps: SimulationStep[] = [];
  const matchups = cloneMatchups(state.matchups);
  const ff = state.finalFour.map(m => ({ ...m }));
  const champ = { ...state.championship! };
  const regions: Region[] = ['EAST', 'WEST', 'SOUTH', 'MIDWEST'];

  for (let round = 1; round <= 4; round++) {
    for (const region of regions) {
      const count = Math.pow(2, 4 - round);
      for (let i = 0; i < count; i++) {
        const id = `${region}-R${round}-${i}`;
        const updated = updateProbs(matchups[id]);
        matchups[id] = updated;
        const winner = simulateOne(updated);
        matchups[id] = { ...updated, winner };

        if (round < 4) {
          const nextId = `${region}-R${round + 1}-${Math.floor(i / 2)}`;
          matchups[nextId] = { ...matchups[nextId], [i % 2 === 0 ? 'teamA' : 'teamB']: winner };
        }

        steps.push({
          matchupId: id,
          matchups: cloneMatchups(matchups),
          finalFour: ff.map(m => ({ ...m })),
          championship: { ...champ },
          champion: null,
          currentMatchup: { ...matchups[id] },
        });
      }
    }

    if (round === 4) {
      // FF-0: top half — South (left) vs West (right)
      ff[0].teamA = matchups['SOUTH-R4-0'].winner!;
      ff[0].teamB = matchups['WEST-R4-0'].winner!;
      Object.assign(ff[0], updateProbs(ff[0]));

      // FF-1: bottom half — East (left) vs Midwest (right)
      ff[1].teamA = matchups['EAST-R4-0'].winner!;
      ff[1].teamB = matchups['MIDWEST-R4-0'].winner!;
      Object.assign(ff[1], updateProbs(ff[1]));
    }
  }

  // Final Four
  for (let i = 0; i < 2; i++) {
    const winner = simulateOne(ff[i]);
    ff[i].winner = winner;
    steps.push({
      matchupId: ff[i].id,
      matchups: cloneMatchups(matchups),
      finalFour: ff.map(m => ({ ...m })),
      championship: { ...champ },
      champion: null,
      currentMatchup: { ...ff[i] },
    });
  }

  // Championship
  champ.teamA = ff[0].winner!;
  champ.teamB = ff[1].winner!;
  Object.assign(champ, updateProbs(champ));
  const champion = simulateOne(champ);
  champ.winner = champion;

  steps.push({
    matchupId: 'CHAMP',
    matchups: cloneMatchups(matchups),
    finalFour: ff.map(m => ({ ...m })),
    championship: { ...champ },
    champion,
    currentMatchup: { ...champ },
  });

  return steps;
}

// ─── Live results ────────────────────────────────────────────────────────────

function normName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
}

function namesMatch(a: string, b: string): boolean {
  const na = normName(a);
  const nb = normName(b);
  return na === nb || na.includes(nb) || nb.includes(na);
}

function findResult(teamA: Team, teamB: Team, results: GameResult[]): GameResult | undefined {
  return results.find(r =>
    (namesMatch(teamA.name, r.teamA) && namesMatch(teamB.name, r.teamB)) ||
    (namesMatch(teamA.name, r.teamB) && namesMatch(teamB.name, r.teamA))
  );
}

function realWinner(matchup: Matchup, result: GameResult): Team | null {
  if (!matchup.teamA || !matchup.teamB) return null;
  if (namesMatch(matchup.teamA.name, result.winner)) return matchup.teamA;
  if (namesMatch(matchup.teamB.name, result.winner)) return matchup.teamB;
  return null;
}

/**
 * Applies completed real-world game results to the bracket state.
 * Only fills in matchups that have both teams set but no winner yet.
 * Propagates winners to the next round so later matchups get populated.
 */
export function applyRealResults(state: BracketState, results: GameResult[]): BracketState {
  if (!results.length) return state;

  const matchups = cloneMatchups(state.matchups);
  const ff = state.finalFour.map(m => ({ ...m }));
  const champ = { ...state.championship! };
  const regions: Region[] = ['EAST', 'WEST', 'SOUTH', 'MIDWEST'];

  for (let round = 1; round <= 4; round++) {
    for (const region of regions) {
      const count = Math.pow(2, 4 - round);
      for (let i = 0; i < count; i++) {
        const id = `${region}-R${round}-${i}`;
        const m = matchups[id];
        if (!m.teamA || !m.teamB || m.winner) continue;

        const result = findResult(m.teamA, m.teamB, results);
        if (!result) continue;

        const winner = realWinner(m, result);
        if (!winner) continue;

        matchups[id] = { ...m, winner };

        if (round < 4) {
          const nextId = `${region}-R${round + 1}-${Math.floor(i / 2)}`;
          const slot = i % 2 === 0 ? 'teamA' : 'teamB';
          matchups[nextId] = { ...matchups[nextId], [slot]: winner };
        } else {
          // Elite Eight winner → Final Four
          if (region === 'SOUTH') ff[0] = { ...ff[0], teamA: winner };
          else if (region === 'WEST') ff[0] = { ...ff[0], teamB: winner };
          else if (region === 'EAST') ff[1] = { ...ff[1], teamA: winner };
          else if (region === 'MIDWEST') ff[1] = { ...ff[1], teamB: winner };
        }
      }
    }
  }

  // Update win probabilities for newly populated matchups
  for (const id of Object.keys(matchups)) {
    const m = matchups[id];
    if (m.teamA && m.teamB && !m.winner) matchups[id] = updateProbs(m);
  }

  // Final Four
  for (let i = 0; i < 2; i++) {
    if (!ff[i].teamA || !ff[i].teamB || ff[i].winner) continue;
    const result = findResult(ff[i].teamA!, ff[i].teamB!, results);
    if (!result) continue;
    const winner = realWinner(ff[i], result);
    if (!winner) continue;
    ff[i] = { ...ff[i], winner };
    if (i === 0) champ.teamA = winner;
    else champ.teamB = winner;
  }

  // Championship
  if (champ.teamA && champ.teamB && !champ.winner) {
    const result = findResult(champ.teamA, champ.teamB, results);
    if (result) {
      const winner = realWinner(champ, result);
      if (winner) champ.winner = winner;
    }
  }

  return {
    ...state,
    matchups,
    finalFour: ff,
    championship: champ,
    champion: champ.winner ?? state.champion,
  };
}
