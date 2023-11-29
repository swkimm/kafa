// MultipleLineCard.storeis.ts
import type { Meta, StoryObj } from '@storybook/react'
import MultipleLineCard from './MultipleLineCard'

const meta = {
  title: 'Components/MultipleLineCard',
  component: MultipleLineCard,
  parameters: {},
  argTypes: {
    id: { control: 'number' },
    cardName: { control: 'text' },
    onClick: { control: 'action' }
  },
  tags: ['autodocs']
} satisfies Meta<typeof MultipleLineCard>

export default meta
type Story = StoryObj<typeof MultipleLineCard>

export const Default: Story = {
  args: {
    cardName: '예시 이름'
  }
}
