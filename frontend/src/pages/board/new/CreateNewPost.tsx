import axiosInstance from '@/commons/axios'
import RichTextEditor from '@/components/boards/RichTextEditor'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface CreateNewPostProps {}

const CreateNewPost: React.FC<CreateNewPostProps> = () => {
  useEffect(() => {
    getAccountRole()
  })

  const [role, setRole] = useState<'Normal' | 'Manager' | 'Admin'>('Normal')
  const navigate = useNavigate()

  const getAccountRole = async () => {
    const data: { role: 'Normal' | 'Manager' | 'Admin' } = await axiosInstance
      .get('/account/role')
      .then((result) => result.data)
      .catch(() => {
        alert('로그인 하지 않았습니다')
        navigate('/')
      })

    setRole(data.role)
  }

  return (
    <>
      <div className="mx-auto flex max-w-screen-sm flex-col px-8 sm:max-w-screen-xl sm:px-20">
        <div className="py-8">
          <RichTextEditor content="" role={role}></RichTextEditor>
        </div>
      </div>
    </>
  )
}

export default CreateNewPost
