// PastLeagueList.tsx
import Button from '@/components/buttons/Button'
import DropdownRight from '@/components/dropdown/DropdownRight'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const leagueList = [
  {
    id: 1,
    associationId: 1,
    associationName: '사회인연맹',
    associationLogo: '/logo/KAFA_OG.png',
    leagueId: 1,
    leagueName: '제 00회 광개토볼',
    startedAt: '2022-01-01',
    endedAt: '2022-12-31'
  },
  {
    id: 2,
    associationId: 2,
    associationName: '대학연맹',
    associationLogo: '/logo/KAFA_OG.png',
    leagueId: 1,
    leagueName: '제 00회 타이거볼',
    startedAt: '2022-01-01',
    endedAt: '2022-12-31'
  },
  {
    id: 3,
    associationId: 2,
    associationName: '대학연맹',
    associationLogo: '/logo/KAFA_OG.png',
    leagueId: 1,
    leagueName: '제 00회 타이거볼',
    startedAt: '2021-01-01',
    endedAt: '2021-12-31'
  },
  {
    id: 4,
    associationId: 4,
    associationName: '플래그연맹',
    associationLogo: '/logo/KAFA_OG.png',
    leagueId: 2,
    leagueName: '제 00회 플래그볼',
    startedAt: '2021-01-01',
    endedAt: '2021-12-31'
  },
  {
    id: 5,
    associationId: 3,
    associationName: '대학연멩',
    associationLogo: '/logo/KAFA_OG.png',
    leagueId: 2,
    leagueName: '제 00회 챌린지볼',
    startedAt: '2020-01-01',
    endedAt: '2020-12-31'
  },
  {
    id: 6,
    associationId: 4,
    associationName: '플래그연맹',
    associationLogo: '/logo/KAFA_OG.png',
    leagueId: 1,
    leagueName: '제 00회 플래그볼',
    startedAt: '2019-01-01',
    endedAt: '2019-12-31'
  }
]

// const leagueList = [
//   {
//     id: 1,
//     logo: '/logo/KAFA_OG.png',
//     assosiation: '사회인연맹',
//     leagueName: '제 00회 타이거볼',
//     period: '10/01 ~ 12/02'
//   },
//   {
//     id: 2,
//     logo: '/logo/KAFA_OG.png',
//     assosiation: '사회인연맹',
//     leagueName: '제 00회 타이거볼',
//     period: '10/01 ~ 12/02'
//   },
//   {
//     id: 3,
//     logo: '/logo/KAFA_OG.png',
//     assosiation: '사회인연맹',
//     leagueName: '제 00회 타이거볼',
//     period: '10/01 ~ 12/02'
//   },
//   {
//     id: 4,
//     logo: '/logo/KAFA_OG.png',
//     assosiation: '사회인연맹',
//     leagueName: '제 00회 타이거볼',
//     period: '10/01 ~ 12/02'
//   },
//   {
//     id: 5,
//     logo: '/logo/KAFA_OG.png',
//     assosiation: '사회인연맹',
//     leagueName: '제 00회 타이거볼',
//     period: '10/01 ~ 12/02'
//   }
// ]

const options = [
  { id: 1, name: '2022' },
  { id: 2, name: '2021' },
  { id: 3, name: '2020' },
  { id: 4, name: '2019' }
]

const PastLeague = () => {
  const navigate = useNavigate()
  const [selectedYear, setSelectedYear] = useState(options[0].name)

  const goToLeagueDetail = (id: number) => {
    navigate(`/pastLeague/${id}`)
  }

  const handleSelect = (selected: string) => {
    setSelectedYear(selected)
  }

  const filteredLeagues = leagueList.filter((league) => {
    return league.startedAt.substring(0, 4) === selectedYear
  })

  return (
    <div className="">
      <div className="flex justify-between bg-indigo-800 p-6">
        <div className="text-xl font-bold text-white">PAST LEAGUES</div>
        <div className="text-white">
          <DropdownRight
            optionName={options[0].name}
            optionList={options}
            onSelect={handleSelect}
          />
        </div>
      </div>
      <div className="mb-5">
        {filteredLeagues.map((league) => (
          <div
            key={league.id}
            className="mx-3 my-5 mt-5 flex justify-between rounded-md bg-gray-600 p-5 lg:mx-10 lg:p-10"
          >
            <div className="flex text-white">
              <img
                src={league.associationLogo}
                alt="KAFA Logo"
                className="h-auto w-16 sm:w-32"
              />
              <div className="ml-3 flex flex-col justify-center gap-4 lg:ml-10">
                <div className="text-gray-250 text-md font-semibold sm:text-xl">
                  {league.associationName}
                </div>
                <div className="text-md font-bold sm:text-lg lg:text-2xl">
                  {league.leagueName}
                </div>
                <div className="text-sm sm:text-lg">
                  {league.startedAt} ~ {league.endedAt}
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center gap-4">
              <div>
                <Button
                  variant="outlineWhiteText"
                  label="바로가기"
                  onClick={() => goToLeagueDetail(league.id)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PastLeague
