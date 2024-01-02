// LeagueList.stories.ts
import type { Meta, StoryObj } from '@storybook/react'
import LeagueList from './LeagueList'

const meta = {
  title: 'Components/LeagueList',
  component: LeagueList,
  parameters: {},
  argTypes: {
    id: { control: 'number' },
    name: { control: 'text' },
    associationName: { control: 'text' },
    startedAt: { control: 'date' },
    endedAt: { control: 'date' },
    onClick: { control: 'clicked' }
  },
  tags: ['autodocs']
} satisfies Meta<typeof LeagueList>

export default meta
type Story = StoryObj<typeof LeagueList>

export const Default: Story = {
  // args: {
  //   leagueId: 1,
  //   leagueName: '제 28회 KNFL',
  //   status: '종료됨',
  //   conference: '사회인연맹',
  //   period: '2023/01/01 ~ 2023/01/13'
  // }
}
