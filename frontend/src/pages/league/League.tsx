// LeagueList.tsx
import axiosInstance from '@/commons/axios'
import type { LeagueWithAssociation } from '@/commons/interfaces/league/league'
import Button from '@/components/buttons/Button'
import DropdownRight from '@/components/dropdown/DropdownRight'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface DropdownOption {
  id: number
  name: string
}

const League = () => {
  const thisYear = new Date().getFullYear()
  const navigate = useNavigate()
  const [year, setYear] = useState(thisYear.toString())
  const [leagues, setLeagues] = useState<LeagueWithAssociation[]>([])
  const [options] = useState<DropdownOption[]>([
    {
      id: 1,
      name: '' + thisYear
    },
    {
      id: 2,
      name: '' + (thisYear - 1)
    },
    {
      id: 3,
      name: '' + (thisYear - 2)
    },
    {
      id: 4,
      name: '' + (thisYear - 3)
    },
    {
      id: 5,
      name: '' + (thisYear - 4)
    }
  ])

  const handleSelect = (selected: string) => {
    setYear(selected)
  }

  const printDate = (league: LeagueWithAssociation) => {
    return `${league.startedAt.getMonth() + 1}/${league.startedAt.getDate()} ~ ${league.endedAt.getMonth() + 1}/${league.endedAt.getDate()}`
  }

  useEffect(() => {
    const getLeaguesWithAssociation = async () => {
      try {
        const leaguesWithAssociation: LeagueWithAssociation[] =
          await axiosInstance
            .get(`/leagues/years/${year}?page=1&take=30`)
            .then((result) => result.data)

        leaguesWithAssociation.forEach((league) => {
          league.startedAt = new Date(league.startedAt)
          league.endedAt = new Date(league.endedAt)
        })

        setLeagues(leaguesWithAssociation)
      } catch (error) {
        setLeagues([])
      }
    }

    getLeaguesWithAssociation()
  }, [year])

  const goToLeagueDetail = (id: number) => {
    navigate(`/leagues/${id}`)
  }

  return (
    <div className="">
      <div className="bg-purple-950 py-6 text-xl font-bold text-gray-50">
        <div className="mx-auto flex max-w-screen-xl justify-between px-4 lg:px-20">
          <p>LEAGUES</p>
          <div className="text-xs text-white sm:text-base">
            <DropdownRight
              optionName={options[0].name}
              optionList={options}
              onSelect={handleSelect}
            />
          </div>
        </div>
      </div>
      <div className="mx-auto my-2.5 h-full max-w-screen-xl px-4 sm:my-5 lg:px-20">
        <div className="grid grid-cols-2 gap-x-3">
          {leagues.length > 0 ? (
            leagues.map((league) => (
              <div
                key={league.id}
                className={`col-span-2 my-1 flex justify-between rounded-lg shadow-lg sm:my-1.5 lg:col-span-1 ${
                  league.endedAt && new Date(league.endedAt) <= new Date()
                    ? 'bg-gray-600'
                    : 'bg-gray-800'
                } p-5 sm:p-10`}
              >
                <div className="flex text-white">
                  {league.Association.profileImgUrl ? (
                    <img
                      src={league.Association.profileImgUrl}
                      alt={`${league.Association.name} Logo`}
                      className="h-auto w-12 object-contain sm:w-24"
                    />
                  ) : (
                    <img
                      src="/logo/KAFA_OG.png"
                      alt=""
                      className="h-auto w-12 object-contain sm:w-24"
                    />
                  )}
                  <div className="ml-5 flex flex-col justify-center lg:ml-10">
                    <div className="text-gray-250 text-xs font-semibold sm:text-base">
                      {league.Association.name}
                    </div>
                    <div
                      className={`text-gray-250 mb-0.5 text-sm font-bold sm:mb-2 sm:text-xl ${
                        league.endedAt && league.endedAt <= new Date()
                          ? 'text-white-900'
                          : ''
                      }`}
                    >
                      {league?.name}
                      {league?.endedAt &&
                        league.endedAt <= new Date() &&
                        ' (종료됨)'}
                    </div>
                    <div className="text-xs font-light sm:text-sm">
                      {printDate(league)}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-center gap-4">
                  <div>
                    <Button
                      variant="outlineWhiteText"
                      label="바로가기"
                      onClick={() =>
                        league?.id !== undefined && goToLeagueDetail(league.id)
                      }
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 h-full w-full">
              <p className="text-center text-xl font-light">
                {year}년의 리그 정보가 존재하지 않습니다
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default League
