import axiosInstance from '@/commons/axios'
import { printPosition } from '@/commons/functions/position/position.print'
import { RosterType, type Roster } from '@/commons/interfaces/roster/roster'
import MemberBanner from '@/components/cards/MemberBanner'
import { useDate } from '@/hooks/useDate'
import useNotification from '@/hooks/useNotification'
import { NotificationType } from '@/state/notificationState'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const RosterDetail = () => {
  const { rosterId } = useParams()
  const [member, setMember] = useState<Roster>()
  const { showNotification } = useNotification()

  const { parseUTCDate, formatDate } = useDate()

  const navigate = useNavigate()

  useEffect(() => {
    const getRoster = async () => {
      if (rosterId) {
        try {
          const response = await axiosInstance.get<Roster>(
            `/rosters/${rosterId}`
          )

          if (response.data.rosterType !== RosterType.Athlete) {
            showNotification(
              NotificationType.Warning,
              '로스터 상세정보 조회 불가',
              '선수가 아닌 로스터의 경우 상세보기가 제공되지 않습니다',
              4000
            )
            navigate(`/teams/${response.data.Team?.id}`)
          } else {
            setMember(response.data)
          }
        } catch (error) {
          showNotification(
            NotificationType.Error,
            '멤버 불러오기 실패',
            '멤버를 불러올 수 없습니다.',
            2500
          )
        }
      }
    }

    getRoster()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rosterId])

  return (
    <div>
      {member && (
        <>
          <MemberBanner
            teamLogo={member.Team?.profileImgUrl || '/logo/KAFA_OG.png'}
            teamName={member.Team?.name || '팀 이름'}
            name={member.name || '이름'}
            profile={member.profileImgUrl || '/logo/KAFA_OG.png'}
            height={member.Athlete?.height || 0}
            weight={member.Athlete?.weight || 0}
            backNumber={member.Athlete?.backNumber || 0}
            position={printPosition(member.Athlete?.position)}
            registerYear={formatDate(parseUTCDate(member.registerYear), 'YYYY')}
          />
          <div className="bg-purple-950 py-6">
            <div className="mx-auto max-w-screen-xl px-4 lg:px-20">
              <h1 className="text-lg font-medium text-white">{`${member.name}'s PERSONAL STAT`}</h1>
            </div>
          </div>
          <div className="mx-auto max-w-screen-xl px-4 lg:px-20">
            <div className="min-h-96 py-10 text-center">
              <p className="text-lg font-medium">로스터 스탯 정보가 없습니다</p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default RosterDetail
