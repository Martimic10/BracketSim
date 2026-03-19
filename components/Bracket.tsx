'use client';

import { useState, useCallback, useEffect } from 'react';
import { BracketState, Matchup } from '@/lib/types';
import { initializeBracket, runFullSimulation } from '@/lib/simulation';
import { runAISimulation } from '@/lib/ai-simulation';
import RegionBracket, { CARD_H, CARD_W, REGION_TOTAL_H, REGION_TOTAL_W, ROUND_GAP, REGION_LABEL_H } from './RegionBracket';
import CenterBracket, { CENTER_W } from './CenterBracket';
import SimPanel from './SimPanel';
import MobileBar, { ZoomLevel } from './MobileBar';

const FIRST_FOUR_H = 160;
const REGION_COL_GAP = 16;

const topHalfH   = REGION_LABEL_H + REGION_TOTAL_H;  // 624
const bottomRowY = topHalfH + FIRST_FOUR_H;           // 784

const BRACKET_W = REGION_TOTAL_W + REGION_COL_GAP + CENTER_W + REGION_COL_GAP + REGION_TOTAL_W;
const BRACKET_H = topHalfH + FIRST_FOUR_H + REGION_LABEL_H + REGION_TOTAL_H + 80;

const PANEL_W = 290;

const centerTotalH = REGION_TOTAL_H + FIRST_FOUR_H + REGION_LABEL_H + REGION_TOTAL_H;

const leftX   = 0;
const centerX = REGION_TOTAL_W + REGION_COL_GAP;
const rightX  = centerX + CENTER_W + REGION_COL_GAP;

const FF_GAMES = [
  { teamA: 'UMBC',         seedA: 16, scoreA: 83,   teamB: 'Howard',     seedB: 16, scoreB: 86  },
  { teamA: 'Miami OH',     seedA: 11, scoreA: null,  teamB: 'SMU',        seedB: 11, scoreB: null },
  { teamA: 'Prairie View', seedA: 16, scoreA: null,  teamB: 'Lehigh',     seedB: 16, scoreB: null },
  { teamA: 'Texas',        seedA: 11, scoreA: 68,    teamB: 'NC State',   seedB: 11, scoreB: 66  },
] as const;

const FF_WINNERS = ['Howard', 'SMU', 'Lehigh', 'Texas'] as const;

