import useNotification from '@/hooks/useNotification'
import { NotificationType, notificationState } from '@/state/notificationState'
import { Transition } from '@headlessui/react'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { Fragment, useEffect } from 'react'
import { useRecoilValue } from 'recoil'

export const NotificationToast = () => {
  const notification = useRecoilValue(notificationState)
  const { closeNotification } = useNotification()

  // 생성된지 1.5초 후에 종료
  useEffect(() => {
    if (notification.isShow) {
      const timer = setTimeout(() => {
        closeNotification()
      }, notification.age)

      return () => clearTimeout(timer)
    }
  }, [notification.isShow, closeNotification, notification.age])

  const renderIcon = (): JSX.Element => {
    switch (notification.type) {
      case NotificationType.Success:
        return (
          <CheckCircleIcon
            className="h-6 w-6 text-green-400"
            aria-hidden="true"
          />
        )
      case NotificationType.Warning:
        return (
          <InformationCircleIcon
            className="h-6 w-6 text-yellow-400"
            aria-hidden="true"
          />
        )
      case NotificationType.Error:
        return (
          <ExclamationTriangleIcon
            className="h-6 w-6 text-red-400"
            aria-hidden="true"
          />
        )
      default:
        return <></>
    }
  }

  return (
    <>
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 z-50 flex items-end px-4 py-6 sm:mt-12 sm:items-start sm:p-6"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          <Transition
            show={notification.isShow}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">{renderIcon()}</div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-bold text-gray-900">
                      {notification.title}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {notification.message}
                    </p>
                  </div>
                  <div className="ml-4 flex flex-shrink-0">
                    <button
                      type="button"
                      className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={closeNotification}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </>
  )
}

export default NotificationToast
