'use client';

import { Matchup, Team } from '@/lib/types';

export type ZoomLevel = 'fit' | 'mid' | 'full';

interface MobileBarProps {
  currentMatchup: Matchup | null;
  champion: Team | null;
  simulationDone: boolean;
  isSimulating: boolean;
  isAILoading: boolean;
  zoom: ZoomLevel;
  onZoomChange: (z: ZoomLevel) => void;
  onRun: () => void;
  onRunAI: () => void;
  onReset: () => void;
}

const ZOOM_LABELS: Record<ZoomLevel, string> = { fit: 'Fit', mid: '65%', full: '100%' };

export default function MobileBar({
  currentMatchup, champion, simulationDone, isSimulating, isAILoading,
  zoom, onZoomChange, onRun, onRunAI, onReset,
}: MobileBarProps) {
  const busy = isSimulating || isAILoading;
  const m = currentMatchup;
  const showTicker = m && m.teamA && m.teamB;

  return (
    <div className="bg-white border-t border-gray-200 shadow-[0_-2px_12px_rgba(0,0,0,0.08)]">

      {/* Live game ticker */}
      {showTicker && !champion && (
        <div className="flex items-center gap-2.5 px-4 py-2 bg-blue-50 border-b border-blue-100">
          {isSimulating && (
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shrink-0" />
          )}
          <span className="text-[12px] font-semibold text-gray-700 truncate flex-1">
            <span className={m.winner?.name === m.teamA?.name ? 'text-blue-700 font-bold' : ''}>
              #{m.teamA!.seed} {m.teamA!.shortName}
            </span>
            <span className="text-gray-400 mx-1.5">vs</span>
            <span className={m.winner?.name === m.teamB?.name ? 'text-blue-700 font-bold' : ''}>
              #{m.teamB!.seed} {m.teamB!.shortName}
            </span>
          </span>
          <span className="text-[11px] font-bold text-blue-600 shrink-0">
            {(m.probA * 100).toFixed(0)}
            <span className="text-gray-300 mx-0.5">/</span>
            {(m.probB * 100).toFixed(0)}
          </span>
        </div>
      )}

      {/* Champion banner */}
      {champion && (
        <div className="flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-50 border-b border-amber-200">
          <span className="text-base">🏆</span>
          <span className="text-[13px] font-black text-amber-700 tracking-wide">
            {champion.name} — 2026 Champion!
          </span>
        </div>
      )}

      {/* Zoom controls + action buttons */}
      <div className="flex items-center gap-2 px-3 py-2.5" style={{ paddingBottom: 'max(0.625rem, env(safe-area-inset-bottom))' }}>

        {/* Zoom picker */}
        <div className="flex rounded-lg border border-gray-200 overflow-hidden shrink-0">
          {(['fit', 'mid', 'full'] as ZoomLevel[]).map(z => (
            <button
              key={z}
              onClick={() => onZoomChange(z)}
              className={`px-2.5 py-1.5 text-[11px] font-semibold transition-colors ${
                zoom === z
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              {ZOOM_LABELS[z]}
            </button>
          ))}
        </div>

        {/* Action buttons */}
        {!simulationDone ? (
          <div className="flex gap-1.5 flex-1">
            <button
              onClick={onRun}
              disabled={busy}
              className={`flex-1 py-2 text-[12px] font-bold rounded-lg transition-all ${
                isSimulating
                  ? 'bg-blue-400 text-white'
                  : 'bg-blue-600 text-white active:scale-95 disabled:opacity-50'
              }`}
            >
              {isSimulating
                ? <span className="flex items-center justify-center gap-1.5">
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Simulating…
                  </span>
                : 'Run Sim'
              }
            </button>
            <button
              onClick={onRunAI}
              disabled={busy}
              className={`flex-1 py-2 text-[12px] font-bold rounded-lg transition-all ${
                isAILoading
                  ? 'bg-violet-400 text-white'
                  : 'bg-violet-600 text-white active:scale-95 disabled:opacity-50'
              }`}
            >
              {isAILoading
                ? <span className="flex items-center justify-center gap-1.5">
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    AI Picking…
                  </span>
                : 'AI Picks'
              }
            </button>
          </div>
        ) : (
          <button
            onClick={onReset}
            className="flex-1 py-2 text-[12px] font-bold rounded-lg bg-gray-900 text-white active:scale-95 transition-all"
          >
            Reset Bracket
          </button>
        )}
      </div>
    </div>
  );
}
