// TeamHomeItem.tsx
// import { useParams } from 'react-router-dom'
import axiosInstance from '@/commons/axios'
import type { GameMany } from '@/commons/interfaces/game/game'
import type { NewsCardProps } from '@/components/cards/NewsCard'
import NoticeNarrowCard from '@/components/cards/NoticeNarrowCard'
import NoticeWideCard from '@/components/cards/NoticeWideCard'
import NoticeList from '@/components/stackedList/NoticeList'
import DefaultTable from '@/components/tables/DefaultTable'
import useNotification from '@/hooks/useNotification'
import { NotificationType } from '@/state/notificationState'
import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

interface Notice {
  id: number
  noticeName: string
  writer: string
  period: string
  onClick: (id: number) => void
}

const goToNoticeById = (id: number) => {
  console.log(id)
}

const notices: Notice[] = [
  {
    id: 1,
    noticeName: '공지사항 1',
    writer: '관리자',
    period: '2023/01/01 13:00',
    onClick: (id) => goToNoticeById(id)
  },
  {
    id: 2,
    noticeName: '공지사항 1',
    writer: '관리자',
    period: '2023/01/01 13:00',
    onClick: (id) => goToNoticeById(id)
  },
  {
    id: 3,
    noticeName: '공지사항 1',
    writer: '관리자',
    period: '2023/01/01 13:00',
    onClick: (id) => goToNoticeById(id)
  },
  {
    id: 4,
    noticeName: '공지사항 1',
    writer: '관리자',
    period: '2023/01/01 13:00',
    onClick: (id) => goToNoticeById(id)
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

interface GameWithStadium extends GameMany {
  stadium: string
}

const TeamHomeItem = () => {
  const [games, setGames] = useState<GameWithStadium[]>([])
  const { leagueId, teamId: teamIdString } = useParams()
  const teamId = Number(teamIdString) // teamId를 숫자로 변환
  const [searchParams] = useSearchParams()
  const yearParam = searchParams.get('year')
  const year = Number(yearParam)
  const { showNotification } = useNotification()

  const fetchGameWithStadium = async (gameId: number) => {
    const response = await axiosInstance.get(`/games/${gameId}`)
    return response.data
  }

  useEffect(() => {
    const getGamesByTeamId = async () => {
      const page = 1
      const limit = 5
      try {
        const response = await axiosInstance.get(
          `/games/teams/${teamId}?page=${page}&limit=${limit}`
        )
        let games = response.data

        // URL 쿼리 파라미터에 따라 연도 필터링
        if (year) {
          games = games.filter(
            (game: { startedAt: string }) =>
              new Date(game.startedAt).getFullYear() === year
          )
        }

        // 특정 리그와 팀에 해당하는 경기만 필터링
        if (leagueId && teamId) {
          games = games.filter(
            (game: { League: { id: number } }) =>
              game.League.id === parseInt(leagueId, 10)
          )
        }

        // 각 게임에 대한 추가 정보(스타디움 등)를 가져옴
        const gamesWithStadium = await Promise.all(
          games.map(async (game: { id: number }) => {
            const gameDetails = await fetchGameWithStadium(game.id)
            return {
              ...game,
              ...gameDetails
            }
          })
        )
        setGames(gamesWithStadium)
      } catch (error) {
        showNotification(
          NotificationType.Error,
          '게임 목록 불러오기 실패',
          '게임 목록 불러오기에 실패했습니다.'
        )
        setGames([])
      }
    }

    getGamesByTeamId()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const gamesColumns = [
    {
      title: 'HOME',
      render: (game: GameMany) => (
        <div className="flex items-center">
          {game.homeTeam?.profileImgUrl ? (
            <img
              src={game.homeTeam.profileImgUrl}
              alt={game.homeTeam.name}
              className="mr-2 w-8"
            />
          ) : (
            <img src="/logo/KAFA_OG.png" alt="" className="mr-2 w-8" />
          )}
          <span>{game.homeTeam?.name}</span>
        </div>
      )
    },
    {
      title: '',
      render: (game: GameMany) => <span>{game.score.homeTeamScore}</span>
    },
    {
      title: 'AWAY',
      render: (game: GameMany) => (
        <div className="flex items-center">
          {game.awayTeam?.profileImgUrl ? (
            <img
              src={game.awayTeam.profileImgUrl}
              alt={game.awayTeam.name}
              className="mr-2 w-8"
            />
          ) : (
            <img src="/logo/KAFA_OG.png" alt="" className="mr-2 w-8" />
          )}
          <span>{game.awayTeam?.name}</span>
        </div>
      )
    },
    {
      title: '',
      render: (game: GameMany) => <span>{game.score?.awayTeamScore}</span>
    },
    {
      title: 'DATE',
      render: (game: GameMany) => {
        const date = game.startedAt ? new Date(game.startedAt) : null
        const formattedDate = date
          ? `${date.getMonth() + 1}/${date.getDate()} ${
              date.getHours() >= 12 ? 'PM' : 'AM'
            } ${date.getHours() % 12 === 0 ? 12 : date.getHours() % 12}:${date
              .getMinutes()
              .toString()
              .padStart(2, '0')}`
          : 'N/A'

        return (
          <div>
            <span>{formattedDate}</span>
          </div>
        )
      }
    },
    {
      title: 'LOCATION',
      render: (game: GameWithStadium) => (
        <div>
          <span>{game.stadium}</span>
        </div>
      )
    }
  ]
  const goToGallery = (id: number) => {
    console.log(id)
  }

  const goToNotice = (id: number) => {
    console.log('Card clicked:', id)
  }

  return (
    <div className="container mx-auto my-5 grid max-w-screen-2xl grid-cols-1 px-5 sm:grid-cols-3">
      <div className="col-span-2">
        <div className="my-5">
          <DefaultTable title="경기일정" data={games} columns={gamesColumns} />
        </div>
        <div className="my-5">
          <NoticeWideCard
            id={2}
            cardName="GALLERY"
            onClick={goToGallery}
            newsCardPropsArray={galleryData}
          />
        </div>
      </div>
      <div className="col-span-1">
        <div className="mx-5 my-5">
          <NoticeNarrowCard cardName="NOTICE" onClick={goToNotice}>
            {notices.map((notice) => (
              <NoticeList
                key={notice.id}
                id={notice.id}
                noticeName={notice.noticeName}
                writer={notice.writer}
                period={notice.period}
                onClick={() => notice.onClick(notice.id)}
              />
            ))}
          </NoticeNarrowCard>
        </div>
      </div>
    </div>
  )
}

export default TeamHomeItem
