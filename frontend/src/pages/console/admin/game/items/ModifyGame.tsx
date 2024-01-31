import axiosInstance from '@/commons/axios'
import type { TeamComplication } from '@/commons/interfaces/team/teamComplication'
import Button from '@/components/buttons/Button'
import DropdownLeft from '@/components/dropdown/DropdownLeft'
import useNotification from '@/hooks/useNotification'
import { NotificationType } from '@/state/notificationState'
import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

enum ResultType {
  HomeWin = 'HomeWin',
  AwayWin = 'AwayWin',
  Draw = 'Draw',
  NotFinished = 'NotFinished'
}

const ModifyGame = () => {
  const location = useLocation()
  const game = location.state?.game
  const { leagueId: leagueIdString } = useParams()
  const leagueId = leagueIdString ? parseInt(leagueIdString, 10) : null
  const [teams, setTeams] = useState<TeamComplication[]>([])
  const [homeTeamName, setHomeTeamName] = useState('')
  const [awayTeamName, setAwayTeamName] = useState('')
  const [selectedHomeTeam, setSelectedHomeTeam] = useState(homeTeamName)
  const [selectedAwayTeam, setSelectedAwayTeam] = useState(awayTeamName)
  const [stadium, setStadium] = useState(game.stadium)
  const [selectedDate, setSelectedDate] = useState(
    game?.startedAt ? new Date(game.startedAt) : new Date()
  )
  const [result, setResult] = useState<ResultType>(game.result)
  const { showNotification } = useNotification()
  const navigate = useNavigate()

  const fetchTeamInfo = async (teamId: number) => {
    const response = await axiosInstance.get(`/teams/${teamId}`)
    return response.data.name
  }

  useEffect(() => {
    const fetchTeamNames = async () => {
      if (game?.homeTeamId) {
        const homeName = await fetchTeamInfo(game.homeTeamId)
        setHomeTeamName(homeName)
      }
      if (game?.awayTeamId) {
        const awayName = await fetchTeamInfo(game.awayTeamId)
        setAwayTeamName(awayName)
      }
    }

    fetchTeamNames()
  }, [game?.homeTeamId, game?.awayTeamId])

  const handleDateChange = (date: Date) => {
    setSelectedDate(date)
  }

  const homeTeamSelect = (selectedName: string) => {
    setSelectedHomeTeam(selectedName)
  }

  const findHomeTeamIdByName = (teamName: string) => {
    const team = teams.find((team) => team.name === teamName)
    return team ? team.id : null
  }

  const awayTeamSelect = (selectedName: string) => {
    setSelectedAwayTeam(selectedName)
  }

  const findAwayTeamIdByName = (teamName: string) => {
    const team = teams.find((team) => team.name === teamName)
    return team ? team.id : null
  }

  const resultOptions = Object.keys(ResultType)
    .filter((key) => isNaN(Number(key))) // 숫자 키를 제외합니다.
    .map((key) => ({
      id: ResultType[key as keyof typeof ResultType],
      name: key
    }))

  const resultSelect = (selected: string) => {
    const resultValue = ResultType[selected as keyof typeof ResultType]
    setResult(resultValue)
  }

  useEffect(() => {
    const getTeamsByLeagueId = async () => {
      try {
        const response = await axiosInstance.get(`/teams/leagues/${leagueId}`)
        setTeams(response.data)
      } catch (error) {
        showNotification(
          NotificationType.Error,
          '팀 불러오기 실패',
          '팀 불러오기에 실패했습니다.'
        )
      }
    }
    getTeamsByLeagueId()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leagueId])

  const modifySubmitHandler = async () => {
    const homeTeamId = selectedHomeTeam
      ? findHomeTeamIdByName(selectedHomeTeam)
      : game?.homeTeamId
    const awayTeamId = selectedAwayTeam
      ? findAwayTeamIdByName(selectedAwayTeam)
      : game?.awayTeamId

    try {
      const updatePayload = {
        leagueId: leagueId,
        stadium: stadium,
        startedAt: selectedDate,
        homeTeamId: homeTeamId,
        awayTeamId: awayTeamId,
        result: result
      }

      await axiosInstance.put(`/admin/games/${game?.id}`, updatePayload)
      showNotification(
        NotificationType.Success,
        '게임 수정 성공',
        '게임 수정에 성공하였습니다.'
      )
      navigate(`/console/leagues/${leagueId}/game-detail`)
    } catch (error) {
      showNotification(
        NotificationType.Error,
        '게임 수정 실패',
        '게임 수정에 실패했습니다.'
      )
    }
  }

  return (
    <div className="m-5">
      <div className="bg-white p-5">
        <div className="mb-5 border-b border-l-8 border-l-black p-3 sm:flex-auto">
          <div>게임 수정</div>
        </div>
        <div className="relative mb-5 grid grid-cols-6 items-center">
          <div className="col-span-1">날짜</div>
          <div className="col-span-5 mb-2 ml-2">
            <DatePicker
              className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              selected={selectedDate}
              onChange={handleDateChange}
              showTimeSelect
              timeIntervals={10}
              dateFormat="yyyy-MM-dd HH:mm"
              timeCaption="시간"
            />
          </div>
          <div className="col-span-1">경기장</div>
          <div className="col-span-5 mb-2 ml-2">
            <input
              className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={stadium}
              onChange={(e) => setStadium(e.target.value)}
            />
          </div>
          <div className="col-span-1">HomeTeam</div>
          <div className="col-span-5 mb-2 ml-2">
            {homeTeamName && (
              <DropdownLeft
                optionList={teams.map((team) => ({
                  id: team.id,
                  name: team.name
                }))}
                optionName={homeTeamName}
                onSelect={homeTeamSelect}
              />
            )}
          </div>
          <div className="col-span-1">AwayTeam</div>
          <div className="col-span-5 mb-2 ml-2">
            {awayTeamName && (
              <DropdownLeft
                optionList={teams.map((team) => ({
                  id: team.id,
                  name: team.name
                }))}
                optionName={awayTeamName}
                onSelect={awayTeamSelect}
              />
            )}
          </div>
          <div className="col-span-1">결과</div>
          <div className="col-span-5 mb-2 ml-2">
            <DropdownLeft
              optionList={resultOptions}
              optionName={ResultType[result]}
              onSelect={resultSelect}
            />
          </div>
        </div>
      </div>
      <div className="mt-5 flex justify-center">
        <Button label="수정" variant="roundLg" onClick={modifySubmitHandler} />
      </div>
    </div>
  )
}

export default ModifyGame
