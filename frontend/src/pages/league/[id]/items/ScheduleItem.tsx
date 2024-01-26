// ScheduleItem.tsx
import axiosInstance from '@/commons/axios'
import type { Game } from '@/commons/interfaces/game/game'
import DropdownSimple from '@/components/dropdown/DropdownLeft'
import DefaultTable from '@/components/tables/DefaultTable'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

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

const findEarliestDate = (games: ExtendedGame[]): Date => {
  return new Date(
    Math.min(...games.map((game) => new Date(game.startedAt).getTime()))
  )
}

// Modified getWeekNumber function
const getWeekNumber = (d: Date, startDate: Date): number => {
  const differenceInTime = d.getTime() - startDate.getTime()
  const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24))
  return Math.floor(differenceInDays / 7) + 1
}

// Modified groupByWeek function
const groupByWeek = (
  data: ExtendedGame[],
  startDate: Date
): Map<number, ExtendedGame[]> => {
  const groupedByWeek = new Map<number, ExtendedGame[]>()

  for (const item of data) {
    const date = new Date(item.startedAt)
    const weekNumber = getWeekNumber(date, startDate)

    if (!groupedByWeek.has(weekNumber)) {
      groupedByWeek.set(weekNumber, [])
    }

    groupedByWeek.get(weekNumber)?.push(item)
  }

  return groupedByWeek
}

