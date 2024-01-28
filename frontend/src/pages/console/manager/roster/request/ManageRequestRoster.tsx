import axiosInstance from '@/commons/axios'
import type { Profile } from '@/commons/interfaces/account/profile'
import type { Roster } from '@/commons/interfaces/roster/roster'
import ConsoleCard from '@/components/cards/ConsoleCard'
import { useDate } from '@/hooks/useDate'
import useNotification from '@/hooks/useNotification'
import { NotificationType } from '@/state/notificationState'
import { useEffect, useState } from 'react'
import RosterRequestList from './RosterRequestList'

const ManageRequestRoster: React.FC = () => {
  const [rosters, setRosters] = useState<Roster[]>([])
  const [profile, setProfile] = useState<Profile>()
  const [isFetching, setIsFetching] = useState(false)

  const { showNotification } = useNotification()

  const { parseUTCDate, formatDate } = useDate()

  const onApprove = async (rosterId: number) => {
    if (!profile) return

    setIsFetching(true)

    await axiosInstance
      .post(`/rosters/${rosterId}/approve`)
      .then(() => {
        showNotification(
          NotificationType.Success,
          '승인',
          '로스터 요청이 승인되었습니다'
        )
        setRosters(rosters.filter((roster) => roster.id !== rosterId))
      })
      .catch(() =>
        showNotification(
          NotificationType.Error,
          '승인 실패',
          '로스터를 승인하는 중 오류가 발생했습니다'
        )
      )

    setIsFetching(false)
  }

  const onReject = async (rosterId: number) => {
    if (!profile) return

    setIsFetching(true)

    await axiosInstance
      .post(`/rosters/${rosterId}/reject`)
      .then(() => {
        showNotification(
          NotificationType.Success,
          '반려',
          '로스터 요청이 반려되었습니다'
        )
        setRosters(rosters.filter((roster) => roster.id !== rosterId))
      })
      .catch(() =>
        showNotification(
          NotificationType.Error,
          '반려 실패',
          '로스터를 반려하는 중 오류가 발생했습니다'
        )
      )

    setIsFetching(false)
  }

  useEffect(() => {
    const init = async () => {
      const profile: Profile = await axiosInstance
        .get('/account/profile')
        .then((result) => {
          setProfile(result.data)
          return result.data
        })

      if (!profile) return

      await axiosInstance
        .get(
          `/rosters/teams/${profile.teamId}?page=1&limit=20&option=Verifying`
        )
        .then((result: { data: Roster[] }) => {
          result.data.forEach(
            (roster) =>
              (roster.registerYear = formatDate(
                parseUTCDate(roster.registerYear),
                'YYYY'
              ))
          )
          setRosters(result.data)
        })
    }

    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="m-0 h-full w-full sm:p-5">
      <div className="text-md mb-5 px-4 pt-5 font-bold sm:px-0 sm:pt-0">
        로스터 연결 요청
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-3">
          <ConsoleCard
            title="로스터 신청 목록"
            subtitle="팀에 접수된 로스터 신청 목록"
          >
            <div className="flex flex-col gap-y-3">
              <RosterRequestList
                onApprove={onApprove}
                onReject={onReject}
                rosters={rosters}
                disabled={isFetching}
              />
            </div>
          </ConsoleCard>
        </div>
      </div>
    </div>
  )
}

export default ManageRequestRoster
