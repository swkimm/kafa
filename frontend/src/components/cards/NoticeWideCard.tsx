// NoticeWideCard.tsx
import type React from 'react'
import NewsCard, { type NewsCardProps } from './NewsCard'

interface NoticeWideCardProps {
  id: number
  cardName: string
  onClick?: (id: number) => void
  newsCardPropsArray: NewsCardProps[]
}

const NoticeWideCard: React.FC<NoticeWideCardProps> = ({
  id,
  cardName,
  onClick,
  newsCardPropsArray
}) => {
  return (
    <div className="border border-black bg-white">
      <div className="mb-3 border-b border-l-8 border-gray-800 bg-white px-4 py-5 sm:px-6">
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
      <div className="mb-3 flex w-full snap-x snap-mandatory overflow-x-auto">
        {newsCardPropsArray?.map((newsCardProps, index) => (
          <div key={index} className="min-w-0 flex-shrink-0 snap-center pr-3">
            <NewsCard {...newsCardProps} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default NoticeWideCard
