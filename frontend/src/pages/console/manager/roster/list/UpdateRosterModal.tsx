import axiosInstance from '@/commons/axios'
import { printRosterStatus } from '@/commons/functions/roster-status/roster-status.print'
import { printRosterType } from '@/commons/functions/roster-type/roster-type.print'
import { type Roster, RosterType } from '@/commons/interfaces/roster/roster'
import { RosterStatus } from '@/commons/interfaces/roster/rosterStatus'
import ModalContainer from '@/components/modal/ModalContainer'
import { useDate } from '@/hooks/useDate'
import useNotification from '@/hooks/useNotification'
import { NotificationType } from '@/state/notificationState'
import { Listbox, Transition } from '@headlessui/react'
import {
  CheckIcon,
  ChevronUpDownIcon,
  ExclamationTriangleIcon,
  PhotoIcon
} from '@heroicons/react/24/outline'
import { Fragment, useEffect, useState } from 'react'

interface UpdateRosterMoalProps {
  rosterId: number
  isModalOpen: boolean
  closeModal: () => void
  onRosterUpdate: (updatedRoster: Roster) => void
}

interface FormType {
  name: string
  globalName: string
  registerYear: number
  rosterType: RosterType
  status: RosterStatus
  height?: number
  weight?: number
  backNumber?: number
}

const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ')
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

const rosterStatusItems = [
  {
    name: '활성',
    value: RosterStatus.Enable
  },
  {
    name: '동문',
    value: RosterStatus.Graduate
  },
  {
    name: '비활성',
    value: RosterStatus.Disable
  }
]

