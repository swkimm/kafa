import axiosInstance from '@/commons/axios'
import useNotification from '@/hooks/useNotification'
import { NotificationType } from '@/state/notificationState'
import { LockClosedIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface EmailVerificationFormProps {
  email: string
  accountId: number
}

const EmailVerificationForm: React.FC<EmailVerificationFormProps> = ({
  email,
  accountId
}) => {
  const navigate = useNavigate()

  const { showNotification } = useNotification()

  const [pin, setPin] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!pin) {
      showNotification(
        NotificationType.Warning,
        '인증번호 없음',
        '인증번호를 입력해주세요'
      )

      return
    }

    try {
      setIsSubmitting(true)
      await axiosInstance.post(
        `/account/email/verify?pin=${pin}&accountId=${accountId}`
      )
      showNotification(
        NotificationType.Success,
        '회원가입 완료',
        '입력하신 정보로 로그인할 수 있습니다',
        3000
      )
      navigate('/login')
    } catch (error) {
      showNotification(
        NotificationType.Error,
        '인증번호 틀림',
        '잘못된 인증번호입니다',
        3000
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-y-2">
      <div>
        <img className="mx-auto h-32" src="/logo/logo.png" alt="TBD" />
      </div>
      <div className="mt-10 text-center text-gray-400">
        <p>
          <span className="mr-1 font-bold text-gray-600">{email}</span>로 전송된
          인증번호를 입력해주세요
        </p>
      </div>
      <div className="relative flex flex-row items-center rounded-md px-3 py-3 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-indigo-950">
        <label htmlFor="pin" className="sr-only">
          인증번호
        </label>
        <LockClosedIcon
          className="mr-2 h-5 w-5 text-gray-400"
          aria-hidden="true"
        />
        <input
          type="text"
          className="w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 sm:text-sm sm:leading-6"
          placeholder="인증번호"
          id="pin"
          value={pin}
          onChange={(event) => setPin(event.target.value)}
        />
      </div>
      <div>
        <button
          disabled={isSubmitting}
          onClick={handleSubmit}
          className="mt-3 w-full rounded-md bg-indigo-950 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-900 focus:ring-offset-2"
          onKeyDown={(event) => {
            if (event.key === 'Enter') handleSubmit()
          }}
        >
          인증하기
        </button>
      </div>
    </div>
  )
}

export default EmailVerificationForm
