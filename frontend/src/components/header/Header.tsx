import useAuth from '@/hooks/useAuth'
import useNotification from '@/hooks/useNotification'
import { NotificationType } from '@/state/notificationState'
import { userState } from '@/state/userState'
import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import logo from '/logo/logo.png'

const Header = () => {
  const user = useRecoilValue(userState)
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const headerHeight = ''
  const { showNotification } = useNotification()

  const mainContentStyle = {
    paddingTop: headerHeight
  }

  const handleLogout = async () => {
    await logout()
    showNotification(
      NotificationType.Success,
      '로그아웃 성공',
      '로그아웃 되었습니다',
      3000
    )
  }

  const handleScroll = () => {
    const offset = window.scrollY
    setIsScrolled(offset > 0)
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
        isScrolled ? 'bg-indigo-950 opacity-95 shadow-md' : 'bg-transparent'
      }`}
      style={mainContentStyle}
    >
      {({ open }) => (
        <>
          <div className="mx-auto px-4">
            <div className="flex h-16 justify-between px-2 lg:h-20">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <img
                    onClick={() => navigate('/')}
                    src={logo}
                    alt="KAFA Logo"
                    className="h-auto w-20 lg:w-24"
                  />
                </div>
                <div className="hidden lg:ml-2 lg:flex lg:space-x-4">
                  <Disclosure.Button
                    as="button"
                    onClick={() => navigate('/')}
                    className="inline-flex items-center pl-5 pr-1 pt-1 text-sm font-medium text-gray-100 hover:border-gray-300 hover:text-gray-700"
                  >
                    HUDDLE
                  </Disclosure.Button>
                  <Disclosure.Button
                    as="button"
                    onClick={() => navigate('/leagues')}
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-100 hover:border-gray-300 hover:text-gray-700"
                  >
                    대회정보
                  </Disclosure.Button>
                  <Disclosure.Button
                    as="button"
                    onClick={() => navigate('/teams')}
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-100 hover:border-gray-300 hover:text-gray-700"
                  >
                    팀 정보
                  </Disclosure.Button>
                  <Disclosure.Button
                    as="button"
                    onClick={() => navigate('/association')}
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-100 hover:border-gray-300 hover:text-gray-700"
                  >
                    협회정보
                  </Disclosure.Button>
                  <a
                    href="#"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-100 hover:border-gray-300 hover:text-gray-700"
                  >
                    자료실
                  </a>
                  <Disclosure.Button
                    as="button"
                    onClick={() => navigate('/board')}
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-100 hover:border-gray-300 hover:text-gray-700"
                  >
                    게시판
                  </Disclosure.Button>
                </div>
              </div>
              <div className="hidden lg:ml-6 lg:flex lg:items-center">
                <div className="flex space-x-4">
                  <Disclosure.Button
                    as="button"
                    onClick={() => navigate('/appeal')}
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-100 hover:border-gray-300 hover:text-gray-700"
                  >
                    신문고
                  </Disclosure.Button>
                  <Disclosure.Button
                    as="button"
                    onClick={() => navigate('/calendar')}
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-100 hover:border-gray-300 hover:text-gray-700"
                  >
                    캘린더
                  </Disclosure.Button>

                  {user.isLoggedIn ? (
                    <>
                      <Disclosure.Button
                        as="button"
                        onClick={() => navigate('/console')}
                        className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-100 hover:border-gray-300 hover:text-gray-700"
                      >
                        콘솔로 이동
                      </Disclosure.Button>
                      <Disclosure.Button
                        as="button"
                        onClick={handleLogout}
                        className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-100 hover:border-gray-300 hover:text-gray-700"
                      >
                        로그아웃
                      </Disclosure.Button>
                    </>
                  ) : (
                    <Disclosure.Button
                      as="button"
                      onClick={() => navigate('/login')}
                      className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-100 hover:border-gray-300 hover:text-gray-700"
                    >
                      로그인
                    </Disclosure.Button>
                  )}
                </div>
              </div>
              <div className="-mr-2 flex items-center lg:hidden">
                {user.isLoggedIn ? (
                  <Disclosure.Button
                    as="button"
                    onClick={() => navigate('console')}
                    className="block py-2 pl-3 pr-4 text-sm font-medium text-gray-100 hover:text-gray-700"
                  >
                    콘솔로 이동
                  </Disclosure.Button>
                ) : (
                  <Disclosure.Button
                    as="button"
                    onClick={() => navigate('/login')}
                    className="block py-2 pl-3 pr-4 text-sm font-medium text-gray-100 hover:text-gray-700"
                  >
                    로그인
                  </Disclosure.Button>
                )}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 pl-2 text-gray-100 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
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
          <Disclosure.Panel className="min-h-screen lg:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              <Disclosure.Button
                as="button"
                onClick={() => navigate('/')}
                className="block w-full py-2 pl-3 pr-4 text-start text-base font-medium text-gray-100 hover:text-gray-700"
              >
                HUDDLE
              </Disclosure.Button>
              <Disclosure.Button
                as="button"
                onClick={() => navigate('/leagues')}
                className="block w-full py-2 pl-3 pr-4 text-start text-base font-medium text-gray-100 hover:text-gray-700"
              >
                대회정보
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="#"
                className="block w-full py-2 pl-3 pr-4 text-start text-base font-medium text-gray-100 hover:text-gray-700"
              >
                협회정보
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="#"
                className="block w-full py-2 pl-3 pr-4 text-start text-base font-medium text-gray-100 hover:text-gray-700"
              >
                자료실
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                onClick={() => navigate('/board')}
                className="block w-full py-2 pl-3 pr-4 text-start text-base font-medium text-gray-100 hover:text-gray-700"
              >
                게시판
              </Disclosure.Button>
            </div>
            <div className="border-t border-gray-200 px-2 pb-3 pt-4">
              <div className="mt-1 space-y-1">
                <Disclosure.Button
                  as="a"
                  href="#"
                  className="block w-full py-2 pl-3 pr-4 text-start text-base font-medium text-gray-100 hover:text-gray-700"
                >
                  신문고
                </Disclosure.Button>
                <Disclosure.Button
                  as="a"
                  href="#"
                  className="block w-full py-2 pl-3 pr-4 text-start text-base font-medium text-gray-100 hover:text-gray-700"
                >
                  캘린더
                </Disclosure.Button>
                {user.isLoggedIn ? (
                  <Disclosure.Button
                    as="button"
                    onClick={handleLogout}
                    className="block w-full py-2 pl-3 pr-4 text-start text-base font-medium text-gray-100 hover:text-gray-700"
                  >
                    로그아웃
                  </Disclosure.Button>
                ) : (
                  <Disclosure.Button
                    as="button"
                    onClick={() => navigate('/login')}
                    className="block w-full py-2 pl-3 pr-4 text-start text-base font-medium text-gray-100 hover:text-gray-700"
                  >
                    로그인
                  </Disclosure.Button>
                )}
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}

export default Header
