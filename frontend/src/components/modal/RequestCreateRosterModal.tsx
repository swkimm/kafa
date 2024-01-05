import axiosInstance from '@/commons/axios'
import { RosterType } from '@/commons/interfaces/roster/roster'
import type { TeamSimple } from '@/commons/interfaces/team/teamSimple'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'
import axios, { type AxiosError } from 'axios'
import { Fragment, useEffect, useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import DropdownLeft from '../dropdown/DropdownLeft'

interface RequestCreateRosterModalProps {
  isOpen: boolean
  onClose: () => void
}

const RequestCreateRosterModal = ({
  isOpen,
  onClose
}: RequestCreateRosterModalProps) => {
  const cancelButtonRef = useRef(null)
  const [teams, setTeams] = useState<TeamSimple[]>([])
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null)
  const [selectedRosterType, setSelectedRosterType] = useState('')
  const [offence, setOffence] = useState<string | ''>('')
  const [defense, setDefense] = useState<string | ''>('')
  const [special, setSpecial] = useState<string | ''>('')
  const [lastName, setLastName] = useState('')
  const [firstName, setFirstName] = useState('')
  const [height, setHeight] = useState<number | ''>()
  const [weight, setWeight] = useState<number | ''>()
  const [backNumber, setBackNumber] = useState<number | ''>()
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  // ... 다른 입력 필드 상태 변수들 ...
  const rosterTypeOptions = Object.keys(RosterType)
    .filter((key): key is keyof typeof RosterType => isNaN(Number(key)))
    .map((key) => ({
      id: RosterType[key as keyof typeof RosterType],
      name: key
    }))

  // 사용자가 선택한 로스터 타입을 처리하는 함수
  const handleRosterTypeSelect = (selectedType: string) => {
    console.log('Selected Roster Type:', selectedType)
    setSelectedRosterType(selectedType)
    // 여기에서 선택된 로스터 타입에 대한 처리를 추가
  }

  const handleYearChange = (date: Date) => {
    setSelectedYear(date.getFullYear())
  }

  const handleTeamSelect = (selectedTeamName: string) => {
    // 선택된 팀 이름으로부터 해당 팀의 ID를 찾습니다.
    const selectedTeam = teams.find((team) => team.name === selectedTeamName)
    if (selectedTeam) {
      setSelectedTeam(selectedTeam.id) // 팀 ID를 상태에 저장
    } else {
      console.error('Selected team not found:', selectedTeamName)
      // 선택된 팀을 찾을 수 없는 경우에 대한 처리
    }
  }

  const getAllTeams = async () => {
    const page = 1
    const limit = 100
    try {
      const response = await axiosInstance.get(
        `/teams?page=${page}&limit=${limit}`
      )
      console.log(response.data)
      setTeams(response.data) // 팀 데이터를 상태에 저장
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getAllTeams()
  }, [])

  const teamOptions = teams.map((team) => ({
    id: team.id,
    name: team.name
  }))

  const handleSubmit = async () => {
    if (!selectedTeam || !lastName.trim() || !firstName.trim()) {
      window.alert(
        '팀 선택, 성(lastName), 이름(firstName)은 필수 입력 사항입니다.'
      )
      return
    }
    const formData = {
      globalName: lastName + firstName,
      teamId: selectedTeam,
      rosterType: selectedRosterType,
      registerYear: selectedYear,
      height: height,
      weight: weight,
      backNumber: backNumber,
      position: {
        offence: offence,
        defense: defense,
        special: special
      }
    }
    try {
      const response = await axiosInstance.post(`/rosters/request`, formData)
      console.log(response.data)
      onClose()
      window.alert('요청이 완료되었습니다.')
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const serverError = error as AxiosError // 타입 단언
        if (serverError && serverError.response) {
          // 서버에서 응답에 따른 에러 처리
          const { status } = serverError.response
          switch (status) {
            case 400:
              window.alert('잘못된 요청입니다. 입력된 값을 확인해주세요.')
              break
            case 401:
              window.alert(
                '로그인이 필요한 요청입니다. 로그인 후 다시 시도해주세요.'
              )
              break
            case 403:
              window.alert('인증이 필요합니다. 계정 인증을 완료해주세요.')
              break
            case 404:
              window.alert('존재하지 않는 팀 ID입니다. 팀을 다시 선택해주세요.')
              break
            case 409:
              window.alert('이미 요청된 작업입니다. 중복 요청을 확인해주세요.')
              break
            default:
              window.alert(
                '요청 처리 중 오류가 발생했습니다. 다시 시도해주세요.'
              )
          }
        } else {
          window.alert(
            '서버에 연결할 수 없습니다. 네트워크 연결을 확인하거나, 나중에 다시 시도해주세요.'
          )
        }
      }
    }
  }

  return (
    <div>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={onClose}
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
                  <div className="overflow-auto">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                      <CheckIcon
                        className="h-6 w-6 text-green-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        로스터 생성 요청
                      </Dialog.Title>
                      <div className="text-sm text-gray-500">
                        해당 팀에 로스터 생성을 요청합니다.
                      </div>
                    </div>
                    <div className="mt-5 grid grid-cols-4 gap-y-2 p-5">
                      <div className="col-span-1">팀명</div>
                      <div className="col-span-3">
                        <DropdownLeft
                          optionName="Select Team"
                          optionList={teamOptions}
                          onSelect={(id) => handleTeamSelect(id)}
                        />
                      </div>
                      <div className="col-span-1">팀명</div>
                      <div className="col-span-3">
                        <DatePicker
                          className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          selected={new Date(selectedYear, 0, 1)} // 현재 연도의 1월 1일
                          onChange={handleYearChange}
                          showYearPicker
                          dateFormat="yyyy" // 연도만 표시
                        />
                      </div>
                      <div className="col-span-1">타입</div>
                      <div className="col-span-3">
                        <DropdownLeft
                          optionName="Select Roster Type"
                          optionList={rosterTypeOptions}
                          onSelect={handleRosterTypeSelect}
                        />
                      </div>
                      {selectedRosterType === 'Athlete' && (
                        <>
                          <div className="col-span-1">포지션</div>
                          <div className="col-span-1">
                            <input
                              type="text"
                              placeholder="오펜스"
                              value={offence}
                              onChange={(e) =>
                                setOffence(
                                  e.target.value === '' ? '' : e.target.value
                                )
                              }
                              className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                          <div className="col-span-1">
                            <input
                              type="text"
                              placeholder="디펜스"
                              value={defense}
                              onChange={(e) =>
                                setDefense(
                                  e.target.value === '' ? '' : e.target.value
                                )
                              }
                              className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                          <div className="col-span-1">
                            <input
                              type="text"
                              placeholder="스페셜"
                              value={special}
                              onChange={(e) =>
                                setSpecial(
                                  e.target.value === '' ? '' : e.target.value
                                )
                              }
                              className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                          <div className="col-span-1 gap-0"></div>
                          <div className="col-span-3 gap-0 text-sm text-gray-500">
                            예시: QB, LB, K
                          </div>
                        </>
                      )}

                      <div className="col-span-2">성(영문) Last Name</div>
                      <div className="col-span-2">
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                      <div className="col-span-2">이름(영문) First Name</div>
                      <div className="col-span-2">
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                      <div className="col-span-1">키(cm)</div>
                      <div className="col-span-3">
                        <input
                          type="number"
                          value={height}
                          onChange={(e) =>
                            setHeight(
                              e.target.value === ''
                                ? ''
                                : parseInt(e.target.value, 10)
                            )
                          }
                          className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                      <div className="col-span-1">몸무게(kg)</div>
                      <div className="col-span-3">
                        <input
                          type="number"
                          value={weight}
                          onChange={(e) =>
                            setWeight(
                              e.target.value === ''
                                ? ''
                                : parseInt(e.target.value, 10)
                            )
                          }
                          className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                      <div className="col-span-1">백넘버</div>
                      <div className="col-span-3">
                        <input
                          type="number"
                          value={backNumber}
                          onChange={(e) =>
                            setBackNumber(
                              e.target.value === ''
                                ? ''
                                : parseInt(e.target.value, 10)
                            )
                          }
                          className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                      onClick={handleSubmit} // 닫기 버튼 클릭 시 onClose 호출
                    >
                      요청
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                      onClick={onClose} // 닫기 버튼 클릭 시 onClose 호출
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

export default RequestCreateRosterModal
