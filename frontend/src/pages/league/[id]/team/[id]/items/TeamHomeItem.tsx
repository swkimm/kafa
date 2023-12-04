// TeamHomeItem.tsx
// import { useParams } from 'react-router-dom'
import type { NewsCardProps } from '@/components/cards/NewsCard'
import NoticeNarrowCard from '@/components/cards/NoticeNarrowCard'
import NoticeWideCard from '@/components/cards/NoticeWideCard'
import NoticeList from '@/components/stackedList/NoticeList'
import DefaultTable from '@/components/tables/DefaultTable'

interface Notice {
  id: number
  noticeName: string
  writer: string
  period: string
  onClick: (id: number) => void
}

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

const upComingGame: Game[] = [
  {
    id: 1,
    homeTeam: 'TBD',
    homeTeamLogo: '/logo/KAFA_OG.png',
    homeScore: 0,
    awayTeam: 'TBD',
    awayTeamLogo: '/logo/KAFA_OG.png',
    awayScore: 0,
    date: '00/00 PM 12:00',
    location: '홈 스타디움'
  },
  {
    id: 2,
    homeTeam: 'TBD',
    homeTeamLogo: '/logo/KAFA_OG.png',
    homeScore: 0,
    awayTeam: 'TBD',
    awayTeamLogo: '/logo/KAFA_OG.png',
    awayScore: 0,
    date: '00/00 PM 12:00',
    location: '홈 스타디움'
  },
  {
    id: 3,
    homeTeam: 'TBD',
    homeTeamLogo: '/logo/KAFA_OG.png',
    homeScore: 0,
    awayTeam: 'TBD',
    awayTeamLogo: '/logo/KAFA_OG.png',
    awayScore: 0,
    date: '00/00 PM 12:00',
    location: '홈 스타디움'
  },
  {
    id: 4,
    homeTeam: 'TBD',
    homeTeamLogo: '/logo/KAFA_OG.png',
    homeScore: 0,
    awayTeam: 'TBD',
    awayTeamLogo: '/logo/KAFA_OG.png',
    awayScore: 0,
    date: '00/00 PM 12:00',
    location: '홈 스타디움'
  }
]

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

const TeamHomeItem = () => {
  const upcomingGamesColumns = [
    {
      title: 'HOME',
      render: (upComingGame: Game) => (
        <div className="flex items-center">
          <img
            src={upComingGame.homeTeamLogo}
            alt={upComingGame.homeTeam}
            className="mr-2 w-8"
          />
          <span>{upComingGame.homeTeam}</span>
        </div>
      )
    },
    {
      title: '',
      render: (upComingGame: Game) => <span>{upComingGame.homeScore}</span>
    },
    {
      title: 'AWAY',
      render: (upComingGame: Game) => (
        <div className="flex items-center">
          <img
            src={upComingGame.awayTeamLogo}
            alt={upComingGame.awayTeam}
            className="mr-2 w-8"
          />
          <span>{upComingGame.awayTeam}</span>
        </div>
      )
    },
    {
      title: '',
      render: (upComingGame: Game) => <span>{upComingGame.awayScore}</span>
    },
    {
      title: 'DATE',
      render: (upComingGame: Game) => (
        <div>
          <span>{upComingGame.date}</span>
        </div>
      )
    },
    {
      title: 'LOCATION',
      render: (upComingGame: Game) => (
        <div>
          <span>{upComingGame.location}</span>
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
          <DefaultTable
            title="경기일정"
            data={upComingGame}
            columns={upcomingGamesColumns}
          />
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
          <NoticeNarrowCard id={123} cardName="NOTICE" onClick={goToNotice}>
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
