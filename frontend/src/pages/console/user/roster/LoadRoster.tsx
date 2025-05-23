import axiosInstance from '@/commons/axios'
import type { Roster } from '@/commons/interfaces/roster/roster'
import ConsoleCard from '@/components/cards/ConsoleCard'
import RosterCard from '@/components/cards/RosterCard'
import ModalContainer from '@/components/modal/ModalContainer'
import useNotification from '@/hooks/useNotification'
import { NotificationType } from '@/state/notificationState'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { AxiosError } from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CreateRosterModal from './CreateRosterModal'

const LoadRoster = () => {
  const [rosters, setRosters] = useState<Roster[]>([])
  const [connectable, setConnectable] = useState<Roster[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const navigate = useNavigate()
  const { showNotification } = useNotification()

  const getConnectableRosters = useCallback(async () => {
    try {
      const response = await axiosInstance.get<Roster[]>(`/rosters/connectable`)
      setConnectable(response.data)
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 403) {
        showNotification(
          NotificationType.Error,
          '개인정보 없음',
          '로스터 관련 기능은 본인인증 후 이용 가능합니다',
          5000
        )
        navigate('/console')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getRosters = useCallback(async () => {
    const rosters: Roster[] = await axiosInstance
      .get('/rosters/account')
      .then((result) => result.data)

    setRosters(rosters)
  }, [])

  useEffect(() => {
    getConnectableRosters()
    getRosters()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const connectRoster = async (id: number) => {
    try {
      const connectedRoster: Roster = await axiosInstance
        .post(`/rosters/${id}/connect`)
        .then((result) => result.data)

      setConnectable(
        connectable.filter((item) => item.id !== connectedRoster.id)
      )

      showNotification(
        NotificationType.Success,
        '연결 성공',
        '현재 계정에 로스터가 연결되었습니다'
      )
    } catch (error) {
      showNotification(
        NotificationType.Error,
        '연결 실패',
        '로스터 연결 과정에서 오류가 발생했습니다'
      )
    }
  }

  return (
    <div className="flex flex-col gap-y-3 sm:px-4">
      <ModalContainer isOpen={isModalOpen}>
        <CreateRosterModal closeModal={() => setIsModalOpen(false)} />
      </ModalContainer>
      <div className="flex items-center justify-between px-4 pt-3 sm:px-0">
        <h2 className="text-base font-bold text-gray-800 sm:px-0">
          로스터 관리
        </h2>
        <div>
          <button
            className="rounded-md bg-indigo-950 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-900"
            onClick={() => setIsModalOpen(true)}
          >
            로스터 생성
          </button>
        </div>
      </div>
      <ConsoleCard
        title={'연결 가능한 로스터'}
        subtitle={'개인정보가 일치하는 로스터 목록입니다'}
      >
        <div className="grid grid-cols-10 gap-x-3">
          {connectable.length > 0 ? (
            connectable.map((roster) => (
              <div
                key={roster.id}
                className="col-span-5 sm:col-span-4 md:col-span-3 lg:col-span-2"
              >
                <RosterCard roster={roster} />
                <button
                  type="button"
                  onClick={() => connectRoster(roster.id)}
                  className="mt-5 rounded-md bg-indigo-950 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-900"
                >
                  연결하기
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-10 flex w-full flex-row items-center justify-center">
              <ExclamationTriangleIcon className="mr-1.5 h-6 w-6 text-red-500" />
              <p className="text-xs font-medium text-gray-900 sm:text-sm">
                계정에 연결할 수 있는 로스터가 없습니다
              </p>
            </div>
          )}
        </div>
      </ConsoleCard>
      <ConsoleCard
        title={'연결된 로스터'}
        subtitle={'현재 계정과 연결된 로스터 목록입니다'}
      >
        <div className="grid grid-cols-10 gap-x-3">
          {rosters.length > 0 ? (
            rosters.map((roster) => (
              <div
                key={roster.id}
                className="col-span-5 sm:col-span-4 md:col-span-3 lg:col-span-2"
              >
                <RosterCard roster={roster} />
              </div>
            ))
          ) : (
            <div className="col-span-10 flex w-full flex-row items-center justify-center">
              <ExclamationTriangleIcon className="mr-1.5 h-6 w-6 text-red-500" />
              <p className="text-xs font-medium text-gray-900 sm:text-sm">
                계정에 연결된 로스터가 없습니다
              </p>
            </div>
          )}
        </div>
      </ConsoleCard>
    </div>
  )
}

export default LoadRoster
