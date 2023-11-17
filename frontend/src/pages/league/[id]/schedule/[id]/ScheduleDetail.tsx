// ScheduleDetail.tsx
import Button from '@/components/buttons/Button'
import ScoreCard from '@/components/cards/ScoreCard'
import DefaultTable from '@/components/tables/DefaultTable'
import { useState } from 'react'

interface RushingStat {
  id: number
  name: string
  attempt: number
  yards: number
  touchdown: number
  long: number
}

interface PassingStat {
  id: number
  name: string
  completion: number
  attempt: number
  yards: number
  intercept: number
  touchdown: number
  long: number
}

interface ReceivingStat {
  id: number
  name: string
  receive: number
  yards: number
  touchdown: number
  long: number
}

interface DefenseStat {
  id: number
  name: string
  total: number
  solo: number
  sacks: number
  tackleForLoss: number
  intercept: number
  forcedFumble: number
  fumbleRecover: number
}

interface HomeStats {
  rushingStats: RushingStat[]
  passingStats: PassingStat[]
  receivingStats: ReceivingStat[]
  defenseStats: DefenseStat[]
}

interface AwayStats {
  rushingStats: RushingStat[]
  passingStats: PassingStat[]
  receivingStats: ReceivingStat[]
  defenseStats: DefenseStat[]
}

const homeTeamStats: HomeStats = {
  rushingStats: [
    {
      id: 1,
      name: 'Marion Lukes',
      attempt: 21,
      yards: 147,
      touchdown: 1,
      long: 17
    },
    {
      id: 2,
      name: 'Jase Bauer',
      attempt: 10,
      yards: 39,
      touchdown: 0,
      long: 27
    },
    {
      id: 3,
      name: 'jr.,bert Emanuel',
      attempt: 3,
      yards: 20,
      touchdown: 0,
      long: 9
    },
    {
      id: 4,
      name: 'Myles Bailey',
      attempt: 1,
      yards: 11,
      touchdown: 0,
      long: 11
    },
    {
      id: 5,
      name: 'Sam Hicks',
      attempt: 1,
      yards: -5,
      touchdown: 0,
      long: 0
    }
  ],
  passingStats: [
    {
      id: 1,
      name: 'Jase Bauer',
      completion: 14,
      attempt: 27,
      intercept: 1,
      yards: 205,
      touchdown: 3,
      long: 65
    }
  ],
  receivingStats: [
    {
      id: 1,
      name: 'Tyson Davis',
      receive: 3,
      yards: 86,
      touchdown: 1,
      long: 67
    },
    {
      id: 2,
      name: 'Chris Parker',
      receive: 2,
      yards: 37,
      touchdown: 0,
      long: 30
    },
    {
      id: 3,
      name: 'Langston Lewis',
      receive: 2,
      yards: 27,
      touchdown: 0,
      long: 22
    },
    {
      id: 4,
      name: 'Thomas Pannunzio',
      receive: 2,
      yards: 20,
      touchdown: 0,
      long: 13
    },
    {
      id: 5,
      name: 'Mitchel Collier',
      receive: 2,
      yards: 13,
      touchdown: 2,
      long: 10
    }
  ],
  defenseStats: [
    {
      id: 1,
      name: 'Jalen Mcgaughy',
      total: 1,
      solo: 1,
      sacks: 0,
      tackleForLoss: 0,
      intercept: 0,
      forcedFumble: 0,
      fumbleRecover: 0
    },
    {
      id: 2,
      name: 'Maurice White',
      total: 3,
      solo: 2,
      sacks: 0,
      tackleForLoss: 0,
      intercept: 0,
      forcedFumble: 0,
      fumbleRecover: 0
    },
    {
      id: 3,
      name: 'Nick Apsey',
      total: 2,
      solo: 0,
      sacks: 0,
      tackleForLoss: 0,
      intercept: 0,
      forcedFumble: 0,
      fumbleRecover: 0
    },
    {
      id: 4,
      name: 'Trey Jones',
      total: 6,
      solo: 3,
      sacks: 0,
      tackleForLoss: 0,
      intercept: 0,
      forcedFumble: 0,
      fumbleRecover: 0
    },
    {
      id: 5,
      name: 'Donte Kent',
      total: 4,
      solo: 3,
      sacks: 0,
      tackleForLoss: 0,
      intercept: 0,
      forcedFumble: 0,
      fumbleRecover: 0
    }
  ]
}

