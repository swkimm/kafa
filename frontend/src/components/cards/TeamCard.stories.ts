// TeamCard.stories.ts
import type { Meta, StoryObj } from '@storybook/react'
import TeamCard from './TeamCard'

const meta = {
  title: 'Components/TeamCard',
  component: TeamCard,
  parameters: {},
  argTypes: {
    id: { control: 'number' },
    teamLogo: { control: 'text' },
    teamName: { control: 'text' },
    nickName: { control: 'text' },
    teamColor: { control: 'text' },
    createdAt: { control: 'text' },
    onClick: { action: 'clicked' }
  },
  tags: ['autodocs']
} satisfies Meta<typeof TeamCard>

export default meta
type Story = StoryObj<typeof TeamCard>

export const Default: Story = {
  args: {
    id: 1,
    teamLogo: '/logo/logo.png',
    teamName: '서울골든이글스',
    nickName: 'GOLDEN EAGLES',
    teamColor: 'white',
    createdAt: '1998'
  }
}
