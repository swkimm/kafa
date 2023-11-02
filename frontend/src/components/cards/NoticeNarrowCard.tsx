// NoticeNarrow.tsx
import type React from 'react'
import NoticeList from '../stackedList/NoticeList'

interface NoticeNarrowProps {
  id: number
  cardName: string
  onClick?: (id: number) => void
}

const NoticeNarrow: React.FC<NoticeNarrowProps> = ({
  id,
  cardName,
  onClick
}) => {
  const handleNoticeClick = (id: number) => {
    console.log(id)
    onClick?.(id) // 추가적으로 부모 컴포넌트에서 전달한 onClick 함수도 호출
  }
  return (
    <div className="w-80 border border-black">
      <div className="mb-3 border-b border-gray-800 bg-white px-4 py-5 sm:px-6">
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
      <div className="mb-3">
        <NoticeList
          id={1}
          noticeName="공지사항 1"
          writer="관리자"
          period="2023/01/01 13:00"
          onClick={() => handleNoticeClick(1)}
        />
        <NoticeList
          id={2}
          noticeName="공지사항 2"
          writer="관리자"
          period="2023/01/02 13:00"
          onClick={() => handleNoticeClick(2)}
        />
        <NoticeList
          id={3}
          noticeName="공지사항 3"
          writer="관리자"
          period="2023/01/03 13:00"
          onClick={() => handleNoticeClick(3)}
        />
      </div>
    </div>
  )
}

export default NoticeNarrow