const homeRushingColumns = [
  {
    title: 'RUSHING',
    render: (rushingStat: RushingStat) => <span>{rushingStat.name}</span>
  },
  {
    title: 'ATT',
    render: (rushingStat: RushingStat) => <span>{rushingStat.attempt}</span>
  },
  {
    title: 'YDS',
    render: (rushingStat: RushingStat) => <span>{rushingStat.yards}</span>
  },
  {
    title: 'TD',
    render: (rushingStat: RushingStat) => <span>{rushingStat.touchdown}</span>
  },
  {
    title: 'LONG',
    render: (rushingStat: RushingStat) => <span>{rushingStat.long}</span>
  }
]

const homePassingColumns = [
  {
    title: 'PASSING',
    render: (passingStat: PassingStat) => <span>{passingStat.name}</span>
  },
  {
    title: 'ATT',
    render: (passingStat: PassingStat) => <span>{passingStat.attempt}</span>
  },
  {
    title: 'YDS',
    render: (passingStat: PassingStat) => <span>{passingStat.yards}</span>
  },
  {
    title: 'TD',
    render: (passingStat: PassingStat) => <span>{passingStat.touchdown}</span>
  },
  {
    title: 'LONG',
    render: (passingStat: RushingStat) => <span>{passingStat.long}</span>
  }
]

const homeReceivingColumns = [
  {
    title: 'RECEIVING',
    render: (receivingStat: ReceivingStat) => <span>{receivingStat.name}</span>
  },
  {
    title: 'REC',
    render: (receivingStat: ReceivingStat) => (
      <span>{receivingStat.receive}</span>
    )
  },
  {
    title: 'YDS',
    render: (receivingStat: ReceivingStat) => <span>{receivingStat.yards}</span>
  },
  {
    title: 'TD',
    render: (receivingStat: ReceivingStat) => (
      <span>{receivingStat.touchdown}</span>
    )
  },
  {
    title: 'LONG',
    render: (receivingStat: ReceivingStat) => <span>{receivingStat.long}</span>
  }
]

const homeDefenseColumns = [
  {
    title: 'DEFENSE',
    render: (defenseStat: DefenseStat) => <span>{defenseStat.name}</span>
  },
  {
    title: 'TOT',
    render: (defenseStat: DefenseStat) => <span>{defenseStat.total}</span>
  },
  {
    title: 'SOLO',
    render: (defenseStat: DefenseStat) => <span>{defenseStat.solo}</span>
  },
  {
    title: 'SACKS',
    render: (defenseStat: DefenseStat) => <span>{defenseStat.sacks}</span>
  },
  {
    title: 'TFL',
    render: (defenseStat: DefenseStat) => (
      <span>{defenseStat.tackleForLoss}</span>
    )
  },
  {
    title: 'INT',
    render: (defenseStat: DefenseStat) => <span>{defenseStat.intercept}</span>
  },
  {
    title: 'FF',
    render: (defenseStat: DefenseStat) => (
      <span>{defenseStat.forcedFumble}</span>
    )
  },
  {
    title: 'FR',
    render: (defenseStat: DefenseStat) => (
      <span>{defenseStat.fumbleRecover}</span>
    )
  }
]

