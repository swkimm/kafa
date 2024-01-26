// StatsItem.tsx
import axiosInstance from '@/commons/axios'
import type { Record } from '@/commons/interfaces/record/record'
import DefaultTable from '@/components/tables/DefaultTable'
import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

const StatsItem = () => {
  const [searchParams] = useSearchParams()
  const year = searchParams.get('year')
  const { leagueId } = useParams()
  const [leagueRecords, setLeagueRecords] = useState<Record[]>([])
  const navigate = useNavigate()

  const getLeagueRecordsByLeagueId = async () => {
    try {
      const response = await axiosInstance.get(`/records/games/${leagueId}`)
      setLeagueRecords(response.data)
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getLeagueRecordsByLeagueId()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const goToTeamDetail = (teamId: number) => {
    navigate(`/leagues/${leagueId}/teams/${teamId}?year=${year}`)
  }

  const goToMemberDetail = (teamId: number, memberId: number) => {
    navigate(
      `/leagues/${leagueId}/teams/${teamId}/members/${memberId}?year=${year}`
    )
  }

  const leagueRecordsColumns = [
    {
      title: 'Unit',
      render: (stats: Record) => <div>{stats.unit}</div>
    },
    {
      title: 'Score',
      render: (stats: Record) => <div>{stats.score}</div>
    },
    {
      title: 'Type',
      render: (stats: Record) => <div>{stats.type}</div>
    },
    {
      title: 'Athlete',
      render: (stats: Record) => (
        <div
          className="flex cursor-pointer items-center"
          onClick={() =>
            goToMemberDetail(
              stats.Athlete.Roster.teamId,
              stats.Athlete.Roster.id
            )
          }
        >
          <div>
            {stats.Athlete.Roster.profileImgUrl ? (
              <img
                src={stats.Athlete.Roster.profileImgUrl}
                alt={stats.Athlete.Roster.name}
              />
            ) : (
              <img src="/logo/KAFA_OG.png" alt="" className="w-8" />
            )}
          </div>
          <div>{stats.Athlete.Roster.name}</div>
        </div>
      )
    },
    {
      title: 'Position',
      render: (stats: Record) => {
        const positions = []
        if (stats.Athlete.position.offence) {
          positions.push(stats.Athlete.position.offence)
        }
        if (stats.Athlete.position.defense) {
          positions.push(stats.Athlete.position.defense)
        }
        if (stats.Athlete.position.special) {
          positions.push(stats.Athlete.position.special)
        }
        return <div>{positions.join('/')}</div>
      }
    },
    {
      title: 'Team',
      render: (stats: Record) => (
        <div
          className="cursor-pointer"
          onClick={() => goToTeamDetail(stats.Athlete.Roster.teamId)}
        >
          {stats.Athlete.Roster.teamId === stats.Game.homeTeam.id
            ? stats.Game.homeTeam.name
            : stats.Athlete.Roster.teamId === stats.Game.awayTeam.id
              ? stats.Game.awayTeam.name
              : 'Unknown Team'}
        </div>
      )
    }
  ]

  return (
    <div className="container mx-auto mb-5 mt-5 w-full">
      <div>
        <DefaultTable
          title={'리그 득점 기록'}
          data={leagueRecords}
          columns={leagueRecordsColumns}
        />
      </div>
    </div>
  )
}

export default StatsItem
