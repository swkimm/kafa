import axiosInstance from '@/commons/axios'
import type { GameMany } from '@/commons/interfaces/game/game'
import MainCard from '@/components/cards/MainCard'
import GameTable from '@/components/tables/GameTable'
import { useEffect, useState } from 'react'

const UpcommingGameSection: React.FC = () => {
  const [upcommingGames, setUpcommingGames] = useState<GameMany[]>([])

  useEffect(() => {
    const getUpcommingGames = async () => {
      await axiosInstance
        .get('/games/upcomming')
        .then((result) => {
          setUpcommingGames(result.data)
        })
        .catch(() => setUpcommingGames([]))
    }

    getUpcommingGames()
  }, [])

  return (
    <MainCard title={'다가오는 경기'} transparent={false}>
      <GameTable games={upcommingGames} />
    </MainCard>
  )
}

export default UpcommingGameSection
