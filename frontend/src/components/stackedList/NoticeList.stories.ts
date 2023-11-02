// NoticeList.stories.ts
import type { Meta, StoryObj } from '@storybook/react'
import NoticeList from './NoticeList'

const meta = {
  title: 'Components/NoticeList',
  component: NoticeList,
  parameters: {},
  argTypes: {
    id: { control: 'number' },
    noticeName: { control: 'text' },
    writer: { control: 'text' },
    period: { control: 'text' }
  },
  tags: ['autodocs']
} satisfies Meta<typeof NoticeList>

export default meta
type Story = StoryObj<typeof NoticeList>

export const Default: Story = {
  args: {
    id: 1,
    noticeName: '공지사항 1',
    writer: '관리자',
    period: '2023/01/01 13:00'
  }
}
