// MultipleLineNarrowCard.tsx
import type React from 'react'
import { useEffect, useState } from 'react'
import NewsCard, { type NewsCardProps } from './NewsCard'

interface MultipleLineNarrowCardProps {
  id: number
  cardName: string
  onClick?: (id: number) => void
  newsCardPropsArray: NewsCardProps[]
}

const MultipleLineNarrowCard: React.FC<MultipleLineNarrowCardProps> = ({
  id,
  cardName,
  onClick,
  newsCardPropsArray
}) => {
  const [visibleCards, setVisibleCards] = useState(newsCardPropsArray)

  useEffect(() => {
    const updateVisibleCards = () => {
      const width = window.innerWidth
      if (width < 640) {
        // 예를 들어, TailwindCSS의 'sm' 브레이크포인트
        setVisibleCards(newsCardPropsArray.slice(0, 1))
      } else {
        setVisibleCards(newsCardPropsArray)
      }
    }

    window.addEventListener('resize', updateVisibleCards)
    updateVisibleCards()

    return () => {
      window.removeEventListener('resize', updateVisibleCards)
    }
  }, [newsCardPropsArray])
  return (
    <div className="border bg-white">
      <div className="mb-3 border-b border-l-8 border-l-black bg-white px-4 py-5 sm:px-6">
        <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
          <div className="ml-4 mt-2">
            <div className="text-base font-semibold leading-6 text-gray-900">
              {cardName}
            </div>
          </div>
          <div className="ml-4 mt-2 flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6 cursor-pointer"
              onClick={() => onClick?.(id)}
            >
              <path
                fillRule="evenodd"
                d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {visibleCards.map((newsCardProps, index) => (
          <div key={index} className="flex-shrink-0">
            <NewsCard {...newsCardProps} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default MultipleLineNarrowCard
