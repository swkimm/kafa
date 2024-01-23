import axiosInstance from '@/commons/axios'
import { printRosterType } from '@/commons/functions/roster-type/roster-type.print'
import { RosterType } from '@/commons/interfaces/roster/roster'
import type { TeamSimple } from '@/commons/interfaces/team/teamSimple'
import useNotification from '@/hooks/useNotification'
import { NotificationType } from '@/state/notificationState'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline'
import { Fragment, useState } from 'react'

interface CreateRosterFormProps {
  selectedTeam: TeamSimple
  closeModal: () => void
  back: () => void
}

export interface ReqeustRosterFormType {
  teamId: number
  globalName: string
  registerYear: number
  rosterType: RosterType
  height?: number
  weight?: number
  backNumber?: number
  position: {
    offence?: string
    defense?: string
    special?: string
  }
}

const rosterTypeItems = [
  {
    name: '선수',
    value: RosterType.Athlete
  },
  {
    name: '매니저',
    value: RosterType.Staff
  },
  {
    name: '감독',
    value: RosterType.HeadCoach
  },
  {
    name: '코치',
    value: RosterType.Coach
  }
]

const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ')
}

export const CreateRosterForm: React.FC<CreateRosterFormProps> = ({
  selectedTeam,
  back,
  closeModal
}) => {
  const [form, setForm] = useState<ReqeustRosterFormType>({
    teamId: selectedTeam.id,
    globalName: '',
    registerYear: new Date().getFullYear(),
    rosterType: RosterType.Athlete,
    position: {}
  })
  const [offence, setOffence] = useState<string>()
  const [defense, setDefense] = useState<string>()
  const [special, setSpecial] = useState<string>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { showNotification } = useNotification()

  const createRoster = async () => {
    setIsSubmitting(true)

    if (form.rosterType === RosterType.Athlete) {
      offence ? (form.position.offence = offence) : null
      defense ? (form.position.defense = defense) : null
      special ? (form.position.special = special) : null
    }

    await axiosInstance
      .post('/rosters/request', {
        ...form
      })
      .then(() => {
        showNotification(
          NotificationType.Success,
          '생성 성공',
          '팀에 로스터 생성을 요청했습니다'
        )
      })
      .catch((error) => {
        if (error.response.status === 409) {
          showNotification(
            NotificationType.Error,
            '중복 요청',
            '이미 해당 팀의 로스터를 가지고 있거나, 로스터 신청이 진행중입니다',
            5000
          )
        } else {
          showNotification(
            NotificationType.Error,
            '생성 실패',
            '로스터를 생성하는 중 오류가 발생했습니다'
          )
        }
      })
      .finally(() => {
        setIsSubmitting(false)
        closeModal()
      })
  }

  return (
    <div className="-mb-6 -mt-2 grid grid-cols-2 gap-x-3 gap-y-5">
      <div className="col-span-2 pt-5 md:col-span-1">
        <label
          htmlFor="team-neam"
          className="block text-sm font-semibold leading-6 text-gray-900"
        >
          신청할 팀
        </label>
        <div className="mt-2">
          <div className="flex w-full">
            <input
              type="text"
              name="team-neam"
              id="team-neam"
              disabled={true}
              value={selectedTeam.name}
              className="block w-full rounded-md border-0 bg-gray-100 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-950 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>

      <div className="col-span-2 pt-5 md:col-span-1">
        <label
          htmlFor="global-name"
          className="block text-sm font-semibold leading-6 text-gray-900"
        >
          이름 (영문)
        </label>
        <div className="mt-2">
          <div className="flex w-full">
            <input
              type="text"
              name="global-name"
              id="global-name"
              value={form.globalName}
              onChange={(event) =>
                setForm({ ...form, globalName: event.target.value })
              }
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-950 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>

      <div className="col-span-2 md:col-span-1">
        <label
          htmlFor="register-year"
          className="block text-sm font-semibold leading-6 text-gray-900"
        >
          입부년도
        </label>
        <div className="mt-2">
          <div className="flex w-full">
            <input
              type="number"
              name="register-year"
              id="register-year"
              value={form.registerYear}
              onChange={(event) =>
                setForm({
                  ...form,
                  registerYear: parseInt(event.target.value, 10)
                })
              }
              placeholder={new Date().getFullYear().toString()}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-950 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>

      <div className="col-span-2 md:col-span-1">
        <p className="block text-sm font-semibold leading-6 text-gray-900">
          구분
        </p>
        <div className="mt-2 flex w-full">
          <Listbox
            value={form.rosterType}
            onChange={(event) => setForm({ ...form, rosterType: event })}
          >
            {({ open }) => (
              <div className="relative w-full">
                <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-950 sm:text-sm sm:leading-6">
                  <span className="block truncate">
                    {printRosterType(form.rosterType)}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>

                <Transition
                  show={open}
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-10 mt-1 max-h-24 w-full overflow-y-auto rounded-md bg-white py-1 text-xs shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {rosterTypeItems.map((item) => (
                      <Listbox.Option
                        key={item.name}
                        className={({ active }) =>
                          classNames(
                            active
                              ? 'bg-indigo-950 text-white'
                              : 'text-gray-900',
                            'relative cursor-default select-none py-2 pl-3 pr-9'
                          )
                        }
                        value={item.value}
                      >
                        {({ selected, active }) => (
                          <>
                            <span
                              className={classNames(
                                selected ? 'font-semibold' : 'font-normal'
                              )}
                            >
                              {item.name}
                            </span>

                            {selected ? (
                              <span
                                className={classNames(
                                  active ? 'text-white' : 'text-indigo-950',
                                  'absolute inset-y-0 right-0 flex items-center pr-4'
                                )}
                              >
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            )}
          </Listbox>
        </div>
      </div>

      {form.rosterType === RosterType.Athlete && (
        <>
          <div className="col-span-2 grid grid-cols-3 gap-x-3 gap-y-5">
            <div className="col-span-3 md:col-span-1">
              <label
                htmlFor="position-offence"
                className="block text-sm font-semibold leading-6 text-gray-900"
              >
                포지션 (오펜스)
              </label>
              <div className="mt-2">
                <div className="flex w-full">
                  <input
                    type="text"
                    name="position-offence"
                    value={offence}
                    onChange={(event) => setOffence(event.target.value)}
                    id="position-offence"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-950 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>

            <div className="col-span-3 md:col-span-1">
              <label
                htmlFor="position-defense"
                className="block text-sm font-semibold leading-6 text-gray-900"
              >
                포지션 (디펜스)
              </label>
              <div className="mt-2">
                <div className="flex w-full">
                  <input
                    type="text"
                    name="position-defense"
                    value={defense}
                    onChange={(event) => setDefense(event.target.value)}
                    id="position-defense"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-950 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>

            <div className="col-span-3 md:col-span-1">
              <label
                htmlFor="position-special"
                className="block text-sm font-semibold leading-6 text-gray-900"
              >
                포지션 (스페셜)
              </label>
              <div className="mt-2">
                <div className="flex w-full">
                  <input
                    type="text"
                    name="position-special"
                    value={special}
                    onChange={(event) => setSpecial(event.target.value)}
                    id="position-special"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-950 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-2 grid grid-cols-3 gap-x-3 gap-y-5">
            <div className="col-span-3 md:col-span-1">
              <label
                htmlFor="height"
                className="block text-sm font-semibold leading-6 text-gray-900"
              >
                키 (cm)
              </label>
              <div className="mt-2">
                <div className="flex w-full">
                  <input
                    type="number"
                    name="height"
                    value={form.height}
                    id="height"
                    onChange={(event) =>
                      setForm({
                        ...form,
                        height: parseInt(event.target.value, 10)
                      })
                    }
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-950 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            <div className="col-span-3 md:col-span-1">
              <label
                htmlFor="weight"
                className="block text-sm font-semibold leading-6 text-gray-900"
              >
                몸무게 (kg)
              </label>
              <div className="mt-2">
                <div className="flex w-full">
                  <input
                    type="number"
                    name="weight"
                    value={form.weight}
                    id="weight"
                    onChange={(event) =>
                      setForm({
                        ...form,
                        weight: parseInt(event.target.value, 10)
                      })
                    }
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-950 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>

            <div className="col-span-3 md:col-span-1">
              <label
                htmlFor="back-number"
                className="block text-sm font-semibold leading-6 text-gray-900"
              >
                백넘버
              </label>
              <div className="mt-2">
                <div className="flex w-full">
                  <input
                    type="number"
                    name="back-number"
                    value={form.backNumber}
                    id="back-number"
                    onChange={(event) =>
                      setForm({
                        ...form,
                        backNumber: parseInt(event.target.value, 10)
                      })
                    }
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-950 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <div className="col-span-2 border-t border-gray-900/30"></div>
      <div className="col-span-2 flex flex-row items-center justify-end gap-x-1">
        <button
          onClick={createRoster}
          disabled={isSubmitting}
          className="items-center whitespace-nowrap rounded-md bg-indigo-950 px-3.5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-900 sm:text-sm"
        >
          요청하기
        </button>
        <button
          onClick={back}
          disabled={isSubmitting}
          className="items-center whitespace-nowrap rounded-md bg-indigo-950 px-3.5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-900 sm:text-sm"
        >
          뒤로가기
        </button>
      </div>
    </div>
  )
}

export default CreateRosterForm
