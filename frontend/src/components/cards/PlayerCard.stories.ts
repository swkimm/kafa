// PlayerCard.stories.ts
import type { Meta, StoryObj } from '@storybook/react'
import PlayerCard from './PlayerCard'

const meta = {
  title: 'Components/PlayerCard',
  component: PlayerCard,
  parameters: {
    docs: {
      story: {
        inline: false,
        iframeHeight: 600
      }
    }
  },
  argTypes: {
    id: { control: 'number' },
    profileImgUrl: { control: 'text' },
    name: { control: 'text' },
    backNumber: { control: 'number' },
    position: { control: 'text' }
  },
  tags: ['autodocs']
} satisfies Meta<typeof PlayerCard>

export default meta
type Story = StoryObj<typeof PlayerCard>

export const Default: Story = {
  args: {
    id: 1,
    profileImgUrl: '/people_alt.webp',
    name: '홍길동',
    backNumber: 0,
    position: []
  }
}
