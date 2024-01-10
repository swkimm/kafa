interface BoardPaginationProp {
  currentPage: number
  totalPosts: number
  onPreviousClick?: () => void
  onNextClick?: () => void
}

const BoardPagination: React.FC<BoardPaginationProp> = ({
  currentPage,
  totalPosts,
  onPreviousClick,
  onNextClick
}) => {
  return (
    <nav
      className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
      aria-label="Pagination"
    >
      <div className="hidden sm:block">
        <p className="text-sm text-gray-700">
          Showing{' '}
          <span className="font-medium">{10 * (currentPage - 1) + 1}</span> to{' '}
          <span className="font-medium">
            {10 * (currentPage - 1) + 10 < totalPosts
              ? 10 * (currentPage - 1) + 10
              : totalPosts}
          </span>{' '}
          of <span className="font-medium">{totalPosts}</span> results
        </p>
      </div>
      <div className="flex flex-1 justify-end">
        {currentPage > 1 ? (
          <button
            onClick={onPreviousClick}
            className="relative inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
          >
            이전
          </button>
        ) : null}
        {10 * (currentPage - 1) + 10 < totalPosts ? (
          <button
            onClick={onNextClick}
            className="relative ml-1.5 inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
          >
            다음
          </button>
        ) : null}
      </div>
    </nav>
  )
}

export default BoardPagination
