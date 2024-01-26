// ScoreCard.stories.ts
import type { Meta, StoryObj } from '@storybook/react'
import ScoreCard from './ScoreCard'

const meta = {
  title: 'Components/ScoreCard',
  component: ScoreCard,
  parameters: {},
  argTypes: {
    startedAt: { control: 'text' },
    stadium: { control: 'text' },
    homeTeam: {
      control: { type: 'object', fields: ['id', 'logo', 'name', 'score'] }
    },
    awayTeam: {
      control: { type: 'object', fields: ['id', 'logo', 'name', 'score'] }
    }
  },
  tags: ['autodocs']
} satisfies Meta<typeof ScoreCard>

export default meta
type Story = StoryObj<typeof ScoreCard>

export const Default: Story = {
  args: {
    startedAt: '2023-11-01',
    stadium: 'Sample Stadium',
    homeTeam: {
      id: 1,
      profileImgUrl:
        'https://cdn.playprove.one/team/47/profile/c16b7795-a576-46f9-a64c-5a33818cfb36.webp',
      name: '골든이글스',
      onClick: (id) => console.log(`Home team clicked: ${id}`)
    },
    score: {
      homeTeamScore: 28,
      awayTeamScore: 14
    },
    awayTeam: {
      id: 2,
      profileImgUrl:
        'https://cdn.playprove.one/team/49/profile/dfd53432-ee1e-4c93-b1bb-f584ec49bc70.webp',
      name: '피닉스',
      onClick: (id) => console.log(`Away team clicked: ${id}`)
    }
  }
}
