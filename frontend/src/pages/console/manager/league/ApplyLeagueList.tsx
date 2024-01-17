import axiosInstance from '@/commons/axios'
import Button from '@/components/buttons/Button'
import DefaultTable from '@/components/tables/DefaultTable'
import { useCallback, useEffect, useState } from 'react'

enum ApplyStatus {
  Approved = 'Approved',
  Hold = 'Hold',
  Rejected = 'Rejected',
  Received = 'Received'
}

interface ApplyRequest {
  teamId: number
  leagueId: number
  rank?: number
  applyStatus: ApplyStatus
  reason?: string
}

interface ExtendedApplyRequest extends ApplyRequest {
  teamName: string
  leagueName: string
  applyStatus: ApplyStatus
}

const ApplyLeagueList = () => {
  const [applyRequest, setApplyRequest] = useState<ExtendedApplyRequest[]>([])

  const fetchTeamName = async (teamId: number) => {
    const response = await axiosInstance.get(`/teams/${teamId}`)
    return response.data
  }

  const fetchLeagueName = async (leagueId: number) => {
    const response = await axiosInstance.get(`/leagues/${leagueId}`)
    return response.data
  }

  const getApplyLeagueRequest = useCallback(async () => {
    try {
      const response =
        await axiosInstance.get<ExtendedApplyRequest[]>(`/leagues/requests`)

      const applyLeagueRequestWithName = await Promise.all(
        response.data.map(async (apply) => {
          const teamResponse = apply.teamId
            ? await fetchTeamName(apply.teamId)
            : { name: 'N/A' }
          const leagueResponse = apply.leagueId
            ? await fetchLeagueName(apply.leagueId)
            : { name: 'N/A' }

          console.log(response.data)
          return {
            ...apply,
            teamName: teamResponse.name,
            leagueName: leagueResponse.name
          }
        })
      )
      setApplyRequest(
        applyLeagueRequestWithName as unknown as ExtendedApplyRequest[]
      )
    } catch (error) {
      console.log(error)
    }
  }, [])

  useEffect(() => {
    getApplyLeagueRequest()
  }, [getApplyLeagueRequest])

  const retryJoin = async (leagueId: number) => {
    try {
      await axiosInstance.post(`/leagues/${leagueId}/join/retry`)
      getApplyLeagueRequest()
    } catch (error) {
      console.log(error)
    }
  }

  const applyLeagueListColumns = [
    {
      title: '신청 리그',
      render: (apply: ExtendedApplyRequest) => <div>{apply.leagueName}</div>
    },
    {
      title: '팀명',
      render: (apply: ExtendedApplyRequest) => <div>{apply.teamName}</div>
    },
    {
      title: '팀 순위',
      render: (apply: ExtendedApplyRequest) => <div>{apply.rank}</div>
    },
    {
      title: '상태',
      render: (apply: ExtendedApplyRequest) => {
        switch (apply.applyStatus) {
          case ApplyStatus.Approved:
            return <div>승인</div>
          case ApplyStatus.Hold:
            return <div>보류</div>
          case ApplyStatus.Rejected:
            return <div>반려</div>
          case ApplyStatus.Received:
            return <div>접수</div>
          default:
            return <div>상태 불명</div>
        }
      }
    },
    {
      title: applyRequest.some(
        (ar) =>
          ar.applyStatus === ApplyStatus.Hold ||
          ar.applyStatus === ApplyStatus.Rejected
      )
        ? '사유'
        : '',
      render: (apply: ExtendedApplyRequest) =>
        apply.applyStatus === ApplyStatus.Hold ||
        apply.applyStatus === ApplyStatus.Rejected ? (
          <div>{apply.reason}</div>
        ) : null // Render null if the condition is not met
    },
    {
      title: applyRequest.some((ar) => ar.applyStatus === ApplyStatus.Hold)
        ? '재신청'
        : '',
      render: (apply: ExtendedApplyRequest) =>
        apply.applyStatus === ApplyStatus.Hold ? (
          <Button
            label="재신청"
            variant="roundLg"
            onClick={() => retryJoin(apply.leagueId)}
          />
        ) : null // Render null if the condition is not met
    }
  ]

  return (
    <div className="m-5">
      <DefaultTable
        title={'리그 신청 리스트'}
        data={applyRequest}
        columns={applyLeagueListColumns}
      />
    </div>
  )
}

export default ApplyLeagueList
