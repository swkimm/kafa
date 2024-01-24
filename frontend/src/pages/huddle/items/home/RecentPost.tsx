import axiosInstance from '@/commons/axios'
import type { BasicPost } from '@/commons/interfaces/board/board.type'
import MainCard from '@/components/cards/MainCard'
import { PostTable } from '@/components/tables/PostTable'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const RecentPostSection: React.FC = () => {
  const [posts, setPosts] = useState<BasicPost[]>([])

  const navigate = useNavigate()

  useEffect(() => {
    const getRecentNotice = async () => {
      await axiosInstance
        .get('/boards/posts?page=1&limit=5')
        .then((result) => setPosts(result.data))
        .catch(() => setPosts([]))
    }

    getRecentNotice()
  }, [])

  return (
    <MainCard
      title={'자유 게시판'}
      subtitle={''}
      transparent={false}
      more={() => navigate('/board/public')}
    >
      <PostTable posts={posts} />
    </MainCard>
  )
}

export default RecentPostSection
