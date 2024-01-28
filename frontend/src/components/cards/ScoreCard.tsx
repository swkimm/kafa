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
  score?: ScoreInfo
  onClick: (id: number) => void
}

const ScoreCard: React.FC<ScoreCardProps> = ({
  startedAt,
  stadium,
  homeTeam,
  awayTeam,
  score,
  onClick
}) => {
  return (
    <div className="grid min-h-32 grid-cols-10 items-center justify-between gap-x-2 p-2 sm:p-8">
      <button onClick={() => onClick(homeTeam.id)}>
        {homeTeam.profileImgUrl ? (
          <img
            className="sm:w-18 col-span-1 mx-auto h-auto w-10 object-contain md:w-24"
            src={homeTeam.profileImgUrl}
            alt={`${homeTeam.name} Logo`}
          />
        ) : (
          <img
            src="/logo/KAFA_OG.png"
            alt=""
            className="sm:w-18 col-span-1 mx-auto h-auto w-10 object-contain md:w-24"
          />
        )}
      </button>

      <div className="col-span-1 hidden items-start sm:flex sm:flex-col">
        <p className="text-sm font-medium text-gray-400">HOME</p>
        <p className="font-bold">{homeTeam.name}</p>
      </div>

      <div className="col-span-1 text-center text-xl font-extrabold sm:text-3xl">
        {score && score.homeTeamScore}
      </div>
      <div className="col-span-1 flex justify-center">
        {score && score.homeTeamScore > score.awayTeamScore && (
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
      <div className="col-span-4 flex flex-col items-center text-center text-[14px] font-medium text-gray-900 sm:col-span-2 sm:text-base">
        <p className="max-w-24 sm:max-w-full">{startedAt}</p>
        <p className="text-gray-400">{stadium}</p>
      </div>
      <div className="col-span-1 flex justify-center">
        {score && score.awayTeamScore > score.homeTeamScore && (
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
      <div className="col-span-1 text-center text-xl font-extrabold sm:text-3xl">
        {score && score.awayTeamScore}
      </div>

      <div className="col-span-1 hidden items-end sm:flex sm:flex-col">
        <p className="text-sm font-medium text-gray-400">AWAY</p>
        <p className="font-bold">{awayTeam.name}</p>
      </div>
      <button onClick={() => onClick(awayTeam.id)}>
        {awayTeam.profileImgUrl ? (
          <img
            className="sm:w-18 col-span-1 mx-auto h-auto w-10 object-contain md:w-24"
            src={awayTeam.profileImgUrl}
            alt={`${awayTeam.name} Logo`}
          />
        ) : (
          <img
            src="/logo/KAFA_OG.png"
            alt=""
            className="sm:w-18 col-span-1 mx-auto h-auto w-10 object-contain md:w-24"
          />
        )}
      </button>
    </div>
  )
}

export default ScoreCard
