import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import TeamCard from '../../../../components/cards/TeamCard'

const teamList = [
  {
    id: 1,
    teamLogo: '/logo/KAFA_OG.png',
    teamName: 'TBD',
    nickName: 'To Be Determined',
    teamColor: '#888888',
    createdAt: '2000'
  },
  {
    id: 2,
    teamLogo: '/logo/KAFA_OG.png',
    teamName: 'TBD',
    nickName: 'To Be Determined',
    teamColor: '#888888',
    createdAt: '2000'
  },
  {
    id: 3,
    teamLogo: '/logo/KAFA_OG.png',
    teamName: 'TBD',
    nickName: 'To Be Determined',
    teamColor: '#888888',
    createdAt: '2000'
  },
  {
    id: 4,
    teamLogo: '/logo/KAFA_OG.png',
    teamName: 'TBD',
    nickName: 'To Be Determined',
    teamColor: '#888888',
    createdAt: '2000'
  },
  {
    id: 5,
    teamLogo: '/logo/KAFA_OG.png',
    teamName: 'TBD',
    nickName: 'To Be Determined',
    teamColor: '#888888',
    createdAt: '2000'
  }
]

const PastLeagueTeamItem = () => {
  const { pastLeagueId } = useParams()
  console.log(pastLeagueId)

  const navigate = useNavigate()
  return (
    <div className="container mx-auto max-w-screen-2xl px-5">
      <div className="grid grid-cols-1 text-center sm:grid-cols-2">
        {teamList.map((team) => (
          <div className="my-5 flex justify-center" key={team.id}>
            <TeamCard
              {...team}
              isWhite={(teamColor: string) => teamColor === '#ffffff'}
              onClick={() => {
                navigate(`/pastLeague/${pastLeagueId}/team/${team.id}`)
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default PastLeagueTeamItem
