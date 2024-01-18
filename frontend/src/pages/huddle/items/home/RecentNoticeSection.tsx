import axiosInstance from '@/commons/axios'
import type { BasicPost } from '@/commons/interfaces/board/board.type'
import MainCard from '@/components/cards/MainCard'
import { PostTable } from '@/components/tables/PostTable'
import { useEffect, useState } from 'react'

const RecentNoticeSection: React.FC = () => {
  const [posts, setPosts] = useState<BasicPost[]>([])

  useEffect(() => {
    const getRecentNotice = async () => {
      await axiosInstance
        .get('/boards/posts?page=1&limit=5&option=Notice')
        .then((result) => setPosts(result.data))
        .catch(() => setPosts([]))
    }

    getRecentNotice()
  }, [])

  return (
    <MainCard title={'공지사항'} subtitle={''} transparent={false}>
      <PostTable posts={posts} />
    </MainCard>
  )
}

export default RecentNoticeSection
