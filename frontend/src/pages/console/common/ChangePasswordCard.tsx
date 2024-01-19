import axiosInstance from '@/commons/axios'
import ConsoleCard from '@/components/cards/ConsoleCard'
import useNotification from '@/hooks/useNotification'
import { NotificationType } from '@/state/notificationState'
import { useState } from 'react'

const ChangePasswordCard: React.FC = () => {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { showNotification } = useNotification()

  const onOldPasswordChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOldPassword(event.target.value)
  }

  const onNewPasswordChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(event.target.value)
  }

  const handleChangePassword = async () => {
    setIsSubmitting(true)
    await axiosInstance
      .put('/account/password', {
        oldPassword,
        newPassword
      })
      .then(() => {
        showNotification(
          NotificationType.Success,
          '변경 성공',
          '비밀번호를 변경하였습니다'
        )
        setOldPassword('')
        setNewPassword('')
      })
      .catch(() => {
        showNotification(
          NotificationType.Error,
          '변경 실패',
          '현재 비밀번호를 확인해주세요'
        )
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  return (
    <ConsoleCard title={'비밀번호 변경'} subtitle={'비밀번호를 변경합니다'}>
      <div>
        <div className="pb-3 sm:grid sm:grid-cols-3 sm:items-start sm:gap-4">
          <label
            htmlFor="oldPassword"
            className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
          >
            기존 비밀번호
          </label>
          <div className="mt-2 sm:col-span-2 sm:mt-0">
            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-950">
              <input
                type="password"
                name="oldPassword"
                value={oldPassword}
                onChange={onOldPasswordChanged}
                disabled={isSubmitting}
                id="oldPassword"
                className="block flex-1 border-0 bg-transparent py-1.5 pl-1.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4">
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
          >
            새 비밀번호
          </label>
          <div className="mt-2 sm:col-span-2 sm:mt-0">
            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-950">
              <input
                type="password"
                name="newPassword"
                value={newPassword}
                onChange={onNewPasswordChanged}
                disabled={isSubmitting}
                id="newPassword"
                className="block flex-1 border-0 bg-transparent py-1.5 pl-1.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <button
            onClick={handleChangePassword}
            disabled={isSubmitting}
            className="inline-flex items-center rounded-md bg-indigo-950 px-3.5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-900 sm:text-sm"
          >
            비밀번호 변경
          </button>
        </div>
      </div>
    </ConsoleCard>
  )
}

export default ChangePasswordCard
