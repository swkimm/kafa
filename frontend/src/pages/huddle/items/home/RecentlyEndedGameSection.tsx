import axiosInstance from '@/commons/axios'
import type { GameMany } from '@/commons/interfaces/game/game'
import MainCard from '@/components/cards/MainCard'
import GameTable from '@/components/tables/GameTable'
import { useEffect, useState } from 'react'

const RecentlyEndedGameSection: React.FC = () => {
  const [recentlyEndedGames, setRecentlyEndedGames] = useState<GameMany[]>([])

  useEffect(() => {
    const getRecentlyEndedGames = async () => {
      try {
        const games: GameMany[] = await axiosInstance
          .get('/games/currently-ended')
          .then((result) => {
            return result.data
          })
        games.forEach((game) => (game.startedAt = new Date(game.startedAt)))
        setRecentlyEndedGames(games)
      } catch (error) {
        setRecentlyEndedGames([])
      }
    }

    getRecentlyEndedGames()
  }, [])
  return (
    <MainCard title={'최근 경기 결과'} transparent={false}>
      <GameTable games={recentlyEndedGames} />
    </MainCard>
  )
}

export default RecentlyEndedGameSection
