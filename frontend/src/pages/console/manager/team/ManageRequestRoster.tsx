import axiosInstance from '@/commons/axios'
import type { Roster } from '@/commons/interfaces/roster/roster'
import DefaultTable from '@/components/tables/DefaultTable'
import { useEffect, useState } from 'react'

const ManageRequestRoster = () => {
  const [roster, setRoster] = useState<Roster[]>([])

  const getRosterRequests = async () => {
    try {
      const response = await axiosInstance.get<Roster[]>(`/rosters/requests`)
      console.log(response.data)
      setRoster(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getRosterRequests()
  }, [])

  const approveRosterRequest = async (id: number) => {
    try {
      const response = await axiosInstance.post(`/rosters/${id}/approve`)
      console.log(response.data)
      getRosterRequests()
    } catch (error) {
      console.log(error)
    }
  }

  const rejectRosterRequest = async (id: number) => {
    try {
      const response = await axiosInstance.post(`/rosters/${id}/reject`)
      console.log(response.data)
      getRosterRequests()
    } catch (error) {
      console.log(error)
    }
  }

  const rosterColumns = [
    {
      title: '구분',
      render: (roster: Roster) => <span>{roster.rosterType}</span>
    },
    {
      title: '프로필',
      render: (roster: Roster) => (
        <div>
          {roster.profileImgUrl ? (
            <img
              className="h-10 w-10"
              src={roster.profileImgUrl}
              alt={roster.name}
            />
          ) : (
            <img className="h-10 w-10" src="/logo/KAFA_OG.png" alt="" />
          )}
        </div>
      )
    },
    {
      title: '이름',
      render: (roster: Roster) => <span>{roster.name}</span>
    },
    {
      title: '승인',
      render: (roster: Roster) => (
        <button
          type="button"
          onClick={() => approveRosterRequest(roster.id)}
          className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          승인
        </button>
      )
    },
    {
      title: '반려',
      render: (roster: Roster) => (
        <button
          type="button"
          onClick={() => rejectRosterRequest(roster.id)}
          className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          반려
        </button>
      )
    }
  ]

  return (
    <div className="m-5">
      <div className="text-md mb-5 font-bold">로스터 관리</div>
      <DefaultTable title={'연결 요청'} data={roster} columns={rosterColumns} />
    </div>
  )
}

export default ManageRequestRoster
