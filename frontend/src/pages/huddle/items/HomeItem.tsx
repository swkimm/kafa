import axiosInstance from '@/commons/axios'
import type { Association } from '@/commons/interfaces/association/association'
import type { Game } from '@/commons/interfaces/game/game'
import type { GetLeagues } from '@/commons/interfaces/league/getLeagues'
import type { Sponser } from '@/commons/interfaces/sponser/sponser'
import type { NewsCardProps } from '@/components/cards/NewsCard'
import NoticeNarrow from '@/components/cards/NoticeNarrowCard'
import NoticeWideCard from '@/components/cards/NoticeWideCard'
import LeagueList from '@/components/stackedList/LeagueList'
import NoticeList from '@/components/stackedList/NoticeList'
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

  const goToNoticeById = (id: number) => {
    console.log(id)
  }

  const goToNotice = () => {
    navigate('/notice')
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
      console.log(response.data)
      setAssociations(response.data)
    } catch (error) {
      alert(error)
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
              ...game, // Game 객체의 속성들을 펼침
              scoreInfo, // scoreInfo 추가
              leagueInfo, // leagueInfo 추가
              homeTeamInfo,
              awayTeamInfo
            }
          })
        )

        setUpcommingGames(upcommingGamesWithScore as ExtendedGame[])
        // console.log(upcommingGames)
      } catch (error) {
        alert(error)
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
        alert(error)
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
      alert(error)
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
    // ...more news items
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
    // ...more gallery items
  ]

  return (
    <div className="mx-auto">
      <div className="grid max-w-screen-2xl gap-4 px-5 sm:grid-cols-1 md:grid-cols-3">
        <div className="overflow-x-auto md:col-span-2">
          <div className="md:flex md:flex-row">
            <div className="flex-grow overflow-x-auto p-3">
              {associations.length > 1 && (
                <GameTable title="다가오는 경기" games={notFinishedGames} />
              )}
            </div>
            <div className="flex-grow overflow-x-auto p-3">
              {associations.length > 1 && (
                <GameTable title="최근 경기 결과" games={finishedGames} />
              )}
            </div>
          </div>
          <div className="p-3 sm:w-full ">
            <NoticeWideCard
              id={1}
              cardName="NEWS"
              onClick={goToNews}
              newsCardPropsArray={newsData}
            />
          </div>
          <div className="p-3 sm:w-full">
            <NoticeWideCard
              id={2}
              cardName="GALLERY"
              onClick={goToGallery}
              newsCardPropsArray={galleryData}
            />
          </div>
        </div>
        <div className="overflow-x-auto md:col-span-1">
          <div className="w-full p-3">
            <div className="mb-3 flex items-center justify-center bg-blue-950 p-5">
              <img
                src="/logo/KAFA_OG.png"
                alt=""
                className="w-16 justify-center"
              />
              <div className="ml-5 items-center text-white">
                <div className="text-xl font-bold text-gray-500">
                  대한미식축구협회
                </div>
                <div>제00회 타이거볼</div>
              </div>
            </div>
            <div className="mb-3 flex items-center justify-center bg-blue-950 p-5">
              <img
                src="/logo/KAFA_OG.png"
                alt=""
                className="w-16 justify-center"
              />
              <div className="ml-5 items-center text-white">
                <div className="text-xl font-bold text-gray-500">
                  대한미식축구협회
                </div>
                <div>제00회 타이거볼</div>
              </div>
            </div>
            <div className="mb-3 flex items-center justify-center bg-blue-950 p-5">
              <img
                src="/logo/KAFA_OG.png"
                alt=""
                className="w-16 justify-center"
              />
              <div className="ml-5 items-center text-white">
                <div className="text-xl font-bold text-gray-500">
                  대한미식축구협회
                </div>
                <div>제00회 타이거볼</div>
              </div>
            </div>
          </div>
          <div className="p-3 sm:w-full">
            <NoticeNarrow cardName="NOTICE" onClick={goToNotice}>
              <NoticeList
                id={1}
                noticeName="공지사항 1"
                writer="관리자"
                period="2023/01/01 13:00"
                onClick={() => goToNoticeById(1)}
              />
              <NoticeList
                id={2}
                noticeName="공지사항 2"
                writer="관리자"
                period="2023/01/02 13:00"
                onClick={() => goToNoticeById(2)}
              />
              <NoticeList
                id={3}
                noticeName="공지사항 3"
                writer="관리자"
                period="2023/01/03 13:00"
                onClick={() => goToNoticeById(3)}
              />
              {/* 추가 NoticeList 컴포넌트들을 넣을 수 있습니다. */}
            </NoticeNarrow>{' '}
          </div>
          <div className="p-3 sm:w-full">
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
          <div className="p-3">
            <NoticeNarrow cardName="SPONSER" onClick={goToPartners}>
              {Array.from({ length: 3 }, (_, index) => (
                <div key={index} className="border-b p-3">
                  <div className="flex items-center  justify-between">
                    {sponsers.map((sponser) => (
                      <img
                        key={sponser.id}
                        className={`h-10 ${sponser.id > 0 ? '' : ''}`} // Add margin-left if it's not the first logo
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
