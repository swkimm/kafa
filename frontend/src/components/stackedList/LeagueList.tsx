// LeagueList.tsx
import type React from 'react'
import { useNavigate } from 'react-router-dom'

interface LeagueListProps {
  id: number
  name: string
  associationName: string
  startedAt: Date
  endedAt: Date
  onClick?: (id: number) => void
}

const LeagueList: React.FC<LeagueListProps> = ({
  id,
  name,
  associationName,
  startedAt,
  endedAt
}) => {
  const navigate = useNavigate()
  const isLeagueInProgress = () => {
    const today = new Date()
    const endDate = new Date(endedAt)

    const todayTimestamp = today.getTime()
    const endDateTimestamp = endDate.getTime()

    return endDateTimestamp >= todayTimestamp
  }
  const parseDate = (dateString: Date) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  const goToLeague = (id: number) => {
    navigate(`/leagues/${id}`)
  }

  return (
    <div className="border-b px-3">
      <div className="py-3">
        <div className="grid grid-cols-4 items-center">
          <div className="col-span-3">
            <div className="flex">
              <div className="font-bold">{name}</div>
              <div className="ml-3">
                {isLeagueInProgress() ? (
                  <button
                    type="button"
                    className="rounded-md border border-green-500 bg-green-200 px-2 text-sm font-semibold text-green-700 shadow-sm hover:bg-green-300"
                  >
                    진행중
                  </button>
                ) : (
                  <button
                    type="button"
                    className="rounded-md border border-red-500 bg-red-200 px-2 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-300"
                  >
                    종료됨
                  </button>
                )}
              </div>
            </div>
            <div>
              {parseDate(startedAt)} {'~'} {parseDate(endedAt)}{' '}
              {associationName}
            </div>
          </div>
          <div className="col-span-1 flex items-center justify-center">
            <button
              type="button"
              className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              onClick={() => goToLeague(id)}
            >
              바로가기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeagueList
