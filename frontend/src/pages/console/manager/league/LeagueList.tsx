import axiosInstance from '@/commons/axios'
import Button from '@/components/buttons/Button'
import DefaultTable from '@/components/tables/DefaultTable'
import { useEffect, useState } from 'react'

interface JoinableLeague {
  id: number
  name: string
  startedAt: Date
  endedAt: Date
  Association: {
    id: number
    name: string
    profileImgUrl?: string
  }
}

const LeagueList = () => {
  const [joinableLeague, setJoinalbleLeague] = useState<JoinableLeague[]>([])

  const getJoinableLeague = async () => {
    try {
      const response = await axiosInstance.get(`/leagues/joinable`)
      console.log(response.data)
      setJoinalbleLeague(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getJoinableLeague()
  }, [])

  const requestJoinLeague = async (leagueId: number) => {
    try {
      const validationResponse = await axiosInstance.get(
        '/leagues/rosters/validation'
      )
      console.log('Validation Status:', validationResponse.data.valid)
      if (validationResponse.data.valid) {
        try {
          const joinResponse = await axiosInstance.post(
            `/leagues/${leagueId}/join`
          )
          console.log(joinResponse)
          window.alert('리그 신청이 완료되었습니다.')
        } catch (joinError) {
          window.alert('리그 참가 신청 중 오류가 발생했습니다.')
        }
      } else {
        window.alert('로스터 인증서 검증이 필요합니다.')
      }
    } catch (validationError) {
      console.error('Validation Error:', validationError)
      window.alert('리그 신청 검증 중 오류가 발생했습니다.')
    }
  }

  const joinableLeagueColumns = [
    {
      title: '협회',
      render: (join: JoinableLeague) => (
        <div className="flex items-center">
          {join.Association.profileImgUrl ? (
            <div>
              <img
                src={join.Association.profileImgUrl}
                alt={join.Association.name}
              />
            </div>
          ) : (
            <div className="flex">
              <img src="/logo/KAFA_OG.png" alt="" className="w-10" />
            </div>
          )}
          <div className="items-center justify-center">
            {join.Association.name}
          </div>
        </div>
      )
    },
    {
      title: '리그명',
      render: (join: JoinableLeague) => (
        <div className="items-center justify-center">{join.name}</div>
      )
    },
    {
      title: '일정',
      render: (join: JoinableLeague) => {
        const startDate = new Date(join.startedAt)
        const endDate = new Date(join.endedAt)

        const formattedStartDate = startDate.toISOString().split('T')[0]
        const formattedEndDate = endDate.toISOString().split('T')[0]

        return <div>{`${formattedStartDate} ~ ${formattedEndDate}`}</div>
      }
    },
    {
      title: '참가 신청',
      render: (join: JoinableLeague) => (
        <Button
          label="참가 신청"
          variant="roundLg"
          onClick={() => requestJoinLeague(join.id)}
        />
      )
    }
  ]

  return (
    <div className="m-5">
      {joinableLeague ? (
        <DefaultTable
          title={'참가 가능 리그 목록'}
          data={joinableLeague}
          columns={joinableLeagueColumns}
        />
      ) : (
        <p>참가 가능한 리그가 없습니다.</p>
      )}
    </div>
  )
}

export default LeagueList
