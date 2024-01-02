import MultipleLineNarrowCard from '@/components/cards/MultipleLineNarrowCard'
import type { NewsCardProps } from '@/components/cards/NewsCard'
import DropdownTransparent from '@/components/dropdown/DropdownTransparent'
import { useState } from 'react'

const galleryData: NewsCardProps[] = [
  {
    imageSrc: '/logo/KAFA_OG.png',
    title: 'Gallery Title 1',
    description: 'Gallery Description 1',
    variant: 'narrow'
  },
  {
    imageSrc: '/logo/KAFA_OG.png',
    title: 'Gallery Title 2',
    description: 'Gallery Description 2',
    variant: 'narrow'
  },
  {
    imageSrc: '/logo/KAFA_OG.png',
    title: 'Gallery Title 2',
    description: 'Gallery Description 2',
    variant: 'narrow'
  },
  {
    imageSrc: '/logo/KAFA_OG.png',
    title: 'Gallery Title 2',
    description: 'Gallery Description 2',
    variant: 'narrow'
  },
  {
    imageSrc: '/logo/KAFA_OG.png',
    title: 'Gallery Title 2',
    description: 'Gallery Description 2',
    variant: 'narrow'
  },
  {
    imageSrc: '/logo/KAFA_OG.png',
    title: 'Gallery Title 2',
    description: 'Gallery Description 2',
    variant: 'narrow'
  }
]

const associationOptions = [
  { id: 1, name: '서울미식축구협회' },
  { id: 2, name: '사회인미식축구연맹' },
  { id: 3, name: '대구경북미식축구협회' },
  { id: 4, name: '플래그풋볼협회' }
]

const leagueOptions = [
  { id: 1, name: '제00회 타이거볼' },
  { id: 2, name: '제00회 챌린지볼' },
  { id: 3, name: '제00회 광개토볼' },
  { id: 4, name: '제00회 김치볼' }
]

const PhotoItem = () => {
  const [selectedLeague, setSelectedLeague] = useState('제00회 타이거볼')

  const selectedOption = leagueOptions.find(
    (option) => option.name === selectedLeague
  )
  const tableTitle = selectedOption ? selectedOption.name : '제00회 타이거볼'

  // const gallery = result[selectedLeague] || []

  const handleSelect = (selected: number) => {
    // Change to number
    const selectedLeagueName = leagueOptions.find(
      (option) => option.id === selected
    )?.name
    setSelectedLeague(selectedLeagueName || '제00회 타이거볼')
    console.log(selectedLeagueName)
  }

  const goToGallery = () => {
    console.log('갤러리로 이동')
  }

  return (
    <div>
      <div className="bg-blue-950 p-5 sm:flex">
        <div className="mb-2 sm:mr-5">
          <DropdownTransparent
            optionName={associationOptions[0].name}
            optionList={associationOptions}
            onSelect={handleSelect}
          />
        </div>
        <div className="mb-2 sm:mr-5">
          <DropdownTransparent
            optionName={leagueOptions[0].name}
            optionList={leagueOptions}
            onSelect={handleSelect}
          />
        </div>
      </div>
      <div className="container mx-auto my-5">
        <MultipleLineNarrowCard
          id={2}
          cardName={tableTitle}
          onClick={goToGallery}
          newsCardPropsArray={galleryData}
        />
      </div>
    </div>
  )
}

export default PhotoItem
