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
  const [, setGames] = useState<ExtendedGame[]>([])
  const [selectedAssociationId, setSelectedAssociationId] = useState<number>(1)
  const [selectedLeagueId, setSelectedLeagueId] = useState<number>(1)
  const [selectedWeek, setSelectedWeek] = useState<number>(1)
  const [groupedGames, setGroupedGames] = useState<Map<number, ExtendedGame[]>>(
    new Map()
  )
  const selectedAssociationName =
    associations.find((assoc) => assoc.id === selectedAssociationId)?.name ||
    'Select Association'

  const selectedLeagueName = leagues.find(
    (league) => league.id === selectedLeagueId
  )?.name

  useEffect(() => {
    getAssociations()
    if (selectedAssociationId) {
      getLeagues(selectedAssociationId)
    }
  }, [selectedAssociationId])

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
      console.error(error)
    }
  }

  const getLeagues = async (associationId: number) => {
    const page = 1
    const limit = 100
    try {
      const response = await axiosInstance.get(
        `/leagues/associations/${associationId}?page=${page}&limit=${limit}`
      )
      setLeagues(response.data)
    } catch (error) {
      console.error(error)
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
    const limit = 100
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

      const weekOptions = Array.from(grouped.keys())
        .sort((a, b) => a - b)
        .map((week) => ({ id: week, name: `Week ${week}` }))
      setSelectedWeek(weekOptions[0]?.id)
    } catch (error) {
      console.error(error)
    }
  }, [])

  const weekOptions = useMemo(() => {
    const weeks = Array.from(groupedGames.keys()).sort()
    return weeks.map((week) => ({
      id: week,
      name: `Week ${week}`
    }))
  }, [groupedGames])

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
    <div className="w-full">
      <div className="bg-blue-950 py-5">
        <div className="mx-auto max-w-screen-xl px-4 sm:flex lg:px-20">
          {associations.length > 0 && (
            <div className="mb-2 sm:mr-5">
              <DropdownTransparent
                optionName={selectedAssociationName}
                optionList={associations.map((association) => ({
                  id: association.id,
                  name: association.name
                }))}
                onSelect={(id) => {
                  handleAssociationSelect(id)
                }}
              />
            </div>
          )}
          {leagues && leagues.length > 0 && (
            <div className="mb-2 sm:mr-5">
              <DropdownTransparent
                optionName={selectedLeagueName}
                optionList={leagues.map((league) => ({
                  id: league.id,
                  name: league.name
                }))}
                onSelect={(id) => {
                  handleLeagueSelect(id)
                }}
              />
            </div>
          )}
          {weekOptions && weekOptions.length > 0 && (
            <div className="mb-2 sm:mr-5">
              <DropdownTransparent
                optionName={`Week ${selectedWeek || 1}`}
                optionList={weekOptions}
                onSelect={(weekNumber) => handleWeekSelect(Number(weekNumber))}
              />
            </div>
          )}
        </div>
      </div>
      <div className="container mx-auto mt-5 max-w-screen-xl px-4 lg:px-20">
        <div className="mb-48">
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
