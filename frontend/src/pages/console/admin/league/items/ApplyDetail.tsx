import axiosInstance from '@/commons/axios'
import { printRosterType } from '@/commons/functions/roster-type/roster-type.print'
import type { Roster } from '@/commons/interfaces/roster/roster'
import DefaultTable from '@/components/tables/DefaultTable'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

interface RequestDetail {
  rejectReason: string
  rosters: Roster[]
}

const ApplyDetail = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const leagueId = queryParams.get('league')
  const teamId = queryParams.get('team')
  const [requestDetail, setRequestDetail] = useState<RequestDetail>()
  console.log(leagueId, teamId)

  const getJoinLeagueRequestDetail = async () => {
    try {
      const response = await axiosInstance.get(
        `/admin/leagues/${leagueId}/teams/${teamId}/request`
      )
      console.log(response.data)
      setRequestDetail(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getJoinLeagueRequestDetail()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const requestDetailColumns = [
    {
      title: '이름',
      render: (roster: Roster) => <div>{roster.name}</div>
    },
    {
      title: '증명서',
      render: (roster: Roster) => (
        <div>
          {roster.certification ? (
            <div>{roster.certification}</div>
          ) : (
            <div>증명서 없음</div>
          )}
        </div>
      )
    },
    {
      title: '구분',
      render: (roster: Roster) => (
        <div> {printRosterType(roster.rosterType)}</div>
      )
    },
    {
      title: '백넘버',
      render: (roster: Roster) => <div>{roster.Athlete?.backNumber}</div>
    },
    {
      title: '포지션',
      render: (roster: Roster) => {
        {
          const positions = []
          if (roster.Athlete?.position.offence) {
            positions.push(roster.Athlete.position.offence)
          }
          if (roster.Athlete?.position.defense) {
            positions.push(roster.Athlete.position.defense)
          }
          if (roster.Athlete?.position.special) {
            positions.push(roster.Athlete.position.special)
          }
          return <div>{positions.join('/')}</div>
        }
      }
    }
  ]

  return (
    <div className="m-5">
      {requestDetail?.rejectReason && (
        <div>거절 사유{requestDetail?.rejectReason}</div>
      )}
      <div>
        {requestDetail && requestDetail.rosters && (
          <DefaultTable
            title={'참가 신청 상세'}
            data={requestDetail?.rosters}
            columns={requestDetailColumns}
          />
        )}
      </div>
    </div>
  )
}

export default ApplyDetail
