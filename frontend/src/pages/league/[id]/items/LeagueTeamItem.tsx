import axiosInstance from '@/commons/axios'
import type { TeamComplication } from '@/commons/interfaces/team/teamComplication'
import useNotification from '@/hooks/useNotification'
import { NotificationType } from '@/state/notificationState'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import TeamCard from '../../../../components/cards/TeamCard'

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
    <div className="container mx-auto max-w-screen-2xl px-5">
      <div className="grid grid-cols-1 text-center sm:grid-cols-2">
        {teams &&
          teams.map(
            (
              team // teams가 배열인지 확인
            ) => (
              <div className="my-5 flex justify-center" key={team.id}>
                <TeamCard
                  id={team.id}
                  name={team.name}
                  globalName={team.globalName}
                  initial={team.initial}
                  color={team.color}
                  profileImgUrl={team.profileImgUrl || '/logo/KAFA_OG.png'}
                  isWhite={(color: string) => color === '#ffffff'}
                  onClick={() => {
                    navigate(`/league/${leagueId}/team/${team.id}`)
                  }}
                />
              </div>
            )
          )}
      </div>
    </div>
  )
}

export default TeamItem
