// PastTeamDetail.tsx
// import { useParams } from 'react-router-dom'
import TeamBanner from '@/components/cards/TeamBanner'
import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import PastTeamHomeItem from './[id]/items/PastTeamHomeItem'
import PastTeamPhotoItem from './[id]/items/PastTeamPhotoItem'
import PastTeamRosterItem from './[id]/items/PastTeamRosterItem'
import PastTeamStatsItem from './[id]/items/PastTeamStatsItem'

const team = {
  teamId: 1,
  teamName: '서울골든이글스',
  teamLogo: '/logo/KAFA_OG.png',
  nickName: 'GOLDEN EAGLES',
  teamColor: '#000000',
  createdAt: '1998',
  conference: '사회인연맹'
}

const PastTeamDetail = () => {
  const [currentComponent, setCurrentComponent] = useState<string | null>(
    'HOME'
  )

  const renderComponent = () => {
    if (currentComponent === 'HOME') {
      return <PastTeamHomeItem />
    } else if (currentComponent === 'ROSTER') {
      return <PastTeamRosterItem />
    } else if (currentComponent === 'STATS') {
      return <PastTeamStatsItem />
    } else if (currentComponent === 'PHOTO') {
      return <PastTeamPhotoItem />
    }
  }

  return (
    <div className="pt-16">
      <TeamBanner {...team} />
      <Disclosure as="nav" className="w-full bg-indigo-800 shadow">
        {({ open }) => (
          <>
            <div className=" px-4 sm:px-6 lg:px-8">
              <div className="flex h-20 justify-between">
                <div className="flex">
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    <Disclosure.Button
                      as="button"
                      className={`inline-flex items-center px-1 pt-1 text-sm font-medium text-white ${
                        currentComponent === 'HOME'
                          ? 'border-b-2 border-white'
                          : 'border-b-2 border-transparent hover:border-white hover:text-gray-700'
                      }`}
                      onClick={() => setCurrentComponent('HOME')}
                    >
                      HOME
                    </Disclosure.Button>
                    <Disclosure.Button
                      as="button"
                      className={`inline-flex items-center px-1 pt-1 text-sm font-medium text-white ${
                        currentComponent === 'ROSTER'
                          ? 'border-b-2 border-white'
                          : 'border-b-2 border-transparent hover:border-white hover:text-gray-700'
                      }`}
                      onClick={() => setCurrentComponent('ROSTER')}
                    >
                      ROSTER
                    </Disclosure.Button>
                    <Disclosure.Button
                      as="button"
                      className={`inline-flex items-center px-1 pt-1 text-sm font-medium text-white ${
                        currentComponent === 'STATS'
                          ? 'border-b-2 border-white'
                          : 'border-b-2 border-transparent hover:border-white hover:text-gray-700'
                      }`}
                      onClick={() => setCurrentComponent('STATS')}
                    >
                      STATS
                    </Disclosure.Button>
                    <Disclosure.Button
                      as="button"
                      className={`inline-flex items-center px-1 pt-1 text-sm font-medium text-white ${
                        currentComponent === 'PHOTO'
                          ? 'border-b-2 border-white'
                          : 'border-b-2 border-transparent hover:border-white hover:text-gray-700'
                      }`}
                      onClick={() => setCurrentComponent('PHOTO')}
                    >
                      PHOTO
                    </Disclosure.Button>
                  </div>
                </div>
                <div className="-mr-2 flex items-center sm:hidden">
                  {/* Mobile menu button */}
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
                {/* Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" */}
                <Disclosure.Button
                  as="button"
                  onClick={() => setCurrentComponent('HOME')}
                  className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                >
                  HOME
                </Disclosure.Button>
                <Disclosure.Button
                  as="button"
                  onClick={() => setCurrentComponent('ROSTER')}
                  className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                >
                  ROSTER
                </Disclosure.Button>
                <Disclosure.Button
                  as="button"
                  onClick={() => setCurrentComponent('STATS')}
                  className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                >
                  STATS
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

export default PastTeamDetail
