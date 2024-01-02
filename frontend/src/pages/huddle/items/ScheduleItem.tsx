import axiosInstance from '@/commons/axios'
import type { Association } from '@/commons/interfaces/association/association'
import type { Game } from '@/commons/interfaces/game/game'
import type { League } from '@/commons/interfaces/league/league'
import DropdownTransparent from '@/components/dropdown/DropdownTransparent'
import DefaultTable from '@/components/tables/DefaultTable'
import { useCallback, useEffect, useMemo, useState } from 'react'

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
const ScheduleItem = () => {
  const [associations, setAssociations] = useState<Association[]>([])
  const [leagues, setLeagues] = useState<League[]>([])
  const [games, setGames] = useState<ExtendedGame[]>([])
  const [selectedAssociationId, setSelectedAssociationId] = useState<number>(1)
  const [selectedLeagueId, setSelectedLeagueId] = useState<number>(1)
  const [selectedWeek, setSelectedWeek] = useState<number>()
  const [groupedGames, setGroupedGames] = useState<Map<number, ExtendedGame[]>>(
    new Map()
  )

  useEffect(() => {
    getAssociations()
    if (selectedAssociationId) {
      getLeagues(selectedAssociationId)
    }
  }, [selectedAssociationId])

  console.log(games)

  const handleAssociationSelect = (associationId: number) => {
    setSelectedAssociationId(associationId)
    setLeagues([])
    setGames([])
  }

  const handleLeagueSelect = (leagueId: number) => {
    setSelectedLeagueId(leagueId)
    setGames([])
  }

  const getAssociations = async () => {
    const page = 1
    const limit = 100
    try {
      const response = await axiosInstance.get(
        `/associations?page=${page}&limit=${limit}`
      )
      setAssociations(response.data)
    } catch (error) {
      alert(error)
    }
  }

  const getLeagues = async (associationId: number) => {
    const page = 1
    const limit = 3
    try {
      const response = await axiosInstance.get(
        `/leagues/associations/${associationId}?page=${page}&limit=${limit}`
      )
      setLeagues(response.data)
    } catch (error) {
      alert(error)
    }
  }

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
    if (selectedLeagueId) {
      getGames(selectedLeagueId)
    }
  }, [selectedLeagueId, getGames, selectedWeek])

  const resultColumns = [
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
    <div className="">
      <div className="bg-blue-950 p-5 sm:flex">
        {associations.length > 0 && (
          <div className="mb-2 sm:mr-5">
            <DropdownTransparent
              optionName={associations[0].name}
              optionList={associations.map((association) => ({
                id: association.id, // 'string | number' 타입의 id
                name: association.name
              }))}
              onSelect={(id) => {
                handleAssociationSelect(id) // 이미 number 타입이므로 추가 변환 없이 직접 사용
              }}
            />
          </div>
        )}
        {leagues.length > 0 && (
          <div className="mb-2 sm:mr-5">
            <DropdownTransparent
              optionName={leagues[2].name}
              optionList={leagues.map((league) => ({
                id: league.id, // 'string | number' 타입의 id
                name: league.name
              }))}
              onSelect={(id) => {
                handleLeagueSelect(id) // 이미 number 타입이므로 추가 변환 없이 직접 사용
              }}
            />
          </div>
        )}
        <DropdownTransparent
          optionName={`Week ${selectedWeek || 1}`}
          optionList={weekOptions}
          onSelect={(weekNumber) => handleWeekSelect(Number(weekNumber))}
        />
      </div>
      <div className="container mx-auto mt-5">
        <div className="mx-5 mb-3">
          <DefaultTable
            title={`Week ${selectedWeek || 1}`}
            data={gamesForSelectedWeek}
            columns={resultColumns}
          />
        </div>
      </div>
    </div>
  )
}

export default ScheduleItem
