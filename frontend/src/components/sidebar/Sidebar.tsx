import type { RootState } from '@/app/store'
import { Disclosure } from '@headlessui/react'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

type NavigationItem = {
  name: string
  href?: string
  current?: boolean // 이 속성은 이제 선택적입니다.
  children?: NavigationItem[] // children 역시 선택적입니다.
}

const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ')
}

const Sidebar = () => {
  const navigate = useNavigate()
  const userRole = useSelector((state: RootState) => state.auth.role)

  // 각 역할에 따른 다른 네비게이션 구조 정의
  const adminNavigation: NavigationItem[] = [
    {
      name: '대회정보',
      current: true,
      children: [
        { name: '대회 등록', href: '/console/registerLeague' },
        { name: '대회 관리', href: '#' }
      ]
    },
    {
      name: '기록실',
      current: false,
      children: [
        { name: '기록 입력', href: '#' },
        { name: '기록 관리', href: '#' }
      ]
    },
    {
      name: 'HUDDLE',
      current: false,
      children: [
        { name: 'Schedule', href: '#' },
        { name: '기록 관리', href: '#' }
      ]
    },
    { name: '협회 정보', href: '#', current: false },
    { name: '심판', href: '#', current: false },
    { name: '국가대표', href: '#', current: false },
    { name: '자료실', href: '#', current: false },
    { name: 'NOTICE', href: '#', current: false },
    { name: '신문고', href: '#', current: false },
    { name: 'Calendar', href: '#', current: false },
    { name: '회원 관리', href: '#', current: false }
  ]
  const userNavigation: NavigationItem[] = [
    { name: 'HOME', href: '#', current: true },
    { name: '자료 제출', href: '#', current: false },
    { name: '팀 신청', href: '#', current: false },
    { name: 'QR 코드', href: '#', current: false }
  ]
  const managerNavigation: NavigationItem[] = [
    { name: 'HOME', href: '#', current: true },
    { name: '참가신청', href: '#', current: false },
    { name: '팀 정보 관리', href: '#', current: false },
    { name: '선수 관리', href: '#', current: false }
  ]

  let navigation: NavigationItem[]

  switch (userRole) {
    case 'Admin':
      navigation = adminNavigation
      break
    case 'User':
      navigation = userNavigation
      break
    case 'Manager':
      navigation = managerNavigation
      break
    default:
      navigation = [] // 역할이 인식되지 않을 경우 기본 네비게이션
  }

  // 메뉴 클릭 핸들러
  const handleMenuClick = (href?: string) => {
    if (href) {
      navigate(href) // 전달받은 href 경로로 이동
    }
  }
  return (
    <div>
      {/* 여기부터 사이드바 컴포넌트 */}
      <div className="border-r border-gray-200 bg-white pt-16">
        <nav className="border-gray-200 bg-white">
          <ul role="list" className="space-y-1">
            <li>
              <ul role="list" className="space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    {!item.children ? (
                      <button
                        onClick={() => item.href && handleMenuClick(item.href)}
                        className={classNames(
                          item.current ? 'bg-gray-50' : 'hover:bg-gray-50',
                          'block w-full rounded-md py-2 pl-10 pr-2 text-left text-sm font-semibold leading-6 text-gray-700'
                        )}
                      >
                        {item.name}
                      </button>
                    ) : (
                      <Disclosure as="div">
                        {({ open }) => (
                          <>
                            <Disclosure.Button
                              className={classNames(
                                item.current
                                  ? 'bg-gray-50'
                                  : 'hover:bg-gray-50',
                                'flex w-full items-center gap-x-3 rounded-md p-2 text-left text-sm font-semibold leading-6 text-gray-700'
                              )}
                            >
                              <ChevronRightIcon
                                className={classNames(
                                  open
                                    ? 'rotate-90 text-gray-500'
                                    : 'text-gray-400',
                                  'h-5 w-5 shrink-0'
                                )}
                                aria-hidden="true"
                              />
                              {item.name}
                            </Disclosure.Button>
                            <Disclosure.Panel as="ul" className="mt-1 px-2">
                              {item.children?.map((subItem) => (
                                <li key={subItem.name}>
                                  <Disclosure.Button
                                    as="button"
                                    onClick={() =>
                                      subItem.href &&
                                      handleMenuClick(subItem.href)
                                    }
                                    className={classNames(
                                      subItem.current
                                        ? 'bg-gray-50'
                                        : 'hover:bg-gray-50',
                                      'block rounded-md py-2 pl-9 pr-2 text-sm leading-6 text-gray-700'
                                    )}
                                  >
                                    {subItem.name}
                                  </Disclosure.Button>
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
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default Sidebar
