// TeamDetail.tsx
import axiosInstance from '@/commons/axios'
import type { TeamComplication } from '@/commons/interfaces/team/teamComplication'
import TeamBanner from '@/components/cards/TeamBanner'
import useNotification from '@/hooks/useNotification'
import { NotificationType } from '@/state/notificationState'
import { Disclosure } from '@headlessui/react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AlumniItem from './item/AlumniItem'
import RosterItem from './item/RosterItem'
import TeamHomeItem from './item/TeamHomeItem'

const TeamDetail = () => {
  const { teamId } = useParams()
  const [currentComponent, setCurrentComponent] = useState<string | null>(
    'HOME'
  )
  const [team, setTeam] = useState<TeamComplication | null>(null)
  const { showNotification } = useNotification()
  const navigate = useNavigate()

  useEffect(() => {
    const getTeam = async () => {
      try {
        const response = await axiosInstance.get(`/teams/${teamId}`)
        setTeam(response.data)
      } catch (error) {
        showNotification(
          NotificationType.Error,
          '팀 정보 불러오기 실패',
          '팀 정보 불러오기에 실패했습니다.'
        )
        navigate('/teams')
      }
    }
    getTeam()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const renderComponent = () => {
    if (currentComponent === 'HOME') {
      return <TeamHomeItem />
    } else if (currentComponent === 'ROSTER') {
      return <RosterItem />
    } else if (currentComponent === 'ALUMNI') {
      return <AlumniItem />
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
      <div className="bg-purple-950">
        <Disclosure as="nav" className="mx-auto max-w-screen-xl px-4 lg:px-20">
          <>
            <div className="">
              <div className="flex h-20 justify-between">
                <div className="flex">
                  <div className="flex space-x-2 sm:space-x-8">
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
                      onClick={() => setCurrentComponent('ALUMNI')}
                    >
                      ALUMNI
                    </Disclosure.Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        </Disclosure>
      </div>
      <div className="min-h-96">{renderComponent()}</div>
    </div>
  )
}

export default TeamDetail
