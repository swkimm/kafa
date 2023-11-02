// NoticeWideCard.storeis.ts
import type { Meta, StoryObj } from '@storybook/react'
import NoticeWideCard from './NoticeWideCard'

const meta = {
  title: 'Components/NoticeWideCard',
  component: NoticeWideCard,
  parameters: {},
  argTypes: {
    id: { control: 'number' },
    cardName: { control: 'text' },
    onClick: { control: 'action' }
  },
  tags: ['autodocs']
} satisfies Meta<typeof NoticeWideCard>

export default meta
type Story = StoryObj<typeof NoticeWideCard>

export const Default: Story = {
  args: {
    cardName: '예시 이름'
  }
}
