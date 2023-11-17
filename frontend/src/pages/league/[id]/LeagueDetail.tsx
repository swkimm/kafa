// LeagueDetail.tsx
// import { useNavigate } from 'react-router-dom'
import Button from '@/components/buttons/Button'
import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import LeagueHomeItem from './items/HomeItem'
import TeamItem from './items/LeagueTeamItem'
import MediaItem from './items/MediaItem'
import ScheduleItem from './items/ScheduleItem'
import StatsItem from './items/StatsItem'

const league = {
  id: 1,
  logo: '/logo/KAFA_OG.png',
  assosiation: '대한미식축구협회',
  leagueName: '제 00회 타이거볼',
  isFinished: false
}

const LeagueDetail = () => {
  const [currentComponent, setCurrentComponent] = useState<string | null>(
    'HOME'
  )
  const location = useLocation()
  // const navigate = useNavigate()

  const goToRegister = () => {
    console.log('출전 등록 페이지로 이동')
  }

  const goToNotice = (id: number) => {
    // navigate(`/league/`)
    console.log(id)
    console.log(location)
  }

  const renderComponent = () => {
    if (currentComponent === 'HOME') {
      return <LeagueHomeItem />
    } else if (currentComponent === 'TEAMS') {
      return <TeamItem />
    } else if (currentComponent === 'SCHEDULE') {
      return <ScheduleItem />
    } else if (currentComponent === 'STATS') {
      return <StatsItem />
    } else if (currentComponent === 'MEDIA') {
      return <MediaItem />
    }
  }

  return (
    <div className="pt-16">
      <div className="max-w-screen">
        <div
          key={league.id}
          className="flex justify-between bg-gray-800 p-5 lg:p-7"
        >
          <div className="flex text-white">
            <img
              src={league.logo}
              alt="KAFA Logo"
              className="h-auto w-16 sm:w-32"
            />
            <div className="ml-3 flex flex-col justify-center gap-4 lg:ml-10">
              <div className="text-gray-250 text-xl font-semibold">
                {league.assosiation}
              </div>
              <div className="text-white-900 text-md font-bold sm:text-2xl">
                {league.leagueName}
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-4">
            {!league.isFinished && (
              <div>
                <Button
                  variant="outlineWhiteText"
                  label="출전등록"
                  onClick={goToRegister}
                />
              </div>
            )}
            <div>
              <Button
                variant="outlineWhiteText"
                label="대회요강"
                onClick={() => goToNotice(league.id)}
              />
            </div>
          </div>
        </div>
      </div>
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
                        currentComponent === 'TEAMS'
                          ? 'border-b-2 border-white'
                          : 'border-b-2 border-transparent hover:border-white hover:text-gray-700'
                      }`}
                      onClick={() => setCurrentComponent('TEAMS')}
                    >
                      TEAMS
                    </Disclosure.Button>
                    <Disclosure.Button
                      as="button"
                      className={`inline-flex items-center px-1 pt-1 text-sm font-medium text-white ${
                        currentComponent === 'SCHEDULE'
                          ? 'border-b-2 border-white'
                          : 'border-b-2 border-transparent hover:border-white hover:text-gray-700'
                      }`}
                      onClick={() => setCurrentComponent('SCHEDULE')}
                    >
                      SCHEDULE
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
                        currentComponent === 'MEDIA'
                          ? 'border-b-2 border-white'
                          : 'border-b-2 border-transparent hover:border-white hover:text-gray-700'
                      }`}
                      onClick={() => setCurrentComponent('MEDIA')}
                    >
                      MEDIA
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
                  className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                  onClick={() => setCurrentComponent('HOME')}
                >
                  HOME
                </Disclosure.Button>
                <Disclosure.Button
                  as="button"
                  className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                  onClick={() => setCurrentComponent('TEAMS')}
                >
                  TEAMS
                </Disclosure.Button>
                <Disclosure.Button
                  as="button"
                  className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                  onClick={() => setCurrentComponent('SCHEDULE')}
                >
                  SCHEDULE
                </Disclosure.Button>
                <Disclosure.Button
                  as="button"
                  className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                  onClick={() => setCurrentComponent('STATS')}
                >
                  STATS
                </Disclosure.Button>
                <Disclosure.Button
                  as="button"
                  className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                  onClick={() => setCurrentComponent('MEDIA')}
                >
                  MEDIA
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

export default LeagueDetail
