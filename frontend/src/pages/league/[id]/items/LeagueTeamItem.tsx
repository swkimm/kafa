import axiosInstance from '@/commons/axios'
import type { TeamComplication } from '@/commons/interfaces/team/teamComplication'
import TeamCard from '@/components/cards/TeamCard'
import useNotification from '@/hooks/useNotification'
import { NotificationType } from '@/state/notificationState'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'

const TeamItem = () => {
  const [teams, setTeams] = useState<TeamComplication[] | null>(null)
  const { showNotification } = useNotification()

  const { leagueId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const getTeams = async () => {
      try {
        const response = await axiosInstance.get(`/teams/leagues/${leagueId}`)
        setTeams(response.data)
      } catch (error: unknown) {
        showNotification(
          NotificationType.Error,
          '팀 불러오기 실패',
          '팀 목록을 불러오는 실패하였습니다.',
          2500
        )
      }
    }
    getTeams()
  }, [leagueId, showNotification])

  return (
    <div className="mx-auto mt-3 max-w-screen-xl px-4 lg:px-20">
      <div className="my-5 grid grid-cols-1 gap-4 text-center sm:grid-cols-2">
        {teams &&
          teams.length > 0 &&
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
                hometown={team.hometown}
                establishedAt={team.establishedAt.toString().substring(0, 4)}
                onClick={() => {
                  navigate(`/teams/${team.id}`)
                }}
              />
            </div>
          ))}
        {teams && teams.length === 0 && (
          <div className="col-span-2 mx-auto mt-5 flex w-full items-center justify-center">
            <ExclamationTriangleIcon className="h-6 w-6 pr-1.5 text-yellow-500" />
            <p>리그에 참여한 팀 목록이 없습니다</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TeamItem
