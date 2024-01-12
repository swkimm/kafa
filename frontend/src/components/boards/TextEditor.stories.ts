import { CustomUploadAdapter } from '@/pages/board/adapter'
import type { Editor } from '@ckeditor/ckeditor5-core'
import type { FileLoader } from '@ckeditor/ckeditor5-upload'
import type { Meta, StoryObj } from '@storybook/react'
import TextEditor from './TextEditor'

const meta = {
  title: 'Components/TextEditor',
  component: TextEditor,
  argTypes: {
    mode: {
      name: 'mode',
      type: 'string',
      description: `읽기전용모드: 'view', 에디터모드: 'edit'`
    },
    content: {
      name: 'content',
      type: 'string',
      description: '에디터에 표시될 내용'
    },
    onContentChange: {
      name: 'content',
      type: 'function',
      description: '에디터 내용 변경시 실행할 함수'
    },
    disabled: {
      name: 'disabled',
      type: 'boolean',
      description: '에디터 활성화 여부'
    },
    removeImage: {
      name: 'removeImage',
      type: 'function',
      description: '이미지 삭제 함수'
    },
    CustomUploadAdapterPlugin: {
      name: 'CustomUploadAdapterPlugin',
      type: { name: 'function', required: true },
      description: '이미지 업로드시에 사용할 클래스의 생성자 함수'
    }
  },
  tags: ['autodocs']
} satisfies Meta<typeof TextEditor>

export default meta

type Story = StoryObj<typeof meta>

// eslint-disable-next-line func-style
function CustomUploadAdapterPlugin(editor: Editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (
    loader: FileLoader
  ) => {
    return new CustomUploadAdapter(loader)
  }
}

export const Default: Story = {
  args: {
    content: '',
    disabled: false,
    mode: 'edit',
    onContentChange: () => [],
    removeImage: () => [],
    CustomUploadAdapterPlugin
  }
}

export const ReadOnly: Story = {
  args: {
    content: 'This is ReadOnly Mode',
    disabled: false,
    mode: 'view',
    onContentChange: () => [],
    removeImage: () => [],
    CustomUploadAdapterPlugin
  }
}
