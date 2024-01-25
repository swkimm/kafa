import { printRosterType } from '@/commons/functions/roster-type/roster-type.print'
import { Gender } from '@/commons/interfaces/account/credential'
import { RosterStatus } from '@/commons/interfaces/roster/rosterStatus'
import type { RosterWithCredential } from '@/commons/interfaces/roster/rosterWithCredential'
import { PencilIcon } from '@heroicons/react/24/outline'

interface RosterCredentialListProps {
  rosters: RosterWithCredential[]
  onClick: (roster: RosterWithCredential) => void
}

const RosterCredentialList: React.FC<RosterCredentialListProps> = ({
  rosters,
  onClick
}) => {
  const renderStatus = (option: RosterStatus) => {
    switch (option) {
      case RosterStatus.Disable:
        return (
          <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
            비활성
          </span>
        )
      case RosterStatus.Enable:
        return (
          <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/10">
            활성
          </span>
        )
      case RosterStatus.Graduate:
        return (
          <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-600/10">
            동문
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="-mt-3 flow-root">
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
                  프로필
                </th>
                <th
                  scope="col"
                  className="whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  구분
                </th>
                <th
                  scope="col"
                  className="whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  실명
                </th>
                <th
                  scope="col"
                  className="whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  생년월일
                </th>
                <th
                  scope="col"
                  className="whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  성별
                </th>
                <th
                  scope="col"
                  className="whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  상태
                </th>
                <th scope="col" className="relative py-3.5 pr-4 sm:pr-0">
                  <span className="sr-only">관리</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rosters.map((roster) => (
                <tr key={roster.id}>
                  <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                    {roster.id}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                    <div className="flex flex-row items-center gap-x-2">
                      <div className="inline-block h-8 w-8 overflow-hidden rounded-full bg-gray-50">
                        {roster.profileImgUrl ? (
                          <img
                            className="h-full w-full object-cover"
                            src={roster.profileImgUrl}
                          />
                        ) : (
                          <svg
                            className="h-full w-full text-gray-300"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        )}
                      </div>
                      <p className="text-gray-500">{roster.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                    <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                      {printRosterType(roster.rosterType)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                    {roster.RosterCredentials.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                    {roster.RosterCredentials.birthday}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                    {roster.RosterCredentials.gender === Gender.Male
                      ? '남성'
                      : '여성'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                    {renderStatus(roster.status)}
                  </td>
                  <td className="relative whitespace-nowrap py-3 pr-4 text-right text-sm font-medium sm:pr-0">
                    <div className="flex flex-row items-center justify-end gap-x-1">
                      <button
                        onClick={() => onClick(roster)}
                        className="inline-flex items-center rounded-md bg-amber-500 px-3 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-amber-600 sm:text-sm"
                      >
                        <PencilIcon className="mr-1 h-4 w-4" />
                        수정
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

export default RosterCredentialList
