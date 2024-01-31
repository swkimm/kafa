import axiosInstance from '@/commons/axios'
import type { Game } from '@/commons/interfaces/game/game'
import type { Score } from '@/commons/interfaces/score/score'
import Button from '@/components/buttons/Button'
import DefaultTable from '@/components/tables/DefaultTable'
import type { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

interface ExtendedGame extends Game {
  id: number
  score: {
    homeTeamScore: number
    homeTeamQuarterScores: []
    awayTeamScore: number
    awayTeamQuarterScores: []
    overtime: boolean
  } | null
  homeTeamInfo: {
    name: string
    profileImgUrl: string
  }
  awayTeamInfo: {
    name: string
    profileImgUrl: string
  }
}

const LeagueGame = () => {
  const navigate = useNavigate()
  const { leagueId } = useParams()
  const [games, setGames] = useState<ExtendedGame[]>([])
  const goToRecodeInputById = (gameId: number) => {
    navigate(`/console/create-recode/leagues/${leagueId}/games/${gameId}`)
  }

  const fetchGetScoreById = async (gameId: number) => {
    try {
      const response = await axiosInstance.get<Score>(`/games/${gameId}/score`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      if (axiosError.response && axiosError.response.status === 404) {
        console.error(`Game with ID ${gameId} not found.`)
        return null
      }
      throw error
    }
  }

  const fetchGetHomeTeamName = async (homeTeamId: number) => {
    const response = await axiosInstance.get(`/teams/${homeTeamId}`)
    return response.data
  }

  const fetchGetAwayTeamName = async (awayTeamId: number) => {
    const response = await axiosInstance.get(`/teams/${awayTeamId}`)
    return response.data
  }

  useEffect(() => {
    const getGamesByLeagueId = async () => {
      const cursor = 0
      const limit = 100
      try {
        const response = await axiosInstance.get<ExtendedGame[]>(
          `/games/leagues/${leagueId}?cursor=${cursor}&limit=${limit}`
        )
        const getGamesByLeagueIdWithScore = await Promise.all(
          response.data.map(async (get) => {
            const scoreResponse = get.id
              ? await fetchGetScoreById(get.id)
              : { resposne: 'N/A' }
            const homeTeamResponse = get.homeTeamId
              ? await fetchGetHomeTeamName(get.homeTeamId)
              : { resposne: 'N/A' }
            const awayTeamResponse = get.awayTeamId
              ? await fetchGetAwayTeamName(get.awayTeamId)
              : { resposne: 'N/A' }
            return {
              ...get,
              score: scoreResponse,
              homeTeamInfo: homeTeamResponse,
              awayTeamInfo: awayTeamResponse
            }
          })
        )
        setGames(getGamesByLeagueIdWithScore as ExtendedGame[])
        console.log(getGamesByLeagueIdWithScore)
      } catch (error) {
        console.log(error)
      }
    }

    getGamesByLeagueId()
  }, [leagueId])

  const gameColumns = [
    {
      title: 'id',
      render: (game: ExtendedGame) => <div>{game.id}</div>
    },
    {
      title: 'HOME',
      render: (game: ExtendedGame) => (
        <div className="flex">
          {game.homeTeamInfo.profileImgUrl ? (
            <img
              src={game.homeTeamInfo.profileImgUrl}
              alt=""
              className="w-10"
            />
          ) : (
            <img src="/logo/KAFA_OG.png" alt="" className="w-10" />
          )}
          <div className="justify-content ml-2 flex items-center">
            {game.homeTeamInfo.name}
          </div>
        </div>
      )
    },
    {
      title: '',
      render: (game: ExtendedGame) => (
        <div>
          {game.score?.homeTeamScore || game.score?.homeTeamScore === 0 ? (
            <div>{game.score.homeTeamScore}</div>
          ) : (
            <div>N/A</div>
          )}
        </div>
      )
    },
    {
      title: 'AWAY',
      render: (game: ExtendedGame) => (
        <div className="flex">
          {game.awayTeamInfo.profileImgUrl ? (
            <img
              src={game.awayTeamInfo.profileImgUrl}
              alt=""
              className="w-10"
            />
          ) : (
            <img src="/logo/KAFA_OG.png" alt="" className="w-10" />
          )}
          <div className="justify-content ml-2 flex items-center">
            {game.awayTeamInfo.name}
          </div>
        </div>
      )
    },
    {
      title: '',
      render: (game: ExtendedGame) => (
        <div>
          {game.score?.awayTeamScore || game.score?.awayTeamScore === 0 ? (
            <div>{game.score.awayTeamScore}</div>
          ) : (
            <div>N/A</div>
          )}
        </div>
      )
    },
    {
      title: '날짜',
      render: (game: ExtendedGame) => {
        const date = new Date(game.startedAt)
        const year = date.getFullYear().toString().substr(-2) // 마지막 두 자리 연도
        const month = (date.getMonth() + 1).toString().padStart(2, '0') // 월
        const day = date.getDate().toString().padStart(2, '0') // 일
        const hours = date.getHours().toString().padStart(2, '0') // 시간
        const minutes = date.getMinutes().toString().padStart(2, '0') // 분

        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`
        return <div>{formattedDate}</div>
      }
    },
    {
      title: '연장 여부',
      render: (game: ExtendedGame) => (
        <div>{game.score?.overtime ? <div>Yes</div> : <div>No</div>}</div>
      )
    },
    {
      title: '기록 입력/수정',
      render: (game: ExtendedGame) => (
        <Button
          label="입력"
          variant="roundLg"
          onClick={() => goToRecodeInputById(game.id)}
        />
      )
    }
  ]

  return (
    <div className="m-5">
      {games.length > 0 ? (
        <DefaultTable
          title={'리그 소속 게임 목록'}
          data={games}
          columns={gameColumns}
        />
      ) : (
        <p>리그에 소속된 게임 목록이 없습니다.</p>
      )}
    </div>
  )
}

export default LeagueGame
