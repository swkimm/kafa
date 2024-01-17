import useAuth from '@/hooks/useAuth'
import useNotification from '@/hooks/useNotification'
import { NotificationType } from '@/state/notificationState'
import { userState } from '@/state/userState'
import { Dialog, Disclosure, Transition } from '@headlessui/react'
import {
  ChevronRightIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
  FunnelIcon,
  FlagIcon,
  TrophyIcon,
  PencilSquareIcon
} from '@heroicons/react/20/solid'
import {
  ArrowLeftEndOnRectangleIcon,
  Bars3Icon,
  HomeIcon,
  LockClosedIcon,
  UserCircleIcon,
  WalletIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { Fragment, useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'

type NavigationItem = {
  name: string
  href?: string
  children?: NavigationChildren[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any
}

type NavigationChildren = {
  name: string
  href: string
}

interface SidebarProps {
  children: React.ReactNode
}

const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ')
}

const userNavigation: NavigationItem[] = [
  { name: 'HOME', href: '/console', icon: HomeIcon },
  { name: '계정 관리', href: '/console/profile', icon: UserCircleIcon },
  {
    name: '인증 관리',
    href: '/console/certification',
    icon: LockClosedIcon
  },
  {
    name: '로스터 관리',
    href: '/console/loadRoster',
    icon: WalletIcon
  },
  {
    name: '팀 생성',
    href: '/console/createTeam',
    icon: WalletIcon
  }
]

const managerNavigation: NavigationItem[] = [
  { name: 'HOME', href: '/console', icon: HomeIcon },
  {
    name: '팀 정보 관리',
    icon: WrenchScrewdriverIcon,
    children: [
      { name: '로고 관리', href: '/console/manageLogo' },
      { name: '팀 정보 수정', href: '/console/manageTeam' }
    ]
  },
  {
    name: '로스터 관리',
    icon: UserGroupIcon,
    children: [
      { name: '로스터 관리', href: '/console/manageRoster' },
      { name: '연결 요청', href: '/console/manageRequest' }
    ]
  },
  {
    name: '리그 참가 신청',
    icon: ClipboardDocumentListIcon,
    children: [
      { name: '로스터 인증서 검증', href: '/console/validateCerti' },
      { name: '리그 목록', href: '/console/leagueList' },
      { name: '참가 신청 목록', href: '/console/applyLeagueList' }
    ]
  }
]

const adminNavigation: NavigationItem[] = [
  { name: 'HOME', href: '/console', icon: HomeIcon },
  {
    name: '대회정보',
    icon: TrophyIcon,
    children: [
      { name: '대회 등록', href: '/console/createLeague' },
      { name: '대회 관리', href: '/console/manageLeague' }
    ]
  },
  {
    name: '기록실',
    icon: PencilSquareIcon,
    children: [
      { name: '기록 입력', href: '/console/createRecode' },
      { name: '기록 관리', href: '/console/manageRecode' }
    ]
  },
  // {
  //   name: 'HUDDLE',
  //   icon: HomeIcon,
  //   children: [
  //     { name: 'Schedule', href: '#' },
  //     { name: '기록 관리', href: '#' }
  //   ]
  // },
  { name: '협회 정보', href: '/console/manageAssociation', icon: FlagIcon },
  { name: '자료실', href: '#', icon: HomeIcon },
  { name: '신문고', href: '#', icon: HomeIcon },
  { name: 'Calendar', href: '#', icon: HomeIcon },
  { name: '팀 관리', href: '/console/manageTeams', icon: FunnelIcon }
]

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const user = useRecoilValue(userState)
  const { logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const [navigation, setNavigation] = useState<NavigationItem[]>([])
  const { showNotification } = useNotification()

  useEffect(() => {
    switch (user.role) {
      case 'Admin':
        setNavigation(adminNavigation)
        break
      case 'User':
        setNavigation(userNavigation)
        break
      case 'Manager':
        setNavigation(managerNavigation)
        break
      default:
        setNavigation([])
    }
  }, [user])

  const handleLogout = async () => {
    await logout()
    showNotification(
      NotificationType.Success,
      '로그아웃 성공',
      '로그아웃 되었습니다',
      3000
    )
    navigate('/')
  }

  return (
    <>
      <div className="w-full">
        {/* Mobile Version */}
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50 lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-950 px-6 pb-4">
                    <div className="flex h-16 shrink-0 items-center">
                      <img
                        className="h-8 w-auto"
                        src="https://cdn.kafa.one/logo"
                        alt="KAFA"
                      />
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => (
                              <li key={item.name}>
                                {!item.children ? (
                                  <NavLink
                                    to={item.href ?? '#'}
                                    end
                                    onClick={() => setSidebarOpen(false)}
                                    className={({ isActive }) =>
                                      classNames(
                                        isActive
                                          ? 'bg-indigo-900'
                                          : 'hover:bg-indigo-900',
                                        'group flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-200'
                                      )
                                    }
                                  >
                                    <item.icon
                                      className="h-6 w-6 shrink-0 text-gray-200"
                                      aria-hidden="true"
                                    />
                                    {item.name}
                                  </NavLink>
                                ) : (
                                  <Disclosure as="div">
                                    {({ open }) => (
                                      <>
                                        <Disclosure.Button
                                          className={classNames(
                                            'hover:bg-indigo-800',
                                            'flex w-full items-center gap-x-3 rounded-md p-2 text-left text-sm font-semibold leading-6 text-gray-200'
                                          )}
                                        >
                                          <item.icon
                                            className="h-6 w-6 shrink-0 text-gray-200"
                                            aria-hidden="true"
                                          />
                                          {item.name}
                                          <ChevronRightIcon
                                            className={classNames(
                                              open
                                                ? 'rotate-90 text-indigo-200'
                                                : 'text-gray-200',
                                              'ml-auto h-5 w-5 shrink-0'
                                            )}
                                            aria-hidden="true"
                                          />
                                        </Disclosure.Button>
                                        <Disclosure.Panel
                                          as="ul"
                                          className="mt-1 px-2"
                                        >
                                          {item.children?.map((subItem) => (
                                            <li key={subItem.name}>
                                              <NavLink
                                                to={subItem.href ?? '#'}
                                                onClick={() =>
                                                  setSidebarOpen(false)
                                                }
                                                end
                                                className={({ isActive }) =>
                                                  classNames(
                                                    isActive
                                                      ? 'bg-indigo-800'
                                                      : 'hover:bg-indigo-800',
                                                    'block rounded-md py-2 pl-9 pr-2 text-sm leading-6 text-indigo-200'
                                                  )
                                                }
                                              >
                                                {subItem.name}
                                              </NavLink>
                                            </li>
                                          ))}
                                        </Disclosure.Panel>
                                      </>
                                    )}
                                  </Disclosure>
                                )}
                              </li>
                            ))}
                          </ul>
                        </li>
                        <li className="mt-auto">
                          <button
                            onClick={() => navigate('/')}
                            className="group -mx-2 flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-indigo-200 hover:bg-indigo-800 hover:text-white"
                          >
                            <ArrowLeftEndOnRectangleIcon
                              className="h-6 w-6 shrink-0 text-indigo-200 group-hover:text-white"
                              aria-hidden="true"
                            />
                            메인으로 이동
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Desktop Version */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-950 px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center">
              <img
                className="h-8 w-auto"
                src="https://cdn.kafa.one/logo"
                alt="KAFA"
              />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        {!item.children ? (
                          <NavLink
                            to={item.href ?? '#'}
                            end
                            className={({ isActive }) =>
                              classNames(
                                isActive
                                  ? 'bg-indigo-900'
                                  : 'hover:bg-indigo-900',
                                'group flex w-full gap-x-3 rounded-md p-2 text-sm font-medium leading-6 text-gray-200'
                              )
                            }
                          >
                            <item.icon
                              className="h-6 w-6 shrink-0 text-gray-200"
                              aria-hidden="true"
                            />
                            {item.name}
                          </NavLink>
                        ) : (
                          <Disclosure as="div">
                            {({ open }) => (
                              <>
                                <Disclosure.Button
                                  className={classNames(
                                    'hover:bg-indigo-800',
                                    'flex w-full items-center gap-x-3 rounded-md p-2 text-left text-sm font-medium leading-6 text-gray-200'
                                  )}
                                >
                                  <item.icon
                                    className="h-6 w-6 shrink-0 text-gray-200"
                                    aria-hidden="true"
                                  />
                                  {item.name}
                                  <ChevronRightIcon
                                    className={classNames(
                                      open
                                        ? 'rotate-90 text-indigo-200'
                                        : 'text-indigo-200',
                                      'ml-auto h-5 w-5 shrink-0'
                                    )}
                                    aria-hidden="true"
                                  />
                                </Disclosure.Button>
                                <Disclosure.Panel as="ul" className="mt-1 px-2">
                                  {item.children?.map((subItem) => (
                                    <li key={subItem.name}>
                                      <NavLink
                                        to={subItem.href ?? '#'}
                                        end
                                        className={({ isActive }) =>
                                          classNames(
                                            isActive
                                              ? 'bg-indigo-900'
                                              : 'hover:bg-indigo-900',
                                            'block rounded-md py-2 pl-9 pr-2 text-sm leading-6 text-indigo-200'
                                          )
                                        }
                                      >
                                        {subItem.name}
                                      </NavLink>
                                    </li>
                                  ))}
                                </Disclosure.Panel>
                              </>
                            )}
                          </Disclosure>
                        )}
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="-mx-6 mt-auto">
                  <button
                    onClick={() => navigate('/')}
                    className="flex w-full items-center gap-x-4 px-6 py-3 text-sm font-medium leading-6 text-gray-200 hover:bg-indigo-900"
                  >
                    <ArrowLeftEndOnRectangleIcon
                      className="h-6 w-6 shrink-0 text-gray-200"
                      aria-hidden="true"
                    />
                    <span aria-hidden="true">메인으로 이동</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <div className="lg:pl-72">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-5 opacity-95 shadow-lg">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>

            <div
              className="h-6 w-px bg-gray-900/10 lg:hidden"
              aria-hidden="true"
            />

            <div className="flex flex-1 items-center justify-between gap-x-4 self-stretch">
              <p className="text-sm font-bold lg:text-lg">관리 콘솔</p>
              <button
                className="text-xs font-medium lg:text-base"
                onClick={handleLogout}
              >
                로그아웃
              </button>
            </div>
          </div>

          <main className="h-full w-full pb-10">{children}</main>
        </div>
      </div>
    </>
  )
}

export default Sidebar