const ScheduleItem = () => {
  const [searchParams] = useSearchParams()
  const year = searchParams.get('year')
  const { leagueId } = useParams()
  const navigate = useNavigate()
  const [, setGames] = useState<ExtendedGame[]>([])
  const [selectedWeek, setSelectedWeek] = useState<number>()
  const [groupedGames, setGroupedGames] = useState<Map<number, ExtendedGame[]>>(
    new Map()
  )

  const fetchScoreInfo = async (gameId: number) => {
    try {
      const response = await axiosInstance.get(`/games/${gameId}/score`)
      return response.data
    } catch (error) {
      return { homeTeamScore: '', awayTeamScore: '' }
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

  const getGames = useCallback(async (leagueId: number) => {
    const cursor = 0
    const limit = 3

    try {
      const response = await axiosInstance.get<Game[]>(
        `/games/leagues/${leagueId}?cursor=${cursor}&limit=${limit}`
      )

      const gamesByLeagueIdWithScore = await Promise.all(
        response.data.map(async (game) => {
          const scoreInfo = game.id
            ? await fetchScoreInfo(game.id)
            : { homeTeamScore: 'N/A', awayTeamScore: 'N/A' }

          const homeTeamInfo = game.homeTeamId
            ? await fetchHomeTeamInfo(game.homeTeamId)
            : { name: 'N/A' }

          const awayTeamInfo = game.awayTeamId
            ? await fetchAwayTeamInfo(game.awayTeamId)
            : { name: 'N/A' }

          return {
            ...game, // Game 객체의 속성들을 펼침
            scoreInfo, // scoreInfo 추가
            homeTeamInfo,
            awayTeamInfo
          }
        })
      )
      setGames(gamesByLeagueIdWithScore as ExtendedGame[])

      const earliestDate = findEarliestDate(gamesByLeagueIdWithScore)
      const grouped = groupByWeek(gamesByLeagueIdWithScore, earliestDate)
      setGroupedGames(grouped)

      // Generate week options for the dropdown
      const weekOptions = Array.from(grouped.keys())
        .sort((a, b) => a - b)
        .map((week) => ({ id: week, name: `Week ${week}` }))
      // Set the first available week as the selected week
      setSelectedWeek(weekOptions[0]?.id)
    } catch (error) {
      alert(error)
    }
  }, [])

  const weekOptions = useMemo(() => {
    const weeks = Array.from(groupedGames.keys()).sort()
    return weeks.map((week) => ({
      id: week,
      name: `Week ${week}`
    }))
  }, [groupedGames])

  // Function to handle week selection
  const handleWeekSelect = (weekNumber: number) => {
    setSelectedWeek(weekNumber)
  }

  const gamesForSelectedWeek = useMemo(() => {
    if (selectedWeek !== undefined) {
      return groupedGames.get(selectedWeek) || []
    }
    return []
  }, [groupedGames, selectedWeek])

  useEffect(() => {
    getGames(Number(leagueId))
  }, [leagueId, getGames, selectedWeek])

  const handleGameClick = (
    gameId: number,
    homeTeamId: number,
    awayTeamId: number
  ) => {
    navigate(
      `/leagues/${leagueId}/game-detail/${gameId}?year=${year}&home=${homeTeamId}&away=${awayTeamId}`
    )
  }

  const gameColumns = [
    {
      title: 'HOME',
      render: (game: ExtendedGame) => (
        <div
          className="flex cursor-pointer items-center"
          onClick={() =>
            handleGameClick(game.id, game.homeTeamId, game.awayTeamId)
          }
        >
          {game.homeTeamInfo?.profileImgUrl ? (
            <img
              src={game.homeTeamInfo.profileImgUrl}
              alt={game.homeTeamInfo.initial}
              className="mr-2 w-8"
            />
          ) : (
            <img src="/logo/KAFA_OG.png" alt="" className="mr-2 w-8" />
          )}
          <div>{game.homeTeamInfo?.name}</div>
        </div>
      )
    },
    {
      title: '',
      render: (game: ExtendedGame) => (
        <div
          className="cursor-pointer"
          onClick={() =>
            handleGameClick(game.id, game.homeTeamId, game.awayTeamId)
          }
        >
          {game.score?.homeScore}
        </div>
      )
    },
    {
      title: 'AWAY',
      render: (game: ExtendedGame) => (
        <div
          className="flex cursor-pointer items-center"
          onClick={() =>
            handleGameClick(game.id, game.homeTeamId, game.awayTeamId)
          }
        >
          {game.awayTeamInfo?.profileImgUrl ? (
            <img
              src={game.awayTeamInfo.profileImgUrl}
              alt={game.awayTeamInfo.initial}
              className="mr-2 w-8"
            />
          ) : (
            <img src="/logo/KAFA_OG.png" alt="" className="mr-2 w-8" />
          )}
          <div>{game.awayTeamInfo?.name}</div>
        </div>
      )
    },
    {
      title: '',
      render: (game: ExtendedGame) => (
        <div
          className="cursor-pointer"
          onClick={() =>
            handleGameClick(game.id, game.homeTeamId, game.awayTeamId)
          }
        >
          {game.score?.awayScore}
        </div>
      )
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
          <div
            className="cursor-pointer"
            onClick={() =>
              handleGameClick(game.id, game.homeTeamId, game.awayTeamId)
            }
          >
            <span>{formattedDate}</span>
          </div>
        )
      }
    },
    {
      title: 'LOCATION',
      render: (game: ExtendedGame) => (
        <div
          className="cursor-pointer"
          onClick={() =>
            handleGameClick(game.id, game.homeTeamId, game.awayTeamId)
          }
        >
          <span>{game.stadium}</span>
        </div>
      )
    }
  ]
  return (
    <div className="container mx-auto my-5 grid max-w-screen-2xl grid-cols-1 sm:grid-cols-3">
      <div className="order-2 col-span-1 mx-5 sm:order-1 sm:col-span-2">
        <DefaultTable
          title={`Week ${selectedWeek || 1}`}
          data={gamesForSelectedWeek}
          columns={gameColumns}
        />
      </div>
      <div className="order-1 col-span-1 mx-5 mb-5 sm:order-2">
        <DropdownSimple
          optionName={`Week ${selectedWeek || 1}`}
          optionList={weekOptions}
          onSelect={(weekNumber) => handleWeekSelect(Number(weekNumber))}
        />
      </div>
    </div>
  )
}

export default ScheduleItem
