// RosterItem.tsx
import axiosInstance from '@/commons/axios'
import type { Roster } from '@/commons/interfaces/roster/roster'
import PlayerCard from '@/components/cards/PlayerCard'
import useNotification from '@/hooks/useNotification'
import { NotificationType } from '@/state/notificationState'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const RosterItem = () => {
  const { leagueId, teamId } = useParams()
  const navigate = useNavigate()
  const [roster, setRoster] = useState<Roster[]>([])
  const { showNotification } = useNotification()

  const getRoster = useCallback(async () => {
    try {
      const response = await axiosInstance.get<Roster[]>(
        `/rosters/leagues/${leagueId}/teams/${teamId}`
      )
      setRoster(response.data)
    } catch (error) {
      showNotification(
        NotificationType.Error,
        '로스터 불러오기 실패',
        '로스터 불러오기에 실패했습니다.'
      )
    }
  }, [leagueId, showNotification, teamId])

  useEffect(() => {
    getRoster()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