const awayTeamStats: AwayStats = {
  rushingStats: [
    {
      id: 1,
      name: 'Jalen Buckley',
      attempt: 23,
      yards: 117,
      touchdown: 2,
      long: 52
    },
    {
      id: 2,
      name: 'Zahir Abdus-salaam',
      attempt: 9,
      yards: 39,
      touchdown: 0,
      long: 11
    },
    {
      id: 3,
      name: 'Cj Hester',
      attempt: 5,
      yards: 12,
      touchdown: 0,
      long: 9
    },
    {
      id: 4,
      name: 'xxx',
      attempt: 3,
      yards: -3,
      touchdown: 0,
      long: 0
    },
    {
      id: 5,
      name: 'Hayden Wolff',
      attempt: 5,
      yards: -14,
      touchdown: 0,
      long: 3
    }
  ],
  passingStats: [
    {
      id: 1,
      name: 'Hayden Wolff',
      completion: 25,
      attempt: 36,
      intercept: 1,
      yards: 333,
      touchdown: 3,
      long: 41
    }
  ],
  receivingStats: [
    {
      id: 1,
      name: 'Kenneth Womack',
      receive: 12,
      yards: 135,
      touchdown: 0,
      long: 25
    },
    {
      id: 2,
      name: 'Blake Bosma',
      receive: 3,
      yards: 64,
      touchdown: 0,
      long: 35
    },
    {
      id: 3,
      name: 'Leroy Thomas',
      receive: 3,
      yards: 58,
      touchdown: 1,
      long: 41
    },
    {
      id: 4,
      name: 'Anthony Sambucci',
      receive: 3,
      yards: 31,
      touchdown: 1,
      long: 22
    },
    {
      id: 5,
      name: 'Austin Hence',
      receive: 1,
      yards: 23,
      touchdown: 1,
      long: 23
    }
  ],
  defenseStats: [
    {
      id: 1,
      name: 'Bilhal Kone',
      total: 5,
      solo: 2,
      sacks: 0,
      tackleForLoss: 0,
      intercept: 1,
      forcedFumble: 0,
      fumbleRecover: 0
    },
    {
      id: 2,
      name: 'Keni-h Lovely',
      total: 6,
      solo: 5,
      sacks: 0,
      tackleForLoss: 1,
      intercept: 0,
      forcedFumble: 1,
      fumbleRecover: 0
    },
    {
      id: 3,
      name: 'Tate Hallock',
      total: 3,
      solo: 2,
      sacks: 0,
      tackleForLoss: 0,
      intercept: 0,
      forcedFumble: 0,
      fumbleRecover: 0
    },
    {
      id: 4,
      name: 'Cj Hester',
      total: 1,
      solo: 1,
      sacks: 0,
      tackleForLoss: 0,
      intercept: 0,
      forcedFumble: 0,
      fumbleRecover: 0
    },
    {
      id: 5,
      name: 'Damari Roberson',
      total: 6,
      solo: 3,
      sacks: 0,
      tackleForLoss: 0,
      intercept: 0,
      forcedFumble: 0,
      fumbleRecover: 0
    }
  ]
}

const awayRushingColumns = [
  {
    title: 'RUSHING',
    render: (rushingStat: RushingStat) => <span>{rushingStat.name}</span>
  },
  {
    title: 'ATT',
    render: (rushingStat: RushingStat) => <span>{rushingStat.attempt}</span>
  },
  {
    title: 'YDS',
    render: (rushingStat: RushingStat) => <span>{rushingStat.yards}</span>
  },
  {
    title: 'TD',
    render: (rushingStat: RushingStat) => <span>{rushingStat.touchdown}</span>
  },
  {
    title: 'LONG',
    render: (rushingStat: RushingStat) => <span>{rushingStat.long}</span>
  }
]

const awayPassingColumns = [
  {
    title: 'RUSHING',
    render: (passingStat: PassingStat) => <span>{passingStat.name}</span>
  },
  {
    title: 'ATT',
    render: (passingStat: PassingStat) => <span>{passingStat.attempt}</span>
  },
  {
    title: 'YDS',
    render: (passingStat: PassingStat) => <span>{passingStat.yards}</span>
  },
  {
    title: 'TD',
    render: (passingStat: PassingStat) => <span>{passingStat.touchdown}</span>
  },
  {
    title: 'LONG',
    render: (passingStat: PassingStat) => <span>{passingStat.long}</span>
  }
]

const awayReceivingColumns = [
  {
    title: 'RECEIVING',
    render: (receivingStat: ReceivingStat) => <span>{receivingStat.name}</span>
  },
  {
    title: 'REC',
    render: (receivingStat: ReceivingStat) => (
      <span>{receivingStat.receive}</span>
    )
  },
  {
    title: 'YDS',
    render: (receivingStat: ReceivingStat) => <span>{receivingStat.yards}</span>
  },
  {
    title: 'TD',
    render: (receivingStat: ReceivingStat) => (
      <span>{receivingStat.touchdown}</span>
    )
  },
  {
    title: 'LONG',
    render: (receivingStat: ReceivingStat) => <span>{receivingStat.long}</span>
  }
]

const awayDefenseColumns = [
  {
    title: 'DEFENSE',
    render: (defenseStat: DefenseStat) => <span>{defenseStat.name}</span>
  },
  {
    title: 'TOT',
    render: (defenseStat: DefenseStat) => <span>{defenseStat.total}</span>
  },
  {
    title: 'SOLO',
    render: (defenseStat: DefenseStat) => <span>{defenseStat.solo}</span>
  },
  {
    title: 'SACKS',
    render: (defenseStat: DefenseStat) => <span>{defenseStat.sacks}</span>
  },
  {
    title: 'TFL',
    render: (defenseStat: DefenseStat) => (
      <span>{defenseStat.tackleForLoss}</span>
    )
  },
  {
    title: 'INT',
    render: (defenseStat: DefenseStat) => <span>{defenseStat.intercept}</span>
  },
  {
    title: 'FF',
    render: (defenseStat: DefenseStat) => (
      <span>{defenseStat.forcedFumble}</span>
    )
  },
  {
    title: 'FR',
    render: (defenseStat: DefenseStat) => (
      <span>{defenseStat.fumbleRecover}</span>
    )
  }
]

