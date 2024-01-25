// StatsItem.tsx
import DefaultTable from '@/components/tables/DefaultTable'

interface Rank {
  id: number
  rank: number
  name?: string
  teamLogo: string
  team: string
  passingYards?: number
  rushingYards?: number
  scoringOffense?: number
  scoringDefense?: number
}

const rushingStats: Rank[] = [
  {
    id: 1,
    rank: 1,
    name: 'Ollie Gordon',
    teamLogo: '/logo/KAFA_OG.png',
    team: 'Oklahoma St.',
    rushingYards: 1250
  },
  {
    id: 2,
    rank: 2,
    name: 'Omarion Hampton',
    teamLogo: '/logo/KAFA_OG.png',
    team: 'North Carolina',
    rushingYards: 1236
  },
  {
    id: 3,
    rank: 3,
    name: 'Marcus Carroll',
    teamLogo: '/logo/KAFA_OG.png',
    team: 'Georgia St.',
    rushingYards: 1206
  },
  {
    id: 4,
    rank: 4,
    name: '	Kimani Vidal',
    teamLogo: '/logo/KAFA_OG.png',
    team: 'Troy',
    rushingYards: 1168
  },
  {
    id: 5,
    rank: 5,
    name: 'Tahj Brooks',
    teamLogo: '/logo/KAFA_OG.png',
    team: 'Texas Tech',
    rushingYards: 1166
  }
]

const rushingColumns = [
  {
    title: 'RANK',
    render: (item: Rank) => <span>{item.rank}</span>
  },
  {
    title: 'NAME',
    render: (item: Rank) => <span>{item.name}</span>
  },
  {
    title: 'TEAM',
    render: (item: Rank) => (
      <div className="flex items-center">
        <img src={item.teamLogo} alt={item.team} className="mr-2 h-6 w-6" />
        <span>{item.team}</span>
      </div>
    )
  },
  {
    title: 'RUSH YDS',
    render: (item: Rank) => <span>{item.rushingYards}</span>
  }
]

const passingStats: Rank[] = [
  {
    id: 1,
    rank: 1,
    name: 'Michael Penix jr',
    teamLogo: '/logo/KAFA_OG.png',
    team: 'Washington',
    passingYards: 3533
  },
  {
    id: 2,
    rank: 2,
    name: 'Caleb Williams',
    teamLogo: '/logo/KAFA_OG.png',
    team: 'Southern California',
    passingYards: 3249
  },
  {
    id: 3,
    rank: 3,
    name: 'Jayden Daniels',
    teamLogo: '/logo/KAFA_OG.png',
    team: 'LSU',
    passingYards: 3164
  },
  {
    id: 4,
    rank: 4,
    name: 'Drake Maye',
    teamLogo: '/logo/KAFA_OG.png',
    team: 'North Carolina',
    passingYards: 3145
  },
  {
    id: 5,
    rank: 5,
    name: 'Shedeur Sanders',
    teamLogo: '/logo/KAFA_OG.png',
    team: 'Colorado',
    passingYards: 3144
  }
]

const passingColumns = [
  {
    title: 'RANK',
    render: (item: Rank) => <span>{item.rank}</span>
  },
  {
    title: 'NAME',
    render: (item: Rank) => <span>{item.name}</span>
  },
  {
    title: 'TEAM',
    render: (item: Rank) => (
      <div className="flex items-center">
        <img src={item.teamLogo} alt={item.team} className="mr-2 h-6 w-6" />
        <span>{item.team}</span>
      </div>
    )
  },
  {
    title: 'PASS YDS',
    render: (item: Rank) => <span>{item.passingYards}</span>
  }
]

const scoringOffenseStats: Rank[] = [
  {
    id: 1,
    rank: 1,
    teamLogo: '/logo/KAFA_OG.png',
    team: 'Oregon',
    scoringOffense: 46.3
  },
  {
    id: 2,
    rank: 2,
    teamLogo: '/logo/KAFA_OG.png',
    team: 'LSU',
    scoringOffense: 45.9
  },
  {
    id: 3,
    rank: 3,
    teamLogo: '/logo/KAFA_OG.png',
    team: 'Southern California',
    scoringOffense: 43.8
  },
  {
    id: 4,
    rank: 4,
    teamLogo: '/logo/KAFA_OG.png',
    team: 'Oklahoma',
    scoringOffense: 41.8
  },
  {
    id: 5,
    rank: 5,
    teamLogo: '/logo/KAFA_OG.png',
    team: 'Washington',
    scoringOffense: 41.0
  }
]

const scoringOffenseColumns = [
  {
    title: 'RANK',
    render: (item: Rank) => <span>{item.rank}</span>
  },
  {
    title: 'TEAM',
    render: (item: Rank) => (
      <div className="flex items-center">
        <img src={item.teamLogo} alt={item.team} className="mr-2 h-6 w-6" />
        <span>{item.team}</span>
      </div>
    )
  },
  {
    title: 'PPG',
    render: (item: Rank) => <span>{item.scoringOffense}</span>
  }
]

const scoringDefenseStats: Rank[] = [
  {
    id: 1,
    rank: 1,
    teamLogo: '/logo/KAFA_OG.png',
    team: 'Michigan',
    scoringDefense: 7.5
  },
  {
    id: 2,
    rank: 2,
    teamLogo: '/logo/KAFA_OG.png',
    team: 'Ohio St.',
    scoringDefense: 9.9
  },
  {
    id: 3,
    rank: 3,
    teamLogo: '/logo/KAFA_OG.png',
    team: 'Iowa',
    scoringDefense: 12.3
  },
  {
    id: 4,
    rank: 4,
    teamLogo: '/logo/KAFA_OG.png',
    team: 'Penn St.',
    scoringDefense: 13.1
  },
  {
    id: 5,
    rank: 5,
    teamLogo: '/logo/KAFA_OG.png',
    team: 'Ohio',
    scoringDefense: 15.1
  }
]

const scoringDefenseColumns = [
  {
    title: 'RANK',
    render: (item: Rank) => <span>{item.rank}</span>
  },
  {
    title: 'TEAM',
    render: (item: Rank) => (
      <div className="flex items-center">
        <img src={item.teamLogo} alt={item.team} className="mr-2 h-6 w-6" />
        <span>{item.team}</span>
      </div>
    )
  },
  {
    title: 'PPG',
    render: (item: Rank) => <span>{item.scoringDefense}</span>
  }
]

const StatsItem = () => {
  return (
    <div className="mx-auto my-5 w-full max-w-screen-xl px-4 lg:px-20">
      <div className="mx-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <DefaultTable<Rank>
            title="PASSING STATS"
            data={passingStats}
            columns={passingColumns}
          />
        </div>
        <div>
          <DefaultTable<Rank>
            title="RUSHING STATS"
            data={rushingStats}
            columns={rushingColumns}
          />
        </div>
        <div>
          <DefaultTable<Rank>
            title="SCORING OFFENSE"
            data={scoringOffenseStats}
            columns={scoringOffenseColumns}
          />
        </div>
        <div>
          <DefaultTable<Rank>
            title="SCORING OFFENSE"
            data={scoringDefenseStats}
            columns={scoringDefenseColumns}
          />
        </div>
      </div>
    </div>
  )
}

export default StatsItem
