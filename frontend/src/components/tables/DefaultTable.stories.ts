// DefaultTable.stories.ts
import type { Meta, StoryObj } from '@storybook/react'
import DefaultTable from './DefaultTable'

const meta = {
  title: 'Components/DefaultTable',
  component: DefaultTable,
  parameters: {},
  argTypes: {
    title: { control: 'text' }
  },
  tags: ['autodocs']
} satisfies Meta<typeof DefaultTable>

export default meta
type Story = StoryObj<typeof DefaultTable>

export const Default: Story = {
  args: {
    title: '테이블'
  }
}
