import axiosInstance from '@/commons/axios'
import type { Profile } from '@/commons/interfaces/account/profile'
import type { Attachment } from '@/commons/interfaces/attachment/attachment.type'
import type { DetailPost } from '@/commons/interfaces/board/board.type'
import type { Comment } from '@/commons/interfaces/comment/comment.type'
import CommentEditor from '@/components/boards/CommentEditor'
import TextEditor from '@/components/boards/TextEditor'
import {
  CalendarIcon,
  PencilIcon,
  TrashIcon,
  UserCircleIcon,
  ArrowLeftEndOnRectangleIcon,
  PaperClipIcon
} from '@heroicons/react/24/outline'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CustomUploadAdapterPlugin } from '../adapter'
import CommentList from './CommentList'

interface PostProps {}

const Post: React.FC<PostProps> = () => {
  const [post, setPost] = useState<DetailPost>()
  const [profile, setProfile] = useState<Profile>()
  const [comments, setComments] = useState<Comment[]>([])
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const params = useParams()
  const navigate = useNavigate()

  const getAttachments = useCallback(async (): Promise<Attachment[]> => {
    const attachments: Attachment[] = await axiosInstance
      .get(`/boards/posts/${params.id}/attachments`)
      .then((result) => result.data)
      .catch(() => [])

    return attachments
  }, [params.id])

  const getComments = useCallback(async (): Promise<Comment[]> => {
    const comments: Comment[] = await axiosInstance
      .get(`/boards/posts/${params.id}/comments`)
      .then((result) => result.data)
      .catch(() => [])

    comments.forEach(
      (comment) => (comment.createdAt = new Date(comment.createdAt))
    )

    return comments
  }, [params.id])

  const getPost = useCallback(async (): Promise<DetailPost> => {
    const post: DetailPost = await axiosInstance
      .get(`/boards/posts/${params.id}`)
      .then((result) => result.data)

    post.createdAt = new Date(post.createdAt)
    post.updatedAt = new Date(post.updatedAt)

    return post
  }, [params.id])

  const init = useCallback(async () => {
    const post = await getPost()
    setPost(post)

    const data: Profile = await axiosInstance
      .get('/account/profile')
      .then((result) => result.data)
      .catch(() => {
        return { role: 'Public' }
      })

    setProfile(data)

    const comments = await getComments()
    setComments(comments)

    const attachments = await getAttachments()
    setAttachments(attachments)
  }, [getPost, getComments, getAttachments])

  useEffect(() => {
    init()
  }, [init])

  const deletePost = async () => {
    try {
      await axiosInstance.delete(`/boards/posts/${params.id}`)
      alert('게시글이 삭제되었습니다')
      navigate('/board')
    } catch (error) {
      alert('오류 발생')
    } finally {
      navigate('/board')
    }
  }

  const submitComment = async (content: string) => {
    await axiosInstance
      .post(`/boards/posts/${params.id}/comments`, {
        content
      })
      .then(() => alert('댓글이 등록되었습니다'))
      .catch((error) => alert(error.response.data.message))

    location.reload()
  }

  const deleteComment = async (commentId: number) => {
    await axiosInstance
      .delete(`/boards/comments/${commentId}`)
      .then(() => {
        alert('삭제되었습니다')
        location.reload()
      })
      .catch((error) => {
        alert(error.response.data.message)
      })
  }

  if (!post) {
    return null
  }

  return (
    <>
      <div className="mx-auto my-0.5 flex max-w-screen-sm flex-col px-0 sm:my-5 sm:max-w-screen-xl sm:px-20">
        <div className="rounded-none bg-transparent">
          <div className="px-3 py-6 lg:flex lg:items-center lg:justify-between">
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                {post.title}
              </h2>
              <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <UserCircleIcon
                    className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                    aria-hidden="true"
                  />
                  {post.Account.name}
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <CalendarIcon
                    className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                    aria-hidden="true"
                  />
                  {post.createdAt.toLocaleString('ko')}
                </div>
              </div>
            </div>
            {profile?.role === 'Admin' || profile?.id === post.Account.id ? (
              <div className="mt-5 flex lg:ml-4 lg:mt-0">
                <span>
                  <button
                    type="button"
                    onClick={() => navigate('edit')}
                    className="inline-flex items-center rounded-md bg-indigo-950 px-3.5 py-2.5 text-xs font-semibold text-white shadow-xl hover:bg-indigo-900 sm:text-sm"
                  >
                    <PencilIcon
                      className="-ml-0.5 mr-1.5 h-3 w-3 text-white sm:h-4 sm:w-4"
                      aria-hidden="true"
                    />
                    수정하기
                  </button>
                </span>
                <span className="ml-1.5">
                  <button
                    type="button"
                    onClick={deletePost}
                    className="inline-flex items-center rounded-md bg-indigo-950 px-3.5 py-2.5 text-xs font-semibold text-white shadow-xl hover:bg-indigo-900 sm:text-sm"
                  >
                    <TrashIcon
                      className="-ml-0.5 mr-1.5 h-3 w-3 text-white sm:h-4 sm:w-4"
                      aria-hidden="true"
                    />
                    삭제하기
                  </button>
                </span>
              </div>
            ) : null}
          </div>
          <div className="border-t border-gray-400 py-3"></div>
          <div className="px-1 pb-2">
            {post ? (
              <TextEditor
                content={post.content}
                mode="view"
                CustomUploadAdapterPlugin={CustomUploadAdapterPlugin}
                disabled={true}
                onContentChange={() => []}
                removeImage={() => []}
              ></TextEditor>
            ) : null}
            {attachments ? <div className="mt-1.5"></div> : null}
            {attachments
              ? attachments.map((attachment) => {
                  return (
                    <div key={attachment.id} className="px-3 py-1.5 text-sm">
                      <div className="flex items-center">
                        <PaperClipIcon
                          className="h-5 w-5 flex-shrink-0 text-gray-400"
                          aria-hidden="true"
                        />
                        <div className="ml-4 gap-2 text-gray-600">
                          {attachment.name}
                        </div>
                        <div className="ml-4">
                          <a
                            href={attachment.fileUrl}
                            className="font-medium text-indigo-900 hover:text-indigo-800"
                            target="_blank"
                            rel="noreferrer"
                          >
                            다운로드
                          </a>
                        </div>
                      </div>
                    </div>
                  )
                })
              : null}
          </div>
          <div className="border-t border-gray-400 py-3"></div>
          <div className="px-3 pb-6">
            <button
              onClick={() => navigate('/board')}
              className="inline-flex items-center rounded-md bg-indigo-950 px-3.5 py-2.5 text-xs font-semibold text-white shadow-xl hover:bg-indigo-900 sm:text-sm"
            >
              <ArrowLeftEndOnRectangleIcon
                className="-ml-0.5 mr-1.5 h-3 w-3 text-white sm:h-4 sm:w-4"
                aria-hidden="true"
              ></ArrowLeftEndOnRectangleIcon>
              목록으로
            </button>
          </div>
          <div className="border-t border-gray-400"></div>
          <div className="px-3 pb-3.5">
            <CommentList
              onCommentDetele={deleteComment}
              comments={comments}
              accountId={profile?.id ?? 0}
            ></CommentList>
          </div>
          <div className="px-3 pb-5">
            <div className="flex">
              <div className="flex w-1/6 text-start text-xs text-gray-600 sm:text-sm">
                <UserCircleIcon
                  className="mr-1.5 h-5 w-5 flex-shrink-0"
                  aria-hidden="true"
                />
                나
              </div>
              <div className="w-5/6">
                <CommentEditor onSubmitComment={submitComment}></CommentEditor>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Post
