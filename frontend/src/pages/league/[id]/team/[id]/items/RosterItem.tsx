// RosterItem.tsx
import axiosInstance from '@/commons/axios'
import type { Roster } from '@/commons/interfaces/roster/roster'
import PlayerCard from '@/components/cards/PlayerCard'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const RosterItem = () => {
  const { leagueId, teamId } = useParams()
  const navigate = useNavigate()
  const [roster, setRoster] = useState<Roster[]>([])

  const getRoster = useCallback(async () => {
    try {
      const response = await axiosInstance.get<Roster[]>(
        `/rosters/leagues/${leagueId}/teams/${teamId}`
      )
      setRoster(response.data)
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }, [leagueId, teamId])

  useEffect(() => {
    getRoster()
  }, [getRoster])

  const goToMemberInfo = (memberId: number) => {
    navigate(`/leagues/${leagueId}/teams/${teamId}/members/${memberId}`)
  }
  return (
    <div className="container mx-auto my-5 grid max-w-screen-2xl grid-cols-2 sm:grid-cols-4">
      {roster && roster.length > 0 ? (
        roster.map((member) => (
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
        ))
      ) : (
        <div className="col-span-2 my-5 h-full w-full">
          <p className="text-center text-xl font-light">
            팀에 등록된 로스터가 없습니다.
          </p>
        </div>
      )}
    </div>
  )
}

export default RosterItem
