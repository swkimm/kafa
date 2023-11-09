// TeamHomeItem.tsx
// import { useParams } from 'react-router-dom'
import NoticeNarrowCard from '@/components/cards/NoticeNarrowCard'
import NoticeWideCard from '@/components/cards/NoticeWideCard'
import NoticeList from '@/components/stackedList/NoticeList'
import DefaultTable from '@/components/tables/DefaultTable'

interface Person {
  name: string
  title: string
  email: string
  role: string
}

interface Notice {
  id: number
  noticeName: string
  writer: string
  period: string
  onClick: (id: number) => void
}

interface NewsCardProps {
  imageSrc: string
  title: string
  description: string
  variant?: 'wide' | 'narrow'
  onClick?: () => void
}

const people: Person[] = [
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member'
  },
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member'
  },
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member'
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
  // const { teamId } = useParams<{ teamId?: string }>()

  const goToGallery = (id: number) => {
    console.log(id)
  }

  const goToNotice = (id: number) => {
    console.log('Card clicked:', id)
  }

  return (
    <div className="container mx-auto grid max-w-screen-2xl px-5 sm:grid-cols-1 md:grid-cols-3">
      <div className="col-span-2">
        <div className="my-5">
          <DefaultTable title="경기일정" data={people} />
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
