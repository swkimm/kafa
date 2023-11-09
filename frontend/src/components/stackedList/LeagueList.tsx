// LeagueList.tsx
import type React from 'react'
import Button from '../buttons/Button'

interface LeagueListProps {
  leagueId: number
  leagueName: string
  status: string
  conference: string
  period: string
  isInProgress?: (status: string) => boolean
  onClick: (leagueId: number) => void // 필수 프로퍼티로 변경
}

const LeagueList: React.FC<LeagueListProps> = ({
  leagueId,
  leagueName,
  status,
  conference,
  period,
  isInProgress: isInProgressProp = () => false,
  onClick
}) => {
  const handleOnClick = () => {
    onClick(leagueId) // 필수 프로퍼티이므로 바로 호출
  }

  const isLeagueInProgress = () => {
    if (status === '진행중') {
      return true
    } else if (status === '종료됨') {
      return false
    }
    return isInProgressProp(status)
  }

  return (
    <div className="border-b px-3">
      <div className="py-1">
        <div
          className="flex items-center justify-between"
          onClick={handleOnClick}
        >
          <div className="flex">
            <div className="font-bold">{leagueName}</div>
            <div className="pl-1">
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
          <Button
            variant="outlineWithDarkHover"
            label="바로가기"
            onClick={handleOnClick}
          />
        </div>
        <div className="mb-2">
          {period} {conference}
        </div>
      </div>
    </div>
  )
}

export default LeagueList
