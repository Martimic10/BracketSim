'use client';

import { Matchup, Region } from '@/lib/types';
import MatchupCard from './MatchupCard';

interface RegionBracketProps {
  region: Region;
  matchups: Record<string, Matchup>;
  currentMatchupId: string | null;
  mirrored: boolean;
  onMatchupClick?: (matchup: Matchup) => void;
}

export const CARD_H = 66;    // 2 rows × 32px + 2px divider
export const CARD_W = 175;
export const ROUND_GAP = 22; // horizontal space between rounds
const INNER_GAP = 8;         // vertical gap between R1 matchups
const NUM_ROUNDS = 4;
const NUM_R1 = 8;

export const REGION_TOTAL_H = NUM_R1 * CARD_H + (NUM_R1 - 1) * INNER_GAP;
export const REGION_TOTAL_W = NUM_ROUNDS * CARD_W + (NUM_ROUNDS - 1) * ROUND_GAP;

// Actual rendered height of the label row (height:28 + mb-3 margin:12 = 40px)
export const REGION_LABEL_H = 40;

function getCardTops(round: number): number[] {
  const count = Math.pow(2, NUM_ROUNDS - round);
  const slot = REGION_TOTAL_H / count;
  return Array.from({ length: count }, (_, i) => slot * i + slot / 2 - CARD_H / 2);
}

function getColumnX(roundIndex: number, mirrored: boolean): number {
  if (!mirrored) return roundIndex * (CARD_W + ROUND_GAP);
  return REGION_TOTAL_W - (roundIndex + 1) * CARD_W - roundIndex * ROUND_GAP;
}

export default function RegionBracket({ region, matchups, currentMatchupId, mirrored, onMatchupClick }: RegionBracketProps) {
  const rounds = [1, 2, 3, 4].map(round => {
    const count = Math.pow(2, NUM_ROUNDS - round);
    const games = Array.from({ length: count }, (_, i) => matchups[`${region}-R${round}-${i}`]);
    return { round, roundIndex: round - 1, games };
  });

  const roundLabels: Record<number, string> = { 1: 'R64', 2: 'R32', 3: 'S16', 4: 'E8' };

  return (
    <div className="flex flex-col" style={{ width: REGION_TOTAL_W }}>
      {/* Region + round labels row */}
      <div className="flex items-end mb-3" style={{ width: REGION_TOTAL_W, height: 28 }}>
        {mirrored
          ? [3, 2, 1, 0].map(ri => (
              <div key={ri} style={{ width: CARD_W, marginLeft: ri < 3 ? ROUND_GAP : 0 }}
                className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">
                {ri === 3 ? region : roundLabels[ri + 1]}
              </div>
            ))
          : [0, 1, 2, 3].map(ri => (
              <div key={ri} style={{ width: CARD_W, marginLeft: ri > 0 ? ROUND_GAP : 0 }}
                className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">
                {ri === 0 ? region : roundLabels[ri + 1]}
              </div>
            ))
        }
      </div>

      {/* Bracket body */}
      <div className="relative" style={{ width: REGION_TOTAL_W, height: REGION_TOTAL_H }}>
        {/* Connector SVG */}
        <svg className="absolute inset-0 pointer-events-none" width={REGION_TOTAL_W} height={REGION_TOTAL_H}>
          {rounds.slice(0, 3).map(({ round, roundIndex, games }) => {
            const curTops = getCardTops(round);
            const nxtTops = getCardTops(round + 1);
            const curX = getColumnX(roundIndex, mirrored);
            const nxtX = getColumnX(roundIndex + 1, mirrored);

            // Which edge the connector exits/enters each card
            const curEdgeX = mirrored ? curX : curX + CARD_W;
            const nxtEdgeX = mirrored ? nxtX + CARD_W : nxtX;
            const midX = (curEdgeX + nxtEdgeX) / 2;

            return games.map((_, gi) => {
              const curMidY = curTops[gi] + CARD_H / 2;
              const nxtMidY = nxtTops[Math.floor(gi / 2)] + CARD_H / 2;
              const pairMidY = gi % 2 === 0 && curTops[gi + 1] !== undefined
                ? (curTops[gi] + CARD_H / 2 + curTops[gi + 1] + CARD_H / 2) / 2
                : null;

              return (
                <g key={`${round}-${gi}`}>
                  {/* Horizontal arm from card edge to midpoint */}
                  <line x1={curEdgeX} y1={curMidY} x2={midX} y2={curMidY}
                    stroke="#b0b8c4" strokeWidth="1.5" />
                  {/* Vertical bar connecting siblings (draw once per pair at even index) */}
                  {gi % 2 === 0 && pairMidY !== null && (
                    <line x1={midX} y1={curMidY} x2={midX} y2={curTops[gi + 1] + CARD_H / 2}
                      stroke="#b0b8c4" strokeWidth="1.5" />
                  )}
                  {/* Horizontal arm from midpoint to next card */}
                  <line x1={midX} y1={nxtMidY} x2={nxtEdgeX} y2={nxtMidY}
                    stroke="#b0b8c4" strokeWidth="1.5" />
                </g>
              );
            });
          })}
        </svg>

        {/* Cards */}
        {rounds.map(({ round, roundIndex, games }) => {
          const tops = getCardTops(round);
          const colX = getColumnX(roundIndex, mirrored);
          return games.map((matchup, gi) => (
            <div key={matchup?.id ?? `${round}-${gi}`} className="absolute" style={{ left: colX, top: tops[gi] }}>
              {matchup ? (
                <MatchupCard
                  matchup={matchup}
                  isCurrent={currentMatchupId === matchup.id}
                  onClick={onMatchupClick ? () => onMatchupClick(matchup) : undefined}
                />
              ) : (
                <div className="rounded border border-gray-200 bg-white"
                  style={{ width: CARD_W, height: CARD_H }} />
              )}
            </div>
          ));
        })}
      </div>
    </div>
  );
}
