import axiosInstance from '@/commons/axios'
import type { RegisterTeamRequest } from '@/commons/interfaces/team/team-request'
import ConsoleCard from '@/components/cards/ConsoleCard'
import { useEffect, useState } from 'react'
import { CreateTeamForm } from './CreateTeamForm'
import { CreatTeamList } from './CreateTeamList'

const CreateTeam: React.FC = () => {
  const [requests, setRequests] = useState<RegisterTeamRequest[]>([])

  const onTeamRequestCreated = (newRequest: RegisterTeamRequest) => {
    newRequest.createdAt = new Date(newRequest.createdAt)
    setRequests([...requests, newRequest])
  }

  useEffect(() => {
    const getTeamRequests = async () => {
      await axiosInstance.get('/teams/requests').then((result) => {
        ;(result.data as RegisterTeamRequest[]).forEach(
          (request) => (request.createdAt = new Date(request.createdAt))
        )
        setRequests(result.data)
      })
    }

    getTeamRequests()
  }, [])

  return (
    <div className="m-0 h-full w-full sm:p-5">
      <div className="text-md mb-5 px-4 pt-5 font-bold sm:px-0 sm:pt-0">
        인증 관리
      </div>
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-4 lg:col-span-2">
          <ConsoleCard title="팀 생성" subtitle="새로운 팀을 생성합니다">
            <CreateTeamForm onCreate={onTeamRequestCreated} />
          </ConsoleCard>
        </div>
        <div className="col-span-4 lg:col-span-2">
          <ConsoleCard title="생성 요청 목록" subtitle="팀 생성 요청 목록">
            <CreatTeamList requests={requests} />
          </ConsoleCard>
        </div>
      </div>
    </div>
  )
}

export default CreateTeam