function FFResultCard({ game, winner }: {
  game: typeof FF_GAMES[number];
  winner: string;
}) {
  const rows = [
    { name: game.teamA, seed: game.seedA, score: game.scoreA },
    { name: game.teamB, seed: game.seedB, score: game.scoreB },
  ];
  return (
    <div className="bg-white border border-gray-200 rounded-[5px] overflow-hidden shadow-sm" style={{ width: CARD_W }}>
      {rows.map((t, i) => (
        <div
          key={i}
          className={`flex items-center px-2 gap-1.5 ${i === 0 ? 'border-b border-gray-100' : ''}`}
          style={{ height: CARD_H / 2 }}
        >
          <span className={`text-[10px] font-bold w-4 shrink-0 ${t.name === winner ? 'text-blue-600' : 'text-gray-400'}`}>
            {t.seed}
          </span>
          <span className={`text-[12px] flex-1 truncate ${t.name === winner ? 'text-blue-700 font-bold' : 'text-gray-500'}`}>
            {t.name}
          </span>
          {t.score !== null && (
            <span className={`text-[12px] font-bold tabular-nums ${t.name === winner ? 'text-blue-700' : 'text-gray-400'}`}>
              {t.score}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export default function Bracket() {
  const [state, setState] = useState<BracketState>(() => initializeBracket());
  const [pinned, setPinned] = useState<Matchup | null>(null);
  const [isAILoading, setIsAILoading] = useState(false);
  const [mobileZoom, setMobileZoom] = useState<ZoomLevel>('fit');
  const [viewportW, setViewportW] = useState(1200);

  useEffect(() => {
    const update = () => setViewportW(window.innerWidth);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const handleRun = useCallback(async () => {
    const freshState = state;
    setState(s => ({ ...s, isSimulating: true }));
    const steps = runFullSimulation(freshState);

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const id = step.matchupId;
      const delay =
        id === 'CHAMP'           ? 1200 :
        id.startsWith('FF')      ?  800 :
        id.includes('-R4-')      ?  600 :
        id.includes('-R3-')      ?  450 :
        id.includes('-R2-')      ?  350 :
                                    250;
      await new Promise<void>(r => setTimeout(r, delay));
      setState(s => ({
        ...s,
        matchups: step.matchups,
        finalFour: step.finalFour,
        championship: step.championship,
        champion: step.champion,
        currentSimMatchup: step.currentMatchup,
        simulationDone: i === steps.length - 1,
        isSimulating: i < steps.length - 1,
      }));
    }
  }, [state]);

  const handleReset = useCallback(() => {
    setState(initializeBracket());
    setPinned(null);
  }, []);

  const handleRunAI = useCallback(async () => {
    setIsAILoading(true);
    const steps = await runAISimulation(state);
    setIsAILoading(false);
    setState(s => ({ ...s, isSimulating: true }));

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const id = step.matchupId;
      const delay =
        id === 'CHAMP'       ? 1200 :
        id.startsWith('FF')  ?  800 :
        id.includes('-R4-')  ?  600 :
        id.includes('-R3-')  ?  450 :
        id.includes('-R2-')  ?  350 :
                                250;
      await new Promise<void>(r => setTimeout(r, delay));
      setState(s => ({
        ...s,
        matchups: step.matchups,
        finalFour: step.finalFour,
        championship: step.championship,
        champion: step.champion,
        currentSimMatchup: step.currentMatchup,
        simulationDone: i === steps.length - 1,
        isSimulating: i < steps.length - 1,
      }));
    }
  }, [state]);

  const handleMatchupClick = useCallback((matchup: Matchup) => {
    if (!matchup.teamA || !matchup.teamB) return;
    setPinned(prev => prev?.id === matchup.id ? null : matchup);
  }, []);

  const { matchups, finalFour, championship, champion, currentSimMatchup, simulationDone, isSimulating } = state;

  const displayMatchup = pinned
    ? (matchups[pinned.id] ?? finalFour.find(f => f.id === pinned.id) ?? (championship?.id === pinned.id ? championship : null))
    : currentSimMatchup;

  const currentId = currentSimMatchup?.id ?? null;

  const cardGap = ROUND_GAP;
  const pairW = 2 * CARD_W + cardGap;
  const leftPairX  = Math.round((centerX - pairW) / 2);
  const rightPairX = rightX + Math.round((REGION_TOTAL_W - pairW) / 2);
  const cardsTop = 44;

  // Mobile zoom/scale
  const isMobile = viewportW < 768;
  const fitScale = Math.min(1, (viewportW - 16) / BRACKET_W);
  const scale = !isMobile ? 1 : (
    mobileZoom === 'fit' ? fitScale :
    mobileZoom === 'mid' ? 0.65 :
    1.0
  );
  const scaledW = Math.round(BRACKET_W * scale);
  const scaledH = Math.round(BRACKET_H * scale);

  // The bracket canvas (shared between mobile and desktop)
  const bracketCanvas = (
    <div className="relative" style={{ width: BRACKET_W, height: BRACKET_H }}>

      {/* SOUTH — top left */}
      <div className="absolute" style={{ left: leftX, top: 0 }}>
        <RegionBracket region="SOUTH" matchups={matchups} currentMatchupId={currentId}
          mirrored={false} onMatchupClick={handleMatchupClick} />
      </div>

      {/* WEST — top right */}
      <div className="absolute" style={{ left: rightX, top: 0 }}>
        <RegionBracket region="WEST" matchups={matchups} currentMatchupId={currentId}
          mirrored={true} onMatchupClick={handleMatchupClick} />
      </div>

      {/* FIRST FOUR band */}
      <div className="absolute" style={{ left: 0, top: topHalfH, width: BRACKET_W, height: FIRST_FOUR_H }}>
        <div className="absolute top-2.5 left-0 right-0 text-center">
          <span className="text-[11px] font-black uppercase tracking-widest text-gray-500">First Four</span>
          <span className="text-[9px] text-gray-400 ml-1.5">· March 17–18, 2026</span>
        </div>
        <div className="absolute flex gap-[22px]" style={{ left: leftPairX, top: cardsTop }}>
          <FFResultCard game={FF_GAMES[0]} winner={FF_WINNERS[0]} />
          <FFResultCard game={FF_GAMES[1]} winner={FF_WINNERS[1]} />
        </div>
        <div className="absolute flex gap-[22px]" style={{ left: rightPairX, top: cardsTop }}>
          <FFResultCard game={FF_GAMES[2]} winner={FF_WINNERS[2]} />
          <FFResultCard game={FF_GAMES[3]} winner={FF_WINNERS[3]} />
        </div>
      </div>

      {/* CENTER */}
      <div className="absolute" style={{ left: centerX, top: REGION_LABEL_H }}>
        <CenterBracket
          finalFour={finalFour}
          championship={championship}
          champion={champion}
          currentMatchupId={currentId}
          totalH={centerTotalH}
          gapH={FIRST_FOUR_H}
          onMatchupClick={handleMatchupClick}
        />
      </div>

      {/* EAST — bottom left */}
      <div className="absolute" style={{ left: leftX, top: bottomRowY }}>
        <RegionBracket region="EAST" matchups={matchups} currentMatchupId={currentId}
          mirrored={false} onMatchupClick={handleMatchupClick} />
      </div>

      {/* MIDWEST — bottom right */}
      <div className="absolute" style={{ left: rightX, top: bottomRowY }}>
        <RegionBracket region="MIDWEST" matchups={matchups} currentMatchupId={currentId}
          mirrored={true} onMatchupClick={handleMatchupClick} />
      </div>

    </div>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* Main row: bracket + desktop panel */}
      <div className="flex flex-1 overflow-hidden">

        {/* Scrollable bracket */}
        <div className="flex-1 overflow-auto bg-gray-50">
          {isMobile ? (
            /* Mobile: scale-transformed bracket */
            <div style={{ padding: 8, minWidth: scaledW + 16 }}>
              <div style={{ width: scaledW, height: scaledH, overflow: 'hidden' }}>
                <div style={{ width: BRACKET_W, height: BRACKET_H, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
                  {bracketCanvas}
                </div>
              </div>
            </div>
          ) : (
            /* Desktop: full-size bracket */
            <div style={{ padding: 24, minWidth: BRACKET_W + 48 }}>
              {bracketCanvas}
            </div>
          )}
        </div>

        {/* Desktop SimPanel */}
        {!isMobile && (
          <div className="shrink-0 border-l border-gray-200 bg-white overflow-y-auto h-full"
            style={{ width: PANEL_W }}>
            <SimPanel
              currentMatchup={displayMatchup}
              champion={champion}
              simulationDone={simulationDone}
              isSimulating={isSimulating}
              isAILoading={isAILoading}
              onRun={handleRun}
              onRunAI={handleRunAI}
              onReset={handleReset}
            />
          </div>
        )}

      </div>

      {/* Mobile bottom bar */}
      {isMobile && (
        <MobileBar
          currentMatchup={displayMatchup ?? null}
          champion={champion}
          simulationDone={simulationDone}
          isSimulating={isSimulating}
          isAILoading={isAILoading}
          zoom={mobileZoom}
          onZoomChange={setMobileZoom}
          onRun={handleRun}
          onRunAI={handleRunAI}
          onReset={handleReset}
        />
      )}

    </div>
  );
}
