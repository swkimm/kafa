import axiosInstance from '@/commons/axios'
import type { Association } from '@/commons/interfaces/association/association'
import type { RegisterTeamRequest } from '@/commons/interfaces/team/team-request'
import useNotification from '@/hooks/useNotification'
import { NotificationType } from '@/state/notificationState'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline'
import { Fragment, useEffect, useState } from 'react'

interface CreatTeamFormProps {
  onCreate: (requests: RegisterTeamRequest) => void
}

type FormType = {
  username: string
  name: string
  globalName: string
  initial: string
  hometown: string
  associationInfo: Association
  establishedAt: number
  color: string
  subColor: string
}

const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ')
}

const formInit = {
  username: '',
  name: '',
  globalName: '',
  initial: '',
  hometown: '',
  associationInfo: {
    id: 0,
    name: '',
    globalName: '',
    initial: '',
    parentId: 0,
    profileImgUrl: undefined
  },
  establishedAt: new Date().getFullYear(),
  color: '',
  subColor: ''
}

export const CreateTeamForm: React.FC<CreatTeamFormProps> = ({ onCreate }) => {
  const [teamInfo, setTeamInfo] = useState<FormType>(formInit)

  const [isSubmitting, setIsSubmitting] = useState(false)

  const [associations, setAssociations] = useState<Association[]>([])

  const { showNotification } = useNotification()

  useEffect(() => {
    const getAssociations = async () => {
      await axiosInstance
        .get('/associations?page=1&limit=50')
        .then((result: { data: Association[] }) => {
          if (result.data.length > 0) {
            setTeamInfo({ ...teamInfo, associationInfo: result.data[0] })
          }
          setAssociations(result.data)
        })
    }

    getAssociations()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const createTeam = async () => {
    setIsSubmitting(true)

    await axiosInstance
      .post('/teams/requests', {
        teamAccountUsername: teamInfo.username,
        data: {
          associationId: teamInfo.associationInfo.id,
          name: teamInfo.name,
          globalName: teamInfo.globalName,
          hometown: teamInfo.hometown,
          initial: teamInfo.initial,
          establishedAt: new Date(`${teamInfo.establishedAt}-01-01`),
          color: teamInfo.color,
          subColor: teamInfo.subColor
        }
      })
      .then((result: { data: RegisterTeamRequest }) => {
        onCreate(result.data)
        setTeamInfo(formInit)
        showNotification(
          NotificationType.Success,
          '요청 성공',
          '팀 생성 요청이 접수되었습니다'
        )
      })
      .catch((error) => {
        if (error.response.status === 400) {
          showNotification(
            NotificationType.Error,
            '올바르지 않은 형식',
            '입력하신 내용중 잘못된 내용이 포함되어 있습니다',
            3000
          )
        }
        if (error.response.status === 409) {
          if ((error.response.data.message as string).includes('username')) {
            showNotification(
              NotificationType.Error,
              '중복된 아이디',
              '입력하신 아이디가 이미 사용중입니다',
              3000
            )
          } else {
            showNotification(
              NotificationType.Error,
              '중복된 요청',
              '이미 처리중인 팀 생성 요청이 존재합니다',
              3000
            )
          }
        }
      })
      .finally(() => setIsSubmitting(false))
  }

  return (
    <>
      <div className="border-b border-gray-900/10 pb-5">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="col-span-full">
            <label
              htmlFor="username"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              팀 계정에 사용할 아이디
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="usename"
                id="username"
                value={teamInfo.username}
                onChange={(event) =>
                  setTeamInfo({ ...teamInfo, username: event.target.value })
                }
                className="block w-full rounded-md border-0 py-1.5 pl-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-950 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              팀 이름 (국문)
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="name"
                id="name"
                value={teamInfo.name}
                onChange={(event) =>
                  setTeamInfo({ ...teamInfo, name: event.target.value })
                }
                className="block w-full rounded-md border-0 py-1.5 pl-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-950 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="global-name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              팀 이름 (영문)
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="global-name"
                id="global-name"
                value={teamInfo.globalName}
                onChange={(event) =>
                  setTeamInfo({ ...teamInfo, globalName: event.target.value })
                }
                className="block w-full rounded-md border-0 py-1.5 pl-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-950 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="initial"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              팀 이니셜 (대문자)
            </label>
            <div className="mt-2">
              <input
                id="initial"
                name="initial"
                type="initial"
                value={teamInfo.initial}
                onChange={(event) =>
                  setTeamInfo({ ...teamInfo, initial: event.target.value })
                }
                className="block w-full rounded-md border-0 py-1.5 pl-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-950 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="hometown"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              소속 또는 연고지
            </label>
            <div className="mt-2">
              <input
                id="hometown"
                name="hometown"
                type="hometown"
                value={teamInfo.hometown}
                onChange={(event) =>
                  setTeamInfo({ ...teamInfo, hometown: event.target.value })
                }
                placeholder="ex) OO대학교 or 서울"
                className="block w-full rounded-md border-0 py-1.5 pl-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-950 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="association"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              소속협회
            </label>
            <div className="mt-2">
              <Listbox
                value={teamInfo.associationInfo}
                onChange={(event) =>
                  setTeamInfo({ ...teamInfo, associationInfo: { ...event } })
                }
              >
                {({ open }) => (
                  <>
                    <div className="relative mt-2">
                      <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-950 sm:text-sm sm:leading-6">
                        <span className="flex items-center">
                          <span className="ml-1.5 block truncate">
                            {teamInfo.associationInfo.name}
                          </span>
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
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
                        <Listbox.Options className="absolute z-10 mt-1 max-h-36 w-full overflow-y-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {associations.map((association) => (
                            <Listbox.Option
                              key={association.id}
                              className={({ active }) =>
                                classNames(
                                  active
                                    ? 'bg-indigo-950 text-white'
                                    : 'text-gray-900',
                                  'relative cursor-default select-none py-2 pr-9'
                                )
                              }
                              value={association}
                            >
                              {({ selected, active }) => (
                                <>
                                  <div className="flex items-center">
                                    <span
                                      className={classNames(
                                        selected
                                          ? 'font-semibold'
                                          : 'font-normal',
                                        'ml-3 block truncate'
                                      )}
                                    >
                                      {association.name}
                                    </span>
                                  </div>

                                  {selected ? (
                                    <span
                                      className={classNames(
                                        active
                                          ? 'text-white'
                                          : 'text-indigo-600',
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
                  </>
                )}
              </Listbox>
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="established-at"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              창단연도
            </label>
            <div className="mt-2">
              <input
                type="number"
                name="established-at"
                id="established-at"
                value={teamInfo.establishedAt}
                onChange={(event) =>
                  setTeamInfo({
                    ...teamInfo,
                    establishedAt: parseInt(event.target.value, 10)
                  })
                }
                className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-950 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="color"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              팀 메인 컬러
            </label>
            <div className="mt-2">
              <input
                id="color"
                name="color"
                type="color"
                value={teamInfo.color}
                onChange={(event) =>
                  setTeamInfo({ ...teamInfo, color: event.target.value })
                }
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="sub-color"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              팀 서브 컬러
            </label>
            <div className="mt-2">
              <input
                id="sub-color"
                name="sub-color"
                type="color"
                value={teamInfo.subColor}
                onChange={(event) =>
                  setTeamInfo({ ...teamInfo, subColor: event.target.value })
                }
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5 flex flex-row-reverse">
        <button
          disabled={isSubmitting}
          onClick={() => createTeam()}
          className="inline-flex items-center rounded-md bg-indigo-950 px-3.5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-900 sm:text-sm"
        >
          신청하기
        </button>
      </div>
    </>
  )
}
