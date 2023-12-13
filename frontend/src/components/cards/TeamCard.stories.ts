import type { Meta, StoryObj } from '@storybook/react'
import TeamCard from './TeamCard'

const meta: Meta<typeof TeamCard> = {
  title: 'Components/TeamCard',
  component: TeamCard,
  parameters: {},
  argTypes: {
    id: { control: 'number' },
    name: { control: 'text' },
    globalName: { control: 'text' },
    initial: { control: 'text' },
    color: { control: 'color' },
    profileImgUrl: { control: 'text' },
    isWhite: { action: 'isWhite' },
    onClick: { action: 'onClick' }
  },
  tags: ['autodocs']
}

export default meta

type Story = StoryObj<typeof TeamCard>

export const Default: Story = {
  args: {
    id: 1,
    name: '서울골든이글스',
    globalName: 'Seoul Golden Eagles',
    initial: 'SGE',
    color: 'red',
    profileImgUrl: '/path/to/image.png',
    isWhite: () => true // 이 함수는 팀 색상에 따라 텍스트 색상을 결정합니다.
  }
}
