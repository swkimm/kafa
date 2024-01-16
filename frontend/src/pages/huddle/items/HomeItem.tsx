import axiosInstance from '@/commons/axios'
import type { Association } from '@/commons/interfaces/association/association'
import type { Game } from '@/commons/interfaces/game/game'
import type { GetLeagues } from '@/commons/interfaces/league/getLeagues'
import type { Sponser } from '@/commons/interfaces/sponser/sponser'
import type { NewsCardProps } from '@/components/cards/NewsCard'
import NoticeNarrow from '@/components/cards/NoticeNarrowCard'
import NoticeWideCard from '@/components/cards/NoticeWideCard'
import LeagueList from '@/components/stackedList/LeagueList'
import GameTable from '@/components/tables/GameTable'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface ExtendedLeague extends GetLeagues {
  associationInfo?: {
    name: string
  }
}

export interface ExtendedGame extends Game {
  homeTeamInfo?: {
    id: number
    name: string
    profileImgUrl: string
  }
  awayTeamInfo?: {
    id: number
    name: string
    profileImgUrl: string
  }
  leagueInfo?: {
    name: string
  }
  scoreInfo?: {
    homeTeamScore: number
    awayTeamScore: number
  }
}

const HomeItem = () => {
  const navigate = useNavigate()
  const [leagues, setLeagues] = useState<ExtendedLeague[]>([])
  const [sponsers, setSponsers] = useState<Sponser[]>([])
  const [associations, setAssociations] = useState<Association[]>([])
  const [upcommingGames, setUpcommingGames] = useState<ExtendedGame[]>([])
  const goToNews = (id: number) => {
    console.log('Card clicked:', id)
  }

  const goToGallery = (id: number) => {
    console.log(id)
  }

  const goToLeague = () => {
    navigate('/league')
  }

  const goToPartners = (id: number) => {
    console.log(id)
  }

  const getAssociations = async () => {
    const page = 1
    const limit = 100
    try {
      const response = await axiosInstance.get(
        `/associations?page=${page}&limit=${limit}`
      )
      setAssociations(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getAssociations()
  }, [])

  const fetchScoreInfo = async (gameId: number) => {
    try {
      const response = await axiosInstance.get(`/games/${gameId}/score`)
      return response.data
    } catch (error) {
      return { homeTeamScore: '', awayTeamScore: '' }
    }
  }

  const fetchLeagueInfo = async (leagueId: number) => {
    const response = await axiosInstance.get(`/leagues/${leagueId}`)
    return response.data
  }

  const fetchHomeTeamInfo = async (homeTeamId: number) => {
    const response = await axiosInstance.get(`/teams/${homeTeamId}`)
    return response.data
  }

  const fetchAwayTeamInfo = async (awayTeamId: number) => {
    const response = await axiosInstance.get(`/teams/${awayTeamId}`)
    return response.data
  }

  useEffect(() => {
    const getUpcommingGames = async () => {
      const cursor = 0
      const limit = 3
      try {
        const response = await axiosInstance.get<Game[]>(
          `/games?cursor=${cursor}&limit=${limit}`
        )
        const upcommingGamesWithScore = await Promise.all(
          response.data.map(async (game) => {
            const scoreInfo = game.id
              ? await fetchScoreInfo(game.id)
              : { homeTeamScore: 'N/A', awayTeamScore: 'N/A' }

            const leagueInfo = game.leagueId
              ? await fetchLeagueInfo(game.leagueId)
              : { name: 'N/A' }

            const homeTeamInfo = game.homeTeamId
              ? await fetchHomeTeamInfo(game.homeTeamId)
              : { name: 'N/A' }

            const awayTeamInfo = game.awayTeamId
              ? await fetchAwayTeamInfo(game.awayTeamId)
              : { name: 'N/A' }

            return {
              ...game,
              scoreInfo,
              leagueInfo,
              homeTeamInfo,
              awayTeamInfo
            }
          })
        )

        setUpcommingGames(upcommingGamesWithScore as ExtendedGame[])
      } catch (error) {
        console.error(error)
      }
    }
    getUpcommingGames()
  }, [])

  const notFinishedGames = upcommingGames.filter(
    (game) => game.result === 'NotFinished'
  )

  const finishedGames = upcommingGames.filter(
    (game) => game.result !== 'NotFinished'
  )

  const fetchAssociationInfo = async (associationId: number) => {
    const response = await axiosInstance.get(`/associations/${associationId}`)
    return response.data
  }

  useEffect(() => {
    const getLeaguesWithAssociation = async () => {
      const limit = 5
      const page = 1
      try {
        const response = await axiosInstance.get<GetLeagues[]>(
          `/leagues?page=${page}&limit=${limit}`
        )
        const leaguesWithAssociation = await Promise.all(
          response.data.map(async (league) => {
            let associationInfo
            if (league.associationId) {
              // null이나 undefined가 아닐 경우
              associationInfo = await fetchAssociationInfo(league.associationId)
            } else {
              // 유효하지 않은 associationId에 대한 처리
              associationInfo = { name: 'Unknown' }
            }
            return {
              ...league,
              associationInfo
            }
          })
        )
        setLeagues(leaguesWithAssociation)
      } catch (error) {
        console.error(error)
      }
    }

    getLeaguesWithAssociation()
  }, [])

  const getSponser = async () => {
    const page = 1
    const limit = 100
    try {
      const response = await axiosInstance.get<Sponser[]>(
        `/sponsers?page=${page}&limit=${limit}`
      )
      setSponsers(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getSponser()
  }, [])

  const goToSponserWeb = (websiteUrl: string) => {
    navigate(websiteUrl)
  }

  const newsData: NewsCardProps[] = [
    {
      imageSrc: '/logo/KAFA_OG.png',
      title: 'Title 1',
      description: 'Description 1',
      variant: 'wide'
    },
    {
      imageSrc: '/logo/KAFA_OG.png',
      title: 'Title 2',
      description: 'Description 2',
      variant: 'wide'
    }
  ]

  const galleryData: NewsCardProps[] = [
    {
      imageSrc: '/logo/KAFA_OG.png',
      title: 'Gallery Title 1',
      description: 'Gallery Description 1',
      variant: 'wide'
    },
    {
      imageSrc: '/logo/KAFA_OG.png',
      title: 'Gallery Title 2',
      description: 'Gallery Description 2',
      variant: 'wide'
    }
  ]

  return (
    <div className="mb-10 w-full">
      <div className="mx-auto grid max-w-screen-xl grid-cols-1 gap-x-3 px-4 md:grid-cols-3 lg:px-20">
        <div className="col-span-2 w-full">
          <div className="grid w-full grid-cols-4 gap-x-2">
            <div className="col-span-4 w-full pb-1 pt-5 lg:col-span-2">
              {associations.length > 1 && (
                <GameTable title="다가오는 경기" games={notFinishedGames} />
              )}
            </div>
            <div className="col-span-4 w-full pb-1 pt-1 lg:col-span-2 lg:pt-5">
              {associations.length > 1 && (
                <GameTable title="최근 경기 결과" games={finishedGames} />
              )}
            </div>
          </div>
          <div className="py-1.5">
            <NoticeWideCard
              id={1}
              cardName="NEWS"
              onClick={goToNews}
              newsCardPropsArray={newsData}
            />
          </div>
          <div className="py-1.5">
            <NoticeWideCard
              id={2}
              cardName="GALLERY"
              onClick={goToGallery}
              newsCardPropsArray={galleryData}
            />
          </div>
        </div>
        <div className="md:col-span-1">
          <div className="mb-3 w-full pt-5">
            <div className="mb-1.5 flex items-center justify-center rounded-xl bg-indigo-950 p-5 shadow-lg">
              <img
                src="/logo/KAFA_OG.png"
                alt=""
                className="w-10 justify-center object-contain lg:w-12"
              />
              <div className="ml-5 items-center text-gray-50">
                <div className="text-xs font-normal text-gray-400 lg:text-sm">
                  대한미식축구협회
                </div>
                <div className="text-sm font-bold sm:text-base">
                  제00회 타이거볼
                </div>
              </div>
            </div>
            <div className="mb-1.5 flex items-center justify-center rounded-xl bg-indigo-950 p-5 shadow-lg">
              <img
                src="/logo/KAFA_OG.png"
                alt=""
                className="w-10 justify-center object-contain lg:w-12"
              />
              <div className="ml-5 items-center text-gray-50">
                <div className="text-xs font-normal text-gray-400 lg:text-sm">
                  대한미식축구협회
                </div>
                <div className="text-sm font-bold sm:text-base">
                  제00회 타이거볼
                </div>
              </div>
            </div>
            <div className="mb-1.5 flex items-center justify-center rounded-xl bg-indigo-950 p-5 shadow-lg">
              <img
                src="/logo/KAFA_OG.png"
                alt=""
                className="w-10 justify-center object-contain lg:w-12"
              />
              <div className="ml-5 items-center text-gray-50">
                <div className="text-xs font-normal text-gray-400 lg:text-sm">
                  대한미식축구협회
                </div>
                <div className="text-sm font-bold sm:text-base">
                  제00회 타이거볼
                </div>
              </div>
            </div>
          </div>
          <div className="mb-3 w-full">
            <NoticeNarrow cardName="LEAGUES" onClick={goToLeague}>
              {leagues.map((league) => (
                <LeagueList
                  key={league.id}
                  id={league.id}
                  name={league.name}
                  associationName={
                    league.associationInfo?.name || 'Unknown Association'
                  }
                  startedAt={league.startedAt}
                  endedAt={league.endedAt}
                />
              ))}
            </NoticeNarrow>
          </div>
          <div className="w-full">
            <NoticeNarrow cardName="SPONSER" onClick={goToPartners}>
              {Array.from({ length: 3 }, (_, index) => (
                <div key={index} className="border-b p-3">
                  <div className="flex items-center  justify-between">
                    {sponsers.map((sponser) => (
                      <img
                        key={sponser.id}
                        className={`h-10 ${sponser.id > 0 ? '' : ''}`}
                        src={
                          sponser.profileImgUrl
                            ? sponser.profileImgUrl
                            : '/logo/KAFA_OG.png'
                        }
                        alt={sponser.name}
                        onClick={() => goToSponserWeb(sponser.websiteUrl)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </NoticeNarrow>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeItem
