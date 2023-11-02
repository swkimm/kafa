// TeamBanner.stories.ts
import type { Meta, StoryObj } from '@storybook/react'
import TeamBanner from './TeamBanner'

const meta = {
  title: 'Components/TeamBanner',
  component: TeamBanner,
  parameters: {},
  argTypes: {
    teamLogo: { control: 'text' },
    teamName: { control: 'text' },
    nickName: { control: 'text' },
    teamColor: { control: 'text' },
    createdAt: { control: 'text' },
    conference: { control: 'text' }
  },
  tags: ['autodocs']
} satisfies Meta<typeof TeamBanner>

export default meta
type Story = StoryObj<typeof TeamBanner>

export const Default: Story = {
  args: {
    teamLogo: 'https://cdn.playprove.one/default/logo.webp',
    teamName: '서울골든이글스',
    nickName: 'GOLDEN EAGLES',
    teamColor: 'gray',
    createdAt: '1998',
    conference: '사회인연맹'
  }
}
