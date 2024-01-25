import axiosInstance from '@/commons/axios'
import { classNames } from '@/commons/functions/class-names/class-names'
import type { CertificationStatus } from '@/commons/interfaces/account/certification'
import {
  Gender,
  type Credential
} from '@/commons/interfaces/account/credential'
import useNotification from '@/hooks/useNotification'
import { NotificationType } from '@/state/notificationState'
import { RadioGroup } from '@headlessui/react'
import {
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'

interface CertificaionCardProps {
  status: CertificationStatus
  onStatusChange: (status: CertificationStatus) => void
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

const CredentialCard: React.FC<CertificaionCardProps> = ({
  status,
  onStatusChange
}) => {
  const [credential, setCredential] = useState<Credential>()
  const [form, setForm] = useState<FormType>({
    birthday: '',
    gender: Gender.Male,
    name: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { showNotification } = useNotification()

  const createCredential = async () => {
    if (!form.birthday || !form.name || !form.gender) {
      showNotification(
        NotificationType.Warning,
        '비어있음',
        '모든 필드를 입력하지 않았습니다'
      )

      return
    }

    try {
      setIsSubmitting(true)
      const response = await axiosInstance.post<Credential>(
        '/account/credential',
        form
      )

      showNotification(
        NotificationType.Success,
        '등록 성공',
        '개인정보가 등록되었습니다'
      )

      setCredential(response.data)

      onStatusChange({ ...status, credential: true })
    } catch (error) {
      showNotification(
        NotificationType.Error,
        '등록 실패',
        '등록 과정에서 오류가 발생했습니다'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    const getCredential = async () => {
      await axiosInstance.get('/account/credential').then((result) => {
        setCredential(result.data)
      })
    }

    getCredential()
  }, [])

  return (
    <div className="-mt-3 flex flex-col gap-y-2">
      {status.credential ? (
        <div className="flex flex-col text-sm">
          <div className="mb-3 flex flex-row items-center">
            <CheckCircleIcon className="h-6 w-6 pr-1.5 text-green-500" />
            <p>본인 인증을 완료했습니다</p>
          </div>
          {credential && (
            <div className="flex flex-col gap-y-0.5">
              <div className="flex flex-row justify-between">
                <p className="text-gray-400">실명</p>
                <p className="text-gray-900">{credential.name}</p>
              </div>
              <div className="flex flex-row justify-between">
                <p className="text-gray-400">생년월일</p>
                <p className="text-gray-900">{credential.birthday}</p>
              </div>
              <div className="flex flex-row justify-between">
                <p className="text-gray-400">성별</p>
                <p className="text-gray-900">
                  {credential.gender === Gender.Male ? '남성' : '여성'}
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="mb-3 flex flex-row items-center text-sm">
            <ExclamationCircleIcon className="h-6 w-6 pr-1.5 text-red-500" />
            <p>본인 인증이 완료되지 않았습니다</p>
          </div>
          <div className="flex flex-col gap-y-5">
            <div className="flex flex-col">
              <label
                htmlFor="name"
                className="mb-1 pr-10 text-sm font-medium text-gray-900"
              >
                이름
              </label>
              <input
                className="block w-full rounded-md border py-1 pl-1.5 text-gray-900 placeholder:text-gray-400 focus-within:ring-2 focus-within:ring-indigo-950 focus:outline-none sm:text-sm sm:leading-6"
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="birthday"
                className="mb-1 pr-10 text-sm font-medium text-gray-900"
              >
                생년월일
              </label>
              <input
                className="block w-full rounded-md border py-1 pl-1.5 text-gray-900 placeholder:text-gray-400 focus-within:ring-2 focus-within:ring-indigo-950 focus:outline-none sm:text-sm sm:leading-6"
                type="date"
                id="birthday"
                name="birthday"
                value={form.birthday}
                onChange={(event) =>
                  setForm({ ...form, birthday: event.target.value })
                }
              />
            </div>
            <div className="flex flex-col">
              <p className="block text-sm font-semibold leading-6 text-gray-900">
                성별
              </p>
              <div className="mt-1">
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
            <div className="flex flex-row-reverse">
              <button
                disabled={isSubmitting}
                onClick={createCredential}
                className="inline-flex items-center rounded-md bg-indigo-950 px-3.5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-900 sm:text-sm"
              >
                개인정보 등록하기
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default CredentialCard
