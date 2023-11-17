import DefaultTable from '@/components/tables/DefaultTable'

interface Game {
  id: number
  homeTeam: string
  homeTeamLogo: string
  awayTeam: string
  awayTeamLogo: string
  homeScore: number
  awayScore: number
  date: string
  location: string
}

const upComingGame: Game[] = [
  {
    id: 1,
    homeTeam: 'ROYALS',
    homeTeamLogo: '/logo/KAFA_OG.png',
    homeScore: 20,
    awayTeam: 'EAGLES',
    awayTeamLogo: '/logo/KAFA_OG.png',
    awayScore: 7,
    date: '09/02 AM 10:00',
    location: '홈 스타디움'
  },
  {
    id: 2,
    homeTeam: 'GREEN TERRORS',
    homeTeamLogo: '/logo/KAFA_OG.png',
    homeScore: 42,
    awayTeam: 'LIONS',
    awayTeamLogo: '/logo/KAFA_OG.png',
    awayScore: 20,
    date: '09/02 PM 1:00',
    location: '홈 스타디움'
  },
  {
    id: 3,
    homeTeam: 'ROYALS',
    homeTeamLogo: '/logo/KAFA_OG.png',
    homeScore: 20,
    awayTeam: 'EAGLES',
    awayTeamLogo: '/logo/KAFA_OG.png',
    awayScore: 7,
    date: '09/02 AM 10:00',
    location: '홈 스타디움'
  },
  {
    id: 4,
    homeTeam: 'GREEN TERRORS',
    homeTeamLogo: '/logo/KAFA_OG.png',
    homeScore: 42,
    awayTeam: 'LIONS',
    awayTeamLogo: '/logo/KAFA_OG.png',
    awayScore: 20,
    date: '09/02 PM 1:00',
    location: '홈 스타디움'
  }
]

const LeagueHomeItem = () => {
  const upcomingGamesColumns = [
    {
      title: 'HOME',
      render: (upComingGame: Game) => (
        <div className="flex items-center">
          <img
            src={upComingGame.homeTeamLogo}
            alt={upComingGame.homeTeam}
            className="mr-2 w-8"
          />
          <span>{upComingGame.homeTeam}</span>
        </div>
      )
    },
    {
      title: '',
      render: (upComingGame: Game) => <span>{upComingGame.homeScore}</span>
    },
    {
      title: 'AWAY',
      render: (upComingGame: Game) => (
        <div className="flex items-center">
          <img
            src={upComingGame.awayTeamLogo}
            alt={upComingGame.awayTeam}
            className="mr-2 w-8"
          />
          <span>{upComingGame.awayTeam}</span>
        </div>
      )
    },
    {
      title: '',
      render: (upComingGame: Game) => <span>{upComingGame.awayScore}</span>
    },
    {
      title: 'DATE',
      render: (upComingGame: Game) => (
        <div>
          <span>{upComingGame.date}</span>
        </div>
      )
    },
    {
      title: 'LOCATION',
      render: (upComingGame: Game) => (
        <div>
          <span>{upComingGame.location}</span>
        </div>
      )
    }
  ]

  return (
    <div className="container mx-auto my-5 grid max-w-screen-2xl grid-cols-1 px-5 sm:grid-cols-3">
      <div className="col-span-2">
        <div className="mb-5">
          <DefaultTable
            title="다가오는 경기일정"
            data={upComingGame}
            columns={upcomingGamesColumns}
          />
        </div>
        <div className="mb-5">
          <DefaultTable
            title="최근경기 결과"
            data={upComingGame}
            columns={upcomingGamesColumns}
          />
        </div>
      </div>
    </div>
  )
}

export default LeagueHomeItem
