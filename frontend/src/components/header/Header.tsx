// Header.tsx
import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import logo from '/public/logo/logo.png'

// const classNames = (...classes: unknown[]): string => {
//   return classes.filter(Boolean).map(String).join(' ')
// }

const Header = () => {
  return (
    <Disclosure as="nav" className="bg-red-600">
      {({ open }) => (
        <>
          <div className="max-w-8xl mx-auto sm:px-2 lg:px-4">
            <div className="flex h-16 justify-between px-2">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <img src={logo} alt="KAFA Logo" className="h-15 w-20" />
                </div>
                <div className="hidden sm:ml-2 sm:flex sm:space-x-4">
                  <a
                    href="#"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-white hover:border-gray-300 hover:text-gray-700"
                  >
                    대회정보
                  </a>
                  <a
                    href="#"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-white hover:border-gray-300 hover:text-gray-700"
                  >
                    기록실
                  </a>
                  <a
                    href="#"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-white hover:border-gray-300 hover:text-gray-700"
                  >
                    KAFA LIVE
                  </a>
                  <a
                    href="#"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-white hover:border-gray-300 hover:text-gray-700"
                  >
                    협회정보
                  </a>
                  <a
                    href="#"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-white hover:border-gray-300 hover:text-gray-700"
                  >
                    심판
                  </a>
                  <a
                    href="#"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-white hover:border-gray-300 hover:text-gray-700"
                  >
                    국가대표
                  </a>
                  <a
                    href="#"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-white hover:border-gray-300 hover:text-gray-700"
                  >
                    자료실
                  </a>
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center ">
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="px-1 pt-1 text-sm text-white hover:text-gray-700"
                  >
                    NOTICE
                  </a>
                  <a
                    href="#"
                    className="px-1 pt-1 text-sm text-white hover:text-gray-700"
                  >
                    신문고
                  </a>
                  <a
                    href="#"
                    className="px-1 pt-1 text-sm text-white hover:text-gray-700"
                  >
                    캘린더
                  </a>
                  <a
                    href="#"
                    className="px-1 pt-1 text-sm text-white hover:text-gray-700"
                  >
                    로그인
                  </a>
                </div>
              </div>
              <div className="-mr-2 flex items-center pr-2 sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button
                  as="a"
                  href="#"
                  className="block py-2 pl-3 pr-4 text-base font-medium text-white hover:text-gray-700"
                >
                  로그인
                </Disclosure.Button>
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
                as="a"
                href="#"
                className="block py-2 pl-3 pr-4 text-base font-medium text-white hover:text-gray-700"
              >
                대회정보
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="#"
                className="block py-2 pl-3 pr-4 text-base font-medium text-white hover:text-gray-700"
              >
                기록실
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="#"
                className="block py-2 pl-3 pr-4 text-base font-medium text-white hover:text-gray-700"
              >
                KAFA LIVE
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
                심판
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
