import { printPosition } from '@/commons/functions/position/position.print'
import { printRosterType } from '@/commons/functions/roster-type/roster-type.print'
import {
  RosterAvailability,
  type RosterWithAvailability
} from '@/commons/interfaces/roster/rosterAvaliablity'

interface RosterReportListProps {
  reports: RosterWithAvailability[]
}

const RosterReportList: React.FC<RosterReportListProps> = ({ reports }) => {
  const renderStatus = (status: RosterAvailability): React.ReactNode => {
    switch (status) {
      case RosterAvailability.Unverified:
        return (
          <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
            증명서 없음
          </span>
        )
      case RosterAvailability.Verified:
        return (
          <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
            증명서 있음
          </span>
        )
      case RosterAvailability.Exemption:
        return (
          <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
            증명서 면제
          </span>
        )
      default:
        return <div>Error</div>
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
                  이름
                </th>
                <th
                  scope="col"
                  className="whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  검증 결과
                </th>
                <th
                  scope="col"
                  className="whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  백넘버
                </th>
                <th
                  scope="col"
                  className="whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  포지션
                </th>
                <th
                  scope="col"
                  className="relative py-3.5 pr-4 text-left text-sm font-semibold text-gray-900 sm:pr-0"
                >
                  구분
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reports.map((report, index) => (
                <tr key={index}>
                  <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                    {index + 1}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                    <div className="flex flex-row items-center gap-x-2">
                      <div className="inline-block h-8 w-8 overflow-hidden rounded-full bg-gray-50 object-cover">
                        {report.profileImgUrl ? (
                          <img
                            className="h-full w-full object-cover"
                            src={report.profileImgUrl}
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
                      <p className="text-gray-500">{report.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                    {renderStatus(report.avaliability)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                    {report.backNumber ?? '-'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                    {report.position ? printPosition(report.position) : '-'}
                  </td>
                  <td className="relative whitespace-nowrap py-3 pr-4 text-left text-sm font-medium sm:pr-0">
                    <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                      {printRosterType(report.rosterType)}
                    </span>
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

export default RosterReportList
