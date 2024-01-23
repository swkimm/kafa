// Stats.tsx
import axiosInstance from '@/commons/axios'
import DropdownSimple from '@/components/dropdown/DropdownLeft'
import WithSubtitleTable from '@/components/tables/WithSubtitleTable'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

interface Person {
  id: number
  name: string
  title: string
  email: string
  role: string
}

const people: Person[] = [
  {
    id: 1,
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member'
  },
  {
    id: 2,
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member'
  },
  {
    id: 3,
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member'
  }
]

// interface StatsProps {
//   selectedYear: string // 년도를 문자열로 받을 것이므로 타입을 조정합니다.
// }

interface GameName {
  id: number
  name: string
}

const StatsItem: React.FC = () => {
  const { leagueId, teamId } = useParams()
  const [gameName, setGameName] = useState<GameName[]>([])
  const currentYear = new Date().getFullYear()
  const recentYears = Array.from(
    { length: 5 },
    (_, index) => currentYear - index
  )
  // const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  const handleYearSelect = (year: number) => {
    // setSelectedYear(year)
    const yearToString = year.toString()
    getLeaguesByYear(yearToString)
  }

  const getLeaguesByYear = async (year: string) => {
    const page = 1
    const limit = 100
    try {
      const response = await axiosInstance.get(
        `/leagues/years/${year}?page=${page}&limit=${limit}`
      )
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getGamesName = async () => {
    try {
      const response = await axiosInstance.get(
        `/games/leagues/${leagueId}/teams/${teamId}`
      )
      setGameName(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getGamesName()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSelect = (selected: string) => {
    console.log('Selected option:', selected)
  }

  const optionName = gameName.length > 0 ? gameName[0].name : ''

  return (
    <div className="container mx-auto my-5 grid max-w-screen-2xl grid-cols-1 px-5 sm:grid-cols-3">
      <div className="order-2 col-span-1 sm:order-1 sm:col-span-2">
        <div className="">
          <WithSubtitleTable
            title="경기일정"
            subtitle="vs Phoenix"
            data={people}
          />
        </div>
      </div>
      <div className="order-1 col-span-1 sm:order-2">
        <div className="mb-5 sm:ml-5">
          <DropdownSimple
            optionName={''}
            optionList={recentYears.map((year) => ({
              id: year,
              name: year.toString()
            }))}
            onSelect={(selected) => handleYearSelect(parseInt(selected, 10))}
          />
        </div>
        <div className="mb-5 sm:ml-5">
          <DropdownSimple
            optionName={optionName}
            optionList={gameName}
            onSelect={handleSelect}
          />
        </div>
      </div>
    </div>
  )
}

export default StatsItem
