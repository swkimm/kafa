// MemberDetail.tsx
import axiosInstance from '@/commons/axios'
import type { Record } from '@/commons/interfaces/record/record'
import type { Roster } from '@/commons/interfaces/roster/roster'
import MemberBanner from '@/components/cards/MemberBanner'
import DropdownLeft from '@/components/dropdown/DropdownLeft'
import DefaultTable from '@/components/tables/DefaultTable'
import useNotification from '@/hooks/useNotification'
import { NotificationType } from '@/state/notificationState'
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

interface GameName {
  id: number
  name: string
}

const MemberDetail = () => {
  const { memberId, leagueId, teamId } = useParams()
  const [member, setMember] = useState<Roster>()
  const { showNotification } = useNotification()
  const [records, setRecords] = useState<Record[]>([])
  const [gameName, setGameName] = useState<GameName[]>([])
  const [selectedGameId, setSelectedGameId] = useState<number>()

  const getMember = useCallback(async () => {
    if (memberId) {
      try {
        const response = await axiosInstance.get(`/rosters/${memberId}`)
        setMember(response.data)
      } catch (error) {
        showNotification(
          NotificationType.Error,
          '멤버 불러오기 실패',
          '멤버를 불러올 수 없습니다.',
          2500
        )
      }
    }
  }, [memberId, setMember, showNotification])

  useEffect(() => {
    if (!memberId || !leagueId || !teamId) {
      showNotification(
        NotificationType.Error,
        '데이터 로딩 실패',
        '유효하지 않은 파라미터입니다.'
      )
      return
    }

    const loadData = async () => {
      await getMember()
      await getGameName()
    }

    loadData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const positionString = [
    member?.Athlete?.position?.defense,
    member?.Athlete?.position?.offence,
    member?.Athlete?.position?.special
  ]
    .filter(Boolean)
    .join('/')

  const getGameName = async () => {
    try {
      const response = await axiosInstance.get(
        `/games/leagues/${leagueId}/teams/${teamId}`
      )
      setGameName(response.data)
    } catch (error) {
      showNotification(
        NotificationType.Error,
        '게임 목록 불러오기 실패',
        '게임 목록 불러오는데 실패했습니다.',
        2500
      )
    }
  }

  const getPersonalRecords = async (gameId: number) => {
    try {
      const response = await axiosInstance.get(`/records/rosters/${memberId}`)
      const filteredRecords = response.data.filter(
        (record: Record) => gameId === null || record.Game.id === gameId
      )
      const filteredByMemberIdRecords = filteredRecords.filter(
        (record: Record) => record.Athlete.Roster.id === member?.id
      )
      setRecords(filteredByMemberIdRecords)
    } catch (error) {
      showNotification(
        NotificationType.Error,
        '기록 불러오기 실패',
        '기록을 불러올 수 없습니다.',
        2500
      )
    }
  }

  useEffect(() => {
    if (gameName.length > 0) {
      const firstGameId = gameName[0].id
      setSelectedGameId(firstGameId)
    }
  }, [gameName])

  useEffect(() => {
    if (selectedGameId !== undefined) {
      getPersonalRecords(selectedGameId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGameId])

  const personalRecordColumns = [
    {
      title: 'Unit',
      render: (stats: Record) => <div>{stats.unit}</div>
    },
    {
      title: 'Score',
      render: (stats: Record) => <div>{stats.score}</div>
    },
    {
      title: 'Type',
      render: (stats: Record) => <div>{stats.type}</div>
    },
    {
      title: 'Athlete',
      render: (stats: Record) => (
        <div className="flex items-center">
          <div>
            {stats.Athlete.Roster.profileImgUrl ? (
              <img
                src={stats.Athlete.Roster.profileImgUrl}
                alt={stats.Athlete.Roster.name}
              />
            ) : (
              <img src="/logo/KAFA_OG.png" alt="" className="w-8" />
            )}
          </div>
          <div>{stats.Athlete.Roster.name}</div>
        </div>
      )
    }
  ]

  const handleSelect = (selectedName: string) => {
    const selectedGame = gameName.find((game) => game.name === selectedName)

    if (selectedGame && selectedGame.id !== undefined) {
      const gameId = selectedGame.id

      setSelectedGameId(gameId)
      getPersonalRecords(gameId)
    } else {
      // 에러 처리
      showNotification(
        NotificationType.Error,
        '잘못된 선택',
        '유효하지 않은 게임 ID입니다.',
        2500
      )
    }
  }

  return (
    <div className="">
      <MemberBanner
        teamLogo={member?.Team?.profileImgUrl || '/logo/KAFA_OG.png'}
        teamName={member?.Team?.name || '팀 이름'}
        name={member?.name || '이름'}
        profile={member?.profileImgUrl || '/logo/KAFA_OG.png'}
        height={member?.Athlete?.height || 0}
        weight={member?.Athlete?.weight || 0}
        backNumber={member?.Athlete?.backNumber || 0}
        position={positionString}
      />

      <div className="bg-indigo-800 p-6 text-xl text-white">
        {`${member?.name}'s PERSONAL STATS`}
      </div>

      <div className="container mx-auto my-5 grid grid-cols-1 sm:grid-cols-3">
        <div className="order-2 col-span-1 mx-5 sm:order-1 sm:col-span-2">
          <div className="mb-5">
            <DefaultTable
              title={'개인 기록'}
              data={records}
              columns={personalRecordColumns}
            />
          </div>
        </div>
        <div className="order-1 col-span-1 sm:order-2">
          <div className="mb-5 ml-5">
            {gameName.length > 0 && selectedGameId && (
              <DropdownLeft
                optionName={gameName[0].name}
                optionList={gameName}
                onSelect={(selectedGameId) => handleSelect(selectedGameId)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MemberDetail
