import { NextResponse } from 'next/server';

export interface GameResult {
  teamA: string;
  teamB: string;
  winner: string;
  scoreA: number;
  scoreB: number;
}

// Normalize for fuzzy name matching
function norm(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
}

// ESPN sometimes uses different names than our bracket
const ALIASES: Record<string, string> = {
  'miami ohio': 'miami oh',
  'miami oh': 'miami oh',
  'prairie view a m': 'prairie view',
  'prairie view a&m': 'prairie view',
  'north carolina state': 'nc state',
  'nc state': 'nc state',
  'north dakota state': 'n dakota state',
  'saint marys': "saint mary's",
  'queens university': 'queens nc',
  'queens nc': 'queens nc',
  'cal baptist': 'cal baptist',
  'california baptist': 'cal baptist',
  'kennesaw state': 'kennesaw state',
  'kennesaw st': 'kennesaw state',
};

function normalizeEspn(name: string): string {
  const n = norm(name);
  return ALIASES[n] ?? n;
}

export async function GET() {
  try {
    // Fetch all NCAA tournament games (March 19 – April 6 2026)
    const url =
      'https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard' +
      '?groups=100&dates=20260319-20260406&limit=300';

    const res = await fetch(url, { next: { revalidate: 30 } });
    if (!res.ok) return NextResponse.json({ results: [] });

    const data = await res.json();
    const results: GameResult[] = [];

    for (const event of data.events ?? []) {
      const comp = event.competitions?.[0];
      if (!comp) continue;

      const completed = event.status?.type?.completed === true;
      if (!completed) continue;

      const comps: any[] = comp.competitors ?? [];
      if (comps.length !== 2) continue;

      const [c1, c2] = comps;
      const name1 = normalizeEspn(c1.team?.shortDisplayName ?? c1.team?.displayName ?? '');
      const name2 = normalizeEspn(c2.team?.shortDisplayName ?? c2.team?.displayName ?? '');
      const score1 = parseInt(c1.score ?? '0', 10);
      const score2 = parseInt(c2.score ?? '0', 10);
      const winner = c1.winner ? name1 : name2;

      if (name1 && name2) {
        results.push({ teamA: name1, teamB: name2, winner, scoreA: score1, scoreB: score2 });
      }
    }

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [] });
  }
}
