// PostList.tsx
import type { BasicPost } from '@/commons/interfaces/board/board.type'
import BoardPagination from '../pagination/BoardPagination'

interface PostListProps {
  posts: BasicPost[] | undefined
  onPostClick: (postId: number) => void
  pagination: {
    currentPage: number
    totalPosts: number
    onPreviousClick?: () => void
    onNextClick?: () => void
  }
}

const timeAgo = (date: Date): string => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      '0'
    )}-${String(date.getDate()).padStart(2, '0')}`
  } else if (hours > 0) {
    return `${hours}시간 전`
  } else if (minutes > 0) {
    return `${minutes}분 전`
  } else {
    return '방금 전'
  }
}

const PostList: React.FC<PostListProps> = ({
  posts,
  onPostClick,
  pagination
}) => {
  return (
    <>
      <div className="flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto pb-5 sm:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-4 lg:px-8">
            <div className="overflow-hidden rounded-none shadow-md ring-1 ring-black ring-opacity-5 lg:rounded-lg lg:shadow-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="w-1/12 py-3.5 pl-4 pr-3 text-left text-xs font-semibold text-gray-900 sm:pl-6 sm:text-base"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      className="w-7/12 px-3 py-3.5 text-left text-xs font-semibold text-gray-900 sm:text-base"
                    >
                      제목
                    </th>
                    <th
                      scope="col"
                      className="w-2/12 px-3 py-3.5 text-left text-xs font-semibold text-gray-900 sm:text-base"
                    >
                      글쓴이
                    </th>
                    <th
                      scope="col"
                      className="w-2/12 px-3 py-3.5 text-left text-xs font-semibold text-gray-900 sm:text-base"
                    >
                      등록일
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {!posts
                    ? null
                    : posts.map((post) => (
                        <tr
                          className="hover:bg-gray-100"
                          key={post.id}
                          onClick={() => onPostClick(post.id)}
                        >
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs font-medium text-gray-900 sm:pl-6 sm:text-sm">
                            {post.type === 'Notice' ? (
                              <strong className="text-red-700">공지</strong>
                            ) : (
                              post.id
                            )}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500 sm:text-sm">
                            {post.type === 'Notice' ? (
                              <strong className="text-gray-600">
                                {post.title}
                              </strong>
                            ) : (
                              post.title
                            )}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500 sm:text-sm">
                            <div className="flex items-center">
                              {post.Account.name}
                            </div>
                          </td>
                          <td className="whitespace-nowrap py-4 pl-4 pr-4 text-xs text-gray-500 sm:pr-6 sm:text-sm">
                            {timeAgo(post.createdAt)}
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
              <BoardPagination
                currentPage={pagination.currentPage}
                totalPosts={pagination.totalPosts}
                onPreviousClick={pagination.onPreviousClick}
                onNextClick={pagination.onNextClick}
              ></BoardPagination>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PostList
