import axiosInstance from '@/commons/axios'
import type { BasicPost } from '@/commons/interfaces/board/board.type'
import TextEditor, { type CustomEditor } from '@/components/boards/TextEditor'
import useNotification from '@/hooks/useNotification'
import { NotificationType } from '@/state/notificationState'
import {
  ArrowUpOnSquareIcon,
  ArrowUturnLeftIcon
} from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CustomUploadAdapterPlugin } from '../adapter'
import { removeImage } from '../remove-image'
import FileHolder from './FileHolder'
import NoticeHolder from './NoticeHolder'
import TitleHolder from './TitleHolder'

interface CreateNewPostProps {}

const CreateNewPost: React.FC<CreateNewPostProps> = () => {
  const [content, setContent] = useState('')
  const [role, setRole] = useState<'Normal' | 'Manager' | 'Admin'>('Normal')
  const [title, setTitle] = useState('')
  const [isNotice, setIsNotice] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fileOne, setFileOne] = useState<File | null>(null)
  const [fileTwo, setFileTwo] = useState<File | null>(null)
  const [fileThree, setFileThree] = useState<File | null>(null)
  const navigate = useNavigate()
  const { showNotification } = useNotification()

  const uploadFiles = async (postId: number, file: File | null) => {
    if (!file) {
      return
    }

    const data = new FormData()
    data.append('file', file, encodeURIComponent(file.name))

    await axiosInstance
      .post(`/boards/posts/${postId}/attachment`, data)
      .then(() => [])
      .catch(() => [])
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      const post: BasicPost = await axiosInstance
        .post('/boards/posts', {
          title,
          content,
          type: isNotice ? 'Notice' : 'Normal'
        })
        .then((result) => result.data)
      const files = [fileOne, fileTwo, fileThree]

      for (const file of files) {
        await uploadFiles(post.id, file)
      }
      showNotification(
        NotificationType.Success,
        '업로드 성공',
        '게시물이 업로드 되었습니다'
      )
    } catch (error) {
      showNotification(
        NotificationType.Error,
        '업로드 실패',
        '게시물 업로드중 오류가 발생했습니다'
      )
    } finally {
      setIsSubmitting(false)
      navigate('/board')
    }
  }

  useEffect(() => {
    const getAccountRole = async () => {
      const data: { role: 'Normal' | 'Manager' | 'Admin' } = await axiosInstance
        .get('/account/role')
        .then((result) => result.data)
        .catch(() => {
          showNotification(
            NotificationType.Warning,
            '접근 불가',
            '로그인 후 이용 가능합니다'
          )
          navigate('/board')
        })

      setRole(data.role)
    }

    getAccountRole()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate])

  return (
    <div className="mx-auto my-8 flex max-w-screen-sm flex-col px-4 sm:max-w-screen-xl sm:px-20">
      <div className="pb-8">
        <p className="mb-4 text-base font-bold sm:text-xl">제목</p>
        <TitleHolder
          title={title}
          handleTitleChange={(event) => setTitle(event.target.value)}
          disabled={isSubmitting}
        ></TitleHolder>
      </div>
      <div className="pb-8">
        <p className="mb-4 text-base font-bold sm:text-xl">내용</p>
        <div className="border-0 border-gray-300 bg-white ">
          <TextEditor
            content={content}
            mode="edit"
            CustomUploadAdapterPlugin={CustomUploadAdapterPlugin}
            disabled={isSubmitting}
            onContentChange={(editor: CustomEditor) =>
              setContent(editor.getData())
            }
            removeImage={removeImage}
          ></TextEditor>
        </div>
      </div>
      <div className="pb-4">
        <p className="mb-4 text-base font-bold sm:text-xl">첨부 파일</p>
        <div className="mb-4">
          <FileHolder
            handleFileChange={(event) => {
              const files = event.target.files
              const file = files && files.length > 0 ? files[0] : null
              setFileOne(file)
            }}
            disabled={isSubmitting}
          ></FileHolder>
        </div>
        <div className="mb-4">
          <FileHolder
            handleFileChange={(event) => {
              const files = event.target.files
              const file = files && files.length > 0 ? files[0] : null
              setFileTwo(file)
            }}
            disabled={isSubmitting}
          ></FileHolder>
        </div>
        <div className="mb-4">
          <FileHolder
            handleFileChange={(event) => {
              const files = event.target.files
              const file = files && files.length > 0 ? files[0] : null
              setFileThree(file)
            }}
            disabled={isSubmitting}
          ></FileHolder>
        </div>
      </div>
      {role === 'Admin' ? (
        <div className="pb-4">
          <p className="mb-4 text-base font-bold sm:text-xl">공지사항</p>
          <div>
            <NoticeHolder
              isNotice={isNotice}
              disabled={isSubmitting}
              handleNoticeChange={(event) => setIsNotice(event.target.checked)}
            ></NoticeHolder>
          </div>
        </div>
      ) : null}
      <div className="mt-5">
        <button
          className="inline-flex items-center rounded-md bg-indigo-950 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xl hover:bg-indigo-900"
          disabled={isSubmitting}
          onClick={handleSubmit}
        >
          <ArrowUpOnSquareIcon
            className="mr-1.5 h-5 w-5 flex-shrink-0"
            aria-hidden="true"
          ></ArrowUpOnSquareIcon>
          등록하기
        </button>
        <button
          className="ml-1.5 inline-flex items-center rounded-md bg-indigo-950 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xl hover:bg-indigo-900"
          onClick={() => navigate('/board')}
          disabled={isSubmitting}
        >
          <ArrowUturnLeftIcon
            className="mr-1.5 h-5 w-5 flex-shrink-0"
            aria-hidden="true"
          ></ArrowUturnLeftIcon>
          뒤로가기
        </button>
      </div>
    </div>
  )
}

export default CreateNewPost
