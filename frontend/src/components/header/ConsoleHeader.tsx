// ConsoleHeader.tsx
import { logout } from '@/features/auth/authSlice'
import { Disclosure } from '@headlessui/react'
import { Bars3Icon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Notification from '../notifications/Notification'
import logo from '/logo/logo.png'

const ConsoleHeader = () => {
  const navigate = useNavigate()
  const [showLogoutNotification, setShowLogoutNotification] = useState(false)
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logout())
    setShowLogoutNotification(true)
    navigate('/login')
  }

  const goToConsoleHomePage = () => {
    navigate('/console')
  }

  return (
    <Disclosure
      as="nav"
      className="absolute left-0 top-0 z-50 w-full bg-white shadow-xl"
    >
      {() => (
        <>
          <div className="mx-auto sm:px-2 lg:px-4">
            <div className="flex h-16 justify-between px-2">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <img
                    onClick={goToConsoleHomePage}
                    src={logo}
                    alt="KAFA Logo"
                    className="h-15 w-20 cursor-pointer"
                  />
                </div>
                <div className="hidden sm:ml-2 sm:flex sm:space-x-4">
                  {/* <Disclosure.Button
                    as="button"
                    onClick={goToLeaguePage}
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-white hover:border-gray-300 hover:text-gray-700"
                  >
                    대회정보
                  </Disclosure.Button>
                  <Disclosure.Button
                    as="button"
                    onClick={gotoPastLeaguePage}
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-white hover:border-gray-300 hover:text-gray-700"
                  >
                    기록실
                  </Disclosure.Button>
                  <Disclosure.Button
                    as="button"
                    onClick={gotoHuddlePage}
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-white hover:border-gray-300 hover:text-gray-700"
                  >
                    HUDDLE
                  </Disclosure.Button> */}
                  <div className="ml-10 flex flex-shrink-0 items-center">
                    <Bars3Icon className="h-6 w-6 text-gray-500" />
                  </div>
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center ">
                <div className="flex space-x-4">
                  {/* <Disclosure.Button
                    as="button"
                    onClick={goToNoticePage}
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-white hover:border-gray-300 hover:text-gray-700"
                  >
                    NOTICE
                  </Disclosure.Button> */}

                  <Disclosure.Button
                    as="button"
                    onClick={handleLogout}
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-black hover:border-gray-300 hover:text-gray-500"
                  >
                    로그아웃
                  </Disclosure.Button>

                  {showLogoutNotification && (
                    <Notification
                      title="로그아웃"
                      content="로그아웃되었습니다."
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  )
}

export default ConsoleHeader
