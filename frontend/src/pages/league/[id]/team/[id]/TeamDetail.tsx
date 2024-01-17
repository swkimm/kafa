// TeamDetail.tsx
import axiosInstance from '@/commons/axios'
import type { TeamComplication } from '@/commons/interfaces/team/teamComplication'
import TeamBanner from '@/components/cards/TeamBanner'
import Alert from '@/components/notifications/Alert'
import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import BoardItem from './items/BoardItem'
import RosterItem from './items/RosterItem'
import StatsItem from './items/StatsItem'
import TeamHomeItem from './items/TeamHomeItem'

const TeamDetail = () => {
  const { teamId } = useParams()
  const [currentComponent, setCurrentComponent] = useState<string | null>(
    'HOME'
  )
  const [team, setTeam] = useState<TeamComplication | null>(null)
  const [alert, setAlert] = useState<{
    title: string
    content?: string
  } | null>(null)

  useEffect(() => {
    const getTeam = async () => {
      try {
        const response = await axiosInstance.get(`/teams/${teamId}`)
        setTeam(response.data)
      } catch (error: unknown) {
        if (error instanceof Error) {
          setAlert({ title: 'Error', content: error.message })
        } else {
          // Handle cases where error is not an instance of Error
          setAlert({ title: 'Error', content: 'An unknown error occurred' })
        }
      }
    }
    getTeam()
  }, [teamId])

  const renderComponent = () => {
    if (currentComponent === 'HOME') {
      return <TeamHomeItem />
    } else if (currentComponent === 'ROSTER') {
      return <RosterItem />
    } else if (currentComponent === 'STATS') {
      return <StatsItem />
    } else if (currentComponent === 'BOARD') {
      return <BoardItem />
    }
  }

  return (
    <div className="">
      {team && (
        <TeamBanner
          id={team.id}
          name={team.name}
          globalName={team.globalName}
          hometown={team.hometown}
          initial={team.initial}
          establishedAt={new Date(team.establishedAt)}
          color={team.color}
          profileImgUrl={team.profileImgUrl}
          status={team.status}
          createdAt={team.createdAt}
        />
      )}

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
                          : 'border-b-2 border-transparent hover:border-white'
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
                          : 'border-b-2 border-transparent hover:border-white'
                      }`}
                      onClick={() => setCurrentComponent('STATS')}
                    >
                      STATS
                    </Disclosure.Button>
                    <Disclosure.Button
                      as="button"
                      className={`inline-flex items-center px-1 pt-1 text-sm font-medium text-white ${
                        currentComponent === 'BOARD'
                          ? 'border-b-2 border-white'
                          : 'border-b-2 border-transparent hover:border-white'
                      }`}
                      onClick={() => setCurrentComponent('BOARD')}
                    >
                      BOARD
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
                  className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-300 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                >
                  HOME
                </Disclosure.Button>
                <Disclosure.Button
                  as="button"
                  onClick={() => setCurrentComponent('ROSTER')}
                  className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-300 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                >
                  ROSTER
                </Disclosure.Button>
                <Disclosure.Button
                  as="button"
                  onClick={() => setCurrentComponent('STATS')}
                  className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-300 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                >
                  STATS
                </Disclosure.Button>
                <Disclosure.Button
                  as="button"
                  onClick={() => setCurrentComponent('BOARD')}
                  className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-300 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                >
                  BOARD
                </Disclosure.Button>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      {alert && <Alert title={alert.title} content={alert.content} />}

      {renderComponent()}
    </div>
  )
}

export default TeamDetail
