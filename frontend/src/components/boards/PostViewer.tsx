import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import '@ckeditor/ckeditor5-build-classic/build/translations/ko'
import type { Editor } from '@ckeditor/ckeditor5-core'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import { useCallback } from 'react'

interface CustomEditor extends Editor {
  getData(): string
}

interface PostViewerProps {
  content: string
}

const PostViewer: React.FC<PostViewerProps> = ({ content }) => {
  const onViewerReady = useCallback((editor: CustomEditor) => {
    editor.enableReadOnlyMode('korean-american-football-association')
  }, [])

  return (
    <div>
      <CKEditor
        config={{
          language: 'ko',
          toolbar: []
        }}
        onReady={onViewerReady}
        editor={ClassicEditor}
        data={content}
      />
    </div>
  )
}

export default PostViewer
