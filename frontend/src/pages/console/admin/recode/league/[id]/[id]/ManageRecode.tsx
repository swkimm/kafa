import axiosInstance from '@/commons/axios'
import { RecordType, UnitType } from '@/commons/interfaces/recode/recode'
import { RosterType, type Roster } from '@/commons/interfaces/roster/roster'
import Button from '@/components/buttons/Button'
import DropdownLeft from '@/components/dropdown/DropdownLeft'
import useNotification from '@/hooks/useNotification'
import { NotificationType } from '@/state/notificationState'
import { useEffect, useRef, useState } from 'react'

interface RecordResponse {
  id: number
  type: string
  score: number
  unit: string
  Game: {
    id: number
    homeTeam: { id: number; name: string; profileImgUrl: string }
    awayTeam: { id: number; name: string; profileImgUrl: string }
  }
  Athlete: {
    position: { defense: string; offence: string }
    Roster: { id: number; name: string; profileImgUrl: string; teamId: number }
  }
}

interface ScoringEvent {
  id: number
  unit: string // 단위
  score: number // 점수
  name: string
  type: RecordType // 기록 종류
  rosterId: number
}

interface ManageRecodeProps {
  gameId: number | undefined
  homeTeamId: number | undefined
  homeTeamName: string | undefined
  awayTeamId: number | undefined
  awayTeamName: string | undefined
  onScoreDataChange: (data: {
    home: ScoringEvent[]
    away: ScoringEvent[]
  }) => void
}

const transformRecordTypeToDropdownOptions = () => {
  return Object.values(RecordType).map((value) => ({
    id: value,
    name: value
  }))
}

const transformUnitTypeToDropdownOptions = () => {
  return Object.values(UnitType).map((value) => ({
    id: value,
    name: value
  }))
}

