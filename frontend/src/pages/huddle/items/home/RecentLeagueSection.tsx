import axiosInstance from '@/commons/axios'
import type { LeagueWithAssociation } from '@/commons/interfaces/league/league'
import MainCard from '@/components/cards/MainCard'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const RecentLeagueSection: React.FC = () => {
  const navigate = useNavigate()

  const [leagues, setLeagues] = useState<LeagueWithAssociation[]>([])

  useEffect(() => {
    const getRecentLeagues = async () => {
      await axiosInstance
        .get('/leagues?page=1&limit=5')
        .then((result) => setLeagues(result.data))
        .catch(() => setLeagues([]))
    }

    getRecentLeagues()
  }, [])

  return (
    <MainCard
      title={'최근 리그 목록'}
      transparent={false}
      more={() => navigate('/leagues')}
    >
      <div className="flex gap-2 overflow-x-auto py-5">
        {leagues.length > 0 &&
          leagues.map((league) => {
            return (
              <div
                key={league.id}
                className="flex min-w-[200px] items-center justify-center rounded-lg bg-indigo-950 p-5 shadow-lg hover:bg-indigo-900 lg:min-w-[320px]"
                onClick={() => navigate(`/leagues/${league.id}`)}
              >
                {league.Association.profileImgUrl ? (
                  <img
                    src={league.Association.profileImgUrl}
                    alt=""
                    className="w-10 justify-center object-contain lg:w-12"
                  />
                ) : (
                  <img
                    src="/logo/KAFA_OG.png"
                    alt=""
                    className="w-10 justify-center object-contain lg:w-12"
                  />
                )}

                <div className="ml-5 items-center text-gray-50">
                  <div className="text-xs font-normal text-gray-400 lg:text-sm">
                    {league.Association.name}
                  </div>
                  <div className="text-sm font-bold sm:text-base">
                    {league.name}
                  </div>
                </div>
              </div>
            )
          })}
      </div>
    </MainCard>
  )
}

export default RecentLeagueSection
