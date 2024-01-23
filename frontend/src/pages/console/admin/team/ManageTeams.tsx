import axiosInstance from '@/commons/axios'
import type { TeamComplication } from '@/commons/interfaces/team/teamComplication'
import Button from '@/components/buttons/Button'
import RejectModalWithInputTag from '@/components/modal/RejectModalWithInputTag'
import DefaultTable from '@/components/tables/DefaultTable'
import useNotification from '@/hooks/useNotification'
import { NotificationType } from '@/state/notificationState'
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
  const { showNotification } = useNotification()
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null)

  const fetchAssociationId = async (associationId: number) => {
    const response = await axiosInstance.get(`/associations/${associationId}`)
    return response.data
  }

  const getRegisterTeamRequest = useCallback(async () => {
    const limit = 100
    const cursor = 0
    const option = 'Received'
    try {
      const response = await axiosInstance.get<RegisterTeamRequest[]>(
        `/admin/teams/requests?limit=${limit}&cursor=${cursor}&option=${option}`
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
    } catch (error) {
      showNotification(
        NotificationType.Error,
        '팀생성 요청 불러오기 실패',
        '팀생성 요청 불러오기에 실패했습니다.',
        2500
      )
    }
  }, [showNotification])

  useEffect(() => {
    getRegisterTeamRequest()
  }, [getRegisterTeamRequest])

  const approveRequest = async (teamId: number) => {
    try {
      await axiosInstance.put(`/admin/teams/requests/${teamId}/approve`)
    } catch (error) {
      showNotification(
        NotificationType.Error,
        '팀생성 요청 승인 실패',
        '팀생성 요청 승인에 실패했습니다.',
        2500
      )
    }
  }

  const openRejectModal = (teamId: number) => {
    setSelectedTeamId(teamId)
    setIsRejectModalOpen(true)
  }

  const closeRejectModal = () => {
    setIsRejectModalOpen(false)
  }

  const rejectRequest = async (rejectReason: string) => {
    if (selectedTeamId && rejectReason) {
      console.log(selectedTeamId, rejectReason)

      try {
        await axiosInstance.put(
          `/admin/teams/requests/${selectedTeamId}/reject`,
          {
            rejectReason
          }
        )
        closeRejectModal()
        getRegisterTeamRequest()
      } catch (error) {
        showNotification(
          NotificationType.Error,
          '팀생성 요청 반려 실패',
          '팀생성 요청 반려 실패했습니다.',
          2500
        )
      }
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
            onClick={() => openRejectModal(request.id)}
          />
        </div>
      )
    }
  ]

  return (
    <div className="m-5">
      {registerTeam.length > 0 ? (
        <DefaultTable
          title={'팀 등록 요청 목록'}
          data={registerTeam}
          columns={registerTeamRequestColumns}
        />
      ) : (
        <p>팀 등록 요청이 없습니다.</p>
      )}

      <RejectModalWithInputTag
        isOpen={isRejectModalOpen}
        onClose={closeRejectModal}
        onSubmit={rejectRequest}
      />
    </div>
  )
}

export default ManageTeams
