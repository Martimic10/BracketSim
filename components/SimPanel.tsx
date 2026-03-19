'use client';

import { useState } from 'react';
import { Matchup, Team } from '@/lib/types';
import { getLogoUrl } from '@/lib/teams';

interface SimPanelProps {
  currentMatchup: Matchup | null;
  champion: Team | null;
  simulationDone: boolean;
  isSimulating: boolean;
  isAILoading: boolean;
  onRun: () => void;
  onRunAI: () => void;
  onReset: () => void;
}

// Historical seed matchup data
const SEED_HISTORY: Record<string, { higherPct: number; higherWins: number; total: number; notes: string[] }> = {
  '1v16': { higherPct: 99.4, higherWins: 163, total: 164, notes: ['1-seeds are 163-1 all-time against 16-seeds since 1985', 'UMBC became the first 16-seed to win in 2018, upsetting Virginia', 'FDU pulled off the second 16-over-1 upset in 2023 vs Purdue'] },
  '2v15': { higherPct: 93.8, higherWins: 150, total: 160, notes: ['2-seeds have won over 93% of first-round matchups', 'Florida Gulf Coast (2013) and Oral Roberts (2021) made historic 15-seed runs', '15-seeds occasionally advance to the Sweet 16'] },
  '3v14': { higherPct: 85.1, higherWins: 136, total: 160, notes: ['3-seeds are strong favorites but face real upset risk', '14-seeds win roughly 1-in-7 games', 'Georgia State\'s 2015 upset of Baylor is a memorable 14-seed win'] },
  '4v13': { higherPct: 79.6, higherWins: 127, total: 160, notes: ['4-seeds win about 80% of openers', '13-seeds are dangerous — they win 1-in-5 games', 'La Salle (2013), Yale (2016), and South Dakota State (2022) are notable 13-seeds'] },
  '5v12': { higherPct: 64.2, higherWins: 103, total: 160, notes: ['The 5-12 matchup is one of the most watched for upsets', '12-seeds win roughly 35% of the time', 'Picking 12-seeds is a common "safe" upset pick in brackets'] },
  '6v11': { higherPct: 62.5, higherWins: 100, total: 160, notes: ['11-seeds have historically been the most dangerous bracket busters', 'VCU (2011), George Mason (2006), and LSU (2006) all made Final Fours as 11-seeds', '11-seeds win about 37% of first-round games'] },
  '7v10': { higherPct: 60.7, higherWins: 97, total: 160, notes: ['One of the most evenly matched first-round pairings', '10-seeds win roughly 39% of the time', 'Recent 10-seed Final Four teams: NC State (2024), Florida Atlantic (2023)'] },
  '8v9':  { higherPct: 51.3, higherWins: 82, total: 160, notes: ['The closest first-round matchup in tournament history', '8 and 9 seeds are virtually equal — nearly a coin flip', 'The winner almost always faces a #1 seed in Round 2'] },
};

function getSeedKey(seedA: number, seedB: number): string {
  const [hi, lo] = seedA < seedB ? [seedA, seedB] : [seedB, seedA];
  return `${hi}v${lo}`;
}

