import axiosInstance from '@/commons/axios'
import type { Game } from '@/commons/interfaces/game/game'
import SimpleAlert from '@/components/notifications/SimpleAlert'
import DefaultWithButton from '@/components/tables/DefaultWithButtonTable'
import useNotification from '@/hooks/useNotification'
import { NotificationType } from '@/state/notificationState'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export interface GamesWithTeamsName extends Game {
  homeTeamInfo?: { name: string } | undefined
  awayTeamInfo?: { name: string } | undefined
}

const ManageGameDetail = () => {
  const { leagueId: leagueIdString } = useParams()
  const leagueId = Number(leagueIdString)
  const [games, setGames] = useState<GamesWithTeamsName[]>([])
  const navigate = useNavigate()
  const { showNotification } = useNotification()
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [gameToDelete, setGameToDelete] = useState<number | null>(null)

  const handleDeleteClick = (gameId: number) => {
    setGameToDelete(gameId)
    setIsAlertOpen(true)
  }

  const goToModifyGame = (game: GamesWithTeamsName) => {
    navigate(`/console/leagues/${leagueId}/modify-game`, { state: { game } })
  }

  const handleAddButtonClick = () => {
    navigate(`/console/leagues/${leagueId}/create-game`)
  }

  const fetchHomeTeamInfo = async (homeTeamId: number) => {
    const response = await axiosInstance.get(`/teams/${homeTeamId}`)
    return response.data
  }

  const fetchAwayTeamInfo = async (awayTeamId: number) => {
    const response = await axiosInstance.get(`/teams/${awayTeamId}`)
    return response.data
  }

  const getGamesByLeagueId = useCallback(async () => {
    const cursor = 0
    const limit = 100
    try {
      const response = await axiosInstance.get<Game[]>(
        `/games/leagues/${leagueId}?cursor=${cursor}&limit=${limit}`
      )

      const gamesWithTeamsName = await Promise.all(
        response.data.map(async (game) => {
          const homeTeamInfo = game.homeTeamId
            ? await fetchHomeTeamInfo(game.homeTeamId)
            : { name: 'N/A' }

          const awayTeamInfo = game.awayTeamId
            ? await fetchAwayTeamInfo(game.awayTeamId)
            : { name: 'N/A' }

          return {
            ...game,
            homeTeamInfo,
            awayTeamInfo
          }
        })
      )
      setGames(gamesWithTeamsName)
    } catch (error) {
      showNotification(
        NotificationType.Error,
        '게임 불러오기 실패',
        '게임 불러오기에 실패했습니다.'
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leagueId])

  useEffect(() => {
    const getTeamsByLeagueId = async () => {
      await axiosInstance.get(`/teams/leagues/${leagueId}`)
    }

    const fetchData = async () => {
      await getGamesByLeagueId()
      await getTeamsByLeagueId()
    }

    fetchData()
  }, [leagueId, getGamesByLeagueId]) // leagueId가 변경될 때만 함수 실행

  const confirmDeleteGame = async (gameId: number) => {
    try {
      await axiosInstance.delete(`/admin/games/${gameId}`)
      showNotification(
        NotificationType.Success,
        '게임 삭제 성공',
        '게임 삭제에 성공했습니다.'
      )
      setIsAlertOpen(false)
      getGamesByLeagueId()
    } catch (error) {
      showNotification(
        NotificationType.Error,
        '게임 삭제 실패',
        '게임 삭제에 실패했습니다.'
      )
    }
  }

  const gamesInfoColumns = [
    {
      title: '날짜',
      render: (info: GamesWithTeamsName) => {
        const date = info.startedAt ? new Date(info.startedAt) : null
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
      title: '경기장',
      render: (info: GamesWithTeamsName) => <span>{info.stadium}</span>
    },
    {
      title: 'HOME',
      render: (info: GamesWithTeamsName) => (
        <span>{info.homeTeamInfo?.name}</span>
      )
    },
    {
      title: 'AWAY',
      render: (info: GamesWithTeamsName) => (
        <span>{info.awayTeamInfo?.name}</span>
      )
    },
    {
      title: '수정',
      render: (info: GamesWithTeamsName) => (
        <button
          type="button"
          onClick={() => goToModifyGame(info)}
          className="rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          수정
        </button>
      )
    },
    {
      title: '삭제',
      render: (info: GamesWithTeamsName) => (
        <button
          type="button"
          onClick={() => handleDeleteClick(info.id)}
          className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          삭제
        </button>
      )
    }
  ]

  return (
    <div className="m-5">
      <div className="text-md mb-5 font-bold">대회등록</div>
      <DefaultWithButton
        title={'게임등록'}
        data={games}
        columns={gamesInfoColumns}
        addButtonTitle="추가 등록"
        onAddButtonClick={handleAddButtonClick}
      />

      {isAlertOpen && (
        <SimpleAlert
          open={isAlertOpen}
          onCancel={() => setIsAlertOpen(false)}
          onConfirm={() =>
            gameToDelete !== null ? confirmDeleteGame(gameToDelete) : null
          }
        />
      )}
    </div>
  )
}

export default ManageGameDetail
