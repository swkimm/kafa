import axiosInstance from '@/commons/axios'
import type { GameMany } from '@/commons/interfaces/game/game'
import MainCard from '@/components/cards/MainCard'
import GameTable from '@/components/tables/GameTable'
import { useDate } from '@/hooks/useDate'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const TeamHomeItem = () => {
  const [games, setGames] = useState<GameMany[]>([])
  const [teamId, setTeamId] = useState<string>()

  const { parseUTCDate, formatDate } = useDate()
  const params = useParams()

  useEffect(() => {
    const { teamId: selectedTeamId } = params

    setTeamId(selectedTeamId)
  }, [params])

  useEffect(() => {
    getGamesByTeamId()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId])

  const getGamesByTeamId = async () => {
    if (!teamId || teamId === '0') return

    const response = await axiosInstance.get<GameMany[]>(
      `/games/teams/${teamId}?page=1&limit=10`
    )

    response.data.forEach((game) => {
      game.startedAt = formatDate(
        parseUTCDate(game.startedAt),
        'YYYY-MM-DD A hh:mm'
      )
    })

    setGames(response.data)
  }

  return (
    <div className="mx-auto max-w-screen-xl py-5 lg:px-20">
      <div className="col-span-2">
        <div>
          <MainCard title="참여 경기 목록" transparent={false}>
            {games && <GameTable games={games} detail={true} />}
          </MainCard>
        </div>
      </div>
    </div>
  )
}

export default TeamHomeItem
