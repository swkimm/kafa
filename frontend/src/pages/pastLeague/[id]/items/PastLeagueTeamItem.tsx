import axiosInstance from '@/commons/axios'
import type { TeamComplication } from '@/commons/interfaces/team/teamComplication'
import Alert from '@/components/notifications/Alert'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import TeamCard from '../../../../components/cards/TeamCard'

const PastLeagueTeamItem = () => {
  const [teams, setTeams] = useState<TeamComplication[] | null>(null)
  const [alert, setAlert] = useState<{
    title: string
    content?: string
  } | null>(null)
  const { pastLeagueId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const getTeams = async () => {
      try {
        const response = await axiosInstance.get(
          `/teams/leagues/${pastLeagueId}`
        )
        setTeams(response.data)
      } catch (error: unknown) {
        if (error instanceof Error) {
          setAlert({ title: 'Error', content: error.message })
        } else {
          // Handle cases where error is not an instance of Error
          setAlert({ title: 'Error', content: 'An unknown error occurred' })
        }
      }
    }
    getTeams()
  }, [pastLeagueId])

  return (
    <div className="container mx-auto max-w-screen-2xl px-5">
      <div className="grid grid-cols-1 text-center sm:grid-cols-2">
        {teams &&
          teams.map((team) => (
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
                  navigate(`/pastLeague/${pastLeagueId}/team/${team.id}`)
                }}
              />
            </div>
          ))}
        {alert && <Alert title={alert.title} content={alert.content} />}
      </div>
    </div>
  )
}

export default PastLeagueTeamItem
