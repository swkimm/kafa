import axiosInstance from '@/commons/axios'
import type { LeagueWithAssociation } from '@/commons/interfaces/league/league'
import ConsoleCard from '@/components/cards/ConsoleCard'
import useNotification from '@/hooks/useNotification'
import { NotificationType } from '@/state/notificationState'
import { useEffect, useState } from 'react'
import LeagueList from './LeagueList'

const JoinableLeagues: React.FC = () => {
  const [joinableLeagues, setJoinalbleLeagues] = useState<
    LeagueWithAssociation[]
  >([])

  const { showNotification } = useNotification()

  const requestJoinLeague = async (leagueId: number) => {
    const validation = await axiosInstance
      .get('/leagues/rosters/validation')
      .then((response) => response.data)

    if (!validation.valid) {
      showNotification(
        NotificationType.Error,
        '로스터 인증 안됨',
        '로스터 인증서 검증 화면에서 확인해주세요',
        3000
      )

      return
    }

    await axiosInstance
      .post(`/leagues/${leagueId}/join`)
      .then(() => {
        showNotification(
          NotificationType.Success,
          '신청 성공',
          '리그 신청을 완료했습니다'
        )
      })
      .catch((error) => {
        if (error.response.status === 409) {
          showNotification(
            NotificationType.Error,
            '중복된 리그 신청',
            '이미 신청한 리그입니다',
            3000
          )
        } else {
          showNotification(
            NotificationType.Error,
            '신청 실패',
            '리그 참여를 신청하는 중 오류가 발생했습니다'
          )
        }
      })
  }

  useEffect(() => {
    const getJoinableLeagues = async () => {
      await axiosInstance
        .get(`/leagues/joinable`)
        .then((result: { data: LeagueWithAssociation[] }) => {
          result.data.forEach((league) => {
            league.startedAt = new Date(league.startedAt)
            league.endedAt = new Date(league.endedAt)
          })
          setJoinalbleLeagues(result.data)
        })
    }

    getJoinableLeagues()
  }, [])

  return (
    <div className="m-0 h-full w-full sm:p-5">
      <div className="text-md mb-5 px-4 pt-5 font-bold sm:px-0 sm:pt-0">
        로스터 관리
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-3">
          <ConsoleCard
            title="참여 가능한 리그 목록"
            subtitle="현재 팀에서 신청 가능한 리그 목록"
          >
            <LeagueList
              onRequest={requestJoinLeague}
              leagues={joinableLeagues}
            />
          </ConsoleCard>
        </div>
      </div>
    </div>
  )
}

export default JoinableLeagues
