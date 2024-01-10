import type { Meta, StoryObj } from '@storybook/react'
import BoardPagination from './BoardPagination'

const meta = {
  title: 'Components/BoardPagination',
  component: BoardPagination,
  tags: ['autodocs']
} satisfies Meta<typeof BoardPagination>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    currentPage: 1,
    totalPosts: 2024
  }
}
