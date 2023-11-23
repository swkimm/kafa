import type { NewsCardProps } from '@/components/cards/NewsCard'
import NoticeNarrow from '@/components/cards/NoticeNarrowCard'
import NoticeWideCard from '@/components/cards/NoticeWideCard'
import LeagueList from '@/components/stackedList/LeagueList'
import NoticeList from '@/components/stackedList/NoticeList'
import GameTable from '@/components/tables/GameTable'
import { useNavigate } from 'react-router-dom'

const HomeItem = () => {
  const navigate = useNavigate()
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

  const gamesData = [
    {
      leagueName: '제 00회 KFNL 00 경기',
      date: '2023-11-03',
      homeTeam: {
        id: 1,
        logo: 'HomeTeamLogo',
        name: 'Home Team',
        score: 12
      },
      awayTeam: {
        id: 2,
        logo: 'AwayTeamLogo',
        name: 'Away Team',
        score: 8
      }
    }
    // Add more dummy game objects as needed for the story
  ]

  const leagues = [
    {
      leagueId: 1,
      leagueName: '제 28회 KNFL',
      status: '진행중',
      conference: '사회인연맹',
      period: '2023/01/01 ~ 2023/01/13',
      onClick: { goToLeague }
    },
    {
      leagueId: 2,
      leagueName: '제 28회 KNFL',
      status: '종료됨',
      conference: '사회인연맹',
      period: '2023/01/01 ~ 2023/01/13',
      onClick: { goToLeague }
    },
    {
      leagueId: 3,
      leagueName: '제 28회 KNFL',
      status: '진행중',
      conference: '사회인연맹',
      period: '2023/01/01 ~ 2023/01/13',
      onClick: { goToLeague }
    },
    {
      leagueId: 4,
      leagueName: '제 28회 KNFL',
      status: '종료됨',
      conference: '사회인연맹',
      period: '2023/01/01 ~ 2023/01/13',
      onClick: { goToLeague }
    },
    {
      leagueId: 5,
      leagueName: '제 28회 KNFL',
      status: '진행중',
      conference: '사회인연맹',
      period: '2023/01/01 ~ 2023/01/13',
      onClick: { goToLeague }
    }
  ]

  const partnerLogos = [
    {
      src: 'https://i.namu.wiki/i/BoeCB4TIQdrkDq2nvIoJjsP_vfA1u0EANezgLYbfvaCmdk-2cQEn5w5atSzJaCGnGxFyuC_VJMBLOhGFRhqDSA.svg',
      alt: 'Partner 1 Logo'
    },
    {
      src: 'https://i.namu.wiki/i/7odiKOobwcRn3h5h_Qj63poBcBpLas3nOiDi1T2MpFPACvELiPckUz1sand2gAyOx9hQMn3IQ9HgH_cAtFsokg.svg',
      alt: 'Partner 2 Logo'
    }
  ]

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
    <div className="mx-auto grid max-w-screen-2xl gap-4 px-5 sm:grid-cols-1 md:grid-cols-3">
      <div className="overflow-x-auto md:col-span-2">
        {' '}
        <div className="md:flex md:flex-row">
          <div className="flex-grow overflow-x-auto p-3">
            <GameTable title="대진표1" games={gamesData} />
          </div>
          <div className="flex-grow overflow-x-auto p-3">
            <GameTable title="대진표2" games={gamesData} />
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
          <div className="mb-3 bg-blue-950 p-8">1</div>
          <div className="mb-3 bg-blue-950 p-8">1</div>
          <div className="mb-3 bg-blue-950 p-8">1</div>
        </div>
        <div className="p-3 sm:w-full">
          <NoticeNarrow id={123} cardName="NOTICE" onClick={goToNotice}>
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
          <NoticeNarrow id={2} cardName="LEAGUES" onClick={goToLeague}>
            {leagues.map((league) => (
              <LeagueList
                key={league.leagueId}
                leagueId={league.leagueId}
                leagueName={league.leagueName}
                status={league.status}
                conference={league.conference}
                period={league.period}
                onClick={goToLeague}
              />
            ))}
          </NoticeNarrow>
        </div>
        <div className="p-3">
          <NoticeNarrow id={123} cardName="PARTNERS" onClick={goToPartners}>
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="border-b p-3">
                <div className="flex justify-between">
                  {partnerLogos.map((logo, logoIndex) => (
                    <img
                      key={logoIndex}
                      className={`h-12 ${logoIndex > 0 ? 'ml-5' : ''}`} // Add margin-left if it's not the first logo
                      src={logo.src}
                      alt={logo.alt}
                    />
                  ))}
                </div>
              </div>
            ))}
          </NoticeNarrow>
        </div>
      </div>
    </div>
  )
}

export default HomeItem
