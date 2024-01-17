import { printPosition } from '@/commons/functions/position/position.print'
import { RosterType } from '@/commons/interfaces/roster/roster'
import type { RosterWithTeam } from '@/commons/interfaces/roster/rosterWithTeam'

interface RosterListProps {
  rosters: RosterWithTeam[]
}

const RosterList: React.FC<RosterListProps> = ({ rosters }) => {
  return (
    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
        <div className="overflow-hidden border-2 border-gray-200/60 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200/60">
            <thead className="bg-gray-100">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-xs font-bold text-gray-900 sm:pl-6"
                >
                  #
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-xs font-bold text-gray-900"
                >
                  프로필
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-xs font-bold text-gray-900"
                >
                  팀
                </th>
                <th
                  scope="col"
                  className="py-3.5 pl-3 pr-4 text-left text-xs font-bold text-gray-900 sm:pr-6"
                >
                  포지션
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/60 bg-white">
              {rosters.map((roster) => (
                <tr key={roster.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs font-medium text-gray-900 sm:pl-6">
                    {roster.id}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">
                    <div className="flex items-center gap-x-4">
                      {roster.profileImgUrl ? (
                        <img
                          src={roster.profileImgUrl}
                          alt=""
                          className="h-8 w-8 rounded-full"
                        />
                      ) : null}
                      <p>{roster.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">
                    <div className="flex items-center gap-x-4">
                      {roster.Team.profileImgUrl ? (
                        <img
                          src={roster.Team.profileImgUrl}
                          alt=""
                          className="h-8 w-8 rounded-full"
                        />
                      ) : null}
                      <p>{roster.Team.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">
                    {roster.rosterType === RosterType.Athlete ? (
                      <>{printPosition(roster.Athlete?.position)}</>
                    ) : (
                      <>{roster.rosterType}</>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default RosterList
