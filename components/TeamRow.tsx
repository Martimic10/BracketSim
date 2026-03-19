'use client';

import { useState } from 'react';
import { Team } from '@/lib/types';
import { getLogoUrl } from '@/lib/teams';

interface TeamRowProps {
  team: Team | null;
  isWinner: boolean;
  isLoser: boolean;
}

export default function TeamRow({ team, isWinner, isLoser }: TeamRowProps) {
  const [imgError, setImgError] = useState(false);

  if (!team) {
    return (
      <div className="flex items-center gap-2 px-2.5 h-[32px]">
        <div className="w-5 h-5 rounded bg-gray-100 shrink-0" />
        <span className="text-[11px] text-gray-300 w-4 font-bold">—</span>
        <span className="text-[12px] text-gray-300">TBD</span>
      </div>
    );
  }

  const logoUrl = getLogoUrl(team.espnId);

  return (
    <div
      className={`flex items-center gap-2 px-2.5 h-[32px] transition-all duration-300 ${
        isWinner ? 'bg-blue-50' : isLoser ? 'opacity-30' : ''
      }`}
    >
      {/* Logo */}
      <div className="w-5 h-5 shrink-0 flex items-center justify-center">
        {!imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoUrl}
            alt={team.shortName}
            width={20}
            height={20}
            className="object-contain"
            style={{ width: 20, height: 20 }}
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className="w-5 h-5 rounded flex items-center justify-center text-white"
            style={{ backgroundColor: seedColor(team.seed), fontSize: 8, fontWeight: 800 }}
          >
            {team.seed}
          </div>
        )}
      </div>

      {/* Seed */}
      <span
        className={`text-[11px] w-4 text-center font-black shrink-0 tabular-nums ${
          isWinner ? 'text-blue-600' : 'text-gray-400'
        }`}
      >
        {team.seed}
      </span>

      {/* Name */}
      <span
        className={`text-[13px] truncate leading-none ${
          isWinner ? 'font-bold text-blue-900' : 'font-semibold text-gray-700'
        }`}
      >
        {team.shortName}
      </span>
    </div>
  );
}

function seedColor(seed: number): string {
  if (seed === 1) return '#1d4ed8';
  if (seed <= 4) return '#2563eb';
  if (seed <= 8) return '#3b82f6';
  if (seed <= 12) return '#6b7280';
  return '#9ca3af';
}
