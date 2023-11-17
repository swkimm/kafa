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
    <div className="grid grid-cols-10 items-center justify-between p-2 sm:p-8">
      <img
        className="sm:w-18 col-span-1 w-10 md:w-24"
        src={homeTeam.logo}
        alt={`${homeTeam.name} Logo`}
      />
      <div className="col-span-1">
        <p className="hidden sm:block">HOME</p>
        <p className="hidden font-bold sm:block">{homeTeam.name}</p>
      </div>

      <div className="col-span-1 text-xl font-extrabold sm:text-3xl">
        {homeTeam.score}
      </div>
      <div className="col-span-1 flex justify-end">
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
      </div>
      <div className="col-span-2 flex flex-col items-center">
        <p>{gameId}경기</p>
        <p>{matchDay}</p>
        <p className="hidden sm:block">{stadium}</p>
      </div>
      <div className="col-span-1 flex justify-start">
        {awayTeam.score > homeTeam.score && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className=" h-6 w-6"
          >
            <path
              fillRule="evenodd"
              d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
      <div className="col-span-1 text-xl font-extrabold sm:text-3xl">
        {awayTeam.score}
      </div>

      <div className="col-span-1 flex flex-col">
        <p className="hidden sm:block">AWAY</p>
        <p className="hidden font-bold sm:block">{awayTeam.name}</p>
      </div>
      <img
        className="sm:w-18 col-span-1 w-10 md:w-24"
        src={awayTeam.logo}
        alt={`${awayTeam.name} Logo`}
      />
    </div>
  )
}

export default ScoreCard
