import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface MatchupInput {
  teamA: { seed: number; name: string; adjEM: number; adjO: number; adjD: number };
  teamB: { seed: number; name: string; adjEM: number; adjO: number; adjD: number };
}

export async function POST(req: NextRequest) {
  const { matchups, round } = await req.json() as { matchups: MatchupInput[]; round: string };

  const roundLabel: Record<string, string> = {
    R1: 'First Round (Round of 64)',
    R2: 'Second Round (Round of 32)',
    R3: 'Sweet Sixteen',
    R4: 'Elite Eight',
    FF: 'Final Four',
    CHAMP: 'National Championship',
  };

  const gameList = matchups
    .map((m, i) =>
      `${i + 1}. #${m.teamA.seed} ${m.teamA.name} (AdjEM ${m.teamA.adjEM.toFixed(1)}, AdjO ${m.teamA.adjO.toFixed(1)}, AdjD ${m.teamA.adjD.toFixed(1)}) ` +
      `vs #${m.teamB.seed} ${m.teamB.name} (AdjEM ${m.teamB.adjEM.toFixed(1)}, AdjO ${m.teamB.adjO.toFixed(1)}, AdjD ${m.teamB.adjD.toFixed(1)})`
    )
    .join('\n');

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are a 2026 NCAA March Madness analyst. Your job is to assign CALIBRATED win probabilities — not just pick the statistically better team every time.

March Madness is famous for upsets. Use these historical upset rates as a guide:
- 9-seeds beat 8-seeds ~49% of the time (nearly a coin flip)
- 10-seeds beat 7-seeds ~39% of the time
- 11-seeds beat 6-seeds ~37% of the time
- 12-seeds beat 5-seeds ~35% of the time
- 13-seeds beat 4-seeds ~21% of the time
- 14-seeds beat 3-seeds ~15% of the time
- 15-seeds beat 2-seeds ~6% of the time
- 16-seeds beat 1-seeds ~1% of the time

Probability guidelines:
- AdjEM difference < 3: give the better team 52–58%
- AdjEM difference 3–7: give the better team 58–68%
- AdjEM difference 7–12: give the better team 68–78%
- AdjEM difference > 12: give the better team 78–88%
- Never assign more than 92% to any team — tournament basketball has high variance
- Use a team's style, conference, and coaching experience, not just raw numbers
- AdjO = offensive efficiency (higher is better), AdjD = defensive efficiency (LOWER is better)

These probabilities will be used for random sampling, so calibration matters more than picking winners.

Respond ONLY with valid JSON: {"probabilities": [p1, p2, ...]}
Each value is teamA's win probability (between 0.05 and 0.92). Must match the number of games exactly.`,
      },
      {
        role: 'user',
        content: `Round: ${roundLabel[round] ?? round}\n\nGames:\n${gameList}`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.8,
  });

  const content = response.choices[0].message.content ?? '{}';
  const parsed = JSON.parse(content) as { probabilities: number[] };

  if (!Array.isArray(parsed.probabilities) || parsed.probabilities.length !== matchups.length) {
    return NextResponse.json({ error: 'Invalid response from AI' }, { status: 500 });
  }

  // Clamp to valid range
  const probabilities = parsed.probabilities.map(p => Math.min(0.92, Math.max(0.08, p)));

  return NextResponse.json({ probabilities });
}
