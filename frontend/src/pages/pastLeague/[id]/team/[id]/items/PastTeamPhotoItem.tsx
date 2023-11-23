// PastTeamPhotoItem.tsx
import type { NewsCardProps } from '@/components/cards/NewsCard'
import NoticeWideCard from '@/components/cards/NoticeWideCard'

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
  },
  {
    imageSrc: '/logo/KAFA_OG.png',
    title: 'Gallery Title 2',
    description: 'Gallery Description 2',
    variant: 'wide'
  },
  {
    imageSrc: '/logo/KAFA_OG.png',
    title: 'Gallery Title 2',
    description: 'Gallery Description 2',
    variant: 'wide'
  },
  {
    imageSrc: '/logo/KAFA_OG.png',
    title: 'Gallery Title 2',
    description: 'Gallery Description 2',
    variant: 'wide'
  },
  {
    imageSrc: '/logo/KAFA_OG.png',
    title: 'Gallery Title 2',
    description: 'Gallery Description 2',
    variant: 'wide'
  }
]

const PastTeamPhotoItem = () => {
  const goToGallery = (id: number) => {
    console.log(id)
  }
  return (
    <div className="container mx-auto my-5">
      <div className="mx-5 my-5">
        <NoticeWideCard
          id={2}
          cardName="GALLERY"
          onClick={goToGallery}
          newsCardPropsArray={galleryData}
        />
      </div>{' '}
    </div>
  )
}

export default PastTeamPhotoItem
