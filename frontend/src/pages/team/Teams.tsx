import axiosInstance from '@/commons/axios'
import type { GetLeaguesWithYear } from '@/commons/interfaces/league/getLeaguesWithYears'
import type { TeamComplication } from '@/commons/interfaces/team/teamComplication'
import TeamCard from '@/components/cards/TeamCard'
import DropdownRight from '@/components/dropdown/DropdownRight'
import useNotification from '@/hooks/useNotification'
import { NotificationType } from '@/state/notificationState'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Teams = () => {
  const [leagues, setLeagues] = useState<GetLeaguesWithYear[]>([])
  const [teams, setTeams] = useState<TeamComplication[] | null>(null)
  const [associationId, setAssociationId] = useState<number | undefined>(
    undefined
  )

  const navigate = useNavigate()

  const { showNotification } = useNotification()

  useEffect(() => {
    const getAssociationTeams = async () => {
      try {
        const response = await axiosInstance.get(
          `/associations?page=1&limit=30`
        )
        setLeagues(response.data)
        if (response.data.length > 0) {
          const firstLeague = response.data[0]
          setAssociationId(firstLeague.id)
          getTeamsByAssociationId(firstLeague.id)
        }
      } catch (error) {
        console.log(error)
      }
    }

    getAssociationTeams()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (associationId !== undefined) {
      getTeamsByAssociationId(associationId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [associationId])

  const handleSelect = (selectedName: string) => {
    const selectedLeague = leagues.find(
      (league) => league.name === selectedName
    )
    if (selectedLeague) {
      setAssociationId(selectedLeague.id)
    }
  }

  const getTeamsByAssociationId = async (associationId: number) => {
    try {
      const response = await axiosInstance.get(
        `/teams/associations/${associationId}`
      )
      setTeams(response.data)
    } catch (error) {
      showNotification(
        NotificationType.Error,
        '팀 목록 불러오기 실패',
        '팀 목록 불러오기에 실패했습니다.'
      )
    }
  }

  return (
    <div>
      <div className="bg-purple-950 py-6 text-xl font-bold text-gray-50">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between px-4 lg:px-20">
          <p>TEAMS</p>
          <div className="text-xs text-white sm:text-base">
            {leagues.length > 0 && (
              <DropdownRight
                key={associationId || 'default-key'}
                optionName={
                  leagues.find((league) => league.id === associationId)?.name ||
                  'Select a League'
                }
                optionList={leagues}
                onSelect={handleSelect}
              />
            )}
          </div>
        </div>
      </div>
      <div className="mx-auto mt-3 max-w-screen-xl px-4 lg:px-20">
        <div className="my-5 grid grid-cols-1 gap-x-5 gap-y-3 text-center sm:grid-cols-2">
          {teams && teams.length > 0 ? (
            teams.map((team) => (
              <div key={team.id}>
                <TeamCard
                  id={team.id}
                  name={team.name}
                  globalName={team.globalName}
                  initial={team.initial}
                  color={team.color}
                  profileImgUrl={team.profileImgUrl || '/logo/KAFA_OG.png'}
                  isWhite={(color: string) => color === '#ffffff'}
                  onClick={(teamId: number) => navigate(`/teams/${teamId}`)}
                />
              </div>
            ))
          ) : (
            <div className="col-span-2 my-5 h-full w-full">
              <div className="mx-auto flex w-full items-center justify-center">
                <ExclamationTriangleIcon className="h-6 w-6 pr-1.5 text-yellow-500" />
                <p>해당 협회의 팀 정보가 없습니다</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Teams
