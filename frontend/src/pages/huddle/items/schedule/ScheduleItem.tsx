import axiosInstance from '@/commons/axios'
import { getStartAndEndDates } from '@/commons/functions/calculate-week/get-week-start-end.util'
import { getWeeksBetween } from '@/commons/functions/calculate-week/get-weeks.between.util'
import type { GameWithLeagueAndAssociation } from '@/commons/interfaces/game/game'
import type { LeagueWithAssociation } from '@/commons/interfaces/league/getLeaguesWithYears'
import MainCard from '@/components/cards/MainCard'
import type { ListboxOption } from '@/components/dropdown/Listbox'
import ListboxComponent from '@/components/dropdown/Listbox'
import GameTable from '@/components/tables/GameTable'
import { useDate } from '@/hooks/useDate'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ScheduleItem = () => {
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i)

  const [leagues, setLeagues] = useState<LeagueWithAssociation[]>([])
  const [weeks, setWeeks] = useState<ListboxOption[]>([])
  const [games, setGames] = useState<GameWithLeagueAndAssociation[]>([])

  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [selectedLeague, setSelectedLeague] = useState<LeagueWithAssociation>()
  const [selectedWeek, setSelectedWeek] = useState<number>()

  const { parseUTCDate, formatDate } = useDate()

  const navigate = useNavigate()

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const response = await axiosInstance.get(
          `/leagues/years/${selectedYear}?page=1&limit=15`
        )
        setLeagues(response.data)
        setSelectedLeague(response.data.length > 0 ? response.data[0] : null)
      } catch (error) {
        setLeagues([])
        setSelectedLeague(undefined)
      }
    }

    fetchLeagues()
  }, [selectedYear])

  useEffect(() => {
    if (!selectedLeague) {
      setWeeks([])
      setSelectedWeek(undefined)
      return
    }

    const weekLength = getWeeksBetween(
      selectedLeague.startedAt,
      selectedLeague.endedAt
    )
    const weekOptions = Array.from({ length: weekLength }, (_, i) => ({
      id: i + 1,
      name: 'Week ' + (i + 1)
    }))

    setWeeks(weekOptions)
    setSelectedWeek(weekOptions.length > 0 ? weekOptions[0].id : undefined)
  }, [selectedLeague])

  useEffect(() => {
    const fetchGames = async () => {
      if (!selectedLeague || selectedWeek === undefined) {
        setGames([])
        return
      }

      const { start, end } = getStartAndEndDates(
        selectedLeague.startedAt,
        selectedWeek
      )

      try {
        const response = await axiosInstance.get<
          GameWithLeagueAndAssociation[]
        >(
          `/games/leagues/${selectedLeague.id}/date-range?startDate=${start}&endDate=${end}`
        )

        response.data.forEach((game) => {
          game.startedAt = formatDate(
            parseUTCDate(game.startedAt),
            'YYYY-MM-DD A hh:mm'
          )
        })
        setGames(response.data)
      } catch (error) {
        setGames([])
      }
    }

    fetchGames()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLeague, selectedWeek])

  const handleYearChange = (year: ListboxOption) => {
    setSelectedYear(year.id)
  }

  const handleLeagueChange = (event: ListboxOption) => {
    const league = leagues.find((league) => league.id === event.id)
    setSelectedLeague(league)
  }

  const handleWeekChange = (week: ListboxOption) => {
    setSelectedWeek(week.id)
  }

  return (
    <div className="w-full">
      <div className="bg-indigo-950 py-5">
        <div className="mx-auto flex max-w-screen-xl flex-col gap-1.5 px-4 md:flex-row lg:px-20">
          <div className="md:w-56">
            <ListboxComponent
              options={years.map((year) => ({
                id: year,
                name: year.toString()
              }))}
              onChange={handleYearChange}
              value={{ id: selectedYear, name: selectedYear.toString() }}
            />
          </div>
          <div className="md:w-56">
            {leagues && leagues.length > 0 && (
              <ListboxComponent
                options={leagues.map((league) => ({
                  id: league.id,
                  name: league.name
                }))}
                onChange={handleLeagueChange}
                value={
                  selectedLeague
                    ? { id: selectedLeague.id, name: selectedLeague.name }
                    : { id: -1, name: '옵션 없음' }
                }
              />
            )}
          </div>
          <div className="md:w-56">
            {weeks && weeks.length > 0 && (
              <ListboxComponent
                options={weeks}
                onChange={handleWeekChange}
                value={
                  selectedWeek !== undefined
                    ? { id: selectedWeek, name: 'Week ' + selectedWeek }
                    : { id: -1, name: '옵션 없음' }
                }
              />
            )}
          </div>
        </div>
      </div>
      <div className="mx-auto mb-10 mt-5 min-h-[480px] max-w-screen-xl lg:px-20">
        <MainCard title={'경기 목록'} transparent={false}>
          <GameTable
            games={games}
            detail={true}
            onClick={(gameId: number) => navigate(`/games/${gameId}`)}
          />
        </MainCard>
      </div>
    </div>
  )
}

export default ScheduleItem
