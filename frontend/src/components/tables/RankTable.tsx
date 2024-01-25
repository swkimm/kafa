import type { LeagueRank } from '@/commons/interfaces/league/rank'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import type React from 'react'

interface RankTableProps {
  ranks: LeagueRank[]
}

const RankTable: React.FC<RankTableProps> = ({ ranks }) => {
  return (
    <div className="py-2.5">
      <div className="custom-scroll-bar -mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-xs text-gray-900 sm:pl-6 lg:pl-8"
                >
                  #
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-xs text-gray-900"
                >
                  TEAM
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-center text-xs text-gray-900"
                >
                  WIN
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-center text-xs text-gray-900"
                >
                  LOSE
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-center text-xs text-gray-900 sm:pr-8"
                >
                  DRAW
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {ranks.length > 0 ? (
                ranks.map((rank, index) => (
                  <tr key={rank.id} className="hover:bg-gray-100">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs font-medium text-gray-900 sm:pl-6 lg:pl-8">
                      {index + 1}
                    </td>
                    <td className="min-w-[100px] whitespace-nowrap px-3 py-4 text-xs text-gray-500">
                      <div className="flex flex-nowrap items-center gap-x-2">
                        {rank.profileImgUrl ? (
                          <img
                            src={rank.profileImgUrl}
                            alt="logo"
                            className="h-auto w-6"
                          />
                        ) : (
                          <img
                            src="/logo/KAFA_OG.png"
                            alt="logo"
                            className="h-auto w-6"
                          />
                        )}
                        <p>{rank.name}</p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-center text-xs text-gray-500">
                      {rank.win}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-center text-xs text-gray-500">
                      {rank.lose}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-center text-xs text-gray-500 sm:pr-8">
                      {rank.draw}
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="w-full">
                  <td
                    className="pt-3 text-sm font-medium text-gray-900"
                    colSpan={5}
                  >
                    <div className="mx-auto flex w-full items-center justify-center">
                      <ExclamationTriangleIcon className="h-6 w-6 pr-1.5 text-yellow-500" />
                      <p>랭킹 정보가 없습니다</p>
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

export default RankTable
