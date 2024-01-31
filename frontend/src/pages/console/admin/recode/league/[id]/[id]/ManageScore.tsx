import axiosInstance from '@/commons/axios'
import type { Game } from '@/commons/interfaces/game/game'
import type { RecordType } from '@/commons/interfaces/record/record'
import type { Score } from '@/commons/interfaces/score/score'
import Button from '@/components/buttons/Button'
import useNotification from '@/hooks/useNotification'
import { NotificationType } from '@/state/notificationState'
import type { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ManageRecode from './ManageRecode'

interface ExtendedGame extends Game {
  id: number
  score: {
    homeTeamScore: number
    homeTeamQuarterScores: []
    awayTeamScore: number
    awayTeamQuarterScores: []
    overtime: boolean
  } | null
  homeTeamInfo: {
    id: number
    name: string
    profileImgUrl: string
  }
  awayTeamInfo: {
    id: number
    name: string
    profileImgUrl: string
  }
}

interface ScoringEvent {
  id: number
  unit: string // 단위
  score: number // 점수
  type: RecordType // 기록 종류
  rosterId: number
}

interface ScoringData {
  home: ScoringEvent[]
  away: ScoringEvent[]
}

const ManageScore = () => {
  const { gameId: gameIdString } = useParams()
  const gameId = Number(gameIdString)
  const { showNotification } = useNotification()

  const [game, setGame] = useState<ExtendedGame>()
  const [homeTeamQuarterScores, setHomeTeamQuarterScores] = useState<number[]>([
    0, 0, 0, 0
  ])
  const [awayTeamQuarterScores, setAwayTeamQuarterScores] = useState<number[]>([
    0, 0, 0, 0
  ])
  const [isOvertime, setIsOvertime] = useState(false)
  const [userChangedOvertime, setUserChangedOvertime] = useState(false)
  const [scoringData, setScoringData] = useState<ScoringData>({
    home: [],
    away: []
  })

  const fetchGetScoreById = async (gameId: number) => {
    try {
      const response = await axiosInstance.get<Score>(`/games/${gameId}/score`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      if (axiosError.response && axiosError.response.status === 404) {
        return null
      }
      throw error
    }
  }

  const fetchGetTeamName = async (teamId: number) => {
    const response = await axiosInstance.get(`/teams/${teamId}`)
    return response.data
  }

  const getGamesByLeagueId = async () => {
    try {
      const response = await axiosInstance.get<ExtendedGame>(`/games/${gameId}`)
      const gameData = response.data

      const scoreResponse = gameData.id
        ? await fetchGetScoreById(gameData.id)
        : null
      const homeTeamResponse = gameData.homeTeamId
        ? await fetchGetTeamName(gameData.homeTeamId)
        : null
      const awayTeamResponse = gameData.awayTeamId
        ? await fetchGetTeamName(gameData.awayTeamId)
        : null

      const gameWithAdditionalInfo = {
        ...gameData,
        score: scoreResponse,
        homeTeamInfo: homeTeamResponse,
        awayTeamInfo: awayTeamResponse
      }
      setGame(gameWithAdditionalInfo as ExtendedGame)

      console.log(gameWithAdditionalInfo)

      if (
        scoreResponse &&
        scoreResponse.homeTeamQuarterScores &&
        scoreResponse.awayTeamQuarterScores
      ) {
        setHomeTeamQuarterScores(scoreResponse.homeTeamQuarterScores)
        setAwayTeamQuarterScores(scoreResponse.awayTeamQuarterScores)
      }
    } catch (error) {
      showNotification(
        NotificationType.Error,
        '게임 불러오기 실패',
        '게임 불러오기에 실패했습니다.'
      )
    }
  }

  useEffect(() => {
    getGamesByLeagueId()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleQuarterScoreChange = (
    team: string,
    quarter: number,
    score: number
  ) => {
    if (team === 'home') {
      setHomeTeamQuarterScores((scores) => {
        const newScores = [...scores]
        newScores[quarter] = score

        if (quarter === 4) {
          setAwayTeamQuarterScores((awayScores) => {
            const updatedAwayScores = [...awayScores]
            updatedAwayScores[4] = 0
            return updatedAwayScores
          })
        }

        return newScores
      })
    } else if (team === 'away') {
      setAwayTeamQuarterScores((scores) => {
        const newScores = [...scores]
        newScores[quarter] = score

        if (quarter === 4) {
          setHomeTeamQuarterScores((homeScores) => {
            const updatedHomeScores = [...homeScores]
            updatedHomeScores[4] = 0
            return updatedHomeScores
          })
        }
        return newScores
      })
    }
  }

  const handleOvertimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target
    setIsOvertime(checked)
    setUserChangedOvertime(true)

    // 연장전이 비활성화되면 연장전 점수를 삭제합니다.
    if (!checked) {
      setHomeTeamQuarterScores((scores) => scores.slice(0, 4))
      setAwayTeamQuarterScores((scores) => scores.slice(0, 4))
    }
    // 연장전이 활성화되면 연장전 점수를 0으로 초기화합니다.
    else {
      setHomeTeamQuarterScores((scores) => [...scores, 0])
      setAwayTeamQuarterScores((scores) => [...scores, 0])
    }
  }

  const handleScoreDataChange = (data: ScoringData) => {
    if (
      JSON.stringify(scoringData.home) !== JSON.stringify(data.home) ||
      JSON.stringify(scoringData.away) !== JSON.stringify(data.away)
    ) {
      setScoringData(data)
    }
  }

  const submitScoringEvents = async (
    gameId: number,
    scoringEvents: ScoringEvent[]
  ) => {
    for (const event of scoringEvents) {
      const payload = {
        unit: event.unit,
        score: event.score,
        type: event.type
      }

      if (event.id === 0) {
        // 새로운 이벤트: POST 요청
        await axiosInstance.post(
          `/admin/records/rosters/${event.rosterId}/games/${gameId}`,
          payload
        )
      } else {
        // 기존 이벤트: PUT 요청
        await axiosInstance.put(`/admin/records/${event.id}`, payload)
      }
    }
  }

  const createRecode = async (gameId: number) => {
    try {
      submitScoringEvents(gameId, scoringData.home)
      submitScoringEvents(gameId, scoringData.away)
      const createScoreData = {
        homeTeamQuarterScores: homeTeamQuarterScores,
        awayTeamQuarterScores: awayTeamQuarterScores,
        overtime: isOvertime
      }
      await axiosInstance.post(`/admin/games/${gameId}/score`, createScoreData)
      showNotification(
        NotificationType.Error,
        '점수(기록) 등록 성공',
        '점수 및 기록 등록에 성공하였습니다.',
        2500
      )
      getGamesByLeagueId()
    } catch (error) {
      showNotification(
        NotificationType.Error,
        '점수(기록) 등록 실패',
        '점수 및 기록 등록에 실패하였습니다.',
        2500
      )
    }
  }

  const modifyRecode = async (gameId: number) => {
    try {
      submitScoringEvents(gameId, scoringData.home)
      submitScoringEvents(gameId, scoringData.away)
      const scoreData = await fetchGetScoreById(gameId)

      if (scoreData) {
        // Update the state with the fetched scores
        setHomeTeamQuarterScores(
          scoreData.homeTeamQuarterScores || [0, 0, 0, 0]
        )
        setAwayTeamQuarterScores(
          scoreData.awayTeamQuarterScores || [0, 0, 0, 0]
        )
      } else {
        setHomeTeamQuarterScores([0, 0, 0, 0])
        setAwayTeamQuarterScores([0, 0, 0, 0])
      }

      const modifyScoreData = {
        homeTeamQuarterScores: homeTeamQuarterScores,
        awayTeamQuarterScores: awayTeamQuarterScores,
        overtime: isOvertime
      }
      await axiosInstance.put(`/admin/games/${gameId}/score`, modifyScoreData)
      showNotification(
        NotificationType.Success,
        '점수 수정 성공',
        '점수 수정에 성공하였습니다.',
        2500
      )
      getGamesByLeagueId()
    } catch (error) {
      showNotification(
        NotificationType.Error,
        '점수 불러오기 실패',
        '점수 불러오기에 실패하였습니다.',
        2500
      )
      setHomeTeamQuarterScores([0, 0, 0, 0])
      setAwayTeamQuarterScores([0, 0, 0, 0])
    }
  }

  useEffect(() => {
    if (game && game.score && !userChangedOvertime) {
      setIsOvertime(game.score.overtime)
    }
  }, [game, userChangedOvertime])

  return (
    <div className="m-5">
      <div className="text-md mb-5 font-bold">기록 관리</div>

      <div className="mt-3 p-5 text-center sm:mt-5">
        <div>
          <div className="grid grid-cols-7 gap-2">
            <div className="col-span-1"></div>
            <div className="col-span-3">
              <div className="mb-3 text-lg font-bold">HOME</div>
              <div className="flex items-center justify-center align-middle">
                <div>
                  <img src="/logo/KAFA_OG.png" alt="" className="w-10" />
                </div>
                <div className="ml-2">{game?.homeTeamInfo?.name}</div>
              </div>
            </div>
            <div className="col-span-3">
              <div className="mb-3 text-lg font-bold">AWAY</div>
              <div className="flex items-center justify-center align-middle">
                <div>
                  <img src="/logo/KAFA_OG.png" alt="" className="w-10" />
                </div>
                <div className="ml-2">{game?.awayTeamInfo?.name}</div>
              </div>
            </div>
          </div>
          {['1Q', '2Q', '3Q', '4Q'].map((quarter, index) => (
            <div key={quarter} className="grid grid-cols-7 gap-2">
              <div className="col-span-1 flex h-full items-center justify-center">
                {quarter}
              </div>
              <div className="col-span-3 mt-1.5">
                <input
                  type="number"
                  value={homeTeamQuarterScores[index] ?? 0}
                  onChange={(event) => {
                    const score = parseInt(event.target.value, 10)
                    handleQuarterScoreChange(
                      'home',
                      index,
                      isNaN(score) ? 0 : score // NaN 처리
                    )
                  }}
                  className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div className="col-span-3 mt-1.5">
                <input
                  type="number"
                  value={awayTeamQuarterScores[index] ?? 0}
                  onChange={(event) => {
                    const score = parseInt(event.target.value, 10)
                    handleQuarterScoreChange(
                      'away',
                      index,
                      isNaN(score) ? 0 : score // NaN 처리
                    )
                  }}
                  className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          <div className="col-span-1 mt-1.5">연장</div>
          <label className="col-span-6 mt-1.5 inline-flex cursor-pointer items-center rounded-lg bg-indigo-600 px-2 py-1.5">
            <input
              type="checkbox"
              checked={isOvertime}
              onChange={handleOvertimeChange}
            />
            <span className="ml-2 text-white">
              {isOvertime ? '활성화' : '비활성화'}
            </span>
          </label>
        </div>
        {isOvertime && (
          <div className="mt-2 grid grid-cols-7 gap-2">
            <div className="col-span-1">연장전</div>
            <div className="col-span-3">
              <input
                type="number"
                value={homeTeamQuarterScores[4] || 0}
                onChange={(e) =>
                  handleQuarterScoreChange(
                    'home',
                    4,
                    parseInt(e.target.value) || 0
                  )
                }
                className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div className="col-span-3">
              <input
                type="number"
                value={awayTeamQuarterScores[4] || 0}
                onChange={(e) =>
                  handleQuarterScoreChange(
                    'away',
                    4,
                    parseInt(e.target.value) || 0
                  )
                }
                className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        )}
        <ManageRecode
          gameId={game?.id}
          homeTeamId={game?.homeTeamInfo?.id}
          homeTeamName={game?.homeTeamInfo?.name}
          awayTeamId={game?.awayTeamInfo?.id}
          awayTeamName={game?.awayTeamInfo?.name}
          onScoreDataChange={handleScoreDataChange}
        />
        <div className="mt-5">
          {gameId && game?.result === 'NotFinished' ? (
            <Button
              label="입력"
              variant="wfull"
              onClick={() => {
                createRecode(gameId)
              }}
            />
          ) : (
            <Button
              label="수정"
              variant="wfull"
              onClick={() => {
                modifyRecode(gameId)
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default ManageScore
