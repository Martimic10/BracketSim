import { Team, Matchup, BracketState, Region } from './types';
import { SimulationStep } from './simulation';

// ── helpers ──────────────────────────────────────────────────────────────────

function cloneMatchups(m: Record<string, Matchup>): Record<string, Matchup> {
  const out: Record<string, Matchup> = {};
  for (const k of Object.keys(m)) out[k] = { ...m[k] };
  return out;
}

/**
 * Ask GPT-4o for calibrated win probabilities, then randomly sample winners.
 * This means Duke (or any favorite) can still lose — every run is different.
 * Falls back to KenPom-based sampling on error.
 */
async function fetchAIPicks(matchups: Matchup[], round: string): Promise<Team[]> {
  const body = {
    round,
    matchups: matchups.map(m => ({
      teamA: { seed: m.teamA!.seed, name: m.teamA!.name, adjEM: m.teamA!.kenpom.adjEM, adjO: m.teamA!.kenpom.adjO, adjD: m.teamA!.kenpom.adjD },
      teamB: { seed: m.teamB!.seed, name: m.teamB!.name, adjEM: m.teamB!.kenpom.adjEM, adjO: m.teamB!.kenpom.adjO, adjD: m.teamB!.kenpom.adjD },
    })),
  };

  try {
    const res = await fetch('/api/ai-picks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`API ${res.status}`);
    const { probabilities } = (await res.json()) as { probabilities: number[] };

    // Randomly sample each winner from the AI's probability — ensures variability
    return probabilities.map((prob, i) =>
      Math.random() < prob ? matchups[i].teamA! : matchups[i].teamB!
    );
  } catch {
    // Fallback: KenPom-based logistic sampling (same as the random sim)
    return matchups.map(m => {
      const emDiff = m.teamA!.kenpom.adjEM - m.teamB!.kenpom.adjEM;
      const prob = 1 / (1 + Math.exp(-0.12 * emDiff));
      return Math.random() < prob ? m.teamA! : m.teamB!;
    });
  }
}

// ── main export ───────────────────────────────────────────────────────────────

/**
 * Async version of runFullSimulation that uses GPT-4o to pick winners.
 * Makes one API call per round (6 total) then returns all steps for animation.
 */
export async function runAISimulation(state: BracketState): Promise<SimulationStep[]> {
  const steps: SimulationStep[] = [];
  const matchups = cloneMatchups(state.matchups);
  const ff = state.finalFour.map(m => ({ ...m }));
  const champ = { ...state.championship! };
  const regions: Region[] = ['EAST', 'WEST', 'SOUTH', 'MIDWEST'];
  const roundLabels: Record<number, string> = { 1: 'R1', 2: 'R2', 3: 'R3', 4: 'R4' };

  // ── Rounds 1–4 ──────────────────────────────────────────────────────────────
  for (let round = 1; round <= 4; round++) {
    const count = Math.pow(2, 4 - round);

    // Collect all matchups for this round across all regions
    const roundMatchups: Matchup[] = [];
    for (const region of regions) {
      for (let i = 0; i < count; i++) {
        roundMatchups.push(matchups[`${region}-R${round}-${i}`]);
      }
    }

    const winners = await fetchAIPicks(roundMatchups, roundLabels[round]);

    // Apply winners and push a step per game
    let wi = 0;
    for (const region of regions) {
      for (let i = 0; i < count; i++) {
        const id = `${region}-R${round}-${i}`;
        const winner = winners[wi++];
        matchups[id] = { ...matchups[id], winner };

        if (round < 4) {
          const nextId = `${region}-R${round + 1}-${Math.floor(i / 2)}`;
          matchups[nextId] = {
            ...matchups[nextId],
            [i % 2 === 0 ? 'teamA' : 'teamB']: winner,
          };
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
  }

  // ── Final Four ───────────────────────────────────────────────────────────────
  ff[0] = { ...ff[0], teamA: matchups['SOUTH-R4-0'].winner!, teamB: matchups['WEST-R4-0'].winner! };
  ff[1] = { ...ff[1], teamA: matchups['EAST-R4-0'].winner!, teamB: matchups['MIDWEST-R4-0'].winner! };

  const ffWinners = await fetchAIPicks(ff, 'FF');
  for (let i = 0; i < 2; i++) {
    ff[i] = { ...ff[i], winner: ffWinners[i] };
    steps.push({
      matchupId: ff[i].id,
      matchups: cloneMatchups(matchups),
      finalFour: ff.map(m => ({ ...m })),
      championship: { ...champ },
      champion: null,
      currentMatchup: { ...ff[i] },
    });
  }

  // ── Championship ─────────────────────────────────────────────────────────────
  const champMatchup = { ...champ, teamA: ff[0].winner!, teamB: ff[1].winner! };
  const [champWinner] = await fetchAIPicks([champMatchup], 'CHAMP');
  champ.teamA = champMatchup.teamA;
  champ.teamB = champMatchup.teamB;
  champ.winner = champWinner;

  steps.push({
    matchupId: 'CHAMP',
    matchups: cloneMatchups(matchups),
    finalFour: ff.map(m => ({ ...m })),
    championship: { ...champ },
    champion: champWinner,
    currentMatchup: { ...champ },
  });

  return steps;
}
