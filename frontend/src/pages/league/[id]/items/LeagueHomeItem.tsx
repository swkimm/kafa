import axiosInstance from '@/commons/axios'
import type { Game } from '@/commons/interfaces/game/game'
import DefaultTable from '@/components/tables/DefaultTable'
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

interface GameScore {
  homeScore: number
  awayScore: number
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

interface Standing {
  id: number
  rank: number
  teamId: number
  teamLogo: string
  teamName: string
  win: number
  lose: number
  draw: number
}

const finalStanding: Standing[] = [
  {
    id: 1,
    rank: 1,
    teamId: 1,
    teamLogo: '/logo/KAFA_OG.png',
    teamName: 'TBD',
    win: 0,
    lose: 0,
    draw: 0
  },
  {
    id: 2,
    rank: 2,
    teamId: 2,
    teamLogo: '/logo/KAFA_OG.png',
    teamName: 'TBD',
    win: 0,
    lose: 0,
    draw: 0
  },
  {
    id: 3,
    rank: 3,
    teamId: 3,
    teamLogo: '/logo/KAFA_OG.png',
    teamName: 'TBD',
    win: 0,
    lose: 0,
    draw: 0
  },
  {
    id: 4,
    rank: 4,
    teamId: 4,
    teamLogo: '/logo/KAFA_OG.png',
    teamName: 'TBD',
    win: 0,
    lose: 0,
    draw: 0
  },
  {
    id: 5,
    rank: 5,
    teamId: 5,
    teamLogo: '/logo/KAFA_OG.png',
    teamName: 'TBD',
    win: 0,
    lose: 0,
    draw: 0
  },
  {
    id: 6,
    rank: 6,
    teamId: 6,
    teamLogo: '/logo/KAFA_OG.png',
    teamName: 'TBD',
    win: 0,
    lose: 0,
    draw: 0
  }
]

const LeagueHomeItem = () => {
  const [games, setGames] = useState<ExtendedGame[]>([])
  const { leagueId } = useParams()

  const fetchTeamInfo = async (teamId: number) => {
    try {
      const response = await axiosInstance.get(`/teams/${teamId}`)
      return response.data // { name, initial, profileImgUrl } 포함 응답 가정
    } catch (error) {
      console.error('Error fetching team info:', error)
      return null // 오류 발생시 null 반환
    }
  }

  const getGameScores = async (gameId: number): Promise<GameScore | null> => {
    try {
      const response = await axiosInstance.get(`/games/${gameId}`)
      return response.data // { name, initial, profileImgUrl }
    } catch (error) {
      console.error('Error fetching game scores:', error)
      return null // 오류 발생 시 null 반환
    }
  }

  const getGamesWithTeamInfo = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/games/leagues/${leagueId}`)
      console.log(response.data)

      const allGames = response.data

      const unfinishedGames = allGames.filter(
        (game: ExtendedGame) => game.result === 'NotFinished'
      )

      const gamesWithTeamInfo = await Promise.all(
        unfinishedGames.map(async (game: ExtendedGame) => {
          const homeTeamInfo = await fetchTeamInfo(game.homeTeamId)
          const awayTeamInfo = await fetchTeamInfo(game.awayTeamId)
          const score = await getGameScores(game.id) // 게임 점수 정보 가져오기

          return {
            ...game,
            homeTeamInfo, // { name, initial, profileImgUrl }
            awayTeamInfo, // { name, initial, profileImgUrl }
            score
          }
        })
      )

      setGames(gamesWithTeamInfo)
    } catch (error) {
      alert(error)
    }
  }, [leagueId])

  useEffect(() => {
    getGamesWithTeamInfo()
  }, [getGamesWithTeamInfo])

  const finalStandingColumns = [
    {
      title: 'RANK',
      render: (finalStanding: Standing) => <span>{finalStanding.rank}</span>
    },
    {
      title: 'TEAM',
      render: (finalStanding: Standing) => (
        <div className="flex items-center">
          <img src={finalStanding.teamLogo} alt="" className="mr-2 w-8" />
          {finalStanding.teamName}
        </div>
      )
    },
    {
      title: 'WIN',
      render: (finalStanding: Standing) => (
        <div className="">{finalStanding.win}</div>
      )
    },
    {
      title: 'LOSE',
      render: (finalStanding: Standing) => (
        <div className="">{finalStanding.lose}</div>
      )
    },
    {
      title: 'DRAW',
      render: (finalStanding: Standing) => (
        <div className="">{finalStanding.draw}</div>
      )
    }
  ]

  const GamesColumns = [
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
      render: (game: ExtendedGame) => <span>{game.score?.homeScore}</span>
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
      render: (game: ExtendedGame) => <span>{game.score?.awayScore}</span>
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
        <div className="mb-5">
          <DefaultTable
            title="다가오는 경기 일정"
            data={games}
            columns={GamesColumns}
          />
        </div>
        <div className="mb-5">
          <DefaultTable
            title="최종 순위"
            data={finalStanding}
            columns={finalStandingColumns}
          />
        </div>
      </div>
    </div>
  )
}

export default LeagueHomeItem
