import {
  type ApplyLeagueInfo,
  LeagueApplyStatus
} from '@/commons/interfaces/league/getLeagues'

interface ApplyLeagueListProps {
  requests: ApplyLeagueInfo[]
  onReRequest: (leagueId: number) => void
}

const ApplyLeagueList: React.FC<ApplyLeagueListProps> = ({
  requests,
  onReRequest
}) => {
  const renderStatus = (status: LeagueApplyStatus) => {
    switch (status) {
      case LeagueApplyStatus.Hold:
        return (
          <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-800 ring-1 ring-inset ring-amber-600/20">
            보류
          </span>
        )
      case LeagueApplyStatus.Received:
        return (
          <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-800 ring-1 ring-inset ring-gray-600/20">
            접수
          </span>
        )
      case LeagueApplyStatus.Rejected:
        return (
          <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-800 ring-1 ring-inset ring-red-600/20">
            반려
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-800 ring-1 ring-inset ring-red-600/20">
            Error
          </span>
        )
    }
  }

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
                  #
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
                  신청 상태
                </th>
                <th
                  scope="col"
                  className="min-w-[200px] max-w-[320px] px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  사유
                </th>
                <th scope="col" className="relative py-3.5 pr-4 sm:pr-0">
                  <span className="sr-only">재신청</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {requests.map((request, index) => (
                <tr key={index}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                    {index + 1}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                    {request.League.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {renderStatus(request.applyStatus)}
                  </td>
                  <td className="min-w-[320px] max-w-[400px] px-3 py-4 text-sm leading-6 text-gray-500">
                    {request.rejectReason &&
                      request.applyStatus !== LeagueApplyStatus.Received && (
                        <p>{request.rejectReason}</p>
                      )}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pr-4 text-right text-sm font-medium sm:pr-0">
                    {request.applyStatus === LeagueApplyStatus.Hold && (
                      <div className="flex flex-row items-center justify-end gap-x-1">
                        <button
                          onClick={() => onReRequest(request.League.id)}
                          className="inline-flex items-center rounded-md bg-indigo-950 px-3 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-900 sm:text-sm"
                        >
                          재신청
                        </button>
                      </div>
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

export default ApplyLeagueList
