import axiosInstance from '@/commons/axios'
import type { Attachment } from '@/commons/interfaces/attachment/attachment.type'
import type {
  BasicPost,
  DetailPost
} from '@/commons/interfaces/board/board.type'
import TextEditor, { type CustomEditor } from '@/components/boards/TextEditor'
import {
  ArrowUpOnSquareIcon,
  ArrowUturnLeftIcon
} from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CustomUploadAdapterPlugin } from '../../adapter'
import FileHolder from '../../new/FileHolder'
import NoticeHolder from '../../new/NoticeHolder'
import TitleHolder from '../../new/TitleHolder'
import { removeImage } from '../../remove-image'
import ExistFileHolder from './ExistFileHolder'

interface EditPostProps {}

const EditPost: React.FC<EditPostProps> = () => {
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [isNotice, setIsNotice] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fileOne, setFileOne] = useState<File | null>(null)
  const [fileTwo, setFileTwo] = useState<File | null>(null)
  const [fileThree, setFileThree] = useState<File | null>(null)
  const [existFiles, setExistFiles] = useState<Attachment[]>([])
  const [role, setRole] = useState<'Normal' | 'Manager' | 'Admin'>('Normal')
  const navigate = useNavigate()
  const params = useParams()

  const deleteFile = async (attachmentId: number) => {
    await axiosInstance
      .delete(
        `/boards/posts/${params.id}/attachments/${attachmentId}
    `
      )
      .then(() => [])
      .catch(() => [])

    const newExistFiles = existFiles.filter(
      (existFile) => existFile.id !== attachmentId
    )

    setExistFiles(newExistFiles)
  }

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
        .put(`/boards/posts/${params.id}`, {
          title,
          content,
          type: isNotice ? 'Notice' : 'Normal'
        })
        .then((result) => result.data)
      const files = [fileOne, fileTwo, fileThree]

      for (const file of files) {
        await uploadFiles(post.id, file)
      }
      alert('게시물이 수정 되었습니다')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert(error.response.data.message ?? '게시글 수정 실패')
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
          alert('로그인 하지 않았습니다')
          navigate('/')
        })

      setRole(data.role)
    }

    const getPost = async (): Promise<void> => {
      const post: DetailPost = await axiosInstance
        .get(`/boards/posts/${params.id}`)
        .then((result) => result.data)

      post.createdAt = new Date(post.createdAt)
      post.updatedAt = new Date(post.updatedAt)

      setContent(post.content)
      setTitle(post.title)
      setIsNotice(post.type === 'Notice')
    }

    const getAttachments = async (): Promise<void> => {
      const attachments: Attachment[] = await axiosInstance
        .get(`/boards/posts/${params.id}/attachments`)
        .then((result) => result.data)
        .catch(() => [])

      setExistFiles(attachments)
    }

    getAccountRole()
    getPost()
    getAttachments()
  }, [navigate, params.id])

  return (
    <>
      <div className="mx-auto my-0.5 flex max-w-screen-sm flex-col px-0 sm:my-8 sm:max-w-screen-xl sm:px-20">
        <div className="pb-8">
          <p className="mb-4 text-xl font-bold">제목</p>
          <TitleHolder
            title={title}
            handleTitleChange={(event) => setTitle(event.target.value)}
            disabled={isSubmitting}
          ></TitleHolder>
        </div>
        <div className="pb-8">
          <p className="mb-4 text-xl font-bold">내용</p>
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
          <p className="mb-4 text-xl font-bold">첨부 파일</p>
          <div className="mb-4">
            {existFiles.map((existFile) => {
              return (
                <ExistFileHolder
                  key={existFile.id}
                  id={existFile.id}
                  name={existFile.name}
                  url={existFile.fileUrl}
                  deleteFileHandler={deleteFile}
                ></ExistFileHolder>
              )
            })}
          </div>
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
            <p className="mb-4 text-xl font-bold">공지사항</p>
            <div>
              <NoticeHolder
                isNotice={isNotice}
                disabled={isSubmitting}
                handleNoticeChange={(event) =>
                  setIsNotice(event.target.checked)
                }
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
            수정하기
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
    </>
  )
}

export default EditPost
