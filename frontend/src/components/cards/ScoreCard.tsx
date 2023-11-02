// ScoreCard.tsx
import type React from 'react'

interface TeamInfo {
  id: number
  logo: string
  name: string
  score: number
  isWin?: () => boolean
  onClick?: (id: number) => void
}

interface ScoreCardProps {
  gameId: number
  matchDay: string
  stadium: string
  homeTeam: TeamInfo
  awayTeam: TeamInfo
}

const ScoreCard: React.FC<ScoreCardProps> = ({
  gameId,
  matchDay,
  stadium,
  homeTeam,
  awayTeam
}) => {
  return (
    <div className="flex items-center justify-between">
      {/* Home Team Section */}
      <div
        className="flex items-center space-x-4"
        onClick={() => homeTeam.onClick?.(homeTeam.id)}
      >
        <img
          className="sm:w-18 w-10 md:w-24"
          src={homeTeam.logo}
          alt={`${homeTeam.name} Logo`}
        />
        <div className="flex flex-col">
          <p>HOME</p>
          <p className="font-bold">{homeTeam.name}</p>
        </div>
      </div>

      {/* Score Section */}
      <div className="flex items-center space-x-3">
        <div className="text-3xl font-extrabold">{homeTeam.score}</div>
        {homeTeam.score > awayTeam.score && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-6 w-6"
          >
            <path
              fillRule="evenodd"
              d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
              clipRule="evenodd"
            />
          </svg>
        )}
        <div className="flex flex-col items-center">
          <p>{gameId}경기</p>
          <p>{matchDay}</p>
          <p>{stadium}</p>
        </div>
        {awayTeam.score > homeTeam.score && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-6 w-6"
          >
            <path
              fillRule="evenodd"
              d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
              clipRule="evenodd"
            />
          </svg>
        )}
        <div className="text-3xl font-extrabold">{awayTeam.score}</div>
      </div>

      {/* Away Team Section */}
      <div
        className="flex items-center space-x-4"
        onClick={() => awayTeam.onClick?.(awayTeam.id)}
      >
        <div className="flex flex-col">
          <p>AWAY</p>
          <p className="font-bold">{awayTeam.name}</p>
        </div>
        <img
          className="sm:w-18 w-10 md:w-24"
          src={awayTeam.logo}
          alt={`${awayTeam.name} Logo`}
        />
      </div>
    </div>
  )
}

export default ScoreCard
