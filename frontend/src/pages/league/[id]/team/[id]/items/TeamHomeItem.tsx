// TeamHomeItem.tsx
// import { useParams } from 'react-router-dom'
import axiosInstance from '@/commons/axios'
import type { GameMany } from '@/commons/interfaces/game/game'
import DefaultTable from '@/components/tables/DefaultTable'
import useNotification from '@/hooks/useNotification'
import { NotificationType } from '@/state/notificationState'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

interface GameWithStadium extends GameMany {
  stadium: string
}

const TeamHomeItem = () => {
  const [games, setGames] = useState<GameWithStadium[]>([])
  const { leagueId, teamId: teamIdString } = useParams()
  const teamId = Number(teamIdString) // teamId를 숫자로 변환
  const { showNotification } = useNotification()
  const navigate = useNavigate()
  const [startedYear, setStartedYear] = useState()

  const getLeague = async (leagueId: number) => {
    const response = await axiosInstance.get(`/leagues/${leagueId}`)
    setStartedYear(response.data.startedYear)
  }

  const fetchGameWithStadium = async (gameId: number) => {
    const response = await axiosInstance.get(`/games/${gameId}`)
    return response.data
  }

  useEffect(() => {
    const fetchData = async () => {
      if (leagueId) {
        const leagueIdToInt = parseInt(leagueId, 10)
        await getLeague(leagueIdToInt)
      }
    }

    fetchData()
  }, [leagueId])

  useEffect(() => {
    const fetchGames = async () => {
      if (startedYear && teamId) {
        await getGamesByTeamId()
      }
    }

    fetchGames()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startedYear, teamId])

  const getGamesByTeamId = async () => {
    const page = 1
    const limit = 5
    try {
      const response = await axiosInstance.get(
        `/games/teams/${teamId}?page=${page}&limit=${limit}`
      )
      let games = response.data

      // URL 쿼리 파라미터에 따라 연도 필터링
      if (startedYear) {
        games = games.filter((game: GameMany) => {
          const gameYear = new Date(game.startedAt).getFullYear()
          return gameYear === startedYear
        })
      }

      // 특정 리그와 팀에 해당하는 경기만 필터링
      if (leagueId && teamId) {
        games = games.filter(
          (game: { League: { id: number } }) =>
            game.League.id === parseInt(leagueId, 10)
        )
      }

      // 각 게임에 대한 추가 정보(스타디움 등)를 가져옴
      const gamesWithStadium = await Promise.all(
        games.map(async (game: { id: number }) => {
          const gameDetails = await fetchGameWithStadium(game.id)
          return {
            ...game,
            ...gameDetails
          }
        })
      )
      setGames(gamesWithStadium)
    } catch (error) {
      showNotification(
        NotificationType.Error,
        '게임 목록 불러오기 실패',
        '게임 목록 불러오기에 실패했습니다.'
      )
      setGames([])
    }
  }

  const goToGamePage = (gameId: number) => {
    navigate(`/leagues/${leagueId}/games/${gameId}`)
  }

  const gamesColumns = [
    {
      title: 'HOME',
      render: (game: GameMany) => (
        <div
          className="flex cursor-pointer items-center"
          onClick={() => goToGamePage(game.id)}
        >
          {game.homeTeam?.profileImgUrl ? (
            <img
              src={game.homeTeam.profileImgUrl}
              alt={game.homeTeam.name}
              className="mr-2 w-8"
            />
          ) : (
            <img src="/logo/KAFA_OG.png" alt="" className="mr-2 w-8" />
          )}
          <span>{game.homeTeam?.name}</span>
        </div>
      )
    },
    {
      title: '',
      render: (game: GameMany) => (
        <div className="cursor-pointer" onClick={() => goToGamePage(game.id)}>
          <span>{game.score.homeTeamScore}</span>
        </div>
      )
    },
    {
      title: 'AWAY',
      render: (game: GameMany) => (
        <div
          className="flex cursor-pointer items-center"
          onClick={() => goToGamePage(game.id)}
        >
          {game.awayTeam?.profileImgUrl ? (
            <img
              src={game.awayTeam.profileImgUrl}
              alt={game.awayTeam.name}
              className="mr-2 w-8"
            />
          ) : (
            <img src="/logo/KAFA_OG.png" alt="" className="mr-2 w-8" />
          )}
          <span>{game.awayTeam?.name}</span>
        </div>
      )
    },
    {
      title: '',
      render: (game: GameMany) => (
        <div className="cursor-pointer" onClick={() => goToGamePage(game.id)}>
          <span>{game.score?.awayTeamScore}</span>
        </div>
      )
    },
    {
      title: 'DATE',
      render: (game: GameMany) => {
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
          <div className="cursor-pointer" onClick={() => goToGamePage(game.id)}>
            <span>{formattedDate}</span>
          </div>
        )
      }
    },
    {
      title: 'LOCATION',
      render: (game: GameWithStadium) => (
        <div className="cursor-pointer" onClick={() => goToGamePage(game.id)}>
          <span>{game.stadium}</span>
        </div>
      )
    }
  ]

  return (
    <div className="container mx-auto my-5 grid max-w-screen-2xl grid-cols-1 px-5 sm:grid-cols-3">
      <div className="col-span-2">
        <div className="my-5">
          {games.length > 0 ? (
            <DefaultTable
              title="경기일정"
              data={games}
              columns={gamesColumns}
            />
          ) : (
            <div className="col-span-2 my-5 h-full w-full">
              <p className="text-center text-xl font-light">
                경기에 대한 기록이 없습니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TeamHomeItem
