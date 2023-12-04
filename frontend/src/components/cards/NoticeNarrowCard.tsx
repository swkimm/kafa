import type React from 'react'

interface NoticeNarrowProps {
  id: number
  cardName: string
  onClick?: (id: number) => void
  children?: React.ReactNode // children prop을 추가합니다.
}

const NoticeNarrow: React.FC<NoticeNarrowProps> = ({
  id,
  cardName,
  onClick,
  children // children을 받아옵니다.
}) => {
  return (
    <div className="border bg-white">
      <div className="mb-3 border-b bg-white px-4 py-5 sm:px-6">
        <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
          <div className="ml-4 mt-2">
            <div className="text-base font-semibold leading-6 text-gray-900">
              {cardName}
            </div>
          </div>
          <div className="ml-4 mt-2 flex-shrink-0">
            <svg
              className="h-6 w-6 cursor-pointer"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              onClick={() => onClick?.(id)}
            >
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="mb-3 overflow-auto">
        {children} {/* children을 렌더링합니다. */}
      </div>
    </div>
  )
}

export default NoticeNarrow
