import type { Meta, StoryObj } from '@storybook/react'
import Pagination from './Pagination'

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs']
} satisfies Meta<typeof Pagination>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    totalPages: 10,
    currentPage: 1
  }
}
