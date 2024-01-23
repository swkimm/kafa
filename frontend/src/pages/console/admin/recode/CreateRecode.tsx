import axiosInstance from '@/commons/axios'
import type { GetLeagues } from '@/commons/interfaces/league/getLeagues'
import DefaultTable from '@/components/tables/DefaultTable'
import useNotification from '@/hooks/useNotification'
import { NotificationType } from '@/state/notificationState'
import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface ExtendedGetLeagues extends GetLeagues {
  associationName: string
}

const CreateRecode = () => {
  const [leagues, setLeagues] = useState<ExtendedGetLeagues[]>([])
  const { showNotification } = useNotification()
  const navigate = useNavigate()

  const fetchAssociationName = useCallback(async (associationId: number) => {
    try {
      const response = await axiosInstance.get(`/associations/${associationId}`)
      return response.data
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return { name: 'N/A' } // 기본값 반환
      }
      throw error // 다른 종류의 오류는 계속해서 throw
    }
  }, [])

  const getLeagues = useCallback(async () => {
    const page = 1
    const limit = 1000

    try {
      const response = await axiosInstance.get<GetLeagues[]>(
        `/leagues?page=${page}&limit=${limit}`
      )
      const getLeaguesWithAssociationName = await Promise.all(
        response.data.map(async (get) => {
          const associationResponse = get.id
            ? await fetchAssociationName(get.id)
            : { name: 'N/A' }
          return {
            ...get,
            associationName: associationResponse.name
          }
        })
      )
      setLeagues(getLeaguesWithAssociationName as ExtendedGetLeagues[])
    } catch (error) {
      showNotification(
        NotificationType.Error,
        '리그 목록 불러오기 실패',
        '리그 목록 불러오기에 실패했습니다.',
        2500
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchAssociationName])

  useEffect(() => {
    getLeagues()
  }, [getLeagues])

  const goToLeague = (leagueId: number) => {
    navigate(`/console/createRecode/leagues/${leagueId}`)
  }

  const leaguesColumns = [
    {
      title: '리그명',
      render: (league: ExtendedGetLeagues) => (
        <div
          className="cursor-pointer text-blue-500"
          onClick={() => goToLeague(league.id)}
        >
          {league.name}
        </div>
      )
    },
    {
      title: '협회명',
      render: (league: ExtendedGetLeagues) => (
        <div>{league.associationName}</div>
      )
    },
    {
      title: '연도',
      render: (league: ExtendedGetLeagues) => <div>{league.startedYear}</div>
    }
  ]

  return (
    <div className="m-5">
      <div className="text-md mb-5 font-bold">기록 입력</div>

      <DefaultTable title={''} data={leagues} columns={leaguesColumns} />
    </div>
  )
}

export default CreateRecode
