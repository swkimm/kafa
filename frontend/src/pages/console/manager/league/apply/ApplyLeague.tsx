import axiosInstance from '@/commons/axios'
import {
  LeagueApplyStatus,
  type ApplyLeagueInfo
} from '@/commons/interfaces/league/getLeagues'
import ConsoleCard from '@/components/cards/ConsoleCard'
import useNotification from '@/hooks/useNotification'
import { NotificationType } from '@/state/notificationState'
import { useEffect, useState } from 'react'
import ApplyLeagueList from './ApplyLeagueList'

const ApplyLeague: React.FC = () => {
  const [requests, setRequests] = useState<ApplyLeagueInfo[]>()
  const { showNotification } = useNotification()

  const onReRequest = async (leagueId: number) => {
    if (!requests) return

    await axiosInstance
      .post(`/leagues/${leagueId}/join/retry`)
      .then(() => {
        showNotification(
          NotificationType.Success,
          '재신청 성공',
          '리그를 다시 신청했습니다'
        )
        setRequests(
          requests.map((request) => {
            if (request.League.id !== leagueId) return request

            return {
              ...request,
              applyStatus: LeagueApplyStatus.Received
            }
          })
        )
      })
      .catch((error) => {
        if (error.response.status === 422) {
          showNotification(
            NotificationType.Error,
            '로스터 오류',
            '유효하지 않은 로스터가 있습니다. 로스터 인증서 검증 탭을 확인해주세요',
            3000
          )
        } else {
          showNotification(
            NotificationType.Error,
            '재신청 실패',
            '리그 신청 중 오류가 발생했습니다'
          )
        }
      })
  }

  useEffect(() => {
    const getLeagueApplyRequests = async () => {
      await axiosInstance
        .get('/leagues/requests')
        .then((result) => setRequests(result.data))
    }

    getLeagueApplyRequests()
  }, [])

  return (
    <div className="m-0 h-full w-full sm:p-5">
      <div className="text-md mb-5 px-4 pt-5 font-bold sm:px-0 sm:pt-0">
        리그 신청
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-3">
          <ConsoleCard
            title="신청한 리그 목록"
            subtitle="신청이 진행중인 리그 목록"
          >
            {requests && (
              <ApplyLeagueList onReRequest={onReRequest} requests={requests} />
            )}
          </ConsoleCard>
        </div>
      </div>
    </div>
  )
}

export default ApplyLeague