interface LogoProps { espnId: number; name: string; size?: number }
function TeamLogo({ espnId, name, size = 28 }: LogoProps) {
  const [err, setErr] = useState(false);
  if (err) {
    return (
      <div
        className="rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0"
        style={{ width: size, height: size, fontSize: size * 0.38 }}
      >
        {name.slice(0, 2).toUpperCase()}
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={getLogoUrl(espnId)}
      alt={name}
      width={size}
      height={size}
      className="object-contain shrink-0"
      style={{ width: size, height: size }}
      onError={() => setErr(true)}
    />
  );
}

function fmt(n: number, decimals = 1): string {
  return n >= 0 ? `+${n.toFixed(decimals)}` : n.toFixed(decimals);
}

export default function SimPanel({ currentMatchup, champion, simulationDone, isSimulating, isAILoading, onRun, onRunAI, onReset }: SimPanelProps) {
  const roundLabel: Record<number, string> = { 1: 'Round of 64', 2: 'Round of 32', 3: 'Sweet 16', 4: 'Elite Eight', 5: 'Final Four', 6: 'Championship' };

  const m = currentMatchup;
  const tA = m?.teamA;
  const tB = m?.teamB;
  const seedKey = tA && tB ? getSeedKey(tA.seed, tB.seed) : null;
  const history = seedKey ? SEED_HISTORY[seedKey] : null;

  // Which team is "higher seed" (lower number)?
  const higherIsA = tA && tB ? tA.seed < tB.seed : true;
  const higherTeam = higherIsA ? tA : tB;
  const lowerTeam = higherIsA ? tB : tA;

  return (
    <div className="flex flex-col gap-0 h-full overflow-y-auto" style={{ width: 290 }}>
      {/* Run / Reset buttons */}
      <div className="p-3 border-b border-gray-100 bg-white sticky top-0 z-10 flex flex-col gap-2">
        {!simulationDone ? (
          <>
            {/* Random simulation */}
            <button
              onClick={onRun}
              disabled={isSimulating || isAILoading}
              className={`w-full py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                isSimulating
                  ? 'bg-blue-400 text-white cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              {isSimulating
                ? <span className="flex items-center justify-center gap-2"><span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />Simulating...</span>
                : 'Run Simulation'
              }
            </button>

            {/* AI simulation */}
            <button
              onClick={onRunAI}
              disabled={isSimulating || isAILoading}
              className={`w-full py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                isAILoading
                  ? 'bg-violet-400 text-white cursor-not-allowed'
                  : 'bg-violet-600 text-white hover:bg-violet-700 active:scale-[0.98] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              {isAILoading
                ? <span className="flex items-center justify-center gap-2"><span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />AI Picking...</span>
                : 'AI Picks (GPT-4o)'
              }
            </button>
          </>
        ) : (
          <button
            onClick={onReset}
            className="w-full py-2.5 rounded-lg text-sm font-semibold bg-gray-900 text-white hover:bg-black active:scale-[0.98] transition-all duration-200"
          >
            Reset Bracket
          </button>
        )}
      </div>

      {/* Champion banner */}
      {champion && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 flex items-center gap-3">
          <TeamLogo espnId={champion.espnId} name={champion.shortName} size={36} />
          <div>
            <div className="text-[9px] font-bold tracking-widest text-amber-600 uppercase">2025 Champion</div>
            <div className="text-[15px] font-extrabold text-amber-800 leading-tight">{champion.name}</div>
            <div className="text-[11px] text-amber-600">#{champion.seed} seed · {champion.conference}</div>
          </div>
        </div>
      )}

      {/* No matchup state */}
      {!m && !simulationDone && (
        <div className="p-4 text-center">
          <div className="text-[12px] text-gray-400 leading-relaxed">
            Click <strong className="text-gray-600">Run Simulation</strong> to simulate the full 2025 NCAA Tournament using KenPom efficiency ratings.
          </div>
        </div>
      )}

      {/* Matchup section */}
      {tA && tB && (
        <>
          {/* Header */}
          <div className="px-4 pt-3 pb-1">
            <div className="text-[9px] font-bold tracking-widest text-gray-400 uppercase">Matchup</div>
            {m?.round && <div className="text-[11px] text-gray-500 font-medium">{roundLabel[m.round]}</div>}
          </div>

          {/* Team A */}
          <TeamMatchupRow
            team={tA}
            prob={m?.probA ?? 0}
            isWinner={m?.winner?.id === tA.id}
            isLoser={!!m?.winner && m.winner.id !== tA.id}
          />

          <div className="mx-4 text-center text-[9px] text-gray-300 font-bold tracking-widest py-0.5">vs</div>

          {/* Team B */}
          <TeamMatchupRow
            team={tB}
            prob={m?.probB ?? 0}
            isWinner={m?.winner?.id === tB.id}
            isLoser={!!m?.winner && m.winner.id !== tB.id}
          />

          {/* KenPom section */}
          <div className="mt-3 mx-3 rounded-lg border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 px-3 py-1.5 border-b border-gray-100">
              <span className="text-[9px] font-bold tracking-widest text-gray-400 uppercase">KenPom</span>
            </div>
            <table className="w-full text-[11px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <td className="px-2 py-1 text-gray-400 text-[9px] font-semibold"></td>
                  <td className="px-2 py-1 text-center font-bold text-gray-700 text-[10px]">{tA.shortName}</td>
                  <td className="px-2 py-1 text-center font-bold text-gray-700 text-[10px]">{tB.shortName}</td>
                </tr>
              </thead>
              <tbody>
                <KenPomRow label="Rank" a={`#${tA.kenpom.rank}`} b={`#${tB.kenpom.rank}`} aVal={-tA.kenpom.rank} bVal={-tB.kenpom.rank} />
                <KenPomRow label="Adj. EM" a={fmt(tA.kenpom.adjEM)} b={fmt(tB.kenpom.adjEM)} aVal={tA.kenpom.adjEM} bVal={tB.kenpom.adjEM} />
                <KenPomRow label="Adj. Offense" a={`${tA.kenpom.adjO.toFixed(1)} (#${tA.kenpom.adjOrank})`} b={`${tB.kenpom.adjO.toFixed(1)} (#${tB.kenpom.adjOrank})`} aVal={tA.kenpom.adjO} bVal={tB.kenpom.adjO} />
                <KenPomRow label="Adj. Defense" a={`${tA.kenpom.adjD.toFixed(1)} (#${tA.kenpom.adjDrank})`} b={`${tB.kenpom.adjD.toFixed(1)} (#${tB.kenpom.adjDrank})`} aVal={-tA.kenpom.adjD} bVal={-tB.kenpom.adjD} />
                <KenPomRow label="Tempo" a={tA.kenpom.tempo.toFixed(1)} b={tB.kenpom.tempo.toFixed(1)} aVal={0} bVal={0} neutral />
                <KenPomRow label="SOS EM" a={fmt(tA.kenpom.sosEM)} b={fmt(tB.kenpom.sosEM)} aVal={tA.kenpom.sosEM} bVal={tB.kenpom.sosEM} />
              </tbody>
            </table>
          </div>

          {/* History section */}
          {history && (
            <div className="mt-3 mx-3 rounded-lg border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-3 py-1.5 border-b border-gray-100">
                <span className="text-[9px] font-bold tracking-widest text-gray-400 uppercase">
                  History · {seedKey}
                </span>
              </div>
              <div className="px-3 py-2.5">
                {/* Bar */}
                <div className="flex justify-between text-[9px] text-gray-400 mb-1">
                  <span>Higher seed ({higherTeam?.seed})</span>
                  <span>Lower seed ({lowerTeam?.seed})</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden bg-red-400 flex">
                  <div
                    className="h-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${history.higherPct}%` }}
                  />
                </div>
                <div className="flex justify-between text-[9px] font-bold mt-0.5">
                  <span className="text-blue-600">{history.higherPct}%</span>
                  <span className="text-red-500">{(100 - history.higherPct).toFixed(1)}%</span>
                </div>
                <p className="text-[10px] text-gray-500 mt-1.5 leading-relaxed">
                  {higherTeam?.seed}-seeds have won {history.higherWins} of {history.total} all-time matchups ({history.higherPct}%).
                </p>
              </div>
            </div>
          )}

          {/* Notes section */}
          {history && (
            <div className="mt-3 mx-3 mb-4 rounded-lg border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-3 py-1.5 border-b border-gray-100">
                <span className="text-[9px] font-bold tracking-widest text-gray-400 uppercase">Notes</span>
              </div>
              <ul className="px-3 py-2 space-y-1.5">
                {history.notes.map((note, i) => (
                  <li key={i} className="flex gap-1.5 text-[10px] text-gray-500 leading-relaxed">
                    <span className="text-gray-300 shrink-0 mt-0.5">·</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function TeamMatchupRow({ team, prob, isWinner, isLoser }: { team: Team; prob: number; isWinner: boolean; isLoser: boolean }) {
  return (
    <div className={`px-4 py-2 flex items-center gap-2.5 transition-all duration-300 ${isWinner ? 'bg-blue-50' : isLoser ? 'opacity-40' : ''}`}>
      <TeamLogo espnId={team.espnId} name={team.shortName} size={28} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-bold text-gray-400 bg-gray-100 rounded px-1">{team.seed}</span>
          <span className={`text-[13px] font-bold truncate ${isWinner ? 'text-blue-900' : 'text-gray-800'}`}>{team.name}</span>
        </div>
        <div className="text-[10px] text-gray-400">{team.conference} · {team.record}</div>
      </div>
      <div className="text-right shrink-0">
        <div className={`text-[18px] font-black tabular-nums ${isWinner ? 'text-blue-600' : 'text-gray-700'}`}>
          {Math.round(prob * 100)}%
        </div>
        <div className="text-[8px] text-gray-400 uppercase tracking-wide">Win Prob</div>
      </div>
    </div>
  );
}

function KenPomRow({ label, a, b, aVal, bVal, neutral }: { label: string; a: string; b: string; aVal: number; bVal: number; neutral?: boolean }) {
  const aBetter = !neutral && aVal > bVal;
  const bBetter = !neutral && bVal > aVal;
  return (
    <tr className="border-b border-gray-50 last:border-0">
      <td className="px-2 py-1 text-[10px] text-gray-400">{label}</td>
      <td className={`px-2 py-1 text-center text-[10px] font-semibold tabular-nums ${aBetter ? 'text-blue-700' : 'text-gray-600'}`}>{a}</td>
      <td className={`px-2 py-1 text-center text-[10px] font-semibold tabular-nums ${bBetter ? 'text-blue-700' : 'text-gray-600'}`}>{b}</td>
    </tr>
  );
}
