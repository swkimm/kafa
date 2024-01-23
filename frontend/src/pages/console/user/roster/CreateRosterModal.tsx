import axiosInstance from '@/commons/axios'
import type { TeamSimple } from '@/commons/interfaces/team/teamSimple'
import { useEffect, useState } from 'react'
import CreateRosterForm from './CreateRosterForm'
import TeamSearchResultList from './TeamSearchResultList'

interface CreateRosterModalProps {
  closeModal: () => void
}

const CreateRosterModal: React.FC<CreateRosterModalProps> = ({
  closeModal
}) => {
  const [term, setTerm] = useState('')
  const [teams, setTeams] = useState<TeamSimple[]>()
  const [isSearching, setIsSearching] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<TeamSimple>()

  const onTeamSelected = (team: TeamSimple) => {
    setSelectedTeam(team)
  }

  const searchTeam = async () => {
    setIsSearching(true)
    await axiosInstance
      .get(`/teams/search?term=${term}&limit=5`)
      .then((result) => {
        setTerm('')
        setTeams(result.data)
      })
    setIsSearching(false)
  }

  useEffect(() => {
    const getTeams = async () => {
      await axiosInstance
        .get('/teams?page=1&limit=5')
        .then((result) => setTeams(result.data))
    }

    getTeams()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <div className="">
          {selectedTeam ? (
            <div className="flex flex-col gap-y-2">
              <h2 className="pb-1 text-base font-semibold leading-7 text-gray-900">
                로스터 정보 입력
              </h2>
              <CreateRosterForm
                closeModal={closeModal}
                back={() => setSelectedTeam(undefined)}
                selectedTeam={selectedTeam}
              />
            </div>
          ) : (
            <div className="border-b border-gray-900/30">
              <div className="flex flex-col gap-y-2 pb-3">
                <h2 className="pb-1 text-base font-semibold leading-7 text-gray-900">
                  로스터를 생성할 팀 선택
                </h2>
                <div className="flex flex-row justify-between">
                  <input
                    type="text"
                    name="term"
                    id="term"
                    value={term}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') searchTeam()
                    }}
                    onChange={(event) => setTerm(event.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-950 sm:text-sm sm:leading-6"
                    placeholder="팀 이름"
                  />
                  <button
                    onClick={searchTeam}
                    disabled={isSearching}
                    className="sm:text-s ml-3 items-center whitespace-nowrap rounded-md bg-indigo-950 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-900"
                  >
                    검색
                  </button>
                </div>
              </div>
              <div>
                {teams && (
                  <TeamSearchResultList
                    onSelect={onTeamSelected}
                    teams={teams}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-row justify-end gap-x-1.5">
        {!selectedTeam && (
          <button
            className="items-center whitespace-nowrap rounded-md bg-indigo-950 px-3.5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-900 sm:text-sm"
            onClick={closeModal}
          >
            닫기
          </button>
        )}
      </div>
    </div>
  )
}

export default CreateRosterModal
