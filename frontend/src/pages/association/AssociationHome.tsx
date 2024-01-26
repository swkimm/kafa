import { Disclosure } from '@headlessui/react'
import { useState } from 'react'
import ContactItem from './items/ContactItem'
import { GreetingItem } from './items/GreetingItem'
import HistoryItem from './items/HistoryItem'
import OrganizationItem from './items/OrganizationItem'
import OutlineItem from './items/OutlineItem'

const AssociationHome = () => {
  const [currentComponent, setCurrentComponent] = useState<string | null>(
    '인사말'
  )

  const renderComponent = () => {
    if (currentComponent === '협회 소개') {
      return <OutlineItem />
    } else if (currentComponent === '인사말') {
      return <GreetingItem />
    } else if (currentComponent === '연혁') {
      return <HistoryItem />
    } else if (currentComponent === '조직도') {
      return <OrganizationItem />
    } else if (currentComponent === 'CONTACT') {
      return <ContactItem />
    }
  }
  return (
    <div className="">
      <Disclosure as="nav" className="w-full bg-purple-950 shadow">
        <>
          <div className="mx-auto max-w-screen-xl px-4 lg:px-20">
            <div className="flex h-20 justify-between">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center text-sm font-bold text-gray-50 sm:text-base">
                  협회정보
                </div>
                <div className="ml-4 flex gap-x-2 sm:ml-6 sm:gap-x-8">
                  <Disclosure.Button
                    as="button"
                    className={`inline-flex items-center px-1 pt-1 text-xs font-medium text-gray-50 sm:text-sm ${
                      currentComponent === '인사말'
                        ? 'border-b-2 border-gray-50'
                        : 'border-b-2 border-transparent hover:border-gray-50 hover:text-black'
                    }`}
                    onClick={() => setCurrentComponent('인사말')}
                  >
                    인사말
                  </Disclosure.Button>
                  <Disclosure.Button
                    as="button"
                    className={`inline-flex items-center px-1 pt-1 text-xs font-medium text-gray-50 sm:text-sm ${
                      currentComponent === '협회 소개'
                        ? 'border-b-2 border-gray-50'
                        : 'border-b-2 border-transparent hover:border-gray-50 hover:text-black'
                    }`}
                    onClick={() => setCurrentComponent('협회 소개')}
                  >
                    협회 소개
                  </Disclosure.Button>
                  <Disclosure.Button
                    as="button"
                    className={`inline-flex items-center px-1 pt-1 text-xs font-medium sm:text-sm ${
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
                    className={`inline-flex items-center px-1 pt-1 text-xs font-medium sm:text-sm ${
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
                    className={`inline-flex items-center px-1 pt-1 text-xs font-medium sm:text-sm ${
                      currentComponent === 'CONTACT'
                        ? 'border-b-2 border-white text-white'
                        : 'border-b-2 border-transparent text-white hover:border-white hover:text-black'
                    }`}
                    onClick={() => setCurrentComponent('CONTACT')}
                  >
                    CONTACT
                  </Disclosure.Button>
                </div>
              </div>
            </div>
          </div>
        </>
      </Disclosure>
      {renderComponent()}
    </div>
  )
}

export default AssociationHome
