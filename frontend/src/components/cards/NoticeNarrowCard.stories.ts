// NoticeNarrowCard.storeis.ts
import type { Meta, StoryObj } from '@storybook/react'
import NoticeNarrowCard from './NoticeNarrowCard'

const meta = {
  title: 'Components/NoticeNarrowCard',
  component: NoticeNarrowCard,
  parameters: {},
  argTypes: {
    cardName: { control: 'text' },
    onClick: { control: 'action' }
  },
  tags: ['autodocs']
} satisfies Meta<typeof NoticeNarrowCard>

export default meta
type Story = StoryObj<typeof NoticeNarrowCard>

export const Default: Story = {
  args: {
    cardName: '예시 이름'
  }
}
