// LeagueList.tsx
import axiosInstance from '@/commons/axios'
import type { GetLeagues } from '@/commons/interfaces/league/getLeagues'
import Button from '@/components/buttons/Button'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface ExtendedLeague extends GetLeagues {
  associationInfo?: {
    name: string
    profileImgUrl: string | null
  }
}

const League = () => {
  const navigate = useNavigate()
  const [leagues, setLeagues] = useState<ExtendedLeague[]>([])

  const fetchAssociationInfo = async (associationId: number) => {
    const response = await axiosInstance.get(`/associations/${associationId}`)
    return response.data
  }

  useEffect(() => {
    const getLeaguesWithAssociation = async () => {
      try {
        const response = await axiosInstance.get<GetLeagues[]>(
          `/leagues?page=1&limit=100`
        )
        const leaguesWithAssociation = await Promise.all(
          response.data.map(async (league) => {
            let associationInfo
            if (league.associationId) {
              // null이나 undefined가 아닐 경우
              associationInfo = await fetchAssociationInfo(league.associationId)
            } else {
              // 유효하지 않은 associationId에 대한 처리
              associationInfo = { name: 'Unknown', profileImgUrl: null }
            }
            return {
              ...league,
              associationInfo
            }
          })
        )
        setLeagues(leaguesWithAssociation)
      } catch (error) {
        alert(error)
      }
    }

    getLeaguesWithAssociation()
  }, [])

  const goToRegister = () => {
    console.log('출전등록 페이지로 이동')
  }

  const goToLeagueDetail = (id: number) => {
    navigate(`/leagues/${id}`)
  }

  return (
    <div className="">
      <div className="bg-indigo-800 p-6 text-xl font-bold text-white">
        LEAGUES
      </div>
      <div className="mb-5">
        {leagues.map((league) => (
          <div
            key={league?.id}
            className={`mx-3 my-5 mt-5 flex justify-between rounded-md lg:mx-10 ${
              league?.endedAt && new Date(league.endedAt) <= new Date()
                ? 'bg-gray-500'
                : 'bg-gray-800'
            } p-5 lg:p-10`}
          >
            <div className="flex text-white">
              {league.associationInfo?.profileImgUrl ? (
                <img
                  src={league.associationInfo.profileImgUrl}
                  alt={`${league.associationInfo.name} Logo`}
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
                  {league.associationInfo && (
                    <div className="text-gray-250 text-md font-semibold sm:text-xl">
                      {league.associationInfo.name}
                    </div>
                  )}
                </div>
                <div
                  className={`text-md font-bold sm:text-lg lg:text-2xl ${
                    league?.endedAt && new Date(league.endedAt) <= new Date()
                      ? 'text-white-900'
                      : ''
                  }`}
                >
                  {league?.name}
                  {league?.endedAt &&
                    new Date(league.endedAt) <= new Date() &&
                    ' (종료됨)'}
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
              {!(league?.endedAt && new Date(league.endedAt) >= new Date()) && (
                <div>
                  <Button
                    variant="outlineWhiteText"
                    label="출전등록"
                    onClick={goToRegister}
                  />
                </div>
              )}
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
        ))}
      </div>
    </div>
  )
}

export default League
