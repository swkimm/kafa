import axiosInstance from '@/commons/axios'
import type { Profile } from '@/commons/interfaces/account/profile'
import type { Roster } from '@/commons/interfaces/roster/roster'
import { RosterStatus } from '@/commons/interfaces/roster/rosterStatus'
import ConsoleCard from '@/components/cards/ConsoleCard'
import useNotification from '@/hooks/useNotification'
import { NotificationType } from '@/state/notificationState'
import { useEffect, useState } from 'react'
import RosterList from './RosterList'
import RosterTypeDropDown from './RosterTypeDropdown'
import SearchRosters from './SearchRoster'
import UpdateRosterModal from './UpdateRosterModal'

const ManageRoster: React.FC = () => {
  const limit = 10
  const [searchedRosters, setSearchedRosters] = useState<Roster[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [rosters, setRosters] = useState<Roster[]>([])
  const [profile, setProfile] = useState<Profile>()
  const [option, setOption] = useState<RosterStatus>(RosterStatus.Enable)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [targetId, setTargetId] = useState<number>()

  const [page, setPage] = useState(1)

  const getPreviousPage = async () => {
    if (rosters.length === limit) {
      await getRosters(page + 1, option)
      setPage(page + 1)
    }
  }

  const getNextPage = async () => {
    if (page > 1) {
      await getRosters(page - 1, option)
      setPage(page - 1)
    }
  }

  const onRosterUpdate = (updatedRoster: Roster) => {
    if (!rosters) return

    setRosters([
      ...rosters.filter((roster) => roster.id !== updatedRoster.id),
      updatedRoster
    ])
  }

  const { showNotification } = useNotification()

  const searchRosters = async (term: string) => {
    if (!profile) return
    if (!term) return

    setIsSearching(true)

    await axiosInstance
      .get(
        `/rosters/teams/${profile.teamId}/search?term=${term}&limit=${limit}`
      )
      .then((result: { data: Roster[] }) => {
        result.data.forEach(
          (roster) => (roster.registerYear = new Date(roster.registerYear))
        )
        setSearchedRosters(result.data)
      })

    setIsSearching(false)
  }

  const getRosters = async (page: number, option: RosterStatus) => {
    if (!profile) return

    await axiosInstance
      .get(
        `/rosters/teams/${profile.teamId}?page=${page}&limit=${limit}&option=${option}`
      )
      .then((result: { data: Roster[] }) => {
        result.data.forEach(
          (roster) => (roster.registerYear = new Date(roster.registerYear))
        )
        setRosters(result.data)
      })
  }

  const deleteRoster = async (id: number) => {
    await axiosInstance
      .delete(`/rosters/${id}`)
      .then((result) => {
        setRosters(rosters.filter((roster) => roster.id !== result.data.id))
        showNotification(
          NotificationType.Success,
          '삭제 성공',
          '로스터가 삭제되었습니다'
        )
      })
      .catch(() => {
        showNotification(
          NotificationType.Error,
          '오류 발생',
          '로스터를 삭제하는중 오류가 발생했습니다',
          2000
        )
      })
  }

  const onRosterOptionChange = async (option: RosterStatus) => {
    await getRosters(1, option)
    setPage(1)
    setOption(option)
  }

  const onRosterUpdateClick = (id: number) => {
    setTargetId(id)
    setIsUpdateModalOpen(true)
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
        .get(`/rosters/teams/${profile.teamId}?page=${page}&limit=${limit}`)
        .then((result: { data: Roster[] }) => {
          result.data.forEach(
            (roster) => (roster.registerYear = new Date(roster.registerYear))
          )
          setRosters(result.data)
        })
    }

    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="m-0 h-full w-full sm:p-5">
      {targetId && (
        <UpdateRosterModal
          onRosterUpdate={onRosterUpdate}
          closeModal={() => setIsUpdateModalOpen(false)}
          isModalOpen={isUpdateModalOpen}
          rosterId={targetId}
        />
      )}
      <div className="text-md mb-5 px-4 pt-5 font-bold sm:px-0 sm:pt-0">
        로스터 관리
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-3">
          <ConsoleCard
            title="로스터 명단"
            subtitle="팀에 등록된 로스터 명단"
            detailedMore={
              <RosterTypeDropDown onChange={onRosterOptionChange} />
            }
          >
            <div className="flex flex-col gap-y-3">
              <RosterList
                onUpdateClick={onRosterUpdateClick}
                onRosterDelete={deleteRoster}
                rosters={rosters}
              />
              <div className="-mx-4 border-t border-gray-400 sm:mx-0"></div>
              <div className="flex flex-row items-center justify-end gap-x-1">
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
            </div>
          </ConsoleCard>
        </div>
        <div className="col-span-3">
          <ConsoleCard
            title="로스터 검색"
            subtitle="최대 10개까지 표시됩니다"
            detailedMore={
              <SearchRosters onSearch={searchRosters} disabled={isSearching} />
            }
          >
            <div className="flex flex-col gap-y-3">
              <RosterList
                onUpdateClick={onRosterUpdateClick}
                onRosterDelete={deleteRoster}
                rosters={searchedRosters}
              />
            </div>
          </ConsoleCard>
        </div>
      </div>
    </div>
  )
}

export default ManageRoster
