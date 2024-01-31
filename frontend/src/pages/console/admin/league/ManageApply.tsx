import axiosInstance from '@/commons/axios'
import type { Association } from '@/commons/interfaces/association/association'
import type { League } from '@/commons/interfaces/league/league'
import type { TeamComplication } from '@/commons/interfaces/team/teamComplication'
import Button from '@/components/buttons/Button'
import DropdownLeft from '@/components/dropdown/DropdownLeft'
import RejectModalWithInputAndDropbox from '@/components/modal/RejectModalWithInputAndDropbox'
import DefaultTable from '@/components/tables/DefaultTable'
import useNotification from '@/hooks/useNotification'
import { NotificationType } from '@/state/notificationState'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

enum ApplyStatus {
  Approved,
  Rejected,
  Hold,
  Received
}

enum RejectStatus {
  Rejected,
  Hold
}

interface RequestLeague {
  teamId: number
  leagueId: number
  rank?: number
  applyStatus: ApplyStatus
  reason?: string
}

interface ExtendedRequest extends RequestLeague {
  teamInfo: TeamComplication
}

const ManageApply = () => {
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
  const [association, setAssociation] = useState<Association[]>([])
  const [selectedAssociationId, setSelectedAssociationId] = useState<number>(1)
  const [league, setLeague] = useState<League[]>([])
  const [selectedLeagueId, setSelectecLeagueId] = useState<number>(1)
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null)
  const [joinRequest, setJoinRequest] = useState<ExtendedRequest[]>([])
  const navigate = useNavigate()
  const { showNotification } = useNotification()

  const applyStatusOptions = Object.values(RejectStatus)
    .filter((key) => isNaN(Number(key)))
    .map((status, index) => ({
      id: index,
      name: status.toString()
    }))

  const getLeaguesByAssociationId = async (associationId: number) => {
    const page = 1
    const limit = 100
    const response = await axiosInstance.get(
      `/leagues/associations/${associationId}?page=${page}&limit=${limit}`
    )
    setLeague(response.data)
    return response.data
  }

  const getAssociations = async () => {
    const page = 1
    const limit = 100
    const response = await axiosInstance.get(
      `/associations?page=${page}&limit=${limit}`
    )
    setAssociation(response.data)
    return response.data
  }

  const openRejectModal = (teamId: number) => {
    setSelectedTeamId(teamId)
    setIsRejectModalOpen(true)
  }

  const closeRejectModal = () => {
    setIsRejectModalOpen(false)
  }

  const fetchGetTeamInfo = async (teamId: number) => {
    const response = await axiosInstance.get(`/teams/${teamId}`)
    return response.data
  }

  const getJoinLeagueRequest = async (leagueId: number) => {
    try {
      const response = await axiosInstance.get<RequestLeague[]>(
        `/admin/leagues/${leagueId}/requests`
      )
      const joinLeagueRequestWithTeamInfo = await Promise.all(
        response.data.map(async (request) => {
          const teamInfo = await fetchGetTeamInfo(request.teamId)

          return {
            ...request,
            teamInfo: teamInfo
          }
        })
      )
      setJoinRequest(joinLeagueRequestWithTeamInfo)
    } catch (error) {
      showNotification(
        NotificationType.Error,
        '참가 신청 팀목록 불러오기 실패',
        '참가 신청 팀목록 불러오기에 실패했습니다.'
      )
    }
  }

  useEffect(() => {
    const init = async () => {
      await getAssociations()
      await getLeaguesByAssociationId(selectedAssociationId)
      await getJoinLeagueRequest(selectedLeagueId)
    }
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const associationName =
    association.length > 0 ? association[0].name : 'Default Name'

  const leagueName = league.length > 0 ? league[0].name : 'Default Name'

  const selectedAssociation = (selectedName: string) => {
    const selectedAssoc = association.find(
      (assoc) => assoc.name === selectedName
    )
    if (selectedAssoc) {
      console.log('Selected Association ID:', selectedAssoc.id)
      setSelectedAssociationId(selectedAssoc.id)
      getLeaguesByAssociationId(selectedAssoc.id)
    }
  }

  const selectedLeague = (selectedName: string) => {
    const selectedLeague = league.find((res) => res.name === selectedName)
    if (selectedLeague) {
      setSelectecLeagueId(selectedLeague.id)
      getJoinLeagueRequest(selectedLeague.id)
    }
  }

  const approveRequest = async (leagueId: number, teamId: number) => {
    try {
      await axiosInstance.post(
        `/admin/leagues/${leagueId}/teams/${teamId}/approve`
      )
      showNotification(
        NotificationType.Success,
        '참가 신청 승인 성공',
        '참가 신청 승인에 성공하였습니다.'
      )
    } catch (error) {
      showNotification(
        NotificationType.Error,
        '참가 신청 승인 실패',
        '참가 신청 승인에 실패하였습니다.'
      )
    }
  }

  const rejectRequest = async (reason: string, type: string) => {
    console.log(reason, type)

    if (selectedTeamId && reason && type) {
      console.log(selectedTeamId, reason, type)
      try {
        await axiosInstance.put(
          `/admin/leagues/${selectedLeagueId}/teams/${selectedTeamId}/join`,
          {
            type: type,
            reason: reason
          }
        )
        closeRejectModal()
        getJoinLeagueRequest(selectedLeagueId)
        showNotification(
          NotificationType.Warning,
          '참가 신청 거절 완료',
          '참가 신청을 거절하였습니다.'
        )
      } catch (error) {
        showNotification(
          NotificationType.Error,
          '참가 신청 거절 실패',
          '참가 신청 거절에 실패하였습니다.'
        )
      }
    }
  }

  const goToRequestDetail = async (teamId: number, leagueId: number) => {
    navigate(`/console/apply-detail?league=${leagueId}&team=${teamId}`)
  }

  const leagueRequestColumns = [
    {
      title: '팀명',
      render: (request: ExtendedRequest) => (
        <div
          className="flex cursor-pointer items-center"
          onClick={() => goToRequestDetail(request.teamId, request.leagueId)}
        >
          <div>
            {request.teamInfo.profileImgUrl ? (
              <img
                src={request.teamInfo.profileImgUrl}
                alt={request.teamInfo.name}
                className="w-10"
              />
            ) : (
              <img src="/logo/KAFA_OG.png" alt="" className="w-10" />
            )}
          </div>
          <div className="ml-2 cursor-pointer text-blue-500 underline">
            {request.teamInfo.name}
          </div>
        </div>
      )
    },
    {
      title: '순위',
      render: (request: ExtendedRequest) => <div>{request.rank}</div>
    },
    {
      title: '상태',
      render: (request: ExtendedRequest) => <div>{request.applyStatus}</div>
    },
    {
      title: '거절 사유',
      render: (request: ExtendedRequest) => <div>{request.reason}</div>
    },
    {
      title: '처리',
      render: (request: ExtendedRequest) => (
        <div>
          <Button
            label="승인"
            variant="roundLg"
            onClick={() => approveRequest(request.leagueId, request.teamId)}
          />
          <Button
            label="거절"
            variant="roundLg"
            onClick={() => openRejectModal(request.teamId)}
          />
        </div>
      )
    }
  ]

  return (
    <div className="m-5">
      <div className="mb-5 flex">
        <div className="mr-5">
          <DropdownLeft
            optionName={associationName}
            optionList={association}
            onSelect={(selected) => selectedAssociation(selected)}
          />
        </div>
        <div>
          {league.length > 0 && (
            <DropdownLeft
              optionName={leagueName}
              optionList={league}
              onSelect={(selected) => selectedLeague(selected)}
            />
          )}
        </div>
      </div>
      <DefaultTable
        title={'리그 참가 신청 팀목록'}
        data={joinRequest}
        columns={leagueRequestColumns}
      />

      <RejectModalWithInputAndDropbox
        isOpen={isRejectModalOpen}
        onClose={closeRejectModal}
        onSubmit={rejectRequest}
        options={applyStatusOptions}
      />
    </div>
  )
}

export default ManageApply
