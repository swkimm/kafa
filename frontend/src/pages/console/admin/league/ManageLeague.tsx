import axiosInstance from '@/commons/axios'
import type { Association } from '@/commons/interfaces/association/association'
import type { League } from '@/commons/interfaces/league/league'
import SimpleAlert from '@/components/notifications/SimpleAlert'
import Pagination from '@/components/pagination/Pagination'
import DefaultWithButtonTable from '@/components/tables/DefaultWithButtonTable'
import useNotification from '@/hooks/useNotification'
import { NotificationType } from '@/state/notificationState'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface LeagueWithAssociationName extends League {
  associationName?: string
}

const ManageLeague = () => {
  const [leagues, setLeagues] = useState<League[]>()
  const [totalPages, setTotalPages] = useState<number>()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const limit = 10 // 한 페이지당 항목 수
  const [associations, setAssociations] = useState<Association[]>([])
  const navigate = useNavigate()
  const { showNotification } = useNotification()
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [leagueToDelete, setLeagueToDelete] = useState<number | null>(null)

  const handleDeleteClick = (leagueId: number) => {
    setLeagueToDelete(leagueId)
    setIsAlertOpen(true)
  }

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
    try {
      const response = await axiosInstance.get(
        `/leagues?page=${currentPage}&limit=${limit}`
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
      const loadedItems = leaguesWithAssociationName.length
      let calculatedTotalPages = currentPage

      if (loadedItems === limit) {
        calculatedTotalPages = currentPage + 1
      } else if (loadedItems < limit) {
        calculatedTotalPages = currentPage
      }

      setTotalPages(calculatedTotalPages)
    } catch (error) {
      showNotification(
        NotificationType.Error,
        '리그 목록 불러오기 실패',
        '리그 목록 불러오기에 실패했습니다.'
      )
    }
  }, [currentPage, associations, showNotification])

  useEffect(() => {
    getAssociations()
  }, [getAssociations])

  useEffect(() => {
    if (associations.length > 0) {
      getLeagues()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [associations.length, currentPage])

  const confirmDeleteLeague = async (leagueId: number) => {
    try {
      await axiosInstance.delete(`/admin/leagues/${leagueId}`)
      showNotification(
        NotificationType.Success,
        '대회 삭제 성공',
        '대회 삭제에 성공했습니다.'
      )
      setIsAlertOpen(false)
      getLeagues()
    } catch (error) {
      showNotification(
        NotificationType.Error,
        '대회 삭제 실패',
        '대회 삭제에 실패했습니다.'
      )
    }
  }

  const goToModifyLeague = (league: League) => {
    navigate('/console/modify-league', { state: { league } })
  }

  const parseDate = (dateString: Date) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const goToCreateGames = () => {
    navigate(`/console/create-league`)
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
      render: (league: League) => <div>{league.name}</div>
    },
    {
      title: '시작일자',
      render: (league: League) => <span>{parseDate(league.startedAt)}</span>
    },
    {
      title: '종료일자',
      render: (league: League) => <span>{parseDate(league.endedAt)}</span>
    },
    {
      title: '수정',
      render: (league: League) => (
        <button
          type="button"
          onClick={() => goToModifyLeague(league)}
          className="rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          수정
        </button>
      )
    },
    {
      title: '삭제',
      render: (league: League) => (
        <button
          type="button"
          onClick={() => handleDeleteClick(league.id)}
          className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          삭제
        </button>
      )
    }
  ]

  return (
    <div className="m-5">
      {leagues && leagues.length > 0 ? (
        <DefaultWithButtonTable
          title={'리그 관리'}
          data={leagues}
          columns={leaguesColumns}
          addButtonTitle="리그 생성"
          onAddButtonClick={goToCreateGames}
        />
      ) : (
        <p></p>
      )}
      <div className="mt-5">
        {totalPages !== undefined && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {isAlertOpen && (
        <SimpleAlert
          open={isAlertOpen}
          onCancel={() => setIsAlertOpen(false)}
          onConfirm={() =>
            leagueToDelete !== null ? confirmDeleteLeague(leagueToDelete) : null
          }
        />
      )}
    </div>
  )
}

export default ManageLeague
