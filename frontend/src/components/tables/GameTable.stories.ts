// GameTable.stories.ts
import type { Meta, StoryObj } from '@storybook/react'
import GameTable from './GameTable'

const meta = {
  title: 'Components/GameTable',
  component: GameTable,
  parameters: {
    story: {
      inline: false,
      iframeHeight: 600
    }
  },
  argTypes: {
    title: { control: 'text' },
    games: {}
  },
  tags: ['autodocs']
} satisfies Meta<typeof GameTable>

export default meta
type Story = StoryObj<typeof GameTable>

export const Default: Story = {
  args: {
    title: '테이블',
    games: [
      {
        leagueName: '제 00회 KFNL 00 경기',
        date: '2023-11-03',
        homeTeam: {
          id: 1,
          logo: 'HomeTeamLogo',
          name: 'Home Team',
          score: 12
        },
        awayTeam: {
          id: 2,
          logo: 'AwayTeamLogo',
          name: 'Away Team',
          score: 8
        }
      }
      // Add more dummy game objects as needed for the story
    ]
  }
}
