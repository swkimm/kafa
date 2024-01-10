import type { Meta, StoryObj } from '@storybook/react'
import RichTextEditor from './RichTextEditor'

const meta = {
  title: 'Components/RichTextEditor',
  component: RichTextEditor,
  argTypes: {
    role: {
      name: 'role',
      type: 'string',
      description: '현재 로그인한 사용자의 권한'
    }
  },
  tags: ['autodocs']
} satisfies Meta<typeof RichTextEditor>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    role: 'Normal',
    content: ''
  }
}

export const Admin: Story = {
  args: {
    role: 'Admin',
    content: ''
  }
}
