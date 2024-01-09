import axiosInstance from '@/commons/axios'
import type { TeamComplication } from '@/commons/interfaces/team/teamComplication'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'
import PropTypes from 'prop-types'
import { Fragment, useEffect, useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import DropdownLeft from '../dropdown/DropdownLeft'

interface CreateGameModalProps {
  leagueId: number
  onClose: (notificationInfo?: {
    type: 'notification' | 'alert'
    title: string
    content: string
  }) => void
}

const results = [
  { id: 1, name: 'HomeWin' },
  { id: 2, name: 'AwayWin' },
  { id: 3, name: 'Draw' },
  { id: 4, name: 'NotFinished' }
]

const CreateGameModal: React.FC<CreateGameModalProps> = ({
  leagueId,
  onClose
}) => {
  const cancelButtonRef = useRef(null)
  const [open, setOpen] = useState(true)
  const [teams, setTeams] = useState<TeamComplication[]>([])
  const [selectedHomeTeam, setSelectedHomeTeam] = useState('')
  const [selectedAwayTeam, setSelectedAwayTeam] = useState('')
  const [stadium, setStadium] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [result, setResult] = useState('NotFinished')

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

  const resultSelect = (selected: string) => {
    setResult(selected)
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

  const createSubmitHandler = async () => {
    const homeTeamId = findHomeTeamIdByName(selectedHomeTeam)
    const awayTeamId = findAwayTeamIdByName(selectedAwayTeam)

    try {
      const createGameData = {
        leagueId: leagueId,
        startedAt: selectedDate,
        stadium: stadium,
        homeTeamId: homeTeamId,
        awayTeamId: awayTeamId,
        result: result
      }
      const response = await axiosInstance.post(`/admin/games`, createGameData)

      if (response.status === 200) {
        setOpen(false)

        onClose({
          type: 'notification',
          title: '게임 등록 성공',
          content: '게임이 성공적으로 등록되었습니다.'
        })
      }
    } catch (error) {
      alert(error)
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
                      <CheckIcon
                        className="h-6 w-6 text-green-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="mb-5 text-base font-semibold leading-6 text-gray-900"
                      >
                        게임 생성
                      </Dialog.Title>
                      <div className="overflow-y-auto text-left">
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
                              onChange={(e) => setStadium(e.target.value)}
                            />
                          </div>
                          <div className="col-span-1 text-center">HomeTeam</div>
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
                          <div className="col-span-1 text-center">AwayTeam</div>
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
                          <div className="col-span-1 text-center">결과</div>
                          <div className="col-span-5 mb-2 ml-2">
                            <DropdownLeft
                              optionList={results}
                              optionName={result}
                              onSelect={resultSelect}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                      onClick={createSubmitHandler}
                    >
                      생성
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                      onClick={() => {
                        setOpen(false)
                        onClose()
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

CreateGameModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  leagueId: PropTypes.number.isRequired
}

export default CreateGameModal
