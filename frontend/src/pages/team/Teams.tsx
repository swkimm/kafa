import axiosInstance from '@/commons/axios'
import type { GetLeaguesWithYear } from '@/commons/interfaces/league/getLeaguesWithYears'
import type { TeamComplication } from '@/commons/interfaces/team/teamComplication'
import TeamCard from '@/components/cards/TeamCard'
import DropdownRight from '@/components/dropdown/DropdownRight'
import useNotification from '@/hooks/useNotification'
import { NotificationType } from '@/state/notificationState'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Teams = () => {
  const [leagues, setLeagues] = useState<GetLeaguesWithYear[]>([])
  const [teams, setTeams] = useState<TeamComplication[] | null>(null)
  const [selectedLeagueId, setSelectedLeagueId] = useState<number | undefined>(
    undefined
  )
  const thisYear = new Date().getFullYear()
  const navigate = useNavigate()
  const { showNotification } = useNotification()

  useEffect(() => {
    const getThisYearLeagues = async () => {
      const page = 1
      const limit = 20
      try {
        const response = await axiosInstance.get(
          `/leagues/years/${new Date().getFullYear() - 1}?page=${page}&limit=${limit}`
        )
        setLeagues(response.data)
        if (response.data.length > 0) {
          const firstLeague = response.data[0]
          setSelectedLeagueId(firstLeague.id) // 첫번째 리그 ID 설정
          getTeamsByLeagueId(firstLeague.id) // 첫번째 리그의 팀 목록 가져오기
        }
      } catch (error) {
        console.log(error)
      }
    }

    getThisYearLeagues()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // selectedLeagueId가 바뀔 때마다 실행될 함수
    if (selectedLeagueId !== undefined) {
      getTeamsByLeagueId(selectedLeagueId) // 선택된 리그의 팀 목록 가져오기
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLeagueId])

  const handleSelect = (selectedName: string) => {
    // leagues 배열에서 선택된 이름과 일치하는 리그 찾기
    const selectedLeague = leagues.find(
      (league) => league.name === selectedName
    )
    if (selectedLeague) {
      setSelectedLeagueId(selectedLeague.id) // 선택된 리그의 ID로 상태 업데이트
    }
  }

  const getTeamsByLeagueId = async (leagueId: number) => {
    try {
      const response = await axiosInstance.get(`/teams/leagues/${leagueId}`)
      console.log(response.data)
      setTeams(response.data)
    } catch (error) {
      showNotification(
        NotificationType.Error,
        '팀 목록 불러오기 실패',
        '팀 목록 불러오기에 실패했습니다.'
      )
    }
  }

  const goToTeamDetailPage = (teamId: number) => {
    navigate(`/leagues/${selectedLeagueId}/teams/${teamId}?year=${thisYear}`)
  }

  return (
    <div>
      <div className="bg-purple-950 py-6 text-xl font-bold text-gray-50">
        <div className="mx-auto flex max-w-screen-xl justify-between px-4 lg:px-20">
          <p>TEAMS</p>
          <div className="text-xs text-white sm:text-base">
            {leagues.length > 0 && (
              <DropdownRight
                key={selectedLeagueId || 'default-key'}
                optionName={
                  leagues.find((league) => league.id === selectedLeagueId)
                    ?.name || 'Select a League'
                }
                optionList={leagues}
                onSelect={handleSelect}
              />
            )}
          </div>
        </div>
      </div>
      <div className="mx-auto mt-3 max-w-screen-xl px-4 lg:px-20">
        <div className="my-5 grid grid-cols-1 gap-x-5 gap-y-3 text-center sm:grid-cols-2">
          {teams && teams.length > 0 ? (
            teams.map((team) => (
              <div key={team.id}>
                <TeamCard
                  id={team.id}
                  name={team.name}
                  globalName={team.globalName}
                  initial={team.initial}
                  color={team.color}
                  profileImgUrl={team.profileImgUrl || '/logo/KAFA_OG.png'}
                  isWhite={(color: string) => color === '#ffffff'}
                  onClick={() => goToTeamDetailPage(team.id)}
                />
              </div>
            ))
          ) : (
            <div className="col-span-2 my-5 h-full w-full">
              <div className="mx-auto flex w-full items-center justify-center">
                <ExclamationTriangleIcon className="h-6 w-6 pr-1.5 text-yellow-500" />
                <p>팀 정보가 없습니다</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Teams
