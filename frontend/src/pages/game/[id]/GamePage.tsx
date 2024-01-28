import axiosInstance from '@/commons/axios'
import type { GameWithLeagueAndAssociation } from '@/commons/interfaces/game/game'
import type { Record } from '@/commons/interfaces/record/record'
import Button from '@/components/buttons/Button'
import ScoreCard from '@/components/cards/ScoreCard'
import DefaultTable from '@/components/tables/DefaultTable'
import { useDate } from '@/hooks/useDate'
import useNotification from '@/hooks/useNotification'
import { NotificationType } from '@/state/notificationState'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const GamePage = () => {
  const [homeTeamId, setHomeTeamId] = useState<number>()
  const [awayTeamId, setAwayTeamId] = useState<number>()
  const [switchTeam, setSwitchTeam] = useState(true)
  const { gameId } = useParams()
  const [game, setGame] = useState<GameWithLeagueAndAssociation>()
  const [homeTeamData, setHomeTeamData] = useState<Record[]>([])
  const [awayTeamData, setAwayTeamData] = useState<Record[]>([])
  const { showNotification } = useNotification()
  const [records, setRecords] = useState<Record[]>([])

  const navigate = useNavigate()

  const { parseUTCDate, formatDate } = useDate()

  const getRecordByGameId = async (gameId: string) => {
    try {
      const gameIdInt = parseInt(gameId, 10)
      if (!isNaN(gameIdInt)) {
        const response = await axiosInstance.get(`/records/games/${gameIdInt}`)
        setRecords(response.data)
      }
    } catch (error) {
      showNotification(
        NotificationType.Error,
        '득점 기록 불러오기 실패',
        '득점 기록을 불러오기에 실패했습니다.'
      )
    }
  }

  useEffect(() => {
    if (gameId) {
      getGameById()
      getRecordByGameId(gameId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId])

  useEffect(() => {
    if (records && homeTeamId && awayTeamId) {
      const filteredHomeTeamData = records.filter(
        (record) => record.Athlete.Roster.teamId === homeTeamId
      )
      const filteredAwayTeamData = records.filter(
        (record) => record.Athlete.Roster.teamId === awayTeamId
      )

      setHomeTeamData(filteredHomeTeamData)
      setAwayTeamData(filteredAwayTeamData)
    }
  }, [records, homeTeamId, awayTeamId])

  const getGameById = async () => {
    try {
      const response = await axiosInstance.get<GameWithLeagueAndAssociation>(
        `/games/${gameId}`
      )

      response.data.startedAt = formatDate(
        parseUTCDate(response.data.startedAt),
        'YYYY-MM-DD A hh:mm'
      )

      setGame(response.data)
      setHomeTeamId(response.data.homeTeam.id)
      setAwayTeamId(response.data.awayTeam.id)
    } catch (error) {
      showNotification(
        NotificationType.Error,
        '게임 기록 불러오기 실패',
        '게임 기록 불러오기에 실패했습니다.'
      )
    }
  }

  const handleClick = () => {
    setSwitchTeam(!switchTeam)
  }

  const homeTeamRecordColumns = [
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
        <div className="flex cursor-pointer items-center" onClick={() => []}>
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
    },
    {
      title: 'Position',
      render: (stats: Record) => {
        const positions = []
        if (stats.Athlete.position.offence) {
          positions.push(stats.Athlete.position.offence)
        }
        if (stats.Athlete.position.defense) {
          positions.push(stats.Athlete.position.defense)
        }
        if (stats.Athlete.position.special) {
          positions.push(stats.Athlete.position.special)
        }
        return <div>{positions.join('/')}</div>
      }
    }
  ]

  const awayTeamRecordColumns = [
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
        <div className="flex cursor-pointer items-center" onClick={() => []}>
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
    },
    {
      title: 'Position',
      render: (stats: Record) => {
        const positions = []
        if (stats.Athlete.position.offence) {
          positions.push(stats.Athlete.position.offence)
        }
        if (stats.Athlete.position.defense) {
          positions.push(stats.Athlete.position.defense)
        }
        if (stats.Athlete.position.special) {
          positions.push(stats.Athlete.position.special)
        }
        return <div>{positions.join('/')}</div>
      }
    }
  ]

  return (
    <>
      {game && (
        <div className="">
          <div className="bg-gray-900 py-5">
            <div className="mx-auto max-w-screen-xl px-4 lg:px-20">
              <div className="flex justify-between">
                <div className="flex text-white">
                  {game?.League?.Association?.profileImgUrl ? (
                    <img
                      src={game.League.Association.profileImgUrl}
                      alt={game.League.Association.name}
                      className="h-auto w-8 object-contain"
                    />
                  ) : (
                    <img
                      src="/logo/KAFA_OG.png"
                      alt=""
                      className="h-auto w-8 object-contain"
                    />
                  )}
                  <div className="ml-3 flex flex-col justify-center lg:ml-5">
                    <div className="text-xs text-gray-400">
                      {game?.League.name}
                    </div>
                    <div className="text-sm font-medium text-white lg:text-base">
                      {game?.name}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-screen-xl px-4 lg:px-20">
            {game && (
              <ScoreCard
                startedAt={game.startedAt}
                stadium={game.stadium || '경기장'}
                homeTeam={game.homeTeam}
                awayTeam={game.awayTeam}
                score={game.score}
                onClick={(teamId: number) => navigate(`/teams/${teamId}`)}
              />
            )}
          </div>

          <div className="bg-purple-950 py-5 text-white">
            <div className="mx-auto max-w-screen-xl px-4 lg:px-20">
              <div className="flex flex-row items-center">
                <div className="justify-center">STATS</div>
                <div className="ml-5">
                  <Button
                    variant="reverse"
                    label="HOME"
                    onClick={handleClick}
                    isActive={switchTeam === true}
                  />
                </div>
                <div className="ml-2">
                  <Button
                    variant="reverse"
                    label="AWAY"
                    onClick={handleClick}
                    isActive={switchTeam === false}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="minh-96 mx-auto max-w-screen-xl px-4 lg:px-20">
            <div className="my-5">
              {switchTeam === true && (
                <>
                  <div>
                    <div>
                      {homeTeamData.length > 0 ? (
                        <DefaultTable
                          title={'홈팀 득점 정보'}
                          data={homeTeamData}
                          columns={homeTeamRecordColumns}
                        />
                      ) : (
                        <div className="col-span-2 my-5 h-full w-full">
                          <p className="text-center text-xl font-light">
                            기록 정보가 없습니다
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
              {switchTeam === false && (
                <>
                  <div>
                    <div>
                      {awayTeamData.length > 0 ? (
                        <DefaultTable
                          title={'어웨이팀 득점 정보'}
                          data={awayTeamData}
                          columns={awayTeamRecordColumns}
                        />
                      ) : (
                        <div className="col-span-2 my-5 h-full w-full">
                          <p className="text-center text-xl font-light">
                            기록 정보가 없습니다
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default GamePage
