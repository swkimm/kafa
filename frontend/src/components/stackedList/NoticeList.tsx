// NoticeList.tsx
import type React from 'react'

interface NoticeListProps {
  id: number
  noticeName: string
  writer: string
  period: string
  onClick: (id: number) => void // 필수 프로퍼티로 변경
}

const NoticeList: React.FC<NoticeListProps> = ({
  id,
  noticeName,
  writer,
  period,
  onClick
}) => {
  const handleOnClick = () => {
    console.log(id)
    onClick(id) // 필수 프로퍼티이므로 바로 호출
  }
  return (
    <div className="mt-3 border-b">
      <div
        className="mr-3 flex items-center justify-between"
        onClick={handleOnClick}
      >
        <div className="mx-3 flex">
          <div className="font-bold">{noticeName}</div>
          <div className="pl-3"></div>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-6 w-6 cursor-pointer"
          onClick={() => handleOnClick?.()}
        >
          <path
            fillRule="evenodd"
            d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div className="mx-3 mb-2 pb-2 text-gray-400">
        {period} {writer}
      </div>
    </div>
  )
}

export default NoticeList
