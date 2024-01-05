import axiosInstance from '@/commons/axios'
import type { AthleteInfo } from '@/commons/interfaces/roster/roster'
import type { RosterWithTeam } from '@/commons/interfaces/roster/rosterWithTeam'
import RequestCreateRosterModal from '@/components/modal/RequestCreateRosterModal'
import { UserCircleIcon } from '@heroicons/react/20/solid'
import { useCallback, useEffect, useState } from 'react'

const LoadRoster = () => {
  const [connectable, setConnectable] = useState<RosterWithTeam[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const getConnectableRosters = useCallback(async () => {
    try {
      const response =
        await axiosInstance.get<RosterWithTeam[]>(`/rosters/connectable`)
      setConnectable(response.data)
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }, [])

  useEffect(() => {
    getConnectableRosters()
  }, [getConnectableRosters])

  const renderPosition = (athlete: AthleteInfo | undefined) => {
    if (!athlete) return 'No Position'

    const formatPositions = (position: string | string[]) => {
      return Array.isArray(position) ? position.join(', ') : position
    }

    const positions = []
    if (athlete.position.offence)
      positions.push(`${formatPositions(athlete.position.offence)}`)
    if (athlete.position.defense)
      positions.push(`${formatPositions(athlete.position.defense)}`)
    if (athlete.position.special)
      positions.push(`${formatPositions(athlete.position.special)}`)

    return positions.length > 0 ? positions.join('/') : 'Position Not Specified'
  }

  const connectRoster = async (id: number) => {
    try {
      const response = await axiosInstance.post(`/rosters/${id}/connect`)
      console.log(response.data)
      getConnectableRosters()
    } catch (error) {
      console.log(error)
    }
  }

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <div className="m-5">
      <div className="flex justify-between">
        <h2 className="mb-5 text-lg font-bold text-gray-800">
          로스터 불러오기
        </h2>
        <div>
          <button
            type="button"
            onClick={openModal}
            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            로스터 생성
          </button>
        </div>
      </div>
      {connectable.length > 0 ? (
        connectable.map((roster) => (
          <div
            className="px-18 mb-4 grid grid-cols-4 items-center rounded-lg bg-white p-4 shadow-lg"
            key={roster.id}
          >
            <div className="flex justify-center">
              {roster.profileImgUrl ? (
                <img
                  src={roster.profileImgUrl}
                  alt={roster.name}
                  className="h-24 w-24 rounded-full object-cover shadow-sm"
                />
              ) : (
                <UserCircleIcon className="h-24 w-24 text-gray-400" />
              )}
            </div>
            <div className="flex flex-col justify-center">
              <div className="text-gray-600">
                팀명: <span className="text-gray-800">{roster.Team.name}</span>
              </div>
              <div className="text-gray-600">
                이름: <span className="text-gray-800">{roster.name}</span>
              </div>
              <div className="text-gray-600">
                구분: <span className="text-gray-800">{roster.rosterType}</span>
              </div>
              <div className="text-gray-600">
                포지션:
                <span className="text-gray-800">
                  {renderPosition(roster.Athlete)}
                </span>
              </div>
              <div className="text-gray-600">
                백넘버:
                <span className="text-gray-800">
                  {roster.Athlete?.backNumber}
                </span>
              </div>
              <div className="col-span-2 flex justify-center"></div>
            </div>
            <button
              type="button"
              onClick={() => connectRoster(roster.id)}
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              연결하기
            </button>
          </div>
        ))
      ) : (
        <div className="flex items-center justify-center rounded-lg bg-white p-8 shadow-lg">
          <span className="text-gray-800">불러올 데이터가 없습니다.</span>
        </div>
      )}

      <RequestCreateRosterModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  )
}

export default LoadRoster
