import DropdownSimple from '@/components/dropdown/DropdownSimple'
import DefaultTable from '@/components/tables/DefaultTable'
import { useState } from 'react'

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

interface GamesData {
  [key: string]: Game[]
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

interface Option {
  id: string | number
  name: string
}

const result: GamesData = {
  Week1: [
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
    }
  ],
  Week2: [
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
}

const finalStanding: Standing[] = [
  {
    id: 1,
    rank: 1,
    teamId: 1,
    teamLogo: '/logo/KAFA_OG.png',
    teamName: '골든이글스',
    win: 5,
    lose: 0,
    draw: 0
  },
  {
    id: 2,
    rank: 2,
    teamId: 2,
    teamLogo: '/logo/KAFA_OG.png',
    teamName: '골든이글스',
    win: 4,
    lose: 1,
    draw: 0
  },
  {
    id: 3,
    rank: 3,
    teamId: 3,
    teamLogo: '/logo/KAFA_OG.png',
    teamName: '골든이글스',
    win: 3,
    lose: 2,
    draw: 0
  },
  {
    id: 4,
    rank: 4,
    teamId: 4,
    teamLogo: '/logo/KAFA_OG.png',
    teamName: '골든이글스',
    win: 2,
    lose: 3,
    draw: 0
  },
  {
    id: 5,
    rank: 5,
    teamId: 5,
    teamLogo: '/logo/KAFA_OG.png',
    teamName: '골든이글스',
    win: 1,
    lose: 4,
    draw: 0
  },
  {
    id: 6,
    rank: 6,
    teamId: 6,
    teamLogo: '/logo/KAFA_OG.png',
    teamName: '골든이글스',
    win: 0,
    lose: 5,
    draw: 0
  }
]

const options: Option[] = [
  { id: '1', name: 'Week1' },
  { id: '2', name: 'Week2' },
  { id: '3', name: 'Week3' },
  { id: '4', name: 'Week4' }
]

const PastLeagueHomeItem = () => {
  const [selectedWeek, setSelectedWeek] = useState('Week1')

  const selectedOption = options.find((option) => option.name === selectedWeek)
  const tableTitle = selectedOption ? selectedOption.name : 'Week1'

  const currentGamesData = result[selectedWeek] || []

  const handleSelect = (selected: string) => {
    setSelectedWeek(selected)
  }

  const finalStandingColumns = [
    {
      title: 'RANK',
      render: (finalStanding: Standing) => <span>{finalStanding.rank}</span>
    },
    {
      title: 'TEAM',
      render: (finalStanding: Standing) => (
        <div className="flex items-center">
          <img src={finalStanding.teamLogo} alt="" className="mr-2 w-8" />
          <span>{finalStanding.teamName}</span>
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

  const resultColumns = [
    {
      title: 'HOME',
      render: (result: Game) => (
        <div className="flex items-center">
          <img
            src={result.homeTeamLogo}
            alt={result.homeTeam}
            className="mr-2 w-8"
          />
          <span>{result.homeTeam}</span>
        </div>
      )
    },
    {
      title: '',
      render: (result: Game) => <span>{result.homeScore}</span>
    },
    {
      title: 'AWAY',
      render: (result: Game) => (
        <div className="flex items-center">
          <img
            src={result.awayTeamLogo}
            alt={result.awayTeam}
            className="mr-2 w-8"
          />
          <span>{result.awayTeam}</span>
        </div>
      )
    },
    {
      title: '',
      render: (result: Game) => <span>{result.awayScore}</span>
    },
    {
      title: 'DATE',
      render: (result: Game) => (
        <div>
          <span>{result.date}</span>
        </div>
      )
    },
    {
      title: 'LOCATION',
      render: (result: Game) => (
        <div>
          <span>{result.location}</span>
        </div>
      )
    }
  ]

  return (
    <div className="container mx-auto my-5 grid grid-cols-1 sm:grid-cols-3">
      <div className="order-2 col-span-1 mx-5 sm:order-1 sm:col-span-2">
        <div className="mb-5">
          <DefaultTable
            title={tableTitle}
            data={currentGamesData}
            columns={resultColumns}
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
      <div className="order-1 col-span-1 mb-5 ml-5 sm:order-2 sm:ml-10">
        <DropdownSimple
          optionName="Week"
          optionList={options}
          onSelect={handleSelect}
        />{' '}
      </div>
    </div>
  )
}

export default PastLeagueHomeItem
