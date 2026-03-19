'use client';

import { Matchup, Team } from '@/lib/types';
import MatchupCard from './MatchupCard';
import { CARD_H, CARD_W, REGION_TOTAL_H, ROUND_GAP } from './RegionBracket';

interface CenterBracketProps {
  finalFour: Matchup[];
  championship: Matchup | null;
  champion: Team | null;
  currentMatchupId: string | null;
  totalH: number;  // full height: top_body + gap + bottom_label + bottom_body
  gapH: number;    // height of the First Four gap section
  onMatchupClick?: (matchup: Matchup) => void;
}

// ARM_W: horizontal arm extending left/right to connect to region E8 connectors.
// Extends REGION_COL_GAP extra on each side (via SVG overflow) to reach E8 right/left edges.
const ARM_W = ROUND_GAP;
const REGION_COL_GAP = 16; // must match Bracket.tsx

export const CENTER_W = ARM_W + CARD_W + ARM_W; // 22+175+22 = 219

export default function CenterBracket({
  finalFour, championship, champion, currentMatchupId, totalH, gapH, onMatchupClick,
}: CenterBracketProps) {
  const cardX = ARM_W; // left edge of each card within CENTER_W

  // FF-0: vertically centered within the top REGION_TOTAL_H body.
  // CenterBracket is positioned at top=REGION_LABEL_H in Bracket.tsx, same as the
  // region body divs, so y=0 here = top of the region body.
  const ff0Y = REGION_TOTAL_H / 2 - CARD_H / 2;                              // 259

  // Championship: centered within the First Four gap.
  const champY = REGION_TOTAL_H + gapH / 2 - CARD_H / 2;                     // 631

  // FF-1: vertically centered within the bottom REGION_TOTAL_H body.
  const ff1Y = totalH - REGION_TOTAL_H / 2 - CARD_H / 2;                     // 1043

  const ff0MidY  = ff0Y  + CARD_H / 2;  // 292
  const ff1MidY  = ff1Y  + CARD_H / 2;  // 1076

  // Center x of all cards (used for vertical FF→CHAMP connectors)
  const cx = cardX + CARD_W / 2;

  return (
    <div style={{ width: CENTER_W }}>
      <div className="relative" style={{ width: CENTER_W, height: totalH }}>
        <svg
          className="absolute inset-0 pointer-events-none"
          width={CENTER_W} height={totalH}
          style={{ overflow: 'visible' }}
        >
          {/* ── Horizontal arms to E8 cards ─────────────────────────── */}
          {/* Extend REGION_COL_GAP past the left edge to reach South/East E8 right edge */}
          <line x1={-REGION_COL_GAP} y1={ff0MidY}  x2={cardX}           y2={ff0MidY}  stroke="#b0b8c4" strokeWidth="1.5" />
          <line x1={-REGION_COL_GAP} y1={ff1MidY}  x2={cardX}           y2={ff1MidY}  stroke="#b0b8c4" strokeWidth="1.5" />
          {/* Extend past the right edge to reach West/Midwest E8 left edge */}
          <line x1={cardX + CARD_W}  y1={ff0MidY}  x2={CENTER_W + REGION_COL_GAP} y2={ff0MidY}  stroke="#b0b8c4" strokeWidth="1.5" />
          <line x1={cardX + CARD_W}  y1={ff1MidY}  x2={CENTER_W + REGION_COL_GAP} y2={ff1MidY}  stroke="#b0b8c4" strokeWidth="1.5" />

          {/* ── Vertical connectors: FF → Championship ────────────── */}
          <line x1={cx} y1={ff0Y + CARD_H} x2={cx} y2={champY}         stroke="#b0b8c4" strokeWidth="1.5" strokeDasharray="4 3" />
          <line x1={cx} y1={champY + CARD_H} x2={cx} y2={ff1Y}         stroke="#b0b8c4" strokeWidth="1.5" strokeDasharray="4 3" />
        </svg>

        {/* ── FINAL FOUR label + FF-0 card ─────────────────────────── */}
        <div
          className="absolute text-[9px] font-black uppercase tracking-widest text-gray-400 text-center"
          style={{ left: 0, width: CENTER_W, top: ff0Y - 15 }}
        >
          Final Four
        </div>
        <div className="absolute" style={{ left: cardX, top: ff0Y }}>
          {finalFour[0] && (
            <MatchupCard
              matchup={finalFour[0]}
              isCurrent={currentMatchupId === finalFour[0].id}
              onClick={onMatchupClick ? () => onMatchupClick(finalFour[0]) : undefined}
            />
          )}
        </div>

        {/* ── Championship label + CHAMP card ──────────────────────── */}
        <div
          className="absolute text-[9px] font-black uppercase tracking-widest text-amber-500 text-center"
          style={{ left: 0, width: CENTER_W, top: champY - 15 }}
        >
          Championship
        </div>
        <div className="absolute" style={{ left: cardX, top: champY }}>
          {championship && (
            <MatchupCard
              matchup={championship}
              isCurrent={currentMatchupId === championship.id}
              onClick={onMatchupClick ? () => onMatchupClick(championship) : undefined}
            />
          )}
        </div>

        {/* ── FINAL FOUR label + FF-1 card ─────────────────────────── */}
        <div
          className="absolute text-[9px] font-black uppercase tracking-widest text-gray-400 text-center"
          style={{ left: 0, width: CENTER_W, top: ff1Y - 15 }}
        >
          Final Four
        </div>
        <div className="absolute" style={{ left: cardX, top: ff1Y }}>
          {finalFour[1] && (
            <MatchupCard
              matchup={finalFour[1]}
              isCurrent={currentMatchupId === finalFour[1].id}
              onClick={onMatchupClick ? () => onMatchupClick(finalFour[1]) : undefined}
            />
          )}
        </div>

        {/* ── Champion banner ───────────────────────────────────────── */}
        {champion && (
          <div
            className="absolute flex flex-col items-center gap-0.5"
            style={{ left: cardX, top: champY + CARD_H + 12, width: CARD_W }}
          >
            <div className="text-[9px] font-black tracking-widest text-amber-500 uppercase">2026 Champion</div>
            <div className="text-[15px] font-extrabold text-amber-700 text-center leading-tight">{champion.name}</div>
            <div className="text-[10px] text-amber-500">#{champion.seed} · {champion.region}</div>
          </div>
        )}
      </div>
    </div>
  );
}
