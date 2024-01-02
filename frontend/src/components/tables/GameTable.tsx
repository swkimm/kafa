// GameTable.tsx
import type { ExtendedGame } from '@/pages/huddle/items/HomeItem'
import type React from 'react'
import { useNavigate } from 'react-router-dom'

interface GameTableProps {
  title: string
  games: ExtendedGame[]
}

const GameTable: React.FC<GameTableProps> = ({ title, games }) => {
  const navigate = useNavigate()
  const goToTeam = (leagueId: number, teamId: number) => {
    navigate(`/league/${leagueId}/team/${teamId}`)
  }

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString)
    const formatter = new Intl.DateTimeFormat('ko-KR', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
    return formatter.format(date).replace(/,/g, '').replace(/\./g, '')
  }
  return (
    <div className="border bg-white">
      <div className="border sm:flex sm:items-center">
        <div className="border-b border-l-8 border-l-black p-5 sm:flex-auto">
          <div className="flex items-center justify-between border-black text-base font-semibold leading-6 text-gray-900">
            <div className="">{title}</div>
          </div>
        </div>
      </div>
      <div>
        {games.map((game) => (
          <div key={game.id} className="border-b">
            <div className="p-2">
              <div className="flex items-center justify-between p-2">
                <div className="flex">{game.leagueInfo?.name}</div>
                <div className="flex">{formatDate(game.startedAt)}</div>
              </div>
              <div className="flex items-center justify-between p-2">
                <div
                  className="flex cursor-pointer"
                  onClick={() => {
                    if (game.leagueId && game.homeTeamInfo?.id) {
                      goToTeam(game.leagueId, game.homeTeamInfo.id)
                    }
                  }}
                >
                  {game.homeTeamInfo?.profileImgUrl !== null ? (
                    <img
                      src={game.homeTeamInfo?.profileImgUrl}
                      alt={`${game.homeTeamInfo?.name}`}
                      className="mr-2 h-6" // add some margin-right and control height if needed
                    />
                  ) : (
                    <img src="/logo/KAFA_OG.png" alt="" className="mr-2 h-6" />
                  )}
                  <div className="ml-3">{game.homeTeamInfo?.name}</div>
                </div>
                <div>{game.scoreInfo?.homeTeamScore}</div>
              </div>
              <div className="flex items-center justify-between p-2">
                <div
                  className="flex cursor-pointer"
                  onClick={() => {
                    if (game.leagueId && game.awayTeamInfo?.id) {
                      goToTeam(game.leagueId, game.awayTeamInfo.id)
                    }
                  }}
                >
                  {game.awayTeamInfo?.profileImgUrl !== null ? (
                    <img
                      src={game.awayTeamInfo?.profileImgUrl}
                      alt={`${game.awayTeamInfo?.name}`}
                      className="mr-2 h-6"
                    />
                  ) : (
                    <img src="/logo/KAFA_OG.png" alt="" className="mr-2 h-6" />
                  )}
                  <div className="ml-3">{game.awayTeamInfo?.name}</div>
                </div>
                <div>{game.scoreInfo?.awayTeamScore}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GameTable
