// ScoreCard.tsx
import type React from 'react'

interface TeamInfo {
  id: number
  profileImgUrl: string
  name: string
  onClick?: (id: number) => void
}

interface ScoreInfo {
  homeTeamScore: number
  awayTeamScore: number
}

interface ScoreCardProps {
  startedAt: string
  stadium: string
  homeTeam: TeamInfo
  awayTeam: TeamInfo
  score: ScoreInfo
}

const ScoreCard: React.FC<ScoreCardProps> = ({
  startedAt,
  stadium,
  homeTeam,
  awayTeam,
  score
}) => {
  return (
    <div className="grid grid-cols-10 items-center justify-between p-2 sm:p-8">
      {homeTeam.profileImgUrl ? (
        <img
          className="sm:w-18 col-span-1 w-10 md:w-24"
          src={homeTeam.profileImgUrl}
          alt={`${homeTeam.name} Logo`}
        />
      ) : (
        <img
          src="/logo/KAFA_OG.png"
          alt=""
          className="sm:w-18 col-span-1 w-10 md:w-24"
        />
      )}
      <div className="col-span-1">
        <p className="hidden sm:block">HOME</p>
        <p className="hidden font-bold sm:block">{homeTeam.name}</p>
      </div>

      <div className="col-span-1 text-xl font-extrabold sm:text-3xl">
        {score.homeTeamScore}
      </div>
      <div className="col-span-1 flex justify-end">
        {score.homeTeamScore > score.awayTeamScore && (
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
        <p>{startedAt}</p>
        <p className="hidden sm:block">{stadium}</p>
      </div>
      <div className="col-span-1 flex justify-start">
        {score.awayTeamScore > score.homeTeamScore && (
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
        {score.awayTeamScore}
      </div>

      <div className="col-span-1 flex flex-col">
        <p className="hidden sm:block">AWAY</p>
        <p className="hidden font-bold sm:block">{awayTeam.name}</p>
      </div>
      {awayTeam.profileImgUrl ? (
        <img
          className="sm:w-18 col-span-1 w-10 md:w-24"
          src={awayTeam.profileImgUrl}
          alt={`${awayTeam.name} Logo`}
        />
      ) : (
        <img
          src="/logo/KAFA_OG.png"
          alt=""
          className="sm:w-18 col-span-1 w-10 md:w-24"
        />
      )}
    </div>
  )
}

export default ScoreCard
