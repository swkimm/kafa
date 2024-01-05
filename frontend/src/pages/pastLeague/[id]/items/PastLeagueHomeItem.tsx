import axiosInstance from '@/commons/axios'
import type { Game } from '@/commons/interfaces/game/game'
import DropdownSimple from '@/components/dropdown/DropdownLeft'
import DefaultTable from '@/components/tables/DefaultTable'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

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
  // Calculate difference in days from the start date
  const differenceInTime = d.getTime() - startDate.getTime()
  const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24))
  // Calculate week number
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

const PastLeagueHomeItem = () => {
  const { pastLeagueId } = useParams()
  const [games, setGames] = useState<ExtendedGame[]>([])
  const [selectedWeek, setSelectedWeek] = useState<number>()
  const [groupedGames, setGroupedGames] = useState<Map<number, ExtendedGame[]>>(
    new Map()
  )

  console.log(games)

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
    getGames(Number(pastLeagueId))
  }, [pastLeagueId, getGames, selectedWeek])

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
          <span>{finalStanding.teamName}</span>
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

  const resultColumns = [
    {
      title: 'HOME',
      render: (result: ExtendedGame) => (
        <div className="flex items-center">
          {result.homeTeamInfo?.profileImgUrl ? (
            <img
              src={result.homeTeamInfo?.profileImgUrl}
              alt={result.homeTeamInfo?.name}
              className="mr-2 w-8"
            />
          ) : (
            <img src="/logo/KAFA_OG.png" alt="" className="mr-2 w-8" />
          )}
          <span>{result.homeTeamInfo?.name}</span>
        </div>
      )
    },
    {
      title: '',
      render: (result: ExtendedGame) => <span>{result.score?.homeScore}</span>
    },
    {
      title: 'AWAY',
      render: (result: ExtendedGame) => (
        <div className="flex items-center">
          {result.awayTeamInfo?.profileImgUrl ? (
            <img
              src={result.awayTeamInfo?.profileImgUrl}
              alt={result.awayTeamInfo?.name}
              className="mr-2 w-8"
            />
          ) : (
            <img src="/logo/KAFA_OG.png" alt="" className="mr-2 w-8" />
          )}
          <span>{result.awayTeamInfo?.name}</span>
        </div>
      )
    },
    {
      title: '',
      render: (result: ExtendedGame) => <span>{result.score?.awayScore}</span>
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
      render: (result: ExtendedGame) => (
        <div>
          <span>{result.stadium}</span>
        </div>
      )
    }
  ]

  return (
    <div className="container mx-auto my-5 grid grid-cols-1 sm:grid-cols-3">
      <div className="order-2 col-span-1 mx-5 sm:order-1 sm:col-span-2">
        <div className="mb-5">
          <DefaultTable
            title={`Week ${selectedWeek || 1}`}
            data={gamesForSelectedWeek}
            columns={resultColumns}
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
      <div className="order-1 col-span-1 mb-5 ml-5 sm:order-2 sm:ml-10">
        <DropdownSimple
          optionName={`Week ${selectedWeek || 1}`}
          optionList={weekOptions}
          onSelect={(weekNumber) => handleWeekSelect(Number(weekNumber))}
        />
      </div>
    </div>
  )
}

export default PastLeagueHomeItem
