import axiosInstance from '@/commons/axios'
import { printRosterType } from '@/commons/functions/roster-type/roster-type.print'
import { Gender } from '@/commons/interfaces/account/credential'
import type { Profile } from '@/commons/interfaces/account/profile'
import { RosterType } from '@/commons/interfaces/roster/roster'
import type { RosterWithCredential } from '@/commons/interfaces/roster/rosterWithCredential'
import useNotification from '@/hooks/useNotification'
import { NotificationType } from '@/state/notificationState'
import { Listbox, RadioGroup, Transition } from '@headlessui/react'
import {
  CheckIcon,
  ChevronUpDownIcon,
  PhotoIcon
} from '@heroicons/react/24/outline'
import { Fragment, useEffect, useState } from 'react'

interface CreateRosterFormProps {
  onRosterCreate: (roster: RosterWithCredential) => void
}

interface FormType {
  name: string
  globalName: string
  registerYear: number
  rosterType: RosterType
  birthday: string
  gender: Gender
  height?: number
  weight?: number
  backNumber?: number
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

const genderItems = [
  {
    name: '남성',
    value: Gender.Male
  },
  {
    name: '여성',
    value: Gender.Female
  }
]

const initForm: FormType = {
  name: '',
  globalName: '',
  registerYear: new Date().getFullYear(),
  birthday: '',
  gender: Gender.Male,
  rosterType: RosterType.Athlete
}

const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ')
}

