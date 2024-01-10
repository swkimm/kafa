import type { Meta, StoryObj } from '@storybook/react'
import PostViewer from './PostViewer'

const meta = {
  title: 'Components/PostViewer',
  component: PostViewer,
  tags: ['autodocs'],
  argTypes: {
    content: {
      name: 'content',
      type: 'string',
      description: 'HTML 본문'
    }
  }
} satisfies Meta<typeof PostViewer>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    content: `<p>뷰어 테스트</p>`
  }
}
