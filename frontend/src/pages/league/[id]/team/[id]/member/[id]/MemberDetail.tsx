// MemberDetail.tsx
import axiosInstance from '@/commons/axios'
import type { Roster } from '@/commons/interfaces/roster/roster'
import MemberBanner from '@/components/cards/MemberBanner'
import DropdownLeft from '@/components/dropdown/DropdownLeft'
import DefaultTable from '@/components/tables/DefaultTable'
import WithSubtitleTable from '@/components/tables/WithSubtitleTable'
import useNotification from '@/hooks/useNotification'
import { NotificationType } from '@/state/notificationState'
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const people = [
  {
    id: 1,
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member'
  },
  {
    id: 2,
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member'
  },
  {
    id: 3,
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member'
  }
]

const options = [
  { id: '1', name: 'Account settings' },
  { id: '2', name: 'Support' },
  { id: '3', name: 'License' },
  { id: '4', name: 'Sign out' }
]

const MemberDetail = () => {
  const { memberId } = useParams()
  const [member, setMember] = useState<Roster | undefined>(undefined)
  const { showNotification } = useNotification()

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
    getMember()
  }, [getMember])

  const positionString = [
    member?.Athlete?.position?.defense,
    member?.Athlete?.position?.offence,
    member?.Athlete?.position?.special
  ]
    .filter(Boolean)
    .join('/')

  const getPersonalRecords = useCallback(async () => {
    try {
      await axiosInstance.get(`/records/rosters/${memberId}`)
    } catch (error) {
      showNotification(
        NotificationType.Error,
        '기록 불러오기 실패',
        '기록을 불러올 수 없습니다.',
        2500
      )
    }
  }, [memberId, showNotification])

  useEffect(() => {
    getPersonalRecords()
  }, [getPersonalRecords])

  const handleSelect = (selected: string) => {
    console.log('Selected option:', selected)
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
        {member?.name} PERSONAL STATS
      </div>
      <div className="container mx-auto my-5 grid grid-cols-1 sm:grid-cols-3">
        <div className="order-2 col-span-1 mx-5 sm:order-1 sm:col-span-2">
          <div className="mb-5">
            <DefaultTable title={''} data={[]} columns={[]} />

            <WithSubtitleTable
              title={'게임별 기록'}
              subtitle="TBD"
              data={people}
            />
          </div>
          <div>
            <WithSubtitleTable
              title={'리그 통산'}
              subtitle="TBD"
              data={people}
            />
          </div>
        </div>
        <div className="order-1 col-span-1 sm:order-2">
          <div className="mb-5 ml-5">
            <DropdownLeft
              optionName="My Options"
              optionList={options}
              onSelect={handleSelect}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MemberDetail
