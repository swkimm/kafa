import {
  type RegisterTeamRequest,
  TeamRequestStatus
} from '@/commons/interfaces/team/team-request'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface CreateTeamListProps {
  requests: RegisterTeamRequest[]
}

export const CreatTeamList: React.FC<CreateTeamListProps> = ({ requests }) => {
  const renderStatus = (status: TeamRequestStatus) => {
    switch (status) {
      case TeamRequestStatus.Approved:
        return (
          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
            승인
          </span>
        )
      case TeamRequestStatus.Rejected:
        return (
          <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
            반려
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
            접수
          </span>
        )
    }
  }

  return (
    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th
                  scope="col"
                  className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-xs font-bold text-gray-900 sm:pl-6"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="whitespace-nowrap px-3 py-3.5 text-left text-xs font-bold text-gray-900"
                >
                  팀 이름
                </th>
                <th
                  scope="col"
                  className="whitespace-nowrap px-3 py-3.5 text-left text-xs font-bold text-gray-900"
                >
                  팀 계정 아이디
                </th>
                <th
                  scope="col"
                  className="whitespace-nowrap px-3 py-3.5 text-left text-xs font-bold text-gray-900"
                >
                  상태
                </th>
                <th
                  scope="col"
                  className="whitespace-nowrap py-3.5 pl-3 pr-4 text-left text-xs font-bold text-gray-900 sm:pr-6"
                >
                  신청 날짜
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/60 bg-white">
              {requests.length > 0 ? (
                requests.map((request) => (
                  <tr key={request.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs font-medium text-gray-900 sm:pl-6">
                      {request.id}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">
                      <p>{request.data.name}</p>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">
                      <p>{request.username}</p>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">
                      <p>{renderStatus(request.status)}</p>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">
                      <p>{request.createdAt.toLocaleString('ko')}</p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="w-full">
                  <td
                    className="py-3 text-sm font-medium text-gray-900"
                    colSpan={5}
                  >
                    <div className="mx-auto flex w-full items-center justify-center">
                      <ExclamationTriangleIcon className="h-6 w-6 pr-1.5 text-yellow-500" />
                      <p>팀을 생성하지 않았습니다</p>
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
