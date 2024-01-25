import axiosInstance from '@/commons/axios'
import { Gender } from '@/commons/interfaces/account/credential'
import type { RosterWithCredential } from '@/commons/interfaces/roster/rosterWithCredential'
import ModalContainer from '@/components/modal/ModalContainer'
import useNotification from '@/hooks/useNotification'
import { NotificationType } from '@/state/notificationState'
import { RadioGroup } from '@headlessui/react'
import { useEffect, useState } from 'react'

interface UpdateCredentialModalProps {
  roster: RosterWithCredential
  isOpen: boolean
  closeModal: () => void
  onRosterUpdate: (updatedRoster: {
    rosterId: number
    name: string
    birthday: string
    gender: Gender
  }) => void
}

interface FormType {
  name: string
  birthday: string
  gender: Gender
}

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

const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ')
}

const UpdateCredentialModal: React.FC<UpdateCredentialModalProps> = ({
  roster,
  isOpen,
  closeModal,
  onRosterUpdate
}) => {
  const [form, setForm] = useState<FormType>()
  const { showNotification } = useNotification()

  useEffect(() => {
    setForm({
      name: roster.RosterCredentials.name,
      birthday: roster.RosterCredentials.birthday,
      gender: roster.RosterCredentials.gender
    })
  }, [roster])

  const updateRosterCredential = async () => {
    await axiosInstance
      .put(`/rosters/${roster.id}/credential`, { ...form })
      .then(
        (result: {
          data: { name: string; birthday: string; gender: Gender }
        }) => {
          onRosterUpdate({ ...result.data, rosterId: roster.id })
          showNotification(
            NotificationType.Success,
            '업데이트 성공',
            '로스터 개인정보가 업데이트 되었습니다'
          )
        }
      )
      .catch(() => {
        showNotification(
          NotificationType.Error,
          '업데이트 실패',
          '로스터 개인정보를 업데이트 하는 중 오류가 발생했습니다'
        )
      })
      .finally(() => closeModal())
  }

  return (
    <ModalContainer isOpen={isOpen}>
      {roster && form && (
        <>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-5">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                로스터 개인 정보 수정
              </h2>
              <div className="mt-7">
                <div className="flex flex-col gap-y-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold leading-6 text-gray-900"
                    >
                      실명
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
                  <div>
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
                          value={form.birthday}
                          id="birthday"
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
                        onChange={(event) =>
                          setForm({ ...form, gender: event })
                        }
                      >
                        <RadioGroup.Label className="sr-only">
                          성별
                        </RadioGroup.Label>
                        <div className="grid w-full grid-cols-2 gap-x-1">
                          {genderItems.map((item) => (
                            <RadioGroup.Option
                              key={item.name}
                              value={item.value}
                              className={({ active, checked }) =>
                                classNames(
                                  active
                                    ? 'ring-2 ring-indigo-950 ring-offset-2'
                                    : '',
                                  checked
                                    ? 'bg-indigo-950 text-white hover:bg-indigo-900'
                                    : 'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
                                  'col-span-1 rounded-md px-3 py-1.5 text-center text-sm font-semibold uppercase leading-6'
                                )
                              }
                            >
                              <RadioGroup.Label as="span">
                                {item.name}
                              </RadioGroup.Label>
                            </RadioGroup.Option>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center justify-end gap-x-2 py-5">
            <button
              className="inline-flex items-center rounded-md bg-indigo-950 px-3.5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-900 sm:text-sm"
              onClick={updateRosterCredential}
            >
              수정하기
            </button>
            <button
              className="inline-flex items-center rounded-md bg-indigo-950 px-3.5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-900 sm:text-sm"
              onClick={closeModal}
            >
              닫기
            </button>
          </div>
        </>
      )}
    </ModalContainer>
  )
}

export default UpdateCredentialModal
