import axiosInstance from '@/commons/axios'
import { getStartAndEndDates } from '@/commons/functions/calculate-week/get-week-start-end.util'
import { getWeeksBetween } from '@/commons/functions/calculate-week/get-weeks.between.util'
import type { GameWithLeagueAndAssociation } from '@/commons/interfaces/game/game'
import type { League } from '@/commons/interfaces/league/league'
import type { LeagueRank } from '@/commons/interfaces/league/rank'
import MainCard from '@/components/cards/MainCard'
import type { ListboxOption } from '@/components/dropdown/Listbox'
import ListboxComponent from '@/components/dropdown/Listbox'
import GameTable from '@/components/tables/GameTable'
import RankTable from '@/components/tables/RankTable'
import { useEffect, useState } from 'react'

interface LeagueHomeItemProps {
  league: League
}

const LeagueHomeItem: React.FC<LeagueHomeItemProps> = ({ league }) => {
  const [games, setGames] = useState<GameWithLeagueAndAssociation[]>([])
  const [weeks, setWeeks] = useState<ListboxOption[]>([])
  const [ranks, setRanks] = useState<LeagueRank[]>([])
  const [selectedWeek, setSelectedWeek] = useState<number>()

  useEffect(() => {
    const weekLength = getWeeksBetween(league.startedAt, league.endedAt)
    const weekOptions = Array.from({ length: weekLength }, (_, i) => ({
      id: i + 1,
      name: 'Week ' + (i + 1)
    }))

    setWeeks(weekOptions)
    setSelectedWeek(weekOptions.length > 0 ? weekOptions[0].id : undefined)
  }, [league])

  useEffect(() => {
    const getGames = async () => {
      if (selectedWeek === undefined) {
        setGames([])
        return
      }

      const { start, end } = getStartAndEndDates(league.startedAt, selectedWeek)

      try {
        const response: { data: GameWithLeagueAndAssociation[] } =
          await axiosInstance.get(
            `/games/leagues/${league.id}/date-range?startDate=${start}&endDate=${end}`
          )

        response.data.forEach(
          (game) => (game.startedAt = new Date(game.startedAt))
        )
        setGames(response.data)
      } catch (error) {
        setGames([])
      }
    }

    getGames()
  }, [selectedWeek, league])

  useEffect(() => {
    const getRanking = async () => {
      const response = await axiosInstance.get<LeagueRank[]>(
        `/leagues/${league.id}/rank`
      )

      response.data.sort((a, b) => {
        if (a.rank === b.rank) {
          if (a.win === b.win) {
            if (a.draw === b.draw) {
              if (a.lose === b.lose) {
                return 0
              }
              return a.lose - b.lose
            }
            return a.draw - b.draw
          }
          return a.win - b.win
        }
        return a.rank - b.rank
      })

      console.log(response.data)

      setRanks(response.data)
    }

    getRanking()
  }, [league])

  const handleWeekChange = (week: ListboxOption) => {
    setSelectedWeek(week.id)
  }

  return (
    <div className="mx-auto mt-3 max-w-screen-xl lg:px-20">
      <div className="grid grid-cols-6 gap-5">
        <div className="col-span-6 lg:col-span-4">
          <MainCard
            title="경기 일정"
            transparent={false}
            detailedMore={
              <div>
                <ListboxComponent
                  options={weeks}
                  onChange={handleWeekChange}
                  value={
                    selectedWeek !== undefined
                      ? { id: selectedWeek, name: 'Week ' + selectedWeek }
                      : { id: -1, name: '옵션 없음' }
                  }
                />
              </div>
            }
          >
            <GameTable games={games} detail={true} />
          </MainCard>
        </div>
        <div className="col-span-6 lg:col-span-2">
          <div className="mb-5">
            <MainCard title="리그 순위" transparent={false}>
              <RankTable ranks={ranks} />
            </MainCard>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeagueHomeItem
