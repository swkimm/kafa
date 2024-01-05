// PastTeamRosterItem.tsx
import axiosInstance from '@/commons/axios'
import type { Roster } from '@/commons/interfaces/roster/roster'
import PlayerCard from '@/components/cards/PlayerCard'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const PastTeamRosterItem = () => {
  const { pastLeagueId, teamId } = useParams()
  const navigate = useNavigate()
  const [roster, setRoster] = useState<Roster[]>([])

  const getRoster = useCallback(async () => {
    try {
      const response = await axiosInstance.get<Roster[]>(
        `/rosters/leagues/${pastLeagueId}/teams/${teamId}`
      )
      setRoster(response.data)
    } catch (error) {
      console.log(error)
    }
  }, [pastLeagueId, teamId])

  useEffect(() => {
    getRoster()
  }, [getRoster])

  const goToMemberInfo = (memberId: number) => {
    navigate(`/pastLeague/${pastLeagueId}/team/${teamId}/member/${memberId}`)
  }
  return (
    <div className="container mx-auto mb-10 grid max-w-screen-2xl grid-cols-2 sm:grid-cols-4">
      {roster.map((member) => (
        <div
          key={member.id}
          className="col-span-1 my-5"
          onClick={() => goToMemberInfo(member.id)}
        >
          <PlayerCard
            key={member.id}
            playerData={member}
            onClick={goToMemberInfo}
          />
        </div>
      ))}
    </div>
  )
}

export default PastTeamRosterItem
