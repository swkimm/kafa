import axiosInstance from '@/commons/axios'
import type { GetLeagues } from '@/commons/interfaces/league/getLeagues'
import Button from '@/components/buttons/Button'
import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PastLeagueHomeItem from './items/PastLeagueHomeItem'
import PastLeagueStatsItem from './items/PastLeagueStatsItem'
import PastLeagueTeamItem from './items/PastLeagueTeamItem'

interface ExtendedLeague extends GetLeagues {
  associationInfo?: {
    name: string
    profileImgUrl: string | null
  }
}

const PastLeagueDetail = () => {
  const [currentComponent, setCurrentComponent] = useState<string | null>(
    'HOME'
  )
  const [pastLeague, setPastLeague] = useState<ExtendedLeague>()
  const { pastLeagueId } = useParams()
  // const navigate = useNavigate()

  // const goToNotice = (id: number) => {
  //   // navigate(`/league/`)
  //   console.log(id)
  // }

  const fetchAssociationInfo = async (associationId: number) => {
    const response = await axiosInstance.get(`/associations/${associationId}`)
    return response.data
  }

  useEffect(() => {
    const getLeague = async () => {
      try {
        const response = await axiosInstance.get<GetLeagues>(
          `/leagues/${pastLeagueId}`
        )
        const league = response.data

        let associationInfo
        if (league.associationId) {
          associationInfo = await fetchAssociationInfo(league.associationId)
        } else {
          associationInfo = { name: 'Unknown', profileImgUrl: null }
        }

        const leagueWithAssociation = {
          ...league,
          associationInfo
        }

        setPastLeague(leagueWithAssociation)
      } catch (error) {
        console.log(error)
      }
    }

    getLeague()
  }, [pastLeagueId])

  const renderComponent = () => {
    if (currentComponent === 'HOME') {
      return <PastLeagueHomeItem />
    } else if (currentComponent === 'TEAMS') {
      return <PastLeagueTeamItem />
    } else if (currentComponent === 'STATS') {
      return <PastLeagueStatsItem />
    }
  }

  return (
    <div className="">
      <div className="max-w-screen">
        <div
          key={pastLeague?.id}
          className="flex justify-between bg-gray-600 p-5 lg:p-7"
        >
          <div className="flex text-white">
            {pastLeague?.associationInfo?.profileImgUrl ? (
              <img
                src={pastLeague?.associationInfo?.profileImgUrl}
                alt="KAFA Logo"
                className="h-auto w-16 sm:w-32"
              />
            ) : (
              <img
                src="/logo/KAFA_OG.png"
                alt=""
                className="h-auto w-16 sm:w-32"
              />
            )}
            <div className="ml-3 flex flex-col justify-center gap-4 lg:ml-10">
              <div className="text-gray-250 text-xl font-semibold">
                {pastLeague?.associationInfo?.name}
              </div>
              <div className="text-white-900 text-md font-bold sm:text-2xl">
                {pastLeague?.name}
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-4">
            <div>
              <Button
                variant="outlineWhiteText"
                label="대회요강"
                // onClick={() => goToNotice(pastLeague.id)}
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
                          : 'border-b-2 border-transparent hover:border-white'
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
                          : 'border-b-2 border-transparent hover:border-white'
                      }`}
                      onClick={() => setCurrentComponent('TEAMS')}
                    >
                      TEAMS
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
                  className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-300"
                  onClick={() => setCurrentComponent('HOME')}
                >
                  HOME
                </Disclosure.Button>
                <Disclosure.Button
                  as="button"
                  className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-300"
                  onClick={() => setCurrentComponent('TEAMS')}
                >
                  TEAMS
                </Disclosure.Button>

                <Disclosure.Button
                  as="button"
                  className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-300"
                  onClick={() => setCurrentComponent('STATS')}
                >
                  STATS
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

export default PastLeagueDetail
