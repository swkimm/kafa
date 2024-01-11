import axiosInstance from '@/commons/axios'
import type { Profile } from '@/commons/interfaces/account/profile'
import type {
  BasicPost,
  DetailPost
} from '@/commons/interfaces/board/board.type'
import { CustomUploadAdapter } from '@/pages/board/adapter'
import { removeImage } from '@/pages/board/remove-image'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import '@ckeditor/ckeditor5-build-classic/build/translations/ko'
import type { Editor } from '@ckeditor/ckeditor5-core'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import type { FileLoader } from '@ckeditor/ckeditor5-upload'
import {
  ArrowUpOnSquareIcon,
  ArrowUturnLeftIcon
} from '@heroicons/react/24/outline'
import { useCallback, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

interface CustomEditor extends Editor {
  getData(): string
}

interface RichTextEditorProps {
  role: string
  content: string
  mode: string
}

// eslint-disable-next-line func-style
function CustomUploadAdapterPlugin(editor: Editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (
    loader: FileLoader
  ) => {
    return new CustomUploadAdapter(loader)
  }
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  role,
  content,
  mode
}) => {
  const [editorData, setEditorData] = useState(content)
  const [lastEditorData, setLastEditorData] = useState(content)
  const [title, setTitle] = useState('')
  const [isNotice, setIsNotice] = useState(false)
  const navigate = useNavigate()
  const params = useParams()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [fileOne, setFileOne] = useState<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [fileTwo, setFileTwo] = useState<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [fileThree, setFileThree] = useState<any>(null)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFileChangeOne = (event: any) => {
    setFileOne(event.target.files[0])
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFileChangeTwo = (event: any) => {
    setFileTwo(event.target.files[0])
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFileChangeThree = (event: any) => {
    setFileThree(event.target.files[0])
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTitleChange = (event: any) => {
    setTitle(event.target.value)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleNoticeChange = (event: any) => {
    setIsNotice(event.target.checked)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onEditorChange = useCallback((_: any, editor: CustomEditor) => {
    setEditorData(editor.getData())
  }, [])

  const uploadFiles = async (postId: number) => {
    if (fileOne) {
      const data = new FormData()
      data.append('file', fileOne, encodeURIComponent(fileOne.name))

      await axiosInstance
        .post(`/boards/posts/${postId}/attachment`, data)
        .then(() => [])
        .catch(() => [])
    }

    if (fileTwo) {
      const data = new FormData()
      data.append('file', fileTwo, encodeURIComponent(fileTwo.name))

      await axiosInstance
        .post(`/boards/posts/${postId}/attachment`, data)
        .then(() => [])
        .catch(() => [])
    }

    if (fileThree) {
      const data = new FormData()
      data.append('file', fileThree, encodeURIComponent(fileThree.name))

      await axiosInstance
        .post(`/boards/posts/${postId}/attachment`, data)
        .then(() => [])
        .catch(() => [])
    }
  }

  const handleSubmit = async () => {
    try {
      if (mode === 'create') {
        const post: BasicPost = await axiosInstance
          .post('/boards/posts', {
            title,
            content: editorData,
            type: isNotice ? 'Notice' : 'Normal'
          })
          .then((result) => result.data)

        await uploadFiles(post.id)

        alert('게시글이 등록되었습니다')
        navigate('/board')
      } else {
        await axiosInstance.put(`/boards/posts/${params.id}`, {
          title,
          content: editorData,
          type: isNotice ? 'Notice' : 'Normal'
        })

        alert('게시글이 수정되었습니다')
        navigate(`/board/posts/${params.id}`)
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert(error?.response.data.message)
    }
  }

  const detectRemovedImages = useCallback(
    (oldData: string, newData: string) => {
      const oldImages = extractImageSources(oldData)
      const newImages = extractImageSources(newData)

      if (oldImages.length === 1 && !oldImages[0]) {
        return
      }

      const removedImages = oldImages.filter((url) => !newImages.includes(url))

      if (removedImages.length > 0) {
        removedImages.forEach((removedImage) => removeImage(removedImage))
      }
    },
    []
  )

  const onEditorReady = useCallback(
    (editor: CustomEditor) => {
      setLastEditorData(editor.getData())

      editor.model.document.on('change:data', () => {
        const currentData = editor.getData()
        detectRemovedImages(lastEditorData, currentData)
        setLastEditorData(currentData)
      })
    },
    [lastEditorData, detectRemovedImages]
  )

  const extractImageSources = (htmlString: string) => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlString, 'text/html')
    const imgs = doc.querySelectorAll('img')
    return Array.from(imgs).map((img) => img.src)
  }

  useEffect(() => {
    if (mode === 'create') {
      return
    }

    const getPost = async () => {
      const post: DetailPost = await axiosInstance
        .get(`/boards/posts/${params.id}`)
        .then((result) => result.data)

      const account: Profile = await axiosInstance
        .get('/account/profile')
        .then((result) => result.data)

      if (account.role !== 'Admin') {
        if (post.Account.id !== account.id) {
          alert('수정 권한이 없습니다')
          navigate('/board')
        }
      }

      post.createdAt = new Date(post.createdAt)
      post.updatedAt = new Date(post.updatedAt)

      setEditorData(post.content)
      setTitle(post.title)
      setIsNotice(post.type === 'Notice')
    }

    getPost()
  }, [mode, params.id, navigate])

  return (
    <div>
      <div className="pb-4">
        <p className="text-xl font-bold">제목</p>
      </div>
      <div className="pb-10">
        <div className="flex rounded-none shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-1 focus-within:ring-inset focus-within:ring-indigo-500">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            id="title"
            className="block flex-1 border border-gray-300 bg-white py-3 pl-3 text-gray-900 placeholder:text-gray-500 focus:ring-0 sm:text-base sm:leading-6"
            placeholder="이곳에 제목을 작성해주세요"
          />
        </div>
      </div>
      <div className="pb-4">
        <p className="text-xl font-bold">내용</p>
      </div>
      <div className="border border-gray-300 bg-white">
        <CKEditor
          config={{
            language: 'ko',
            extraPlugins: [CustomUploadAdapterPlugin],
            placeholder: '이곳에 내용을 작성해주세요'
          }}
          editor={ClassicEditor}
          data={editorData}
          onReady={onEditorReady}
          onChange={onEditorChange}
        />
      </div>
      <div className="pt-10">
        <p className="mb-4 text-xl font-bold">첨부파일</p>
        <div className="mb-4">
          <label
            className="mb-2 block text-sm font-medium text-gray-900"
            htmlFor="file_input"
          >
            파일 1
          </label>
          <input
            className="0 block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none"
            aria-describedby="file_input_help"
            id="file_input"
            type="file"
            onChange={handleFileChangeOne}
          />
          <p className="mt-1 text-sm text-gray-500 " id="file_input_help">
            docs, txt, pdf, xlsx, hwp 형식의 파일만 업로드 가능합니다
          </p>
        </div>
        <div className="mb-4">
          <label
            className="mb-2 block text-sm font-medium text-gray-900"
            htmlFor="file_input"
          >
            파일 2
          </label>
          <input
            className="0 block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none"
            aria-describedby="file_input_help"
            id="file_input"
            type="file"
            onChange={handleFileChangeTwo}
          />
          <p className="mt-1 text-sm text-gray-500 " id="file_input_help">
            docs, txt, pdf, xlsx, hwp 형식의 파일만 업로드 가능합니다
          </p>
        </div>
        <div className="mb-4">
          <label
            className="mb-2 block text-sm font-medium text-gray-900"
            htmlFor="file_input"
          >
            파일 3
          </label>
          <input
            className="0 block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none"
            aria-describedby="file_input_help"
            id="file_input"
            type="file"
            onChange={handleFileChangeThree}
          />
          <p className="mt-1 text-sm text-gray-500 " id="file_input_help">
            docs, txt, pdf, xlsx, hwp 형식의 파일만 업로드 가능합니다
          </p>
        </div>
      </div>
      {role === 'Admin' ? (
        <>
          <div className="pb-2 pt-10">
            <p className="text-xl font-bold">기타</p>
          </div>
          <div className="relative flex gap-x-3">
            <div className="flex h-6 items-center">
              <input
                id="notice"
                checked={isNotice}
                onChange={handleNoticeChange}
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
            </div>
            <div className="text-xs leading-6 sm:text-sm">
              <label className="font-semibold text-gray-900">공지사항</label>
              <p className="text-gray-500">
                지금 작성한 글을 공지사항으로 등록합니다
              </p>
            </div>
          </div>
        </>
      ) : null}
      <div className="mt-10">
        <button
          className="inline-flex items-center rounded-md bg-indigo-950 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xl hover:bg-indigo-900"
          onClick={handleSubmit}
        >
          <ArrowUpOnSquareIcon
            className="mr-1.5 h-5 w-5 flex-shrink-0"
            aria-hidden="true"
          ></ArrowUpOnSquareIcon>
          {mode === 'create' ? '등록하기' : '수정하기'}
        </button>
        <button
          className="ml-1.5 inline-flex items-center rounded-md bg-indigo-950 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xl hover:bg-indigo-900"
          onClick={() => navigate(-1)}
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

export default RichTextEditor
