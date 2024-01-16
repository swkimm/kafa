import axiosInstance from '@/commons/axios'
import type { Association } from '@/commons/interfaces/association/association'
import type { TeamComplication } from '@/commons/interfaces/team/teamComplication'
import DropdownRight from '@/components/dropdown/DropdownRight'
import DefaultTable from '@/components/tables/DefaultTable'
import { useCallback, useEffect, useState } from 'react'

const ApplyTeam = () => {
  const [associations, setAssociations] = useState<Association[]>([])
  const [selectedAssociationId, setSelectedAssociationId] = useState<
    number | null
  >(1)
  const [teams, setTeams] = useState<TeamComplication[] | null>(null)

  const getTeamsByAssociations = useCallback(async () => {
    try {
      const response = await axiosInstance.get<TeamComplication[]>(
        `/teams/associations/${selectedAssociationId}`
      )
      setTeams(response.data)
    } catch (error) {
      console.log(error)
    }
  }, [selectedAssociationId])

  useEffect(() => {
    const getAssociations = async () => {
      try {
        const response = await axiosInstance.get<Association[]>(
          '/associations?page=1&limit=100'
        )
        setAssociations(response.data)
      } catch (error) {
        console.error('협회 데이터 가져오기 오류:', error)
      }
    }
    getAssociations()
    if (selectedAssociationId) {
      getTeamsByAssociations()
    }
  }, [selectedAssociationId, getTeamsByAssociations])

  const associationSelect = (selected: string) => {
    const association = associations.find((assoc) => assoc.name === selected)
    setSelectedAssociationId(association?.id || null)
  }

  const teamsColumns = [
    {
      title: '로고',
      render: (team: TeamComplication) => (
        <div>
          {team.profileImgUrl !== null ? (
            <img
              src={team.profileImgUrl}
              alt={team.name}
              className="mr-2 w-8"
            />
          ) : (
            <img src="/logo/KAFA_OG.png" alt="" className="mr-2 w-8" />
          )}
        </div>
      )
    },
    {
      title: '지역',
      render: (team: TeamComplication) => <div>{team.hometown}</div>
    },
    {
      title: '팀명',
      render: (team: TeamComplication) => <div>{team.name}</div>
    },
    {
      title: '이니셜',
      render: (team: TeamComplication) => <div>{team.initial}</div>
    },
    {
      title: '창단년도',
      render: (team: TeamComplication) => {
        if (team.establishedAt) {
          const year = team.establishedAt.getFullYear()
          return <div>{year}</div>
        } else {
          return <div>년도 정보 없음</div>
        }
      }
    },
    {
      title: '신청',
      render: () => (
        <div>
          <button
            type="button"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            신청
          </button>
        </div>
      )
    }
  ]

  return (
    <div className="m-5">
      <div className="text-md mb-5 font-bold">팀 신청</div>
      <div className="bg-white p-5">
        <div className="flex justify-between border-b border-l-8 border-l-black p-3 sm:flex-auto">
          <div className="flex items-center">팀 신청</div>
          <div className="flex items-center">
            {associations.length > 0 && (
              <DropdownRight
                optionName={associations[0].name}
                optionList={associations}
                onSelect={associationSelect}
              />
            )}

            <button
              type="button"
              className="ml-5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              신규 신청
            </button>
          </div>
        </div>
        <div>
          {teams && teams.length > 0 ? (
            <DefaultTable title={''} data={teams} columns={teamsColumns} />
          ) : (
            <div className="mt-5">
              <p>No teams available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ApplyTeam
