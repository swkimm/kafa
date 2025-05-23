import type { GameMany } from '@/commons/interfaces/game/game'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import type React from 'react'

interface GameTableProps {
  games: GameMany[]
  detail?: boolean
  onClick?: (id: number) => void
}

const GameTable: React.FC<GameTableProps> = ({
  games,
  detail,
  onClick = () => []
}) => {
  return (
    <div className="flow-root py-2.5">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-xs text-gray-900 sm:pl-6 lg:pl-8"
                >
                  LEAGUE
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-xs text-gray-900"
                >
                  NAME
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-xs text-gray-900"
                >
                  HOME
                </th>
                <th scope="col" className="sr-only">
                  HomTeamScore
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-xs text-gray-900"
                >
                  AWAY
                </th>
                <th scope="col" className="sr-only">
                  AwayTeamScore
                </th>
                {detail && (
                  <>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-xs text-gray-900"
                    >
                      KICKOFF
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-xs text-gray-900"
                    >
                      STADIUM
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {games.length > 0 ? (
                games.map((game) => (
                  <tr
                    key={game.id}
                    className="hover:bg-gray-100"
                    onClick={() => onClick(game.id)}
                  >
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs font-medium text-gray-900 sm:pl-6 lg:pl-8">
                      {game.League.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">
                      {game.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">
                      <div className="flex items-center">
                        <div className="h-auto w-6 flex-shrink-0">
                          {game.homeTeam.profileImgUrl ? (
                            <img
                              src={game.homeTeam.profileImgUrl}
                              alt="logo"
                              className="h-auto w-6 object-contain"
                            />
                          ) : (
                            <img
                              src="/logo/KAFA_OG.png"
                              alt="logo"
                              className="h-auto w-6 object-contain"
                            />
                          )}
                        </div>
                        <div className="ml-2">
                          <p className="hidden sm:block">
                            {game.homeTeam.name}
                          </p>
                          <p className="block sm:hidden">
                            {game.homeTeam.initial}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap py-4 pl-0.5 pr-2 text-xs text-gray-500">
                      {game.score ? (
                        <p className="font-medium text-gray-900">
                          {game.score.homeTeamScore}
                        </p>
                      ) : (
                        <p className="font-medium text-gray-900">-</p>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">
                      <div className="flex items-center">
                        <div className="h-auto w-6 flex-shrink-0">
                          {game.awayTeam.profileImgUrl ? (
                            <img
                              src={game.awayTeam.profileImgUrl}
                              alt="logo"
                              className="h-auto w-6 object-contain"
                            />
                          ) : (
                            <img
                              src="/logo/KAFA_OG.png"
                              alt="logo"
                              className="h-auto w-6 object-contain"
                            />
                          )}
                        </div>
                        <div className="ml-2">
                          <p className="hidden sm:block">
                            {game.awayTeam.name}
                          </p>
                          <p className="block sm:hidden">
                            {game.awayTeam.initial}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td
                      className={`whitespace-nowrap py-4 pl-0.5 text-xs text-gray-500 ${detail ? '' : 'pr-16'}`}
                    >
                      {game.score ? (
                        <p className="font-medium text-gray-900">
                          {game.score.awayTeamScore}
                        </p>
                      ) : (
                        <p className="font-medium text-gray-900">-</p>
                      )}
                    </td>
                    {detail && (
                      <>
                        <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">
                          {game.startedAt}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 pr-16 text-xs text-gray-500">
                          {game.stadium}
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr className="w-full">
                  <td
                    className="pt-3 text-sm font-medium text-gray-900"
                    colSpan={detail ? 9 : 7}
                  >
                    <div className="mx-auto flex w-full items-center justify-center">
                      <ExclamationTriangleIcon className="h-6 w-6 pr-1.5 text-yellow-500" />
                      <p>경기 목록이 없습니다</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default GameTable
