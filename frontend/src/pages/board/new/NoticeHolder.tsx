interface NoticeHolderProps {
  isNotice: boolean
  handleNoticeChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  disabled: boolean
}

const NoticeHolder: React.FC<NoticeHolderProps> = ({
  isNotice,
  handleNoticeChange,
  disabled
}) => {
  return (
    <>
      <div className="relative flex gap-x-3">
        <div className="flex h-6 items-center">
          <input
            id="notice"
            checked={isNotice}
            onChange={handleNoticeChange}
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            disabled={disabled}
          />
        </div>
        <div className="text-xs leading-6 sm:text-sm">
          <label className="font-semibold text-gray-900">공지사항</label>
          <p className="text-gray-500">
            지금 작성한 글을 공지사항으로 등록합니다
          </p>
        </div>
      </div>
    </>
  )
}

export default NoticeHolder
