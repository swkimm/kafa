import axiosInstance from '@/commons/axios'
import { CustomUploadAdapter } from '@/pages/board/adapter'
import { removeImage } from '@/pages/board/remove-image'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import '@ckeditor/ckeditor5-build-classic/build/translations/ko'
import type { Editor } from '@ckeditor/ckeditor5-core'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import type { FileLoader } from '@ckeditor/ckeditor5-upload'
import { useRef, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface CustomEditor extends Editor {
  getData(): string
}

interface RichTextEditorProps {
  role: string
  content: string
}

// eslint-disable-next-line func-style
function CustomUploadAdapterPlugin(editor: Editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (
    loader: FileLoader
  ) => {
    return new CustomUploadAdapter(loader)
  }
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ role, content }) => {
  const [editorData, setEditorData] = useState(content)
  const [lastEditorData, setLastEditorData] = useState(content)
  const titleRef = useRef<HTMLInputElement>(null)
  const noticeRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onEditorChange = useCallback((_: any, editor: CustomEditor) => {
    setEditorData(editor.getData())
  }, [])

  const handleSubmit = async () => {
    try {
      const title = titleRef.current?.value
      const isNotice = noticeRef.current?.checked

      const response = await axiosInstance.post('/boards/posts', {
        title,
        content: editorData,
        type: isNotice ? 'Notice' : 'Normal'
      })
      console.log('서버 응답:', response.data)
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

  return (
    <div>
      <div className="pb-4">
        <p className="text-xl font-bold">제목</p>
      </div>
      <div className="pb-10">
        <div className="flex rounded-none shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-1 focus-within:ring-inset focus-within:ring-indigo-500">
          <input
            type="text"
            ref={titleRef}
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
      {role === 'Admin' ? (
        <>
          <div className="pb-2 pt-10">
            <p className="text-xl font-bold">기타</p>
          </div>
          <div className="relative flex gap-x-3">
            <div className="flex h-6 items-center">
              <input
                id="notice"
                ref={noticeRef}
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
      <button
        className="relative mr-1.5 mt-10 inline-flex items-center rounded-md bg-white px-5 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
        onClick={handleSubmit}
      >
        등록하기
      </button>
      <button
        className="relative mt-10 inline-flex items-center rounded-md bg-white px-5 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
        onClick={() => navigate(-1)}
      >
        뒤로가기
      </button>
    </div>
  )
}

export default RichTextEditor
