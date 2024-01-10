import axiosInstance from '@/commons/axios'
import type { Profile } from '@/commons/interfaces/account/profile'
import type { DetailPost } from '@/commons/interfaces/board/board.type'
import PostViewer from '@/components/boards/PostViewer'
import {
  CalendarIcon,
  PencilIcon,
  TrashIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

interface PostProps {}

const Post: React.FC<PostProps> = () => {
  const [post, setPost] = useState<DetailPost>()
  const [profile, setProfile] = useState<Profile>()
  const params = useParams()
  const navigate = useNavigate()

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
  }, [getPost])

  useEffect(() => {
    init()
  }, [init])

  if (!post) {
    return null
  }

  return (
    <>
      <div className="mx-auto my-1 flex max-w-screen-sm flex-col px-4 sm:my-5 sm:max-w-screen-xl sm:px-20">
        <div className="rounded-none bg-transparent">
          <div className="px-3 py-6 lg:flex lg:items-center lg:justify-between">
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                {post?.title}
              </h2>
              <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <UserCircleIcon
                    className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                    aria-hidden="true"
                  />
                  {post?.Account.name}
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <CalendarIcon
                    className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                    aria-hidden="true"
                  />
                  {post?.createdAt.toLocaleString('ko')}
                </div>
              </div>
            </div>
            {profile?.role === 'Admin' ? (
              <div className="mt-5 flex lg:ml-4 lg:mt-0">
                <span>
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    <PencilIcon
                      className="-ml-0.5 mr-1.5 h-4 w-4 text-gray-400"
                      aria-hidden="true"
                    />
                    수정하기
                  </button>
                </span>
                <span className="ml-3">
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    <TrashIcon
                      className="-ml-0.5 mr-1.5 h-4 w-4"
                      aria-hidden="true"
                    />
                    삭제하기
                  </button>
                </span>
              </div>
            ) : null}
          </div>
          <div className="border-t border-gray-400 py-3"></div>
          <div className="px-1 pb-10">
            {post ? <PostViewer content={post?.content}></PostViewer> : <p></p>}
          </div>
          <div className="border-t border-gray-400 py-3"></div>
          <div className="px-3 pb-10">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              목록으로
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Post
