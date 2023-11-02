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
    profile: { control: 'text' },
    name: { control: 'text' },
    backNumber: { control: 'number' },
    offPosition: { control: 'text' },
    defPosition: { control: 'text' }
  },
  tags: ['autodocs']
} satisfies Meta<typeof PlayerCard>

export default meta
type Story = StoryObj<typeof PlayerCard>

export const Default: Story = {
  args: {
    id: 1,
    profile: '/people_alt.webp',
    name: '홍길동',
    backNumber: 0,
    offPosition: 'OL',
    defPosition: 'DL'
  }
}