const CreateRosterForm: React.FC<CreateRosterFormProps> = ({
  onRosterCreate
}) => {
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>()
  const [selectedFile, setSelectedFile] = useState<File>()
  const [isDragging, setIsDragging] = useState(false)
  const [form, setForm] = useState<FormType>(initForm)
  const [profile, setProfile] = useState<Profile>()
  const [offence, setOffence] = useState<string>()
  const [defense, setDefense] = useState<string>()
  const [special, setSpecial] = useState<string>()
  const [isFetching, setIsFetching] = useState(false)

  const { showNotification } = useNotification()

  const uploadRosterImage = async (rosterId: number) => {
    if (!selectedFile) return

    const formData = new FormData()
    formData.append('image', selectedFile)

    await axiosInstance
      .post(`/profile/roster/${rosterId}`, formData)
      .then(() => {
        setImagePreviewUrl(undefined)
        setSelectedFile(undefined)
      })
      .catch((error) => {
        throw new Error(error.response.data.message)
      })
  }

  const createRoster = async () => {
    if (!profile) return

    setIsFetching(true)

    const position: { offence?: string; defense?: string; special?: string } =
      {}

    if (form.rosterType === RosterType.Athlete) {
      offence ? (position.offence = offence) : null
      defense ? (position.defense = defense) : null
      special ? (position.special = special) : null
    }

    const roster: RosterWithCredential = await axiosInstance
      .post('rosters', {
        teamId: profile.teamId,
        position,
        ...form
      })
      .then((result) => result.data)
      .catch(() => undefined)

    if (!roster) {
      showNotification(
        NotificationType.Error,
        '생성 실페',
        '로스터를 생성하는 중 오류가 발생했습니다'
      )
      setIsFetching(false)
      return
    }

    await uploadRosterImage(roster.id)
      .then(() => {
        showNotification(
          NotificationType.Success,
          '생성 성공',
          '로스터가 생성되었습니다'
        )
        setForm(initForm)
      })
      .catch(() => {
        showNotification(
          NotificationType.Warning,
          '일부 성공',
          '로스터가 생성 되었지만 프로필 사진이 설정되지 않았습니다'
        )
      })
      .finally(() => {
        onRosterCreate(roster)
        setIsFetching(false)
      })
  }

  const processFile = (file: File) => {
    if (file.type.startsWith('image/') && file.size <= 10485760) {
      setSelectedFile(file)

      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      console.error('잘못된 사진 형식 또는 사진이 10MB 보다 큼')
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)

    const file = event.dataTransfer.files && event.dataTransfer.files[0]
    if (file) {
      processFile(file)
    } else {
      console.error('No file selected.')
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0]
    if (file) {
      processFile(file)
    } else {
      console.error('사진이 선택되지 않음')
    }
  }

  useEffect(() => {
    const getProfile = async () => {
      axiosInstance
        .get('/account/profile')
        .then((result) => setProfile(result.data))
    }

    getProfile()
  }, [])

  return (
    <>
      <div className="-mt-2 grid grid-cols-2 gap-x-3 gap-y-5">
        <div className="col-span-2">
          <p className="block text-sm font-semibold leading-6 text-gray-900">
            프로필 사진
          </p>
          <div
            className={`col-span-6 mt-2 flex justify-center rounded-lg border border-dashed sm:col-span-5 ${
              isDragging ? 'border-indigo-900' : 'border-gray-300'
            } px-6 py-2`}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="text-center">
              <div>
                {imagePreviewUrl ? (
                  <img
                    src={imagePreviewUrl}
                    alt="ProfileImage"
                    className="mx-auto mt-4 max-h-16 w-auto sm:max-h-28"
                  />
                ) : (
                  <PhotoIcon
                    className="mx-auto h-12 w-12 text-gray-300"
                    aria-hidden="true"
                  />
                )}
              </div>
              <div className="mt-4 flex text-sm leading-6 text-gray-600">
                <label
                  htmlFor="image"
                  className="relative mx-auto flex cursor-pointer items-center rounded-md bg-white text-xs font-semibold text-indigo-900 focus-within:outline-none hover:text-indigo-800 sm:text-sm"
                >
                  <span>사진 업로드</span>
                  <input
                    id="image"
                    name="image"
                    type="file"
                    className="sr-only"
                    onChange={handleImageUpload}
                  />
                  <p className="pl-1 text-gray-600">또는 드래그앤 드랍</p>
                </label>
              </div>
              <p className="text-xs leading-5 text-gray-600">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </div>
        </div>

        <div className="col-span-2 md:col-span-1">
          <label
            htmlFor="name"
            className="block text-sm font-semibold leading-6 text-gray-900"
          >
            이름 (국문)
          </label>
          <div className="mt-2">
            <div className="flex w-full">
              <input
                type="text"
                name="name"
                id="name"
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-950 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
        <div className="col-span-2 md:col-span-1">
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

        <div className="col-span-2 md:col-span-1">
          <label
            htmlFor="birthday"
            className="block text-sm font-semibold leading-6 text-gray-900"
          >
            생년월일
          </label>
          <div className="mt-2">
            <div className="flex w-full">
              <input
                type="date"
                name="birthday"
                id="birthday"
                value={form.birthday}
                onChange={(event) =>
                  setForm({ ...form, birthday: event.target.value })
                }
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-950 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>

        <div className="col-span-2 md:col-span-1">
          <p className="block text-sm font-semibold leading-6 text-gray-900">
            성별
          </p>
          <div className="mt-2">
            <RadioGroup
              value={form.gender}
              onChange={(event) => setForm({ ...form, gender: event })}
            >
              <RadioGroup.Label className="sr-only">성별</RadioGroup.Label>
              <div className="grid w-full grid-cols-2 gap-x-1">
                {genderItems.map((item) => (
                  <RadioGroup.Option
                    key={item.name}
                    value={item.value}
                    className={({ active, checked }) =>
                      classNames(
                        active ? 'ring-2 ring-indigo-950 ring-offset-2' : '',
                        checked
                          ? 'bg-indigo-950 text-white hover:bg-indigo-900'
                          : 'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
                        'col-span-1 rounded-md px-3 py-1.5 text-center text-sm font-semibold uppercase leading-6'
                      )
                    }
                  >
                    <RadioGroup.Label as="span">{item.name}</RadioGroup.Label>
                  </RadioGroup.Option>
                ))}
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>
      {form.rosterType === RosterType.Athlete && (
        <>
          <div className="col-span-2 mb-5 mt-5 grid grid-cols-3 gap-x-3 gap-y-5">
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
      <div className="mt-8 flex flex-row-reverse">
        <button
          disabled={isFetching}
          className="inline-flex items-center rounded-md bg-indigo-950 px-3.5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-900 sm:text-sm"
          onClick={createRoster}
        >
          생성하기
        </button>
      </div>
    </>
  )
}

export default CreateRosterForm
