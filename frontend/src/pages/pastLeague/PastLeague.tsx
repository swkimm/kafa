// PastLeagueList.tsx
import axiosInstance from '@/commons/axios'
import type { GetLeagues } from '@/commons/interfaces/league/getLeagues'
import Button from '@/components/buttons/Button'
import DropdownRight from '@/components/dropdown/DropdownRight'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface ExtendedLeague extends GetLeagues {
  associationInfo?: {
    name: string
    profileImgUrl: string | null
  }
}

interface DropdownOption {
  id: number
  name: string
}

const PastLeague = () => {
  const navigate = useNavigate()
  const [selectedYear, setSelectedYear] = useState(
    (new Date().getFullYear() - 1).toString()
  )
  const [leagues, setLeagues] = useState<ExtendedLeague[]>([])
  const [options, setOptions] = useState<DropdownOption[]>([])

  const goToLeagueDetail = (id: number) => {
    navigate(`/pastLeague/${id}`)
  }

  const handleSelect = (selected: string) => {
    setSelectedYear(selected)
  }

  const filteredLeagues = leagues.filter((league) => {
    // 'league.startedAt'을 ISO 문자열로 변환
    const startedAt = new Date(league.startedAt).toISOString()
    return startedAt.substring(0, 4) === selectedYear
  })

  const fetchAssociationInfo = async (associationId: number) => {
    const response = await axiosInstance.get(`/associations/${associationId}`)
    return response.data
  }

  useEffect(() => {
    const getLeaguesWithAssociation = async () => {
      const page = 1
      const limit = 100
      try {
        const response = await axiosInstance.get<GetLeagues[]>(
          `/leagues?page=${page}&limit=${limit}`
        )
        const leaguesWithAssociation = await Promise.all(
          response.data.map(async (league) => {
            let associationInfo
            if (league.associationId) {
              associationInfo = await fetchAssociationInfo(league.associationId)
            } else {
              associationInfo = { name: 'Unknown', profileImgUrl: null }
            }
            return {
              ...league,
              associationInfo
            }
          })
        )

        const uniqueYears: Set<number> = new Set()
        leaguesWithAssociation.forEach((league) => {
          const year = new Date(league.startedAt).getFullYear()
          uniqueYears.add(year)
          uniqueYears.delete(new Date().getFullYear())
        })

        const dropdownOptions: DropdownOption[] = Array.from(uniqueYears).map(
          (year) => ({
            id: year,
            name: year.toString()
          })
        )
        setOptions(dropdownOptions)
        setLeagues(leaguesWithAssociation)
      } catch (error) {
        alert(error)
      }
    }

    getLeaguesWithAssociation()
  }, [])

  return (
    <div className="">
      <div className="flex justify-between bg-indigo-800 p-6">
        <div className="text-xl font-bold text-white">PAST LEAGUES</div>
        <div className="text-white">
          {options.length > 0 ? (
            <DropdownRight
              optionName={options[0].name}
              optionList={options}
              onSelect={handleSelect}
            />
          ) : (
            <div>Loading...</div> // 또는 다른 대체 요소
          )}
        </div>
      </div>
      <div className="mb-5">
        {filteredLeagues.map((league) => (
          <div
            key={league.id}
            className="mx-3 my-5 mt-5 flex justify-between rounded-md bg-gray-600 p-5 lg:mx-10 lg:p-10"
          >
            <div className="flex text-white">
              {league.associationInfo?.profileImgUrl ? (
                <img
                  src={league.associationInfo.profileImgUrl}
                  alt="KAFA Logo"
                  className="h-auto w-16 sm:w-32"
                />
              ) : (
                <img
                  src="/logo/KAFA_OG.png"
                  alt=""
                  className="h-auto w-16 sm:w-32"
                />
              )}
              <div className="ml-3 flex flex-col justify-center gap-4 lg:ml-10">
                <div className="text-gray-250 text-md font-semibold sm:text-xl">
                  {league.associationInfo?.name}
                </div>
                <div className="text-md font-bold sm:text-lg lg:text-2xl">
                  {league.name}
                </div>
                <div className="text-sm sm:text-lg">
                  {league?.startedAt
                    ? new Date(league.startedAt).toISOString().substring(0, 10)
                    : ''}
                  ~
                  {league?.endedAt
                    ? new Date(league.endedAt).toISOString().substring(0, 10)
                    : ''}
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
