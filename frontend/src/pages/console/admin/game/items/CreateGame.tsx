import axiosInstance from '@/commons/axios'
import type { TeamComplication } from '@/commons/interfaces/team/teamComplication'
import Button from '@/components/buttons/Button'
import DropdownLeft from '@/components/dropdown/DropdownLeft'
import useNotification from '@/hooks/useNotification'
import { NotificationType } from '@/state/notificationState'
import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useNavigate, useParams } from 'react-router-dom'

enum ResultType {
  HomeWin = 'HomeWin',
  AwayWin = 'AwayWin',
  Draw = 'Draw',
  NotFinished = 'NotFinished'
}

const CreateGame = () => {
  const [teams, setTeams] = useState<TeamComplication[]>([])
  const [selectedHomeTeam, setSelectedHomeTeam] = useState('')
  const [selectedAwayTeam, setSelectedAwayTeam] = useState('')
  const [stadium, setStadium] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [name, setName] = useState('')
  const [result, setResult] = useState<ResultType>(ResultType.NotFinished)
  const { leagueId: leagueIdString } = useParams()
  const leagueId = leagueIdString ? parseInt(leagueIdString, 10) : null
  const { showNotification } = useNotification()
  const navigate = useNavigate()

  const handleDateChange = (date: Date) => {
    setSelectedDate(date)
  }
  const homeTeamSelect = (selectedName: string) => {
    setSelectedHomeTeam(selectedName) // 문자열 상태 업데이트
  }

  const findHomeTeamIdByName = (teamName: string) => {
    const team = teams.find((team) => team.name === teamName)
    return team ? team.id : null
  }

  const awayTeamSelect = (selectedName: string) => {
    setSelectedAwayTeam(selectedName) // 문자열 상태 업데이트
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

  const createSubmitHandler = async () => {
    const homeTeamId = findHomeTeamIdByName(selectedHomeTeam)
    const awayTeamId = findAwayTeamIdByName(selectedAwayTeam)

    if (!stadium || !homeTeamId || !awayTeamId) {
      showNotification(
        NotificationType.Error,
        '생성 실패',
        '모든 필드를 채워주세요.'
      )
      return
    }

    try {
      const createGameData = {
        leagueId: leagueId,
        name: name,
        startedAt: selectedDate,
        stadium: stadium,
        homeTeamId: homeTeamId,
        awayTeamId: awayTeamId,
        result: result
      }
      await axiosInstance.post(`/admin/games`, createGameData)
      showNotification(
        NotificationType.Success,
        '생성 성공',
        '게임 생성에 성공하였습니다.'
      )
      navigate(`/console/leagues/${leagueId}/game-detail`)
    } catch (error) {
      showNotification(
        NotificationType.Error,
        '생성 실패',
        '게임 생성에 실패했습니다.'
      )
    }
  }
  return (
    <div className="m-5">
      <div className="bg-white p-5">
        <div className="mb-5 border-b border-l-8 border-l-black p-3 sm:flex-auto">
          <div>게임 생성</div>
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
          <div className="col-span-1">게임명</div>
          <div className="col-span-5 mb-2 ml-2">
            <input
              className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="col-span-1">경기장</div>
          <div className="col-span-5 mb-2 ml-2">
            <input
              className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              onChange={(e) => setStadium(e.target.value)}
            />
          </div>
          <div className="col-span-1">HomeTeam</div>
          <div className="col-span-5 mb-2 ml-2">
            <DropdownLeft
              optionList={teams.map((team) => ({
                id: team.id,
                name: team.name
              }))}
              optionName={'선택하세요'}
              onSelect={homeTeamSelect}
            />
          </div>
          <div className="col-span-1">AwayTeam</div>
          <div className="col-span-5 mb-2 ml-2">
            <DropdownLeft
              optionList={teams.map((team) => ({
                id: team.id,
                name: team.name
              }))}
              optionName={'선택하세요'}
              onSelect={awayTeamSelect}
            />
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
        <Button label="생성" variant="roundLg" onClick={createSubmitHandler} />
      </div>
    </div>
  )
}

export default CreateGame
