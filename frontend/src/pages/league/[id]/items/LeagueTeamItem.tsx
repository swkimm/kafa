import type { TeamSimple } from '@/commons/interfaces/teamSimple'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import TeamCard from '../../../../components/cards/TeamCard'

const teamList: TeamSimple[] = [
  {
    id: 1,
    name: 'TBD',
    globalName: 'TBD',
    initial: 'TBD',
    color: '#ffffff',
    profileImgUrl: '/logo/KAFA_OG.png'
  },
  {
    id: 2,
    name: 'TBD',
    globalName: 'TBD',
    initial: 'TBD',
    color: '#ffffff',
    profileImgUrl: '/logo/KAFA_OG.png'
  },
  {
    id: 3,
    name: 'TBD',
    globalName: 'TBD',
    initial: 'TBD',
    color: '#ffffff',
    profileImgUrl: '/logo/KAFA_OG.png'
  },
  {
    id: 4,
    name: 'TBD',
    globalName: 'TBD',
    initial: 'TBD',
    color: '#ffffff',
    profileImgUrl: '/logo/KAFA_OG.png'
  },
  {
    id: 5,
    name: 'TBD',
    globalName: 'TBD',
    initial: 'TBD',
    color: '#ffffff',
    profileImgUrl: '/logo/KAFA_OG.png'
  }
]

const TeamItem = () => {
  const { leagueId } = useParams()
  const navigate = useNavigate()
  return (
    <div className="container mx-auto max-w-screen-2xl px-5">
      <div className="grid grid-cols-1 text-center sm:grid-cols-2">
        {teamList.map((team) => (
          <div className="my-5 flex justify-center" key={team.id}>
            <TeamCard
              id={team.id}
              name={team.name}
              globalName={team.globalName}
              initial={team.initial}
              color={team.color}
              profileImgUrl={team.profileImgUrl}
              isWhite={(color: string) => color === '#ffffff'}
              onClick={() => {
                navigate(`/league/${leagueId}/team/${team.id}`)
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default TeamItem
