// RosterItem.tsx
import PlayerCard from '@/components/cards/PlayerCard'
import { useNavigate, useParams } from 'react-router-dom'

interface Member {
  id: number
  category: string
  profile: string
  name: string
  backNumber: number
  offPosition: string
  defPosition: string
  onClick?: (id: number) => void
}

const members: Member[] = []

for (let i = 1; i <= 20; i++) {
  members.push({
    id: i,
    category: '스테프',
    profile: 'https://cdn.playprove.one/default/people_alt.webp',
    name: `Member ${i}`,
    backNumber: i + 30,
    offPosition: 'Linebacker',
    defPosition: 'Linebacker'
  })
}

const RosterItem = () => {
  const params = useParams()
  const navigate = useNavigate()
  const goToMemberInfo = (memberId: number) => {
    navigate(
      `/league/${params.leagueId}/team/${params.teamId}/member/${memberId}`
    )
  }
  return (
    <div className="container mx-auto mb-10 grid grid-cols-4">
      {members.map((member) => (
        <div
          key={member.id}
          className="col-span-1 my-5"
          onClick={() => goToMemberInfo(member.id)}
        >
          <PlayerCard {...member} />
        </div>
      ))}
    </div>
  )
}

export default RosterItem
