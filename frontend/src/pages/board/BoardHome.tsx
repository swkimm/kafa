import axiosInstance from '@/commons/axios'
import type { BasicPost } from '@/commons/interfaces/board/board.type'
import PostList from '@/components/boards/PostList'
import { PencilIcon } from '@heroicons/react/20/solid'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface BoardHomeProps {}

export const BoardHome: React.FC<BoardHomeProps> = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [posts, setPosts] = useState<BasicPost[]>()
  const [totalPosts, setTotalPosts] = useState(0)
  const navigate = useNavigate()

  const init = useCallback(async () => {
    const posts = await getPosts(1)
    setPosts(posts)

    const counts = await getTotalPostCounts()
    setTotalPosts(counts)
  }, [setPosts, setTotalPosts])

  useEffect(() => {
    init()
  }, [init])

  const getPosts = async (page: number): Promise<BasicPost[]> => {
    const posts: BasicPost[] = await axiosInstance
      .get(`/boards/posts?page=${page}&limit=10`)
      .then((result) => result.data)

    posts.forEach((post) => (post.createdAt = new Date(post.createdAt)))
    return posts
  }

  const getTotalPostCounts = async (): Promise<number> => {
    const data: { counts: number } = await axiosInstance
      .get('/boards/posts/counts')
      .then((result) => result.data)

    return data.counts
  }

  const getNextPage = async (): Promise<void> => {
    const newPosts = await getPosts(currentPage + 1)
    setPosts(newPosts)
    setCurrentPage(currentPage + 1)
  }

  const getPreviousPage = async (): Promise<void> => {
    if (currentPage > 1) {
      const newPosts = await getPosts(currentPage - 1)
      setPosts(newPosts)
      setCurrentPage(currentPage - 1)
    }
  }

  const handlePostClick = (postId: number) => {
    navigate(`/board/posts/${postId}`)
  }

  const handleCreatePostClick = () => {
    navigate('/board/posts/new')
  }

  return (
    <>
      <div className="mx-auto flex max-w-screen-sm flex-col px-4 py-8 sm:max-w-screen-xl lg:px-20">
        <div className="flex items-center justify-between pb-8">
          <h1 className="text-xl font-bold sm:text-2xl">전체 게시판</h1>
          <button
            onClick={handleCreatePostClick}
            className="inline-flex items-center rounded-md bg-indigo-950 px-3.5 py-2.5 text-xs font-semibold text-white shadow-xl hover:bg-indigo-900 sm:text-sm"
          >
            <PencilIcon
              className="-ml-0.5 mr-1.5 h-3 w-3 text-white sm:h-4 sm:w-4"
              aria-hidden="true"
            />
            글쓰기
          </button>
        </div>
        <PostList
          posts={posts}
          onPostClick={handlePostClick}
          pagination={{
            currentPage,
            totalPosts,
            onNextClick: getNextPage,
            onPreviousClick: getPreviousPage
          }}
        ></PostList>
      </div>
    </>
  )
}

export default BoardHome
