import axiosInstance from '@/commons/axios'
import type { GameMany } from '@/commons/interfaces/game/game'
import MainCard from '@/components/cards/MainCard'
import GameTable from '@/components/tables/GameTable'
import { useDate } from '@/hooks/useDate'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const RecentlyEndedGameSection: React.FC = () => {
  const [recentlyEndedGames, setRecentlyEndedGames] = useState<GameMany[]>([])

  const navigate = useNavigate()

  const { formatDate, parseUTCDate } = useDate()

  useEffect(() => {
    const getRecentlyEndedGames = async () => {
      try {
        const response = await axiosInstance.get<GameMany[]>(
          '/games/currently-ended'
        )

        response.data.forEach((game) => {
          game.startedAt = formatDate(
            parseUTCDate(game.startedAt),
            'YYYY-MM-DD A hh:mm'
          )
        })

        setRecentlyEndedGames(response.data)
      } catch (error) {
        setRecentlyEndedGames([])
      }
    }

    getRecentlyEndedGames()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <MainCard title={'최근 경기 결과'} transparent={false}>
      <GameTable
        games={recentlyEndedGames}
        onClick={(gameId: number) => navigate(`/games/${gameId}`)}
      />
    </MainCard>
  )
}

export default RecentlyEndedGameSection
