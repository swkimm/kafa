// PastTeamHomeItem.tsx
// import { useParams } from 'react-router-dom'
import axiosInstance from '@/commons/axios'
import type { Game } from '@/commons/interfaces/game/game'
import DefaultTable from '@/components/tables/DefaultTable'
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

interface GameScore {
  homeTeamScore: number
  awayTeamScore: number
}

interface ExtendedGame extends Game {
  homeTeamInfo?: {
    name: string
    initial: string
    profileImgUrl: string
  }
  awayTeamInfo?: {
    name: string
    initial: string
    profileImgUrl: string
  }
  score?: GameScore
}

const PastTeamHomeItem = () => {
  const [games, setGames] = useState<ExtendedGame[]>([])
  const { pastLeagueId, teamId: teamIdString } = useParams()
  const teamId = Number(teamIdString) // teamId를 숫자로 변환

  const fetchTeamInfo = async (teamId: number) => {
    try {
      const response = await axiosInstance.get(`/teams/${teamId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching team info:', error)
      return null // 오류 발생시 null 반환
    }
  }

  const getGameScores = async (gameId: number): Promise<GameScore | null> => {
    try {
      const response = await axiosInstance.get(`/games/${gameId}/score`)
      return response.data // { homeScore, awayScore } 포함 가정
    } catch (error) {
      console.error('Error fetching game scores:', error)
      return null // 오류 발생 시 null 반환
    }
  }

  const getGamesWithTeamInfo = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/games/leagues/${pastLeagueId}`)
      let games = response.data

      if (teamId) {
        games = games.filter(
          (game: { homeTeamId: number; awayTeamId: number }) =>
            game.homeTeamId === teamId || game.awayTeamId === teamId
        )
      }

      // 각 게임에 대한 홈팀과 어웨이팀 정보를 추가
      const gamesWithTeamInfo = await Promise.all(
        games.map(async (game: ExtendedGame) => {
          const homeTeamInfo = await fetchTeamInfo(game.homeTeamId)
          const awayTeamInfo = await fetchTeamInfo(game.awayTeamId)
          const score = await getGameScores(game.id) // 게임 점수 정보 가져오기

          return {
            ...game,
            homeTeamInfo,
            awayTeamInfo,
            score
          }
        })
      )

      setGames(gamesWithTeamInfo)
    } catch (error) {
      alert(error)
    }
  }, [pastLeagueId, teamId])

  useEffect(() => {
    getGamesWithTeamInfo()
  }, [getGamesWithTeamInfo])

  const pastGamesColumns = [
    {
      title: 'HOME',
      render: (game: ExtendedGame) => (
        <div className="flex items-center">
          {game.homeTeamInfo?.profileImgUrl ? (
            <img
              src={game.homeTeamInfo.profileImgUrl}
              alt={game.homeTeamInfo.initial}
              className="mr-2 w-8"
            />
          ) : (
            <img src="/logo/KAFA_OG.png" alt="" className="mr-2 w-8" />
          )}
          <span>{game.homeTeamInfo?.name}</span>
        </div>
      )
    },
    {
      title: '',
      render: (game: ExtendedGame) => <span>{game.score?.homeTeamScore}</span>
    },
    {
      title: 'AWAY',
      render: (game: ExtendedGame) => (
        <div className="flex items-center">
          {game.awayTeamInfo?.profileImgUrl ? (
            <img
              src={game.awayTeamInfo.profileImgUrl}
              alt={game.awayTeamInfo.initial}
              className="mr-2 w-8"
            />
          ) : (
            <img src="/logo/KAFA_OG.png" alt="" className="mr-2 w-8" />
          )}
          <span>{game.awayTeamInfo?.name}</span>
        </div>
      )
    },
    {
      title: '',
      render: (game: ExtendedGame) => <span>{game.score?.awayTeamScore}</span>
    },
    {
      title: 'DATE',
      render: (game: ExtendedGame) => {
        const date = game.startedAt ? new Date(game.startedAt) : null
        const formattedDate = date
          ? `${date.getMonth() + 1}/${date.getDate()} ${
              date.getHours() >= 12 ? 'PM' : 'AM'
            } ${date.getHours() % 12 === 0 ? 12 : date.getHours() % 12}:${date
              .getMinutes()
              .toString()
              .padStart(2, '0')}`
          : 'N/A'

        return (
          <div>
            <span>{formattedDate}</span>
          </div>
        )
      }
    },
    {
      title: 'LOCATION',
      render: (game: ExtendedGame) => (
        <div>
          <span>{game.stadium}</span>
        </div>
      )
    }
  ]

  return (
    <div className="container mx-auto my-5 grid max-w-screen-2xl grid-cols-1 px-5 sm:grid-cols-3">
      <div className="col-span-2">
        <div className="my-5">
          <DefaultTable
            title="경기결과"
            data={games}
            columns={pastGamesColumns}
          />
        </div>
      </div>
    </div>
  )
}

export default PastTeamHomeItem
