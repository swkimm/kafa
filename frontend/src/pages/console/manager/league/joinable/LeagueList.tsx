import type { LeagueWithAssociation } from '@/commons/interfaces/league/league'

interface LeagueListProps {
  leagues: LeagueWithAssociation[]
  onRequest: (leagueId: number) => void
}

const LeagueList: React.FC<LeagueListProps> = ({ leagues, onRequest }) => {
  return (
    <div className="flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="whitespace-nowrap py-3.5 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  주관 협회
                </th>
                <th
                  scope="col"
                  className="whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  리그 이름
                </th>
                <th
                  scope="col"
                  className="whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  개회
                </th>
                <th
                  scope="col"
                  className="whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  폐회
                </th>
                <th scope="col" className="relative py-3.5 pr-4 sm:pr-0">
                  <span className="sr-only">신청</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leagues.map((league) => (
                <tr key={league.id}>
                  <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                    {league.id}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                    <div className="flex flex-row items-center gap-x-2">
                      <div className="inline-block h-auto max-h-10 w-8 overflow-hidden">
                        {league.Association.profileImgUrl ? (
                          <img
                            className="h-full w-full object-cover"
                            src={league.Association.profileImgUrl}
                          />
                        ) : (
                          <img
                            className="h-full w-full"
                            src="/logo/KAFA_OG.png"
                          />
                        )}
                      </div>
                      <p className="text-gray-500">{league.Association.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                    <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-700/10">
                      {league.name}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                    {league.startedAt.toLocaleDateString('ko')}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                    {league.endedAt.toLocaleDateString('ko')}
                  </td>
                  <td className="relative whitespace-nowrap py-3 pr-4 text-right text-sm font-medium sm:pr-0">
                    <div className="flex flex-row items-center justify-end gap-x-1">
                      <button
                        onClick={() => onRequest(league.id)}
                        className="inline-flex items-center rounded-md bg-indigo-950 px-3 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-900 sm:text-sm"
                      >
                        참가신청
                      </button>
                    </div>
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

export default LeagueList
