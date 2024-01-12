import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import '@ckeditor/ckeditor5-build-classic/build/translations/ko'
import type { Editor, PluginConstructor } from '@ckeditor/ckeditor5-core'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import { useCallback, useState } from 'react'

export interface CustomEditor extends Editor {
  getData(): string
}

interface TextEditorProps {
  content: string
  mode: 'edit' | 'view'
  disabled: boolean
  onContentChange: (editor: CustomEditor) => void
  removeImage: (url: string) => void
  CustomUploadAdapterPlugin: PluginConstructor
}

const TextEditor: React.FC<TextEditorProps> = ({
  content,
  mode,
  disabled,
  onContentChange,
  removeImage,
  CustomUploadAdapterPlugin
}) => {
  const [lastEditorData, setLastEditorData] = useState(content)

  const onEditorChange = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (_: any, editor: CustomEditor) => {
      onContentChange(editor)
    },
    [onContentChange]
  )

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
    [removeImage]
  )

  const onEditorReady = useCallback(
    (editor: CustomEditor) => {
      if (mode === 'edit') {
        setLastEditorData(editor.getData())

        editor.model.document.on('change:data', () => {
          const currentData = editor.getData()
          detectRemovedImages(lastEditorData, currentData)
          setLastEditorData(currentData)
        })
      } else {
        editor.enableReadOnlyMode('korean-american-football-association')
      }
    },
    [lastEditorData, detectRemovedImages, mode]
  )

  const extractImageSources = (htmlString: string) => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlString, 'text/html')
    const imgs = doc.querySelectorAll('img')
    return Array.from(imgs).map((img) => img.src)
  }

  return (
    <div>
      <div className="border border-gray-300 bg-white">
        <CKEditor
          config={{
            language: 'ko',
            extraPlugins: [CustomUploadAdapterPlugin],
            placeholder: '이곳에 내용을 작성해주세요',
            toolbar:
              mode === 'edit' ? ClassicEditor.defaultConfig.toolbar.items : []
          }}
          editor={ClassicEditor}
          data={content}
          onReady={onEditorReady}
          onChange={onEditorChange}
          disabled={disabled}
        />
      </div>
    </div>
  )
}

export default TextEditor