const ManageRecode: React.FC<ManageRecodeProps> = ({
  gameId,
  homeTeamId,
  homeTeamName,
  awayTeamId,
  awayTeamName,
  onScoreDataChange
}) => {
  const { showNotification } = useNotification()
  const [homeScoringEvents, setHomeScoringEvents] = useState<ScoringEvent[]>([])
  const [awayScoringEvents, setAwayScoringEvents] = useState<ScoringEvent[]>([])
  const recordTypeOptions = transformRecordTypeToDropdownOptions()
  const unitTypeOptions = transformUnitTypeToDropdownOptions()
  const [homeTeamRoster, setHomeTeamRoster] = useState<Roster[]>([])
  const [awayTeamRoster, setAwayTeamRoster] = useState<Roster[]>([])

  const getRosters = async (teamId: number, isHomeTeam: boolean) => {
    const page = 1
    const limit = 100
    try {
      const response = await axiosInstance.get<Roster[]>(
        `/rosters/teams/${teamId}?page=${page}&limit=${limit}`
      )
      const athleteRosters = response.data.filter(
        (roster) => roster.rosterType === RosterType.Athlete
      )

      if (isHomeTeam) {
        setHomeTeamRoster(athleteRosters)
      } else {
        setAwayTeamRoster(athleteRosters)
      }
    } catch (error) {
      showNotification(
        NotificationType.Error,
        '로스터 불러오기 실패',
        '로스터 불러오기에 실패했습니다.'
      )
    }
  }

  useEffect(() => {
    if (homeTeamId) getRosters(homeTeamId, true)
    if (awayTeamId) getRosters(awayTeamId, false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homeTeamId, awayTeamId])

  const prevHomeScoringEvents = useRef(homeScoringEvents)
  const prevAwayScoringEvents = useRef(awayScoringEvents)

  const isDifferent = (
    prevEvents: ScoringEvent[],
    currentEvents: ScoringEvent[]
  ) => {
    return JSON.stringify(prevEvents) !== JSON.stringify(currentEvents)
  }

  useEffect(() => {
    if (
      isDifferent(prevHomeScoringEvents.current, homeScoringEvents) ||
      isDifferent(prevAwayScoringEvents.current, awayScoringEvents)
    ) {
      onScoreDataChange({
        home: homeScoringEvents,
        away: awayScoringEvents
      })

      prevHomeScoringEvents.current = homeScoringEvents
      prevAwayScoringEvents.current = awayScoringEvents
    }
  }, [homeScoringEvents, awayScoringEvents, onScoreDataChange])

  const convertToScoringEvent = (record: RecordResponse): ScoringEvent => ({
    id: record.id,
    unit: record.unit,
    score: record.score,
    name: record.Athlete.Roster.name,
    type: RecordType[record.type as keyof typeof RecordType],
    rosterId: record.Athlete.Roster.id
  })

  const setScoringEventsFromResponse = (
    data: RecordResponse[],
    homeTeamId: number,
    awayTeamId: number
  ) => {
    const homeScoringEvents = data
      .filter(
        (event) => event.Athlete && event.Athlete.Roster.teamId === homeTeamId
      )
      .map(convertToScoringEvent)

    const awayScoringEvents = data
      .filter(
        (event) => event.Athlete && event.Athlete.Roster.teamId === awayTeamId
      )
      .map(convertToScoringEvent)

    setHomeScoringEvents(homeScoringEvents)
    setAwayScoringEvents(awayScoringEvents)
  }

  const getRecodes = async (
    gameId: number,
    homeTeamId: number,
    awayTeamId: number
  ) => {
    try {
      const response = await axiosInstance.get<RecordResponse[]>(
        `/records/games/${gameId}`
      )
      setScoringEventsFromResponse(response.data, homeTeamId, awayTeamId)
    } catch (error) {
      showNotification(
        NotificationType.Error,
        '기록 불러오기 실패',
        '기록 불러오기에 실패했습니다.'
      )
    }
  }

  useEffect(() => {
    if (
      typeof gameId === 'number' &&
      typeof homeTeamId === 'number' &&
      typeof awayTeamId === 'number'
    ) {
      getRecodes(gameId, homeTeamId, awayTeamId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId, homeTeamId, awayTeamId])

  const handleScorerSelect = (
    index: number,
    selectedScorerId: number,
    isHomeTeam: boolean
  ) => {
    const updateScoringEvents = (events: ScoringEvent[]) =>
      events.map((event, eventIndex) =>
        index === eventIndex ? { ...event, rosterId: selectedScorerId } : event
      )
    if (isHomeTeam) {
      setHomeScoringEvents((prevEvents) => updateScoringEvents(prevEvents))
    } else {
      setAwayScoringEvents((prevEvents) => updateScoringEvents(prevEvents))
    }
  }

  const handleUnitSelect = (
    index: number,
    selectedUnit: string,
    isHomeTeam: boolean
  ) => {
    const updateScoringEvents = (events: ScoringEvent[]) =>
      events.map((event, eventIndex) =>
        index === eventIndex ? { ...event, unit: selectedUnit } : event
      )
    if (isHomeTeam) {
      setHomeScoringEvents((prevEvents) => updateScoringEvents(prevEvents))
    } else {
      setAwayScoringEvents((prevEvents) => updateScoringEvents(prevEvents))
    }
  }

  const handleTypeSelect = (
    index: number,
    selected: string,
    isHomeTeam: boolean
  ) => {
    const updateScoringEvents = (events: ScoringEvent[]) =>
      events.map((event, eventIndex) =>
        index === eventIndex
          ? { ...event, type: RecordType[selected as keyof typeof RecordType] }
          : event
      )

    if (isHomeTeam) {
      setHomeScoringEvents((prevEvents) => updateScoringEvents(prevEvents))
    } else {
      setAwayScoringEvents((prevEvents) => updateScoringEvents(prevEvents))
    }
  }

  // 홈 팀의 득점 이벤트를 추가하는 핸들러
  const handleAddHomeScoringEvent = () => {
    setHomeScoringEvents((prevEvents) => [
      ...prevEvents,
      {
        id: 0,
        unit: '',
        score: 0,
        name: '',
        type: RecordType.Passer,
        rosterId: 0
      }
    ])
  }

  // 어웨이 팀의 득점 이벤트를 추가하는 핸들러
  const handleAddAwayScoringEvent = () => {
    setAwayScoringEvents((prevEvents) => [
      ...prevEvents,
      {
        id: 0,
        unit: '',
        score: 0,
        name: '',
        type: RecordType.Passer,
        rosterId: 0
      }
    ])
  }

  // 득점 이벤트를 삭제하는 핸들러
  const handleRemoveScoringEvent = async (
    index: number,
    isHomeTeam: boolean,
    eventId: number
  ) => {
    const newEvents = isHomeTeam
      ? homeScoringEvents.filter((_, eventIndex) => eventIndex !== index)
      : awayScoringEvents.filter((_, eventIndex) => eventIndex !== index)

    if (isHomeTeam) {
      setHomeScoringEvents(newEvents)
    } else {
      setAwayScoringEvents(newEvents)
    }

    // 서버에서 데이터 삭제 요청
    try {
      await axiosInstance.delete(`/admin/records/${eventId}`)
      showNotification(
        NotificationType.Success,
        '기록 삭제 성공',
        '기록 삭제에 성공하였습니다.',
        2500
      )
    } catch (error) {
      showNotification(
        NotificationType.Error,
        '기록 삭제 실패',
        '기록 삭제에 실패하였습니다.',
        2500
      )
    }
  }

  const homeTeamRosterOptions = homeTeamRoster.map((rosterMember) => ({
    id: rosterMember.id,
    name: rosterMember.name
  }))

  const awayTeamRosterOptions = awayTeamRoster.map((rosterMember) => ({
    id: rosterMember.id,
    name: rosterMember.name
  }))

  // 각 득점 이벤트의 점수를 변경하는 함수
  const handleScoreChange = (
    index: number,
    newScore: number,
    isHomeTeam: boolean
  ) => {
    const updateScoringEvents = (events: ScoringEvent[]) =>
      events.map((event: ScoringEvent, idx: number) =>
        idx === index ? { ...event, score: newScore } : event
      )

    if (isHomeTeam) {
      setHomeScoringEvents((prevEvents) => updateScoringEvents(prevEvents))
    } else {
      setAwayScoringEvents((prevEvents) => updateScoringEvents(prevEvents))
    }
  }

  return (
    <div>
      <div className="mt-5">
        <div className="col-span-1">{homeTeamName}</div>
        {homeScoringEvents.map((event, index) => (
          <div className="mt-2 grid grid-cols-5" key={index}>
            <DropdownLeft
              optionName={event.unit}
              optionList={unitTypeOptions}
              onSelect={(selected) => handleUnitSelect(index, selected, true)}
            />
            <div className="col-span-1">
              <input
                type="number"
                placeholder="점수"
                value={event.score}
                onChange={(e) =>
                  handleScoreChange(index, parseInt(e.target.value, 10), true)
                }
                className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div className="col-span-1">
              <DropdownLeft
                optionName={event.name}
                optionList={homeTeamRosterOptions}
                onSelect={(selectedName) => {
                  // 선택된 이름을 사용하여 해당하는 선수의 ID를 찾습니다.
                  const selectedRoster = homeTeamRosterOptions.find(
                    (option) => option.name === selectedName
                  )
                  const selectedRosterId = selectedRoster
                    ? selectedRoster.id
                    : 0

                  // 선수 ID를 handleScorerSelect에 전달합니다.
                  handleScorerSelect(index, selectedRosterId, true)
                }}
              />
            </div>
            <div className="col-span-1">
              <DropdownLeft
                optionName={event.type}
                optionList={recordTypeOptions}
                onSelect={(selected) => handleTypeSelect(index, selected, true)}
              />
            </div>
            <div className="col-span-1">
              <Button
                label="삭제"
                onClick={() => handleRemoveScoringEvent(index, true, event.id)}
                variant="roundLg"
              />
            </div>
          </div>
        ))}
        <div className="col-span mt-5">
          <Button
            label="기록 추가"
            variant="wfull"
            onClick={handleAddHomeScoringEvent}
          />
        </div>
        <div className="my-5 border-2 border-black"></div>
        <div className="col-span-1">{awayTeamName}</div>
        {awayScoringEvents.map((event, index) => (
          <div className="mt-2 grid grid-cols-5" key={index}>
            <div className="col-span-1">
              <DropdownLeft
                optionName="단위"
                optionList={unitTypeOptions}
                onSelect={(selected) =>
                  handleUnitSelect(index, selected, false)
                }
              />
            </div>
            <div className="col-span-1">
              <input
                type="number"
                placeholder="점수"
                value={event.score}
                onChange={(e) =>
                  handleScoreChange(index, parseInt(e.target.value, 10), false)
                }
                className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>

            <div className="col-span-1">
              <DropdownLeft
                optionName="득점자"
                optionList={awayTeamRosterOptions}
                onSelect={(selectedName) => {
                  const selectedRoster = awayTeamRosterOptions.find(
                    (option) => option.name === selectedName
                  )
                  const selectedRosterId = selectedRoster
                    ? selectedRoster.id
                    : 0

                  // 선수 ID를 handleScorerSelect에 전달합니다.
                  handleScorerSelect(index, selectedRosterId, true)
                }}
              />
            </div>
            <div className="col-span-1">
              <DropdownLeft
                optionName="득점 유형"
                optionList={recordTypeOptions}
                onSelect={(selected) =>
                  handleTypeSelect(index, selected, false)
                }
              />
            </div>
            <div className="col-span-1">
              <Button
                label="삭제"
                onClick={() => handleRemoveScoringEvent(index, false, event.id)}
                variant="roundLg"
              />
            </div>
          </div>
        ))}
        <div className="col-span mt-5">
          <Button
            label="기록 추가"
            variant="wfull"
            onClick={handleAddAwayScoringEvent}
          />
        </div>
      </div>
    </div>
  )
}

export default ManageRecode
