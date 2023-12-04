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

interface Standing {
  id: number
  rank: number
  teamId: number
  teamLogo: string
  teamName: string
  win: number
  lose: number
  draw: number
}

const upComingGame: Game[] = [
  {
    id: 1,
    homeTeam: 'TBD',
    homeTeamLogo: '/logo/KAFA_OG.png',
    homeScore: 20,
    awayTeam: 'TBD',
    awayTeamLogo: '/logo/KAFA_OG.png',
    awayScore: 7,
    date: '09/02 AM 10:00',
    location: '홈 스타디움'
  },
  {
    id: 2,
    homeTeam: 'TBD',
    homeTeamLogo: '/logo/KAFA_OG.png',
    homeScore: 42,
    awayTeam: 'TBD',
    awayTeamLogo: '/logo/KAFA_OG.png',
    awayScore: 20,
    date: '09/02 PM 1:00',
    location: '홈 스타디움'
  },
  {
    id: 3,
    homeTeam: 'TBD',
    homeTeamLogo: '/logo/KAFA_OG.png',
    homeScore: 20,
    awayTeam: 'TBD',
    awayTeamLogo: '/logo/KAFA_OG.png',
    awayScore: 7,
    date: '09/02 AM 10:00',
    location: '홈 스타디움'
  },
  {
    id: 4,
    homeTeam: 'TBD',
    homeTeamLogo: '/logo/KAFA_OG.png',
    homeScore: 42,
    awayTeam: 'TBD',
    awayTeamLogo: '/logo/KAFA_OG.png',
    awayScore: 20,
    date: '09/02 PM 1:00',
    location: '홈 스타디움'
  }
]

const finalStanding: Standing[] = [
  {
    id: 1,
    rank: 1,
    teamId: 1,
    teamLogo: '/logo/KAFA_OG.png',
    teamName: 'TBD',
    win: 0,
    lose: 0,
    draw: 0
  },
  {
    id: 2,
    rank: 2,
    teamId: 2,
    teamLogo: '/logo/KAFA_OG.png',
    teamName: 'TBD',
    win: 0,
    lose: 0,
    draw: 0
  },
  {
    id: 3,
    rank: 3,
    teamId: 3,
    teamLogo: '/logo/KAFA_OG.png',
    teamName: 'TBD',
    win: 0,
    lose: 0,
    draw: 0
  },
  {
    id: 4,
    rank: 4,
    teamId: 4,
    teamLogo: '/logo/KAFA_OG.png',
    teamName: 'TBD',
    win: 0,
    lose: 0,
    draw: 0
  },
  {
    id: 5,
    rank: 5,
    teamId: 5,
    teamLogo: '/logo/KAFA_OG.png',
    teamName: 'TBD',
    win: 0,
    lose: 0,
    draw: 0
  },
  {
    id: 6,
    rank: 6,
    teamId: 6,
    teamLogo: '/logo/KAFA_OG.png',
    teamName: 'TBD',
    win: 0,
    lose: 0,
    draw: 0
  }
]

const LeagueHomeItem = () => {
  const finalStandingColumns = [
    {
      title: 'RANK',
      render: (finalStanding: Standing) => <span>{finalStanding.rank}</span>
    },
    {
      title: 'TEAM',
      render: (finalStanding: Standing) => (
        <div className="flex">
          <img src={finalStanding.teamLogo} alt="" className="mr-2 w-8" />
          {finalStanding.teamName}
        </div>
      )
    },
    {
      title: 'WIN',
      render: (finalStanding: Standing) => (
        <div className="">{finalStanding.win}</div>
      )
    },
    {
      title: 'LOSE',
      render: (finalStanding: Standing) => (
        <div className="">{finalStanding.lose}</div>
      )
    },
    {
      title: 'DRAW',
      render: (finalStanding: Standing) => (
        <div className="">{finalStanding.draw}</div>
      )
    }
  ]

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
            title="경기 결과"
            data={upComingGame}
            columns={upcomingGamesColumns}
          />
        </div>
        <div className="mb-5">
          <DefaultTable
            title="최종 순위"
            data={finalStanding}
            columns={finalStandingColumns}
          />
        </div>
      </div>
    </div>
  )
}

export default LeagueHomeItem
