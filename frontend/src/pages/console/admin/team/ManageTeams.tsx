import axiosInstance from '@/commons/axios'
import type { TeamComplication } from '@/commons/interfaces/team/teamComplication'
import Button from '@/components/buttons/Button'
import DefaultTable from '@/components/tables/DefaultTable'
import { useCallback, useEffect, useState } from 'react'

interface RegisterTeamRequest {
  id: number
  accountId: number
  username: string
  data: ExtendedTeam
  createdAt: Date
  rejectReason?: string
  status: string
}

interface ExtendedTeam extends TeamComplication {
  associationName: string
}

const ManageTeams = () => {
  const [registerTeam, setRegisterTeam] = useState<RegisterTeamRequest[]>([])

  const fetchAssociationId = async (associationId: number) => {
    const response = await axiosInstance.get(`/associations/${associationId}`)
    return response.data
  }

  const getRegisterTeamRequest = useCallback(async () => {
    const limit = 100
    const cursor = 0
    try {
      const response = await axiosInstance.get<RegisterTeamRequest[]>(
        `/admin/teams/requests?limit=${limit}&cursor=${cursor}`
      )
      const getRegisterTeamRequestWithAssociationName = await Promise.all(
        response.data.map(async (get) => {
          const associationResponse = get.data.associationId
            ? await fetchAssociationId(get.data.associationId)
            : { name: 'N/A' }
          return {
            ...get,
            data: {
              ...get.data,
              associationName: associationResponse.name
            }
          }
        })
      )
      setRegisterTeam(
        getRegisterTeamRequestWithAssociationName as unknown as RegisterTeamRequest[]
      )
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }, [])

  useEffect(() => {
    getRegisterTeamRequest()
  }, [getRegisterTeamRequest])

  const deleteRequest = async (teamId: number) => {
    const result = window.confirm('삭제하시겠습니까?')
    if (result) {
      try {
        const response = await axiosInstance.delete(`/admin/teams/${teamId}`)
        console.log(response.data)
      } catch (error) {
        console.log(error)
      }
      getRegisterTeamRequest()
    }
  }

  const approveRequest = async (teamId: number) => {
    try {
      const response = await axiosInstance.put(
        `/admin/teams/requests/${teamId}/approve`
      )
      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }

  const rejectRequest = async (teamId: number) => {
    const reason = window.prompt('거절 사유를 입력해주세요')
    if (reason !== null && reason.trim() !== '') {
      try {
        const response = await axiosInstance.put(
          `/admin/teams/requests/${teamId}/reject`,
          { reason }
        )
        console.log(reason)
        console.log(response.data)
      } catch (error) {
        console.log(error)
      }
    } else {
      console.log('No reason provided, request not sent')
    }
  }

  const registerTeamRequestColumns = [
    {
      title: '협회',
      render: (request: RegisterTeamRequest) => (
        <div>{request.data.associationName}</div>
      )
    },
    {
      title: '팀 계정 아이디',
      render: (request: RegisterTeamRequest) => <div>{request.username}</div>
    },
    {
      title: '팀명(연고지)',
      render: (request: RegisterTeamRequest) => (
        <div>
          {request.data.name}({request.data.hometown})
        </div>
      )
    },
    {
      title: '신청 날짜',
      render: (request: RegisterTeamRequest) => {
        const date = new Date(request.createdAt)
        const formattedDate = date.toISOString().split('T')[0]
        return <div>{formattedDate}</div>
      }
    },
    {
      title: '상태',
      render: (request: RegisterTeamRequest) => <div>{request.status}</div>
    },
    {
      title: '사유',
      render: (request: RegisterTeamRequest) => (
        <div>{request.rejectReason}</div>
      )
    },
    {
      title: '처리',
      render: (request: RegisterTeamRequest) => (
        <div className="flex gap-x-2">
          <Button
            label="승인"
            variant="roundLg"
            onClick={() => approveRequest(request.id)}
          />

          <Button
            label="거절"
            variant="roundLg"
            onClick={() => rejectRequest(request.id)}
          />

          <Button
            label="삭제"
            variant="roundLg"
            onClick={() => deleteRequest(request.id)}
          />
        </div>
      )
    }
  ]

  return (
    <div className="m-5">
      <DefaultTable
        title={'팀 등록 요청 목록'}
        data={registerTeam}
        columns={registerTeamRequestColumns}
      />
    </div>
  )
}

export default ManageTeams
