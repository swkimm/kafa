import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import AppealItem from './items/AppealItem'
import FaqsItem from './items/FaqsItem'
import HistoryItem from './items/HistoryItem'
import OrganizationItem from './items/OrganizationItem'
import OutlineItem from './items/OutlineItem'

const AssociationHome = () => {
  const [currentComponent, setCurrentComponent] = useState<string | null>(
    '개요'
  )

  const renderComponent = () => {
    if (currentComponent === '개요') {
      return <OutlineItem />
    } else if (currentComponent === '연혁') {
      return <HistoryItem />
    } else if (currentComponent === '조직도') {
      return <OrganizationItem />
    } else if (currentComponent === '신문고') {
      return <AppealItem />
    } else if (currentComponent === 'FAQs') {
      return <FaqsItem />
    }
  }
  return (
    <div className="">
      <Disclosure as="nav" className="w-full bg-purple-950 shadow">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-screen-xl px-4 lg:px-20">
              <div className="flex h-20 justify-between">
                <div className="flex">
                  <div className="font-lg flex flex-shrink-0 items-center font-bold text-gray-50">
                    협회정보
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    <Disclosure.Button
                      as="button"
                      className={`inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-50 ${
                        currentComponent === '개요'
                          ? 'border-b-2 border-gray-50'
                          : 'border-b-2 border-transparent hover:border-gray-50 hover:text-black'
                      }`}
                      onClick={() => setCurrentComponent('개요')}
                    >
                      개요
                    </Disclosure.Button>
                    <Disclosure.Button
                      as="button"
                      className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                        currentComponent === '연혁'
                          ? 'border-b-2 border-white text-white'
                          : 'border-b-2 border-transparent text-white hover:border-white hover:text-black'
                      }`}
                      onClick={() => setCurrentComponent('연혁')}
                    >
                      연혁
                    </Disclosure.Button>
                    <Disclosure.Button
                      as="button"
                      className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                        currentComponent === '조직도'
                          ? 'border-b-2 border-white text-white'
                          : 'border-b-2 border-transparent text-white hover:border-white hover:text-black'
                      }`}
                      onClick={() => setCurrentComponent('조직도')}
                    >
                      조직도
                    </Disclosure.Button>
                    <Disclosure.Button
                      as="button"
                      className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                        currentComponent === '신문고'
                          ? 'border-b-2 border-white text-white'
                          : 'border-b-2 border-transparent text-white hover:border-white hover:text-black'
                      }`}
                      onClick={() => setCurrentComponent('신문고')}
                    >
                      신문고
                    </Disclosure.Button>
                    <Disclosure.Button
                      as="button"
                      className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                        currentComponent === 'FAQs'
                          ? 'border-b-2 border-white text-white'
                          : 'border-b-2 border-transparent text-white hover:border-white hover:text-black'
                      }`}
                      onClick={() => setCurrentComponent('FAQs')}
                    >
                      FAQs
                    </Disclosure.Button>
                  </div>
                </div>
                <div className="-mr-2 flex items-center sm:hidden">
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
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
                  onClick={() => setCurrentComponent('NOTICE')}
                  className="block border-l-4 border-indigo-500 bg-indigo-50 py-2 pl-3 pr-4 text-base font-medium text-indigo-700"
                >
                  HOME
                </Disclosure.Button>
                <Disclosure.Button
                  as="button"
                  onClick={() => setCurrentComponent('SCHEDULE')}
                  className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                >
                  SCHEDULE
                </Disclosure.Button>
                <Disclosure.Button
                  as="button"
                  onClick={() => setCurrentComponent('NOTICE')}
                  className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                >
                  NOTICE
                </Disclosure.Button>
                <Disclosure.Button
                  as="button"
                  onClick={() => setCurrentComponent('MEDIA')}
                  className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                >
                  MEDIA
                </Disclosure.Button>
                <Disclosure.Button
                  as="button"
                  onClick={() => setCurrentComponent('PHOTO')}
                  className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                >
                  PHOTO
                </Disclosure.Button>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      {renderComponent()}
    </div>
  )
}

export default AssociationHome
