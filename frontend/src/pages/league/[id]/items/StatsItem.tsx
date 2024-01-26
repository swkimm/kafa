// StatsItem.tsx
import axiosInstance from '@/commons/axios'
import type { Record } from '@/commons/interfaces/record/record'
import DefaultTable from '@/components/tables/DefaultTable'
import useNotification from '@/hooks/useNotification'
import { NotificationType } from '@/state/notificationState'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const StatsItem = () => {
  const { leagueId } = useParams()
  const [leagueRecords, setLeagueRecords] = useState<Record[]>([])
  const navigate = useNavigate()
  const { showNotification } = useNotification()

  const getLeagueRecordsByLeagueId = async () => {
    try {
      const response = await axiosInstance.get(`/records/games/${leagueId}`)
      setLeagueRecords(response.data)
    } catch (error) {
      if (error instanceof AxiosError) {
        // 오류가 404가 아닐 경우에만 알림을 표시합니다.
        if (error.response && error.response.status !== 404) {
          showNotification(
            NotificationType.Error,
            '리그 기록 불러오기 실패',
            '리그 기록 불러오기에 실패했습니다.'
          )
        }
      } else {
        showNotification(
          NotificationType.Error,
          '리그 기록 불러오기 실패',
          '리그 기록 불러오기에 실패했습니다.'
        )
      }
    }
  }

  useEffect(() => {
    getLeagueRecordsByLeagueId()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const goToTeamDetail = (teamId: number) => {
    navigate(`/leagues/${leagueId}/teams/${teamId}`)
  }

  const goToMemberDetail = (teamId: number, memberId: number) => {
    navigate(`/leagues/${leagueId}/teams/${teamId}/members/${memberId}`)
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
        {leagueRecords.length > 0 ? (
          <DefaultTable
            title={'리그 득점 기록'}
            data={leagueRecords}
            columns={leagueRecordsColumns}
          />
        ) : (
          <div className="col-span-2 mx-auto mt-5 flex w-full items-center justify-center">
            <ExclamationTriangleIcon className="h-6 w-6 pr-1.5 text-yellow-500" />
            <p>리그에 대한 기록 목록이 없습니다</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default StatsItem
