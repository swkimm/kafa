import DropdownTransparent from '@/components/dropdown/DropdownTransparent'
import DefaultTable from '@/components/tables/DefaultTable'
import { useState } from 'react'

const weekOptions = [
  { id: '1', name: 'Week1' },
  { id: '2', name: 'Week2' },
  { id: '3', name: 'Week3' },
  { id: '4', name: 'Week4' }
]

const associationOptions = [
  { id: 1, name: '서울미식축구협회' },
  { id: 2, name: '사회인미식축구연맹' },
  { id: 3, name: '대구경북미식축구협회' },
  { id: 4, name: '플래그풋볼협회' }
]

const leagueOptions = [
  { id: 1, name: '제00회 타이거볼' },
  { id: 2, name: '제00회 챌린지볼' },
  { id: 3, name: '제00회 광개토볼' },
  { id: 4, name: '제00회 김치볼' }
]

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
    },
    {
      id: 3,
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
  ],
  Week2: [
    {
      id: 3,
      homeTeam: 'ROYALSs',
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

const ScheduleItem = () => {
  const [selectedWeek, setSelectedWeek] = useState('Week1')

  const selectedOption = weekOptions.find(
    (option) => option.name === selectedWeek
  )
  const tableTitle = selectedOption ? selectedOption.name : 'Week 1'

  const currentGamesData = result[selectedWeek] || []

  const handleSelect = (selected: string) => {
    setSelectedWeek(selected)
    console.log(selected)
  }

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
    <div className="">
      <div className="bg-blue-950 p-5 sm:flex">
        <div className="mb-2 sm:mr-5">
          <DropdownTransparent
            optionName={associationOptions[0].name}
            optionList={associationOptions}
            onSelect={handleSelect}
          />
        </div>
        <div className="mb-2 sm:mr-5">
          <DropdownTransparent
            optionName={leagueOptions[0].name}
            optionList={leagueOptions}
            onSelect={handleSelect}
          />
        </div>
        <div>
          <DropdownTransparent
            optionName={weekOptions[0].name}
            optionList={weekOptions}
            onSelect={handleSelect}
          />
        </div>
      </div>
      <div className="container mx-auto mt-5">
        <div className="mx-5 mb-3">
          <DefaultTable
            title={tableTitle}
            data={currentGamesData}
            columns={resultColumns}
          />
        </div>
      </div>
    </div>
  )
}

export default ScheduleItem
