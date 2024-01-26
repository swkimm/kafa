// Stats.tsx
import axiosInstance from '@/commons/axios'
import type { GameMany } from '@/commons/interfaces/game/game'
import type { Record } from '@/commons/interfaces/record/record'
import DropdownSimple from '@/components/dropdown/DropdownLeft'
import WithSubtitleTable from '@/components/tables/WithSubtitleTable'
import useNotification from '@/hooks/useNotification'
import { NotificationType } from '@/state/notificationState'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

interface DropdownOption {
  id: number
  name: string
}

const StatsItem: React.FC = () => {
  const thisYear = new Date().getFullYear()
  const { teamId, leagueId } = useParams()
  const [games, setGames] = useState<GameMany[]>([])
  const [filteredGames, setFilteredGames] = useState<GameMany[]>([])
  const [selectedGame, setSelectedGame] = useState<GameMany>() // 선택된 게임 상태
  const [records, setRecords] = useState<Record[]>([])
  const { showNotification } = useNotification()
  const [startedYear, setStartedYear] = useState()

  const [options] = useState<DropdownOption[]>([
    {
      id: 1,
      name: '' + thisYear
    },
    {
      id: 2,
      name: '' + (thisYear - 1)
    },
    {
      id: 3,
      name: '' + (thisYear - 2)
    },
    {
      id: 4,
      name: '' + (thisYear - 3)
    },
    {
      id: 5,
      name: '' + (thisYear - 4)
    }
  ])

  const getLeague = async () => {
    const response = await axiosInstance.get(`/leagues/${leagueId}`)
    setStartedYear(response.data.startedYear)
  }

  const handleYearSelect = (selected: string) => {
    const selectedYear = parseInt(selected, 10)
    filterGamesByYear(selectedYear)
  }

  const filterGamesByYear = (selectedYear: number) => {
    const filtered = games.filter((game) => {
      const gameYear = new Date(game.startedAt).getFullYear()
      return gameYear === selectedYear
    })
    setFilteredGames(filtered)

    if (filtered.length > 0) {
      setSelectedGame(filtered[0])
      getRecodeByGameId(filtered[0].id)
    } else {
      setSelectedGame(undefined)
    }
  }

  const initialYear = startedYear ? startedYear : thisYear

  const getGamesByTeamId = async () => {
    try {
      const response = await axiosInstance.get(
        `/games/teams/${teamId}?page=1&limit=100`
      )
      setGames(response.data)

      const filtered = response.data.filter(
        (game: GameMany) =>
          new Date(game.startedAt).getFullYear() === initialYear
      )
      setFilteredGames(filtered)

      if (filtered.length > 0) {
        setSelectedGame(filtered[0])
        getRecodeByGameId(filtered[0].id)
      } else {
        setSelectedGame(undefined)
        setRecords([])
      }
    } catch (error) {
      showNotification(
        NotificationType.Error,
        '게임 목록 불러오기 실패',
        '게임 목록 불러오기에 실패했습니다.'
      )
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await getLeague()
      await getGamesByTeamId()
    }

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId, startedYear, thisYear])

  const handleGameSelect = (selectedName: string) => {
    // 게임 이름으로 ID 찾기
    const selectedGameOption = gameOptions.find(
      (option) => option.name === selectedName
    )
    const selectedGameId = selectedGameOption ? selectedGameOption.id : null

    // ID로 게임 찾기
    if (selectedGameId !== null) {
      const foundGame = games.find((game) => game.id === selectedGameId)
      if (foundGame) {
        setSelectedGame(foundGame)
        getRecodeByGameId(foundGame.id)
      } else {
        setSelectedGame(undefined)
      }
    } else {
      setSelectedGame(undefined)
    }
  }

  //getGameByTeamId에서 gameId를 받아와서 getRecodeByGameId 실행
  const getRecodeByGameId = async (gameId: number) => {
    try {
      const response = await axiosInstance.get<Record[]>(
        `/records/games/${gameId}`
      )
      const numericTeamId = teamId ? parseInt(teamId, 10) : undefined

      const filteredRecords = response.data.filter(
        (record) => record.Athlete.Roster?.teamId === numericTeamId
      )
      setRecords(filteredRecords)
    } catch (error) {
      showNotification(
        NotificationType.Error,
        '기록 불러오기 실패',
        '기록 불러오기에 실패했습니다.'
      )
    }
  }

  const gameStatsColumns = [
    {
      title: 'Unit',
      render: (stats: Record) => <div>{stats.unit}</div>
    },
    {
      title: 'Score',
      render: (stats: Record) => <div>{stats.score}</div>
    },
    {
      title: 'Type',
      render: (stats: Record) => <div>{stats.type}</div>
    },
    {
      title: 'Athlete',
      render: (stats: Record) => (
        <div className="flex items-center ">
          <div>
            {stats.Athlete.Roster.profileImgUrl ? (
              <img
                src={stats.Athlete.Roster.profileImgUrl}
                alt={stats.Athlete.Roster.name}
              />
            ) : (
              <img src="/logo/KAFA_OG.png" alt="" className="w-8" />
            )}
          </div>
          <div>{stats.Athlete.Roster.name}</div>
        </div>
      )
    }
  ]

  const gameOptions = filteredGames.map((game) => ({
    id: game.id,
    name: game.name
  }))

  return (
    <div className="container mx-auto my-5 grid max-w-screen-2xl grid-cols-1 px-5 sm:grid-cols-3">
      <div className="order-2 col-span-1 sm:order-1 sm:col-span-2">
        {gameOptions.length > 0 ? (
          <>
            <div>
              <WithSubtitleTable
                title="경기일정"
                subTitle={`vs ${selectedGame ? selectedGame.awayTeam.name : ''}`}
                data={records.length > 0 ? records : []}
                columns={gameStatsColumns}
              />
            </div>
            {records.length === 0 && (
              <div className="col-span-2 my-5 h-full w-full">
                <p className="text-center text-xl font-light">
                  이 팀에 대한 기록이 없습니다.
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="col-span-2 my-5 h-full w-full">
            <p className="text-center text-xl font-light">
              해당 연도에 게임 정보가 없습니다.
            </p>
          </div>
        )}
      </div>
      <div className="order-1 col-span-1 sm:order-2">
        <div className="mb-5 sm:ml-5">
          <DropdownSimple
            optionName={startedYear}
            optionList={options}
            onSelect={handleYearSelect}
          />
        </div>
        <div className="mb-5 sm:ml-5">
          {gameOptions.length > 0 ? (
            <DropdownSimple
              optionName={
                selectedGame ? selectedGame.name : gameOptions[0].name
              }
              optionList={gameOptions}
              onSelect={handleGameSelect}
            />
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StatsItem
