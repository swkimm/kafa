import axiosInstance from '@/commons/axios'
import type { Gender } from '@/commons/interfaces/account/credential'
import type { RosterWithCredential } from '@/commons/interfaces/roster/rosterWithCredential'
import ConsoleCard from '@/components/cards/ConsoleCard'
import { useEffect, useState } from 'react'
import CreateRosterForm from './CreateRosterForm'
import RosterCredentialList from './RosterCredentialList'
import UpdateCredentialModal from './UpdateCredentialModal'

export const CreateRoster: React.FC = () => {
  const limit = 10
  const [page, setPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [targetRoster, setTargetRoster] = useState<RosterWithCredential>()
  const [rosters, setRosters] = useState<RosterWithCredential[]>()

  const closeModal = () => setIsModalOpen(false)

  const onRosterCreate = async (createdRoster: RosterWithCredential) => {
    if (!rosters) return

    setRosters([...rosters, createdRoster])
  }

  const onRosterUpdate = async (updatedRoster: {
    rosterId: number
    name: string
    birthday: string
    gender: Gender
  }) => {
    if (!rosters) return

    setRosters(
      rosters.map((roster) => {
        if (roster.id !== updatedRoster.rosterId) return roster

        return {
          ...roster,
          RosterCredentials: {
            name: updatedRoster.name,
            birthday: updatedRoster.birthday,
            gender: updatedRoster.gender
          }
        }
      })
    )
  }

  const onRosterClick = (roster: RosterWithCredential) => {
    setTargetRoster(roster)
    setIsModalOpen(true)
  }

  const getPreviousPage = async () => {
    if (page > 1) {
      await getUnconnectedRosters(page - 1)
      setPage(page - 1)
    }
  }

  const getNextPage = async () => {
    if (rosters && rosters.length >= limit) {
      await getUnconnectedRosters(page + 1)
      setPage(page + 1)
    }
  }

  const getUnconnectedRosters = async (page: number) => {
    await axiosInstance
      .get(`/rosters/unconnected?page=${page}&limit=${limit}`)
      .then((result: { data: RosterWithCredential[] }) => {
        setRosters(result.data)
      })
  }

  useEffect(() => {
    getUnconnectedRosters(page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {targetRoster && (
        <UpdateCredentialModal
          roster={targetRoster}
          closeModal={closeModal}
          isOpen={isModalOpen}
          onRosterUpdate={onRosterUpdate}
        />
      )}
      <div className="m-0 h-full w-full sm:p-5">
        <div className="text-md mb-5 px-4 pt-5 font-bold sm:px-0 sm:pt-0">
          로스터 생성
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-4 lg:col-span-2">
            <ConsoleCard title="로스터 생성" subtitle="신규 로스터 생성">
              <CreateRosterForm onRosterCreate={onRosterCreate} />
            </ConsoleCard>
          </div>
          <div className="col-span-4 lg:col-span-2">
            <ConsoleCard
              title="로스터 개인정보 관리"
              subtitle="아직 개인 계정에 연결되지 않은 로스터 관리"
            >
              {rosters && (
                <RosterCredentialList
                  onClick={onRosterClick}
                  rosters={rosters}
                />
              )}
              <div className="-mx-4 border-t border-gray-400 sm:mx-0"></div>
              <div className="mt-3 flex flex-row items-center justify-end gap-x-1">
                <button
                  onClick={getPreviousPage}
                  className="inline-flex items-center rounded-md bg-indigo-950 px-3.5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-900 sm:text-sm"
                >
                  이전
                </button>
                <button
                  onClick={getNextPage}
                  className="inline-flex items-center rounded-md bg-indigo-950 px-3.5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-900 sm:text-sm"
                >
                  다음
                </button>
              </div>
            </ConsoleCard>
          </div>
        </div>
      </div>
    </>
  )
}
