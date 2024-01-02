import PropTypes from 'prop-types'

type PaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  // 컴포넌트 로직...
  return (
    <div className="flex items-center justify-center">
      {/* 이전 버튼: 첫 페이지가 아닐 때만 표시 */}
      {currentPage > 1 && (
        <button onClick={() => onPageChange(currentPage - 1)}>Previous</button>
      )}

      {/* Page Numbers */}
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index + 1}
          className={`mx-1 px-4 py-2 ${
            currentPage === index + 1 ? 'bg-blue-500 text-white' : ''
          }`}
          onClick={() => onPageChange(index + 1)}
        >
          {index + 1}
        </button>
      ))}

      {/* 다음 버튼: 마지막 페이지가 아닐 때만 표시 */}
      {currentPage < totalPages && (
        <button onClick={() => onPageChange(currentPage + 1)}>Next</button>
      )}
    </div>
  )
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired
}

export default Pagination
