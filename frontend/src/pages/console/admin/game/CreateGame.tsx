import axiosInstance from '@/commons/axios'
import type { Game } from '@/commons/interfaces/game/game'
import CreateGameModal from '@/components/modal/CreateGameModal'
import ModifyGameModal from '@/components/modal/ModifyGameModal'
import Alert from '@/components/notifications/Alert'
import MyNotification from '@/components/notifications/Notification'
import DefaultWithButton from '@/components/tables/DefaultWithButtonTable'
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export interface GamesWithTeamsName extends Game {
  homeTeamInfo?: { name: string } | null
  awayTeamInfo?: { name: string } | null
}

const CreateGame = () => {
  const { leagueId: leagueIdString } = useParams()
  const leagueId = Number(leagueIdString)
  const [games, setGames] = useState<GamesWithTeamsName[]>([])
  const [currentGame, setCurrentGame] = useState<GamesWithTeamsName | null>(
    null
  )
  const [showModifyModal, setShowModifyModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [notification, setNotification] = useState({
    title: '',
    content: '',
    show: false
  })
  const [alert, setAlert] = useState({ title: '', content: '', show: false })

  const modifyGame = (game: GamesWithTeamsName) => {
    setCurrentGame(game)
    setShowModifyModal(true)
  }

  const handleAddButtonClick = () => {
    setShowCreateModal(true)
  }

  const showAlert = (
    type: 'notification' | 'alert',
    title: string,
    content: string
  ) => {
    const newState = { title, content, show: true }
    if (type === 'notification') {
      setNotification(newState)
      setTimeout(() => setNotification({ ...newState, show: false }), 3000)
    } else if (type === 'alert') {
      setAlert(newState)
      setTimeout(() => setAlert({ ...newState, show: false }), 3000)
    }
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
      // console.log('games', games)
    } catch (error) {
      console.log(error)
    }
  }, [leagueId])

  useEffect(() => {
    const getTeamsByLeagueId = async () => {
      try {
        await axiosInstance.get(`/teams/leagues/${leagueId}`)
      } catch (error) {
        console.log(error)
      }
    }

    const fetchData = async () => {
      await getGamesByLeagueId()
      await getTeamsByLeagueId()
    }

    fetchData()
  }, [leagueId, getGamesByLeagueId]) // leagueId가 변경될 때만 함수 실행

  const deleteGame = async (gameId: number) => {
    console.log(gameId)
    try {
      await axiosInstance.delete(`/admin/games/${gameId}`)
      getGamesByLeagueId()
    } catch (error) {
      console.log(error)
    }
  }

  const handleGameUpdate = (
    _updatedGame: GamesWithTeamsName | null,
    notificationInfo?: {
      type: 'notification' | 'alert'
      title: string
      content: string
    }
  ) => {
    setShowModifyModal(false) // 모달 닫기

    const alertType =
      notificationInfo?.type === 'notification' ||
      notificationInfo?.type === 'alert'
        ? notificationInfo.type
        : 'notification'

    if (notificationInfo) {
      showAlert(alertType, notificationInfo.title, notificationInfo.content)
    }

    getGamesByLeagueId()
  }

  const handleGameCreate = (notificationInfo?: {
    type: 'notification' | 'alert'
    title: string
    content: string
  }) => {
    setShowCreateModal(false) // 모달 닫기
    const alertType =
      notificationInfo?.type === 'notification' ||
      notificationInfo?.type === 'alert'
        ? notificationInfo.type
        : 'notification'

    if (notificationInfo) {
      showAlert(alertType, notificationInfo.title, notificationInfo.content)
    }

    getGamesByLeagueId()
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
          onClick={() => modifyGame(info)}
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
          onClick={() => deleteGame(info.id)}
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
      {notification.show && (
        <MyNotification
          title={notification.title}
          content={notification.content}
        />
      )}
      {alert.show && <Alert title={alert.title} content={alert.content} />}
      {showModifyModal && currentGame && (
        <ModifyGameModal
          game={currentGame}
          leagueId={leagueId}
          onClose={handleGameUpdate}
        />
      )}

      {showCreateModal && (
        <CreateGameModal leagueId={leagueId} onClose={handleGameCreate} />
      )}
    </div>
  )
}

export default CreateGame