const league = {
  id: 1,
  logo: '/logo/KAFA_OG.png',
  assosiation: '대한미식축구협회',
  leagueName: '제 00회 타이거볼',
  isFinished: false
}

const ScheduleDetail = () => {
  const [activeTeam, setActiveTeam] = useState('HOME')

  const handleHomeClick = () => {
    setActiveTeam('HOME')
  }

  const handleAwayClick = () => {
    setActiveTeam('AWAY')
  }
  const homeTeam = {
    id: 1,
    logo: '/logo/KAFA_OG.png',
    name: 'Home Team',
    score: 14,
    onClick: (id: number) => console.log(`Clicked Home Team with ID: ${id}`)
  }

  const awayTeam = {
    id: 2,
    logo: '/logo/KAFA_OG.png',
    name: 'Away Team',
    score: 21,
    onClick: (id: number) => console.log(`Clicked Away Team with ID: ${id}`)
  }

  return (
    <div className="mb-5 mt-16">
      <div className="max-w-screen">
        <div
          key={league.id}
          className="flex justify-between bg-gray-800 lg:p-3"
        >
          <div className="flex text-white">
            <img src={league.logo} alt="KAFA Logo" className="h-auto w-12" />
            <div className="ml-3 flex flex-col justify-center lg:ml-5">
              <div className="text-gray-250 text-sm font-semibold">
                {league.assosiation}
              </div>
              <div className="text-white-900 text-md font-bold lg:text-lg">
                {league.leagueName}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <ScoreCard
          gameId={123}
          matchDay="2023-11-13"
          stadium="Awesome Stadium"
          homeTeam={homeTeam}
          awayTeam={awayTeam}
        />
      </div>
      <div className="flex items-center bg-indigo-800 p-6 text-xl text-white">
        <div className="justify-center">STATS</div>
        <div className="ml-5">
          <Button
            variant="reverse"
            label="HOME"
            onClick={handleHomeClick}
            isActive={activeTeam === 'HOME'}
          />
        </div>
        <div className="ml-2">
          <Button
            variant="reverse"
            label="AWAY"
            onClick={handleAwayClick}
            isActive={activeTeam === 'AWAY'}
          />
        </div>
      </div>
      <div className="container mx-auto mt-5">
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {activeTeam === 'HOME' && (
            <>
              <div>
                <div className="mb-10">
                  <DefaultTable<RushingStat>
                    title="Home Team Rushing Stats"
                    data={homeTeamStats.rushingStats}
                    columns={homeRushingColumns}
                  />
                </div>
                <div>
                  <DefaultTable<ReceivingStat>
                    title="Home Team Receiving Stats"
                    data={homeTeamStats.receivingStats}
                    columns={homeReceivingColumns}
                  />
                </div>
              </div>
              <div>
                <div className="mb-10">
                  <DefaultTable<PassingStat>
                    title="Home Team Passing Stats"
                    data={homeTeamStats.passingStats}
                    columns={homePassingColumns}
                  />
                </div>
                <div>
                  <DefaultTable<DefenseStat>
                    title="Home Team Passing Stats"
                    data={homeTeamStats.defenseStats}
                    columns={homeDefenseColumns}
                  />
                </div>
              </div>
            </>
          )}
          {activeTeam === 'AWAY' && (
            <>
              <div>
                <div className="mb-10">
                  <DefaultTable<RushingStat>
                    title="Away Team Rushing Stats"
                    data={awayTeamStats.rushingStats}
                    columns={awayRushingColumns}
                  />
                </div>
                <div>
                  <DefaultTable<ReceivingStat>
                    title="Away Team Passing Stats"
                    data={awayTeamStats.receivingStats}
                    columns={awayReceivingColumns}
                  />
                </div>
              </div>
              <div>
                <div className="mb-10">
                  <DefaultTable<PassingStat>
                    title="Away Team Passing Stats"
                    data={awayTeamStats.passingStats}
                    columns={awayPassingColumns}
                  />
                </div>
                <div>
                  <DefaultTable<DefenseStat>
                    title="Away Team Defense Stats"
                    data={awayTeamStats.defenseStats}
                    columns={awayDefenseColumns}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ScheduleDetail
