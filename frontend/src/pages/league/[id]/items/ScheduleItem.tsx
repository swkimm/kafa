// ScheduleItem.tsx
import DropdownSimple from '@/components/dropdown/DropdownLeft'
import DefaultTable from '@/components/tables/DefaultTable'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

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

interface Option {
  id: string | number
  name: string
}

const gamesData: GamesData = {
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

const options: Option[] = [
  { id: '1', name: 'Week1' },
  { id: '2', name: 'Week2' },
  { id: '3', name: 'Week3' },
  { id: '4', name: 'Week4' }
]

const ScheduleItem = () => {
  const { leagueId } = useParams()
  const [selectedWeek, setSelectedWeek] = useState('Week1')

  const navigate = useNavigate()

  const navigateToGame = (gameId: number) => {
    navigate(`/league/${leagueId}/schedule/${gameId}`)
  }

  const selectedOption = options.find((option) => option.name === selectedWeek)
  const tableTitle = selectedOption ? selectedOption.name : 'Week1'

  const currentGamesData = gamesData[selectedWeek] || []

  const handleSelect = (selected: string) => {
    setSelectedWeek(selected)
  }

  const gameColumns = [
    {
      title: 'HOME',
      render: (game: Game) => (
        <div
          onClick={() => navigateToGame(game.id)}
          className="flex cursor-pointer items-center"
        >
          <img
            src={game.homeTeamLogo}
            alt={game.homeTeam}
            className="mr-2 w-8"
          />
          <span>{game.homeTeam}</span>
        </div>
      )
    },
    {
      title: '',
      render: (game: Game) => (
        <div
          onClick={() => navigateToGame(game.id)}
          className="flex cursor-pointer items-center"
        >
          <span>{game.homeScore}</span>
        </div>
      )
    },
    {
      title: 'AWAY',
      render: (game: Game) => (
        <div
          onClick={() => navigateToGame(game.id)}
          className="flex cursor-pointer items-center"
        >
          <img
            src={game.awayTeamLogo}
            alt={game.awayTeam}
            className="mr-2 w-8"
          />
          <span>{game.awayTeam}</span>
        </div>
      )
    },
    {
      title: '',
      render: (game: Game) => (
        <div
          onClick={() => navigateToGame(game.id)}
          className="flex cursor-pointer items-center"
        >
          <span>{game.awayScore}</span>
        </div>
      )
    },
    {
      title: 'DATE',
      render: (game: Game) => (
        <div
          onClick={() => navigateToGame(game.id)}
          className="flex cursor-pointer items-center"
        >
          <span>{game.date}</span>,
        </div>
      )
    },
    {
      title: 'LOCATION',
      render: (game: Game) => (
        <div
          onClick={() => navigateToGame(game.id)}
          className="flex cursor-pointer items-center"
        >
          <span>{game.location}</span>,
        </div>
      )
    }
  ]
  return (
    <div className="container mx-auto my-5 grid max-w-screen-2xl grid-cols-1 sm:grid-cols-3">
      <div className="order-2 col-span-1 mx-5 sm:order-1 sm:col-span-2">
        <DefaultTable
          title={tableTitle}
          data={currentGamesData}
          columns={gameColumns}
        />
      </div>
      <div className="order-1 col-span-1 mx-5 mb-5 sm:order-2">
        <DropdownSimple
          optionName="Week"
          optionList={options}
          onSelect={handleSelect}
        />{' '}
      </div>
    </div>
  )
}

export default ScheduleItem
