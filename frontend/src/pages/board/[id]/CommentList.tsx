import type { Comment } from '@/commons/interfaces/comment/comment.type'
import { UserCircleIcon } from '@heroicons/react/24/outline'

interface CommentListProps {
  comments: Comment[]
  accountId: number
  onCommentDetele: (commentId: number) => void
}

const CommentList: React.FC<CommentListProps> = ({
  comments,
  accountId,
  onCommentDetele
}) => {
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

  return (
    <div className="flex flex-col">
      {comments
        ? comments.map((comment) => {
            return (
              <div
                key={comment.id}
                className="flex flex-col border-b border-gray-400 py-2 sm:flex-row sm:py-3.5"
              >
                <div className="flex w-full items-center text-start text-xs text-gray-600 sm:w-1/6 sm:text-sm">
                  <UserCircleIcon
                    className="mr-1.5 hidden h-5 w-5 flex-shrink-0 sm:inline-block"
                    aria-hidden="true"
                  />
                  <p>{comment.Account.name}</p>
                  {comment.Account.id === accountId ? (
                    <button
                      onClick={() => onCommentDetele(comment.id)}
                      className="ml-1 text-xs text-gray-400 hover:text-indigo-600"
                    >
                      삭제
                    </button>
                  ) : null}
                </div>
                <p className="mt-1.5 flex w-full items-center text-start text-xs text-black sm:mt-0 sm:w-4/6 sm:text-sm">
                  {comment.content}
                </p>
                <p className="w-full text-end text-xs text-gray-500 sm:w-1/6">
                  {timeAgo(comment.createdAt)}
                </p>
              </div>
            )
          })
        : null}
    </div>
  )
}

export default CommentList
