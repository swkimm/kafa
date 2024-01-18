import axiosInstance from '@/commons/axios'
import type { Game } from '@/commons/interfaces/game/game'
import type { TeamComplication } from '@/commons/interfaces/team/teamComplication'
import { Dialog, Transition } from '@headlessui/react'
import { PencilSquareIcon } from '@heroicons/react/20/solid'
import { Fragment, useEffect, useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import DropdownLeft from '../dropdown/DropdownLeft'

interface ModifyGameModalProps {
  game: Game
  leagueId: number
  onClose: (
    updatedGame: Game | null,
    notificationInfo?: {
      type: 'notification' | 'alert'
      title: string
      content: string
    }
  ) => void
}

const ModifyGameModal: React.FC<ModifyGameModalProps> = ({
  game,
  leagueId,
  onClose
}) => {
  const [open, setOpen] = useState(true)
  const [teams, setTeams] = useState<TeamComplication[]>([])
  const [homeTeamName, setHomeTeamName] = useState('')
  const [awayTeamName, setAwayTeamName] = useState('')
  const [selectedHomeTeam, setSelectedHomeTeam] = useState(homeTeamName)
  const [selectedAwayTeam, setSelectedAwayTeam] = useState(awayTeamName)
  const [stadium, setStadium] = useState(game.stadium)
  const [selectedDate, setSelectedDate] = useState(new Date(game.startedAt))

  const cancelButtonRef = useRef(null)

  const fetchTeamInfo = async (teamId: number) => {
    try {
      const response = await axiosInstance.get(`/teams/${teamId}`)
      return response.data.name // 팀 이름 반환
    } catch (error) {
      console.error('Error fetching team info:', error)
      return '' // 오류가 발생하면 빈 문자열 반환
    }
  }

  useEffect(() => {
    const fetchTeamNames = async () => {
      if (game.homeTeamId) {
        const homeName = await fetchTeamInfo(game.homeTeamId)
        setHomeTeamName(homeName)
      }
      if (game.awayTeamId) {
        const awayName = await fetchTeamInfo(game.awayTeamId)
        setAwayTeamName(awayName)
      }
    }

    fetchTeamNames()
  }, [game.homeTeamId, game.awayTeamId])

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

  useEffect(() => {
    const getTeamsByLeagueId = async () => {
      try {
        const response = await axiosInstance.get(`/teams/leagues/${leagueId}`)
        setTeams(response.data)
      } catch (error) {
        alert(error)
      }
    }
    getTeamsByLeagueId()
  }, [leagueId])

  const modifySubmitHandler = async () => {
    const homeTeamId = selectedHomeTeam
      ? findHomeTeamIdByName(selectedHomeTeam)
      : game.homeTeamId
    const awayTeamId = selectedAwayTeam
      ? findAwayTeamIdByName(selectedAwayTeam)
      : game.awayTeamId

    try {
      const updatePayload = {
        leagueId: leagueId,
        stadium: stadium,
        startedAt: selectedDate,
        homeTeamId: homeTeamId,
        awayTeamId: awayTeamId
      }

      const response = await axiosInstance.put(
        `/admin/games/${game.id}`,
        updatePayload
      )

      if (response.status === 200) {
        // 업데이트가 성공하면 updatedGame을 설정하고 모달을 닫음
        const updatedGame = response.data
        // updatedGame을 사용해 필요한 작업 수행
        // 모달 닫기
        onClose(updatedGame, {
          type: 'notification',
          title: '게임 수정 성공',
          content: '게임 정보가 성공적으로 수정되었습니다.'
        })
      } else {
        onClose(null, {
          type: 'alert',
          title: '게임 수정 실패',
          content: '게임 정보 수정 실패'
        })
      }
    } catch (error) {
      onClose(null, {
        type: 'alert',
        title: '게임 수정 실패',
        content: '게임 정보 수정 실패'
      })
    }
  }
  return (
    <div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={() => {}}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                      <PencilSquareIcon className="h-6 w-6 text-gray-500" />
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="mb-5 text-base font-semibold leading-6 text-gray-900"
                      >
                        게임 수정
                      </Dialog.Title>
                    </div>
                  </div>
                  <div className="overflow-y-auto">
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
                      <div className="col-span-1 text-center">HomeTeam</div>
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
                      <div className="col-span-1 text-center">AwayTeam</div>
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
                    </div>
                  </div>

                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                      onClick={modifySubmitHandler}
                    >
                      수정
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                      onClick={() => {
                        setOpen(false)
                        onClose(null)
                      }}
                      ref={cancelButtonRef}
                    >
                      취소
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  )
}

export default ModifyGameModal
