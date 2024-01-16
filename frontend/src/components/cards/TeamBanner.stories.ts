import type { Meta, StoryObj } from '@storybook/react'
import TeamBanner from './TeamBanner'

const meta: Meta<typeof TeamBanner> = {
  title: 'Components/TeamBanner',
  component: TeamBanner,
  parameters: {},
  argTypes: {
    id: { control: 'number' },
    name: { control: 'text' },
    globalName: { control: 'text' },
    hometown: { control: 'text' },
    initial: { control: 'text' },
    establishedAt: { control: 'date' },
    color: { control: 'color' },
    subColor: { control: 'color' },
    profileImgUrl: { control: 'text' },
    backgroundImgUrl: { control: 'text' },
    status: { control: 'text' },
    createdAt: { control: 'date' }
    // 다른 필요한 argTypes 추가
  },
  tags: ['autodocs']
}

export default meta

type Story = StoryObj<typeof TeamBanner>

export const Default: Story = {
  args: {
    id: 1,
    name: '서울골든이글스',
    globalName: 'Seoul Golden Eagles',
    hometown: 'Seoul',
    initial: 'SGE',
    establishedAt: new Date('1998'),
    color: 'gray',
    subColor: 'white',
    profileImgUrl: 'https://cdn.playprove.one/default/logo.webp',
    backgroundImgUrl: 'https://cdn.playprove.one/default/background.webp',
    status: 'Active',
    createdAt: new Date('1998-01-01')
    // 다른 필요한 args 추가
  }
}
