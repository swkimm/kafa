import axiosInstance from '@/commons/axios'
import type { Association } from '@/commons/interfaces/association/association'
import type { League } from '@/commons/interfaces/league/league'
import { Disclosure } from '@headlessui/react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import LeagueHomeItem from './items/LeagueHomeItem'
import TeamItem from './items/LeagueTeamItem'
import StatsItem from './items/StatsItem'

const LeagueDetail = () => {
  const { leagueId } = useParams<{ leagueId: string }>()
  const [league, setLeague] = useState<League | null>(null)
  const [association, setAssociation] = useState<Association | null>(null)

  const [currentComponent, setCurrentComponent] = useState<string | null>(
    'HOME'
  )

  const renderComponent = () => {
    if (currentComponent === 'HOME') {
      return <>{league && <LeagueHomeItem league={league} />}</>
    } else if (currentComponent === 'TEAMS') {
      return <TeamItem />
    } else if (currentComponent === 'STATS') {
      return <StatsItem />
    }
  }

  useEffect(() => {
    const fetchLeagueData = async () => {
      try {
        const response = await axiosInstance.get<League>(`/leagues/${leagueId}`)
        response.data.startedAt = new Date(response.data.startedAt)
        response.data.endedAt = new Date(response.data.endedAt)
        setLeague(response.data)
        fetchAssociationData(response.data.associationId)
      } catch (error) {
        console.error('Error fetching data: ', error)
      }
    }

    fetchLeagueData()
  }, [leagueId])

  const fetchAssociationData = async (associationId: number) => {
    try {
      const response = await axiosInstance.get<Association>(
        `/associations/${associationId}`
      )
      setAssociation(response.data)
    } catch (error) {
      console.error('Error fetching data: ', error)
    }
  }

  return (
    <div className="h-full w-full">
      <div className="flex bg-gray-800 py-5 lg:py-7">
        <div className="mx-auto w-full max-w-screen-xl px-4 lg:px-20">
          {association && league && (
            <div className="flex text-white">
              <div>
                <img
                  src={association.profileImgUrl || '/logo/KAFA_OG.png'}
                  alt={association.name}
                  className="h-auto w-16 sm:w-32"
                />
              </div>
              <div className="ml-3 flex flex-col justify-center gap-y-0.5 lg:ml-10">
                <div className="text-sm text-gray-400 sm:text-base">
                  {association.name}
                </div>
                <div className="text-base font-bold text-white sm:text-2xl lg:-mt-1 lg:text-xl">
                  {league.name}
                </div>
                <div className="mt-0.5 text-xs font-normal text-gray-400 lg:mt-2.5">
                  {league.startedAt.toLocaleDateString()} ~{' '}
                  {league.endedAt.toLocaleDateString()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Disclosure as="nav" className="w-full bg-purple-950 shadow">
        {() => (
          <>
            <div className="mx-auto max-w-screen-xl px-4 text-xs lg:px-20 lg:text-sm">
              <div className="flex h-20 justify-between">
                <div className="flex">
                  <div className="flex space-x-2 lg:space-x-8">
                    <Disclosure.Button
                      as="button"
                      className={`inline-flex items-center px-1 pt-1 font-medium text-white ${
                        currentComponent === 'HOME'
                          ? 'border-b-2 border-white'
                          : 'border-b-2 border-transparent hover:border-white '
                      }`}
                      onClick={() => setCurrentComponent('HOME')}
                    >
                      HOME
                    </Disclosure.Button>
                    <Disclosure.Button
                      as="button"
                      className={`inline-flex items-center px-1 pt-1 font-medium text-white ${
                        currentComponent === 'TEAMS'
                          ? 'border-b-2 border-white'
                          : 'border-b-2 border-transparent hover:border-white '
                      }`}
                      onClick={() => setCurrentComponent('TEAMS')}
                    >
                      TEAMS
                    </Disclosure.Button>
                    <Disclosure.Button
                      as="button"
                      className={`inline-flex items-center px-1 pt-1 font-medium text-white ${
                        currentComponent === 'STATS'
                          ? 'border-b-2 border-white'
                          : 'border-b-2 border-transparent hover:border-white '
                      }`}
                      onClick={() => setCurrentComponent('STATS')}
                    >
                      STATS
                    </Disclosure.Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </Disclosure>
      <div className="min-h-96">{renderComponent()}</div>
    </div>
  )
}

export default LeagueDetail
