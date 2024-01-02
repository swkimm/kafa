// Header.tsx
import type { RootState } from '@/app/store'
import { logout } from '@/features/auth/authSlice'
import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import Notification from '../notifications/Notification'
import logo from '/logo/logo.png'

const Header = () => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn)
  const [showLogoutNotification, setShowLogoutNotification] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const headerHeight = ''

  const mainContentStyle = {
    paddingTop: headerHeight
  }

  const handleLogout = () => {
    dispatch(logout())
    setShowLogoutNotification(true)
  }

  const handleScroll = () => {
    const offset = window.pageYOffset
    setIsScrolled(offset > 0)
  }

  const goToLeaguePage = () => {
    navigate('/leagues')
  }

  const gotoPastLeaguePage = () => {
    navigate('/pastLeague')
  }

  const gotoHuddlePage = () => {
    navigate('/')
  }

  const goToHomePage = () => {
    navigate('/')
  }

  const goToNoticePage = () => {
    navigate('/notice')
  }

  const gotoLoginPage = () => {
    navigate('/login')
  }

  const gotoAssociationPage = () => {
    navigate('/association')
  }

  const gotoNationalPage = () => {
    navigate('/national')
  }

  const gotoBoard = () => {
    navigate('/board')
  }

  const goToAppealPage = () => {
    navigate('/appeal')
  }

  const goToCalendar = () => {
    navigate('/calendar')
  }

  useEffect(() => {
    if (location.pathname === '/') {
      setIsScrolled(false)
      window.addEventListener('scroll', handleScroll)
    } else {
      setIsScrolled(true)
    }
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [location.pathname])
  return (
    <Disclosure
      as="nav"
      className={`fixed left-0 top-0 z-10 w-full ${
        isScrolled || location.pathname !== '/'
          ? 'bg-red-600'
          : 'bg-transparent'
      }`}
      style={mainContentStyle}
    >
      {({ open }) => (
        <>
          <div className="mx-auto sm:px-2 lg:px-4">
            <div className="flex h-16 justify-between px-2">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <img
                    onClick={goToHomePage}
                    src={logo}
                    alt="KAFA Logo"
                    className="h-15 w-20"
                  />
                </div>
                <div className="hidden sm:ml-2 sm:flex sm:space-x-4">
                  <Disclosure.Button
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
                  </Disclosure.Button>
                  <Disclosure.Button
                    as="button"
                    onClick={gotoAssociationPage}
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-white hover:border-gray-300 hover:text-gray-700"
                  >
                    협회정보
                  </Disclosure.Button>
                  <Disclosure.Button
                    as="button"
                    onClick={gotoNationalPage}
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-white hover:border-gray-300 hover:text-gray-700"
                  >
                    국가대표
                  </Disclosure.Button>
                  <a
                    href="#"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-white hover:border-gray-300 hover:text-gray-700"
                  >
                    자료실
                  </a>
                  <Disclosure.Button
                    as="button"
                    onClick={gotoBoard}
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-white hover:border-gray-300 hover:text-gray-700"
                  >
                    게시판
                  </Disclosure.Button>
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center ">
                <div className="flex space-x-4">
                  <Disclosure.Button
                    as="button"
                    onClick={goToNoticePage}
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-white hover:border-gray-300 hover:text-gray-700"
                  >
                    NOTICE
                  </Disclosure.Button>
                  <Disclosure.Button
                    as="button"
                    onClick={goToAppealPage}
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-white hover:border-gray-300 hover:text-gray-700"
                  >
                    신문고
                  </Disclosure.Button>
                  <Disclosure.Button
                    as="button"
                    onClick={goToCalendar}
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-white hover:border-gray-300 hover:text-gray-700"
                  >
                    캘린더
                  </Disclosure.Button>
                  {isLoggedIn ? (
                    <Disclosure.Button
                      as="button"
                      onClick={handleLogout}
                      className="inline-flex items-center px-1 pt-1 text-sm font-medium text-white hover:border-gray-300 hover:text-gray-700"
                    >
                      로그아웃
                    </Disclosure.Button>
                  ) : (
                    <Disclosure.Button
                      as="button"
                      onClick={gotoLoginPage}
                      className="inline-flex items-center px-1 pt-1 text-sm font-medium text-white hover:border-gray-300 hover:text-gray-700"
                    >
                      로그인
                    </Disclosure.Button>
                  )}
                  {showLogoutNotification && (
                    <Notification
                      title="로그아웃"
                      content="로그아웃되었습니다."
                    />
                  )}
                </div>
              </div>
              <div className="-mr-2 flex items-center pr-2 sm:hidden">
                {/* Mobile menu button */}
                {isLoggedIn ? (
                  <Disclosure.Button
                    as="button"
                    onClick={handleLogout}
                    className="block py-2 pl-3 pr-4 text-base font-medium text-white hover:text-gray-700"
                  >
                    로그아웃
                  </Disclosure.Button>
                ) : (
                  <Disclosure.Button
                    as="button"
                    onClick={gotoLoginPage}
                    className="block py-2 pl-3 pr-4 text-base font-medium text-white hover:text-gray-700"
                  >
                    로그인
                  </Disclosure.Button>
                )}
                {showLogoutNotification && (
                  <Notification
                    title="로그아웃"
                    content="로그아웃되었습니다."
                  />
                )}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 pl-2 text-white hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>
          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pb-3 pt-2">
              <Disclosure.Button
                as="button"
                onClick={goToLeaguePage}
                className="block py-2 pl-3 pr-4 text-base font-medium text-white hover:text-gray-700"
              >
                대회정보
              </Disclosure.Button>
              <Disclosure.Button
                as="button"
                onClick={gotoPastLeaguePage}
                className="block py-2 pl-3 pr-4 text-base font-medium text-white hover:text-gray-700"
              >
                기록실
              </Disclosure.Button>
              <Disclosure.Button
                as="button"
                onClick={gotoHuddlePage}
                className="block py-2 pl-3 pr-4 text-base font-medium text-white hover:text-gray-700"
              >
                HUDDLE
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="#"
                className="block py-2 pl-3 pr-4 text-base font-medium text-white hover:text-gray-700"
              >
                협회정보
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="#"
                className="block py-2 pl-3 pr-4 text-base font-medium text-white hover:text-gray-700"
              >
                국가대표
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="#"
                className="block py-2 pl-3 pr-4 text-base font-medium text-white hover:text-gray-700"
              >
                자료실
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="#"
                className="block py-2 pl-3 pr-4 text-base font-medium text-white hover:text-gray-700"
              >
                게시판
              </Disclosure.Button>
            </div>
            <div className="border-t border-gray-200 pb-3 pt-4">
              <div className="mt-1 space-y-1">
                <Disclosure.Button
                  as="a"
                  href="#"
                  className="block py-2 pl-3 pr-4 text-base font-medium text-white hover:text-gray-700"
                >
                  NOTICE
                </Disclosure.Button>
                <Disclosure.Button
                  as="a"
                  href="#"
                  className="block py-2 pl-3 pr-4 text-base font-medium text-white hover:text-gray-700"
                >
                  신문고
                </Disclosure.Button>
                <Disclosure.Button
                  as="a"
                  href="#"
                  className="block py-2 pl-3 pr-4 text-base font-medium text-white hover:text-gray-700"
                >
                  캘린더
                </Disclosure.Button>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}

export default Header
