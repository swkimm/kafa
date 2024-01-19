import axiosInstance from '@/commons/axios'
import type { CertificationStatus } from '@/commons/interfaces/account/certification'
import type { Profile } from '@/commons/interfaces/account/profile'
import useNotification from '@/hooks/useNotification'
import { NotificationType } from '@/state/notificationState'
import {
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'

interface CertificaionCardProps {
  status: CertificationStatus
  onStatusChange: (status: CertificationStatus) => void
}

const EmailCard: React.FC<CertificaionCardProps> = ({
  status,
  onStatusChange
}) => {
  const [profile, setProfile] = useState<Profile>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isMailSended, setIsMailSended] = useState(false)
  const [pin, setPin] = useState('')

  const { showNotification } = useNotification()

  const verifyEmail = async () => {
    if (!pin) {
      showNotification(
        NotificationType.Warning,
        '인증번호 미입력',
        '인증번호를 입력해주세요'
      )
      return
    }

    setIsSubmitting(true)
    await axiosInstance
      .post(`/account/email/verify?pin=${pin}`)
      .then(() => {
        showNotification(
          NotificationType.Success,
          '인증 성공',
          '이메일 주소가 인증되었습니다'
        )
        onStatusChange({ ...status, email: true })
      })
      .catch(() =>
        showNotification(
          NotificationType.Error,
          '인증 실패',
          '인증번호를 확인해주세요'
        )
      )
      .finally(() => setIsSubmitting(false))
  }

  const requestMail = async () => {
    setIsSubmitting(true)
    await axiosInstance
      .post('/account/email/verify/resend')
      .then(() => {
        showNotification(
          NotificationType.Success,
          '발송 성공',
          '인증메일이 발송되었습니다'
        )
        setIsMailSended(true)
      })
      .catch(() =>
        showNotification(
          NotificationType.Error,
          '발송 실패',
          '인증메일이 발송되지 않았습니다'
        )
      )
      .finally(() => setIsSubmitting(false))
  }

  useEffect(() => {
    const getProfile = async () => {
      await axiosInstance
        .get('/account/profile')
        .then((result) => setProfile(result.data))
    }

    getProfile()
  }, [])

  return (
    <div className="-mt-3 flex flex-col gap-y-2">
      {status.email ? (
        <>
          <div className="mb-3 flex items-center text-sm">
            <CheckCircleIcon className="h-6 w-6 pr-1.5 text-green-500" />
            <p>이메일 주소 인증을 완료했습니다</p>
          </div>
          {profile && (
            <div className="flex flex-row items-center justify-between text-sm">
              <p className="text-gray-400">이메일 주소</p>
              <p className="pl-1.5 text-gray-900">{profile.email}</p>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col gap-y-2">
          <div className="mb-3 flex items-center text-sm">
            <ExclamationCircleIcon className="h-6 w-6 pr-1.5 text-red-500" />
            <p>이메일 주소 인증을 완료하지 않았습니다</p>
          </div>
          {profile && (
            <div className="flex flex-row items-center justify-between text-sm">
              <p className="text-gray-400">이메일 주소</p>
              <p className="pl-1.5 text-gray-900">{profile.email}</p>
            </div>
          )}
          {isMailSended ? (
            <div className="flex flex-col gap-y-5">
              <div className="flex flex-row items-center justify-between">
                <label
                  htmlFor="pin"
                  className="flex-shrink-0 pr-10 text-sm text-gray-400"
                >
                  인증번호
                </label>
                <input
                  className="block w-full rounded-md border py-1 pl-1.5 text-gray-900 placeholder:text-gray-400 focus-within:ring-2 focus-within:ring-indigo-950 focus:outline-none sm:text-sm sm:leading-6"
                  type="text"
                  id="pin"
                  name="pin"
                  value={pin}
                  onChange={(event) => setPin(event.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <div className="flex flex-row-reverse">
                <button
                  disabled={isSubmitting}
                  onClick={verifyEmail}
                  className="inline-flex items-center rounded-md bg-indigo-950 px-3.5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-900 sm:text-sm"
                >
                  인증하기
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-2 flex flex-row-reverse">
              <button
                disabled={isSubmitting}
                onClick={requestMail}
                className="inline-flex items-center rounded-md bg-indigo-950 px-3.5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-900 sm:text-sm"
              >
                인증메일 전송
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default EmailCard
