import axiosInstance from '@/commons/axios'
import { RosterType, type Roster } from '@/commons/interfaces/roster/roster'
import MainCard from '@/components/cards/MainCard'
import RosterCard from '@/components/cards/RosterCard'
import ListboxComponent, {
  type ListboxOption
} from '@/components/dropdown/Listbox'
import useNotification from '@/hooks/useNotification'
import { NotificationType } from '@/state/notificationState'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const options: ListboxOption[] = [
  {
    id: 0,
    name: '선수'
  },
  {
    id: 1,
    name: '매니저'
  },
  {
    id: 2,
    name: '감독'
  },
  {
    id: 3,
    name: '코치'
  }
]

const rosterTypes = [
  RosterType.Athlete,
  RosterType.Staff,
  RosterType.HeadCoach,
  RosterType.Coach
]

const RosterItem = () => {
  const { teamId } = useParams()
  const [rosters, setRosters] = useState<Roster[]>([])
  const [selectedType, setSelectedType] = useState(options[0])
  const [filteredRosters, setFilteredRosters] = useState<Roster[]>([])
  const { showNotification } = useNotification()
  const navigate = useNavigate()

  useEffect(() => {
    const getRoster = async () => {
      try {
        const response = await axiosInstance.get<Roster[]>(
          `/rosters/teams/${teamId}?page=1&limit=100&option=Enabled`
        )
        setRosters(response.data)
        setFilteredRosters(
          response.data.filter(
            (roster) => roster.rosterType === RosterType.Athlete
          )
        )
      } catch (error) {
        showNotification(
          NotificationType.Error,
          '로스터 불러오기 실패',
          '로스터 불러오기에 실패했습니다.'
        )
      }
    }

    getRoster()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleRosterType = (option: ListboxOption) => {
    const targetType = rosterTypes[option.id]

    setSelectedType(options[option.id])

    setFilteredRosters(
      rosters.filter((roster) => roster.rosterType === targetType)
    )
  }

  return (
    <>
      <div className="bg-indigo-950 py-5">
        <div className="mx-auto flex max-w-screen-xl flex-col gap-1.5 px-4 md:flex-row lg:px-20">
          <div className="md:w-56">
            <ListboxComponent
              options={options}
              onChange={handleRosterType}
              value={selectedType}
            />
          </div>
        </div>
      </div>
      <div className="mx-auto my-5 max-w-screen-xl px-4 lg:px-20">
        <MainCard
          title={`팀 로스터 명단 - ${selectedType.name}`}
          transparent={true}
        >
          <div className="-mx-4 grid grid-cols-4 gap-2">
            {filteredRosters.length > 0 ? (
              filteredRosters.map((roster) => (
                <div key={roster.id} className="col-span-2 lg:col-span-1">
                  <RosterCard
                    roster={roster}
                    onClick={(rosterId: number) =>
                      navigate(`/rosters/${rosterId}`)
                    }
                  />
                </div>
              ))
            ) : (
              <div className="col-span-10 flex w-full flex-row items-center justify-center">
                <ExclamationTriangleIcon className="mr-1.5 h-6 w-6 text-red-500" />
                <p className="text-xs font-medium text-gray-900 sm:text-sm">
                  로스터 정보가 없습니다
                </p>
              </div>
            )}
          </div>
        </MainCard>
      </div>
    </>
  )
}

export default RosterItem
