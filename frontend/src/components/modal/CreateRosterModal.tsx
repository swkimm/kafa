import axiosInstance from '@/commons/axios'
import { RosterType } from '@/commons/interfaces/roster/roster'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'
import axios from 'axios'
import PropTypes from 'prop-types'
import { Fragment, useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import DropdownLeft from '../dropdown/DropdownLeft'

interface CreateRosterModalProps {
  teamId: number
  onRosterAdded: (teamId: number) => Promise<void> // 타입 수정
  onClose: () => void
}

const CreateRosterModal: React.FC<CreateRosterModalProps> = ({
  teamId,
  onRosterAdded, // prop으로 받은 함수
  onClose
}) => {
  const [open, setOpen] = useState(true)
  const [name, setName] = useState('')
  const [lastName, setLastName] = useState('')
  const [firstName, setFirstName] = useState('')
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()) // 입부년도
  const [selectedRosterType, setSelectedRosterType] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date()) // 생년월일
  const [isMaleChecked, setIsMaleChecked] = useState(false)
  const [isFemaleChecked, setIsFemaleChecked] = useState(false)
  const [offence, setOffence] = useState<string | ''>('')
  const [defense, setDefense] = useState<string | ''>('')
  const [special, setSpecial] = useState<string | ''>('')
  const [height, setHeight] = useState<number | ''>()
  const [weight, setWeight] = useState<number | ''>()
  const [backNumber, setBackNumber] = useState<number | ''>()
  const [errorMessages, setErrorMessages] = useState<string[]>([])

  const cancelButtonRef = useRef(null)

  const handleMaleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsMaleChecked(event.target.checked)
    if (event.target.checked) {
      setIsFemaleChecked(false)
    }
  }

  const handleFemaleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsFemaleChecked(event.target.checked)
    if (event.target.checked) {
      setIsMaleChecked(false)
    }
  }

  const handleDateChange = (date: Date) => {
    setSelectedDate(date)
  }

  const rosterTypeOptions = Object.keys(RosterType)
    .filter((key): key is keyof typeof RosterType => isNaN(Number(key)))
    .map((key) => ({
      id: RosterType[key as keyof typeof RosterType],
      name: key
    }))

  const handleRosterTypeSelect = (selectedType: string) => {
    console.log('Selected Roster Type:', selectedType)
    setSelectedRosterType(selectedType)
  }

  const handleYearChange = (date: Date) => {
    setSelectedYear(date.getFullYear())
  }

  const handleSubmit = async () => {
    const calculatedGender = isMaleChecked ? 'Male' : 'Female'
    const formattedBirthday = selectedDate.toISOString().split('T')[0]

    const formData = {
      name: name,
      globalName: lastName + ' ' + firstName,
      teamId: teamId,
      registerYear: selectedYear,
      rosterType: selectedRosterType,
      birthday: formattedBirthday,
      gender: calculatedGender,
      position: {
        offence: offence,
        defense: defense,
        special: special
      },
      height: height,
      weight: weight,
      backNumber: backNumber
    }
    console.log(formData)
    try {
      const response = await axiosInstance.post(`/rosters`, formData)
      console.log(response.data)
      onClose()
      onRosterAdded(teamId)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const responseData = error.response.data
        if (
          typeof responseData === 'object' &&
          responseData !== null &&
          'message' in responseData
        ) {
          if (typeof responseData.message === 'string') {
            setErrorMessages([responseData.message])
          } else if (Array.isArray(responseData.message)) {
            setErrorMessages(responseData.message)
          }
        }
      }
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
                        로스터 추가
                      </Dialog.Title>
                      <div className="overflow-y-auto text-left">
                        <div className="relative mb-5 grid grid-cols-6 items-center">
                          <div className="col-span-2">타입</div>
                          <div className="col-span-4 mb-2">
                            <DropdownLeft
                              optionName="Select Roster Type"
                              optionList={rosterTypeOptions}
                              onSelect={handleRosterTypeSelect}
                            />
                          </div>
                          <div className="col-span-2">입부 년도</div>
                          <div className="col-span-4 mb-2">
                            <DatePicker
                              className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              selected={new Date(selectedYear, 0, 1)} // 현재 연도의 1월 1일
                              onChange={handleYearChange}
                              showYearPicker
                              dateFormat="yyyy" // 연도만 표시
                            />
                          </div>
                          <div className="col-span-2">이름</div>
                          <div className="col-span-4 mb-2">
                            <input
                              value={name}
                              className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              onChange={(e) => setName(e.target.value)}
                            />
                          </div>
                          <div className="col-span-2">성(영문) Last Name</div>
                          <div className="col-span-4 mb-2">
                            <input
                              type="text"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                          <div className="col-span-2">
                            이름(영문) First Name
                          </div>
                          <div className="col-span-4 mb-2">
                            <input
                              type="text"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                          <div className="col-span-2">생년월일</div>
                          <div className="col-span-4 mb-2">
                            <DatePicker
                              selected={selectedDate}
                              className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              onChange={handleDateChange}
                              dateFormat="yyyy/MM/dd"
                              showYearDropdown
                              showMonthDropdown
                              dropdownMode="select" // 드롭다운 모드 활성화
                            />
                          </div>
                          <div className="col-span-2">성별</div>
                          <div className="col-span-2 mb-2">
                            <input
                              type="checkbox"
                              value="Male"
                              checked={isMaleChecked}
                              onChange={handleMaleChange}
                            />
                            <label className="ml-3 " htmlFor="">
                              남성
                            </label>
                          </div>
                          <div className="col-span-2 mb-2">
                            <input
                              type="checkbox"
                              value="Female"
                              checked={isFemaleChecked}
                              onChange={handleFemaleChange}
                            />
                            <label className="ml-3 " htmlFor="">
                              여성
                            </label>
                          </div>
                          {selectedRosterType === 'Athlete' && (
                            <>
                              <div className="col-span-2">포지션</div>
                              <div className="col-span-1">
                                <input
                                  type="text"
                                  placeholder="오펜스"
                                  value={offence}
                                  onChange={(e) =>
                                    setOffence(
                                      e.target.value === ''
                                        ? ''
                                        : e.target.value
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
                                      e.target.value === ''
                                        ? ''
                                        : e.target.value
                                    )
                                  }
                                  className="ml-2 block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                              </div>
                              <div className="col-span-1">
                                <input
                                  type="text"
                                  placeholder="스페셜"
                                  value={special}
                                  onChange={(e) =>
                                    setSpecial(
                                      e.target.value === ''
                                        ? ''
                                        : e.target.value
                                    )
                                  }
                                  className="ml-4 block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                              </div>
                              <div className="col-span-2 gap-0"></div>
                              <div className="col-span-4 gap-0 text-sm text-gray-500">
                                예시: QB, LB, K
                              </div>
                              <div className="col-span-2">키(cm)</div>
                              <div className="col-span-4 mb-2">
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
                              <div className="col-span-2">몸무게(kg)</div>
                              <div className="col-span-4 mb-2">
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
                              <div className="col-span-2">백넘버</div>
                              <div className="col-span-4">
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
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {errorMessages.length > 0 && (
                    <div className="mb-3 rounded-md bg-red-100 p-2 text-sm text-red-800">
                      {errorMessages.map((message, index) => (
                        <p key={index}>{message}</p>
                      ))}
                    </div>
                  )}
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                      onClick={handleSubmit}
                    >
                      추가
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

CreateRosterModal.propTypes = {
  teamId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  onRosterAdded: PropTypes.func.isRequired
}

export default CreateRosterModal