const UpdateRosterModal: React.FC<UpdateRosterMoalProps> = ({
  rosterId,
  closeModal,
  isModalOpen,
  onRosterUpdate
}) => {
  const [form, setForm] = useState<FormType>()
  const [profileImg, setProfileImge] = useState<string>()
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>()
  const [offence, setOffence] = useState<string>()
  const [defense, setDefense] = useState<string>()
  const [special, setSpecial] = useState<string>()
  const [selectedFile, setSelectedFile] = useState<File>()
  const [isDragging, setIsDragging] = useState(false)

  const { showNotification } = useNotification()

  const { formatDate, parseUTCDate } = useDate()

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0]
    if (file) {
      processFile(file)
    } else {
      console.error('사진이 선택되지 않음')
    }
  }

  const uploadRosterProfile = async () => {
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

  const updateRoster = async () => {
    if (!form) return

    const success = await uploadRosterProfile()
      .then(() => {
        return true
      })
      .catch((error) => {
        showNotification(NotificationType.Error, '변경 실패', error.message)
        return false
      })

    if (!success) {
      closeModal()
      return
    }

    const position: { offence?: string; defense?: string; special?: string } =
      {}

    if (form.rosterType === RosterType.Athlete) {
      offence ? (position.offence = offence) : null
      defense ? (position.defense = defense) : null
      special ? (position.special = special) : null
    }

    await axiosInstance
      .put(`/rosters/${rosterId}`, {
        ...form,
        position
      })
      .then((result: { data: Roster }) => {
        result.data.registerYear = formatDate(
          parseUTCDate(result.data.registerYear),
          'YYYY'
        )
        onRosterUpdate(result.data)
        showNotification(
          NotificationType.Success,
          '변경 성공',
          '로스터 정보가 변경되었습니다'
        )
      })
      .catch(() => {
        showNotification(
          NotificationType.Error,
          '변경 실패',
          '로스터 정보를 업데이트 하는 중 오류가 발생했습니다'
        )
      })
      .finally(() => closeModal())
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

  useEffect(() => {
    const getRoster = async () => {
      await axiosInstance
        .get(`/rosters/${rosterId}`)
        .then((result: { data: Roster }) => {
          setForm({
            name: result.data.name,
            globalName: result.data.globalName,
            registerYear: new Date(result.data.registerYear).getFullYear(),
            rosterType: result.data.rosterType,
            status: result.data.status,
            height: result.data.Athlete?.height,
            weight: result.data.Athlete?.weight,
            backNumber: result.data.Athlete?.backNumber
          })
          setOffence(result.data.Athlete?.position.offence)
          setDefense(result.data.Athlete?.position.defense)
          setSpecial(result.data.Athlete?.position.special)
          setProfileImge(result.data.profileImgUrl)
        })
    }

    getRoster()
  }, [rosterId])

  return (
    <ModalContainer isOpen={isModalOpen}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-5">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            로스터 정보 수정
          </h2>
          {form && (
            <div className="mt-7">
              <div className="mb-5 grid grid-cols-2 gap-x-5 gap-y-5">
                <div className="col-span-2 sm:col-span-1">
                  <p className="block text-sm font-semibold leading-6 text-gray-900">
                    프로필 이미지
                  </p>
                  <div className="mt-2">
                    {profileImg ? (
                      <img
                        src={profileImg}
                        alt="프로필 이미지"
                        className="col-span-6 max-h-40 object-contain sm:col-span-5"
                      />
                    ) : (
                      <div className="col-span-6 sm:col-span-5">
                        <div className="flex flex-row items-center">
                          <ExclamationTriangleIcon className="h-6 w-6 pr-1.5 text-yellow-500" />
                          <p className="text-sm leading-6 text-gray-900">
                            등록된 프로필 이미지가 없습니다
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <p className="block text-sm font-semibold leading-6 text-gray-900">
                    프로필 사진 변경
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
                          <p className="pl-1 text-gray-600">
                            또는 드래그앤 드랍
                          </p>
                        </label>
                      </div>
                      <p className="text-xs leading-5 text-gray-600">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-5 grid grid-cols-2 gap-x-5">
                <div className="col-span-1">
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold leading-6 text-gray-900"
                  >
                    이름
                  </label>
                  <div className="mt-2">
                    <div className="flex w-full">
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        id="name"
                        onChange={(event) =>
                          setForm({ ...form, name: event.target.value })
                        }
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-950 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-span-1">
                  <label
                    htmlFor="global-name"
                    className="block text-sm font-semibold leading-6 text-gray-900"
                  >
                    영문 이름
                  </label>
                  <div className="mt-2">
                    <div className="flex w-full">
                      <input
                        type="text"
                        name="global-name"
                        value={form.globalName}
                        id="global-name"
                        onChange={(event) =>
                          setForm({ ...form, globalName: event.target.value })
                        }
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-950 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-5 grid grid-cols-2 gap-x-5">
                <div className="col-span-1">
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
                        value={form.registerYear}
                        id="register-year"
                        onChange={(event) =>
                          setForm({
                            ...form,
                            registerYear: parseInt(event.target.value, 10)
                          })
                        }
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-950 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-span-1">
                  <p className="block text-sm font-semibold leading-6 text-gray-900">
                    구분
                  </p>
                  <div className="mt-2">
                    <div className="flex w-full">
                      <Listbox
                        value={form.rosterType}
                        onChange={(event) =>
                          setForm({ ...form, rosterType: event })
                        }
                      >
                        {({ open }) => (
                          <div className="relative w-full">
                            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-950 sm:text-sm sm:leading-6">
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
                              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
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
                                            selected
                                              ? 'font-semibold'
                                              : 'font-normal'
                                          )}
                                        >
                                          {item.name}
                                        </span>

                                        {selected ? (
                                          <span
                                            className={classNames(
                                              active
                                                ? 'text-white'
                                                : 'text-indigo-950',
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
                </div>
              </div>
              {form.rosterType === RosterType.Athlete && (
                <>
                  <div className="mb-5 grid grid-cols-3 gap-x-5 gap-y-5">
                    <div className="col-span-3 sm:col-span-1">
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
                    <div className="col-span-3 sm:col-span-1">
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
                    <div className="col-span-3 sm:col-span-1">
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
                  <div className="mb-5 grid grid-cols-3 gap-x-5 gap-y-5">
                    <div className="col-span-3 sm:col-span-1">
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
                    <div className="col-span-3 sm:col-span-1">
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
                    <div className="col-span-3 sm:col-span-1">
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

              <div className="mb-5 grid grid-cols-2 gap-x-5 gap-y-5">
                <div className="col-span-2 sm:col-span-1">
                  <p className="block text-sm font-semibold leading-6 text-gray-900">
                    로스터 상태
                  </p>
                  <div className="mt-2">
                    <div className="flex w-full">
                      <Listbox
                        value={form.status}
                        onChange={(event) =>
                          setForm({ ...form, status: event })
                        }
                      >
                        {({ open }) => (
                          <div className="relative w-full">
                            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-950 sm:text-sm sm:leading-6">
                              <span className="block truncate">
                                {printRosterStatus(form.status)}
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
                              <Listbox.Options className="absolute z-10 mt-1 max-h-[102px] w-full overflow-y-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:max-h-32 sm:text-sm">
                                {rosterStatusItems.map((item) => (
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
                                            selected
                                              ? 'font-semibold'
                                              : 'font-normal'
                                          )}
                                        >
                                          {item.name}
                                        </span>

                                        {selected ? (
                                          <span
                                            className={classNames(
                                              active
                                                ? 'text-white'
                                                : 'text-indigo-950',
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
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-8 flex justify-end gap-x-1.5">
        <button
          onClick={updateRoster}
          className="inline-flex items-center rounded-md bg-indigo-950 px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-900 sm:text-sm"
        >
          변경하기
        </button>
        <button
          onClick={closeModal}
          className="inline-flex items-center rounded-md border border-black bg-white px-4 py-2.5 text-xs font-semibold text-black shadow-md hover:bg-gray-100 sm:text-sm"
        >
          변경취소
        </button>
      </div>
    </ModalContainer>
  )
}

export default UpdateRosterModal
