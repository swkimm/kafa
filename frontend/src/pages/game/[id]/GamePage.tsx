import axiosInstance from '@/commons/axios'
import type { Association } from '@/commons/interfaces/association/association'
import type { GameWithLeagueAndAssociation } from '@/commons/interfaces/game/game'
import type { Record } from '@/commons/interfaces/record/record'
import type { Score } from '@/commons/interfaces/score/score'
import Button from '@/components/buttons/Button'
import ScoreCard from '@/components/cards/ScoreCard'
import DefaultTable from '@/components/tables/DefaultTable'
import useNotification from '@/hooks/useNotification'
import { NotificationType } from '@/state/notificationState'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const GamePage = () => {
  const search = window.location.search
  const params = new URLSearchParams(search)
  const home = params.get('home')
  const away = params.get('away')
  const year = params.get('year')
  const homeTeamId = parseInt(params.get('home') || '0', 10)
  const awayTeamId = parseInt(params.get('away') || '0', 10)
  const navigate = useNavigate()
  const [switchTeam, setSwitchTeam] = useState(true)
  const { leagueId, gameId } = useParams()
  const [game, setGame] = useState<GameWithLeagueAndAssociation | undefined>(
    undefined
  )
  // Record 타입을 사용하여 상태를 초기화합니다.
  const [homeTeamData, setHomeTeamData] = useState<Record[]>([])
  const [awayTeamData, setAwayTeamData] = useState<Record[]>([])
  const { showNotification } = useNotification()

  const [records, setRecords] = useState<Record[]>([]) // 여기서 `any` 대신 더 구체적인 타입을 사용하는 것이 좋습니다.

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
    if (gameId !== undefined) {
      getRecordByGameId(gameId) // 컴포넌트 마운트 시 getRecordByGameId 호출
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId])

  useEffect(() => {
    if (records) {
      const filteredHomeTeamData = records.filter(
        (item) => item.Athlete.Roster.teamId === homeTeamId
      )
      const filteredAwayTeamData = records.filter(
        (item) => item.Athlete.Roster.teamId === awayTeamId
      )

      setHomeTeamData(filteredHomeTeamData)
      setAwayTeamData(filteredAwayTeamData)
    }
  }, [homeTeamId, awayTeamId, records])

  const fetchGetAssociationInfo = async (associationId: number) => {
    const response = await axiosInstance.get<Association>(
      `/associations/${associationId}`
    )
    return response.data
  }
  const fetchGetLeagueName = async (leagueId: number) => {
    const response = await axiosInstance.get(`/leagues/${leagueId}`)
    return response.data
  }

  const fetchGetScoreInfo = async (gameId: number) => {
    const response = await axiosInstance.get<Score>(`/games/${gameId}/score`)
    return response.data
  }

  const fetchGetTeamInfo = async (teamId: number) => {
    const response = await axiosInstance.get(`/teams/${teamId}`)
    return response.data
  }

  const getGameById = async () => {
    try {
      const response = await axiosInstance.get(`/games/${gameId}`)
      const gameData = response.data

      const homeTeamId = Number(home)
      const awayTeamId = Number(away)
      const gameIdNumber = Number(gameId) || 0
      const leagueIdNumber = Number(leagueId)

      const leagueInfo = await fetchGetLeagueName(leagueIdNumber)

      let associationInfo = {}
      if (leagueInfo.associationId) {
        const associationId = leagueInfo.associationId
        associationInfo = await fetchGetAssociationInfo(associationId)
      }

      const homeTeamInfo = await fetchGetTeamInfo(homeTeamId)
      const awayTeamInfo = await fetchGetTeamInfo(awayTeamId)
      const scoreResponse = await fetchGetScoreInfo(gameIdNumber)

      const completeGameData = {
        ...gameData,
        League: {
          ...leagueInfo,
          Association: associationInfo
        },
        homeTeam: homeTeamInfo,
        awayTeam: awayTeamInfo,
        score: scoreResponse
      }

      setGame(completeGameData)
    } catch (error) {
      showNotification(
        NotificationType.Error,
        '게임 기록 불러오기 실패',
        '게임 기록 불러오기에 실패했습니다.'
      )
    }
  }

  useEffect(() => {
    getGameById()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleClick = () => {
    setSwitchTeam(!switchTeam)
  }

  const goToMemberDetail = (teamId: number, memberId: number) => {
    navigate(
      `/leagues/${leagueId}/teams/${teamId}/members/${memberId}?year=${year}`
    )
  }

  const convertDateTime = (dateTimeStr: Date) => {
    const date = new Date(dateTimeStr)

    // 시간대 변환을 위해 'en-US' 로케일 사용, 필요에 따라 로케일을 변경할 수 있음
    const formattedDate = date.toLocaleString('en-US', {
      hour12: true,
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    })

    return formattedDate
  }

  const newDateTime = game?.startedAt ? convertDateTime(game.startedAt) : ''

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
        <div
          className="flex cursor-pointer items-center"
          onClick={() =>
            goToMemberDetail(
              stats.Athlete.Roster.teamId,
              stats.Athlete.Roster.id
            )
          }
        >
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
        <div
          className="flex cursor-pointer items-center"
          onClick={() =>
            goToMemberDetail(
              stats.Athlete.Roster.teamId,
              stats.Athlete.Roster.id
            )
          }
        >
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
    <div className="mb-5">
      <div className="max-w-screen">
        <div className="flex justify-between bg-gray-800 lg:p-3">
          <div className="flex text-white">
            {game?.League?.Association?.profileImgUrl ? (
              <img
                src={game.League.Association.profileImgUrl}
                alt={game.League.Association.name}
                className="h-auto w-12"
              />
            ) : (
              <img src="/logo/KAFA_OG.png" alt="" className="h-auto w-12" />
            )}
            <div className="ml-3 flex flex-col justify-center lg:ml-5">
              <div className="text-gray-250 text-sm font-semibold">
                {game?.League.name}
              </div>
              <div className="text-white-900 text-md font-bold lg:text-lg">
                {game?.name}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        {game && (
          <ScoreCard
            startedAt={newDateTime}
            stadium={game.stadium || '경기장'}
            homeTeam={game.homeTeam}
            awayTeam={game.awayTeam}
            score={game.score}
          />
        )}
      </div>

      <div className="flex items-center bg-indigo-800 p-6 text-xl text-white">
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
      <div className="container mx-auto mt-5">
        <div className="mb-10">
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
                        해당 팀에 득점 기록이 없습니다.
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
                        해당 팀에 득점 기록이 없습니다.
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
  )
}

export default GamePage
