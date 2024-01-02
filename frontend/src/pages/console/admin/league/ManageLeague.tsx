import axiosInstance from '@/commons/axios'
import type { Association } from '@/commons/interfaces/association/association'
import type { League } from '@/commons/interfaces/league/league'
import ModifyModal from '@/components/modal/ModifyLeagueModal'
import Alert from '@/components/notifications/Alert'
import MyNotification from '@/components/notifications/Notification'
import Pagination from '@/components/pagination/Pagination'
import DefaultTable from '@/components/tables/DefaultTable'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface LeagueWithAssociationName extends League {
  associationName?: string // 협회 이름을 추가
}

const ManageLeague = () => {
  const [leagues, setLeagues] = useState<League[] | null>(null)
  const [totalPages, setTotalPages] = useState<number | undefined>(undefined)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const limit = 10 // 한 페이지당 항목 수
  const [notification, setNotification] = useState({
    title: '',
    content: '',
    show: false
  })
  const [alert, setAlert] = useState({ title: '', content: '', show: false })
  const [showModifyModal, setShowModifyModal] = useState(false)
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null)
  const [associations, setAssociations] = useState<Association[]>([])
  const navigate = useNavigate()

  const showAlert = (
    type: 'notification' | 'alert',
    title: string,
    content: string
  ) => {
    const newState = { title, content, show: true }
    if (type === 'notification') {
      setNotification(newState)
      setTimeout(() => setNotification({ ...newState, show: false }), 3000)
    } else if (type === 'alert') {
      setAlert(newState)
      setTimeout(() => setAlert({ ...newState, show: false }), 3000)
    }
  }

  // 협회 목록을 가져오는 함수
  const getAssociations = useCallback(async () => {
    try {
      const response = await axiosInstance.get<Association[]>(
        '/associations?page=1&limit=100'
      )
      setAssociations(response.data)
    } catch (error) {
      console.error('협회 데이터 가져오기 오류:', error)
    }
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
      const loadedItems = response.data.length
      const isLastPage = loadedItems < limit
      setTotalPages(currentPage + (isLastPage ? 0 : 1))
    } catch (error) {
      showAlert('alert', '오류', '대회 리스트 가져오기 오류')
    }
  }, [currentPage, associations])

  useEffect(() => {
    getAssociations()
  }, [getAssociations])

  useEffect(() => {
    if (associations.length > 0) {
      getLeagues()
    }
  }, [associations, getLeagues])

  const deleteLeague = async (leagueId: number) => {
    try {
      await axiosInstance.delete(`/admin/leagues/${leagueId}`)
      getLeagues()
      showAlert('notification', '성공', '대회가 정상적으로 삭제되었습니다.')
    } catch (error) {
      showAlert('alert', '실패', '대회 삭제 실패')
    }
  }

  const modifyLeague = async (league: League) => {
    try {
      const updatedLeague = {
        ...league,
        startedAt: new Date(league.startedAt),
        endedAt: new Date(league.endedAt)
      }
      setSelectedLeague(updatedLeague)
      setShowModifyModal(true)
    } catch (error) {
      showAlert('alert', '실패', '대회 수정 준비 실패')
    }
  }

  const handleLeagueUpdate = (
    _updatedLeague: League | null,
    notificationInfo?: {
      type: 'notification' | 'alert'
      title: string
      content: string
    }
  ) => {
    setShowModifyModal(false) // 모달 닫기
    getLeagues() // League 리스트 업데이트

    const alertType =
      notificationInfo?.type === 'notification' ||
      notificationInfo?.type === 'alert'
        ? notificationInfo.type
        : 'notification'

    if (notificationInfo) {
      showAlert(alertType, notificationInfo.title, notificationInfo.content)
    }
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

  const goToCreateGames = (leagueId: number) => {
    navigate(`/console/league/${leagueId}/createGame`)
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
          onClick={() => goToCreateGames(league.id)}
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
    },
    {
      title: '수정',
      render: (league: League) => (
        <button
          type="button"
          onClick={() => modifyLeague(league)}
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
          onClick={() => deleteLeague(league.id)}
          className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          삭제
        </button>
      )
    }
  ]

  return (
    <div className="m-5">
      <div className="text-md mb-5 font-bold">대회관리</div>
      <div className="bg-white">
        {leagues && leagues.length > 0 ? (
          <DefaultTable
            title={'대회관리'}
            data={leagues}
            columns={leaguesColumns}
          />
        ) : (
          <p>No leagues available</p>
        )}
      </div>
      <div className="mt-5">
        {totalPages !== undefined && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
      {notification.show && (
        <MyNotification
          title={notification.title}
          content={notification.content}
        />
      )}
      {alert.show && <Alert title={alert.title} content={alert.content} />}
      {showModifyModal && selectedLeague && (
        <ModifyModal
          league={selectedLeague}
          onClose={handleLeagueUpdate} // onClose prop에 handleLeagueUpdate 함수 전달
        />
      )}
    </div>
  )
}

export default ManageLeague
