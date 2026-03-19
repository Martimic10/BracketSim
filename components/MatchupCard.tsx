'use client';

import { Matchup } from '@/lib/types';
import TeamRow from './TeamRow';

interface MatchupCardProps {
  matchup: Matchup;
  isCurrent: boolean;
  onClick?: () => void;
}

export default function MatchupCard({ matchup, isCurrent, onClick }: MatchupCardProps) {
  const { teamA, teamB, winner } = matchup;
  const aIsWinner = !!winner && winner.id === teamA?.id;
  const bIsWinner = !!winner && winner.id === teamB?.id;

  return (
    <div
      onClick={onClick}
      className={`
        relative rounded-[5px] border bg-white overflow-hidden transition-all duration-200
        ${onClick ? 'cursor-pointer hover:border-blue-300 hover:shadow-md' : ''}
        ${isCurrent
          ? 'border-blue-400 shadow-lg ring-1 ring-blue-300'
          : 'border-gray-200 shadow-sm'
        }
      `}
      style={{ width: 175, minWidth: 175 }}
    >
      <TeamRow team={teamA} isWinner={aIsWinner} isLoser={!!winner && !aIsWinner} />
      <div className="border-t border-gray-100 mx-2" />
      <TeamRow team={teamB} isWinner={bIsWinner} isLoser={!!winner && !bIsWinner} />
    </div>
  );
}
