import axiosInstance from '@/commons/axios'
import type { Association } from '@/commons/interfaces/association/association'
import type { League } from '@/commons/interfaces/league/league'
import DefaultTable from '@/components/tables/DefaultTable'
import useNotification from '@/hooks/useNotification'
import { NotificationType } from '@/state/notificationState'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface LeagueWithAssociationName extends League {
  associationName?: string // 협회 이름을 추가
}

const ManageGame = () => {
  const [leagues, setLeagues] = useState<League[]>()
  const limit = 100 // 한 페이지당 항목 수
  const [associations, setAssociations] = useState<Association[]>([])
  const navigate = useNavigate()
  const { showNotification } = useNotification()

  // 협회 목록을 가져오는 함수
  const getAssociations = useCallback(async () => {
    try {
      const response = await axiosInstance.get<Association[]>(
        '/associations?page=1&limit=100'
      )
      setAssociations(response.data)
    } catch (error) {
      showNotification(
        NotificationType.Error,
        '협회 목록 불러오기 실패',
        '협회 목록 불러오기에 실패했습니다.'
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 리그 목록을 가져오는 함수 (협회 이름을 포함하여 업데이트)
  const getLeagues = useCallback(async () => {
    const page = 1
    try {
      const response = await axiosInstance.get(
        `/leagues?page=${page}&limit=${limit}`
      )
      const leaguesWithAssociationName: LeagueWithAssociationName[] =
        response.data.map((league: LeagueWithAssociationName) => {
          const association = associations.find(
            (a) => a.id === league.associationId
          )
          return {
            ...league,
            associationName: association?.name || '협회 없음'
          }
        })

      setLeagues(leaguesWithAssociationName)
    } catch (error) {
      showNotification(
        NotificationType.Error,
        '리그 목록 불러오기 실패',
        '리그 목록 불러오기에 실패했습니다.'
      )
    }
  }, [associations, showNotification])

  useEffect(() => {
    getAssociations()
  }, [getAssociations])

  useEffect(() => {
    if (associations.length > 0) {
      getLeagues()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [associations.length])

  const parseDate = (dateString: Date) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  const goToGameManage = (leagueId: number) => {
    // navigate(`/console/manage-game-detail?league=${leagueId}`)
    navigate(`/console/leagues/${leagueId}/game-detail`)
  }

  const leaguesColumns = [
    {
      title: '협회',
      render: (league: LeagueWithAssociationName) => (
        <span>{league.associationName}</span>
      )
    },
    {
      title: '대회명',
      render: (league: League) => (
        <div
          className="cursor-pointer text-blue-500 underline"
          onClick={() => goToGameManage(league.id)}
        >
          {league.name}
        </div>
      )
    },
    {
      title: '시작일자',
      render: (league: League) => <span>{parseDate(league.startedAt)}</span>
    },
    {
      title: '종료일자',
      render: (league: League) => <span>{parseDate(league.endedAt)}</span>
    }
  ]

  return (
    <div className="m-5">
      {leagues && leagues.length > 0 ? (
        <DefaultTable
          title={'리그 목록'}
          data={leagues}
          columns={leaguesColumns}
        />
      ) : (
        <p></p>
      )}
    </div>
  )
}

export default ManageGame
