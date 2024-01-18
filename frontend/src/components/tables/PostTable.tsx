import type { BasicPost } from '@/commons/interfaces/board/board.type'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'

interface PostTableProps {
  posts: BasicPost[]
}

export const PostTable: React.FC<PostTableProps> = ({ posts }) => {
  const navigate = useNavigate()
  return (
    <div className="py-5">
      {posts.length > 0 ? (
        <div className="flex flex-col gap-y-3">
          {posts.map((post) => {
            return (
              <div
                className="flex flex-row items-center justify-between"
                key={post.id}
              >
                <div className="flex flex-row items-center gap-x-2">
                  {post.type === 'Notice' ? (
                    <span className="inline-flex items-center rounded-full bg-pink-50 px-2 py-1 text-xs font-medium text-pink-700 ring-1 ring-inset ring-pink-700/10">
                      공지
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                      전체
                    </span>
                  )}
                  <button
                    onClick={() => navigate(`/board/posts/${post.id}`)}
                    className="text-sm text-gray-900 hover:text-gray-600"
                  >
                    {post.title}
                  </button>
                </div>
                <p className="text-xs text-gray-400">{post.Account.name}</p>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="mx-auto flex w-full items-center justify-center">
          <ExclamationTriangleIcon className="h-6 w-6 pr-1.5 text-yellow-500" />
          <p className="text-sm font-medium text-gray-900">게시물이 없습니다</p>
        </div>
      )}
    </div>
  )
}
