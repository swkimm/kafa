import type { TeamSimple } from '@/commons/interfaces/team/teamSimple'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface TeamSearchResultListProps {
  teams: TeamSimple[]
  onSelect: (team: TeamSimple) => void
}

const TeamSearchResultList: React.FC<TeamSearchResultListProps> = ({
  teams,
  onSelect
}) => {
  return (
    <>
      {teams.length > 0 ? (
        <ul role="list" className="divide-y divide-gray-100">
          {teams.map((team) => (
            <li
              key={team.id}
              className="flex items-center justify-between gap-x-6 py-5"
            >
              <div className="flex min-w-0 items-center gap-x-4">
                {team.profileImgUrl ? (
                  <img
                    className="h-8 w-8 flex-none object-cover"
                    src={team.profileImgUrl}
                    alt=""
                  />
                ) : (
                  <img className="h-8 w-auto" src="/logo/KAFA_OG.png" alt="" />
                )}
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    {team.name}
                  </p>
                  <p className="-mt-1 text-xs leading-5 text-gray-500">
                    {team.globalName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onSelect(team)}
                className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                선택
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <ul role="list" className="divide-gray-100 pb-5">
          <li>
            <div className="flex flex-row items-center justify-center text-sm font-semibold">
              <ExclamationTriangleIcon className="h-8 w-8 pr-1.5 text-yellow-500" />
              <p className="-mt-1">검색 결과가 없습니다</p>
            </div>
          </li>
        </ul>
      )}
    </>
  )
}

export default TeamSearchResultList
