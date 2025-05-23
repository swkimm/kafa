// DefaultTable.stories.ts
import type { Meta, StoryObj } from '@storybook/react'
import DefaultTable from './DefaultTable'

const meta = {
  title: 'Components/DefaultTable',
  component: DefaultTable,
  parameters: {},
  argTypes: {
    title: { control: 'text' },
    data: {
      description: 'Array of person objects to be displayed in the table',
      control: false
    }
  },
  tags: ['autodocs']
} satisfies Meta<typeof DefaultTable>

export default meta
type Story = StoryObj<typeof DefaultTable>

export const Default: Story = {
  args: {
    title: '테이블',
    data: [
      {
        name: 'Jane Cooper',
        title: 'Regional Paradigm Technician',
        email: 'jane.cooper@example.com',
        role: 'Admin'
      },
      {
        name: 'Jane Cooper',
        title: 'Regional Paradigm Technician',
        email: 'jane.cooper@example.com',
        role: 'Admin'
      },
      {
        name: 'Jane Cooper',
        title: 'Regional Paradigm Technician',
        email: 'jane.cooper@example.com',
        role: 'Admin'
      },
      {
        name: 'Jane Cooper',
        title: 'Regional Paradigm Technician',
        email: 'jane.cooper@example.com',
        role: 'Admin'
      },
      {
        name: 'Jane Cooper',
        title: 'Regional Paradigm Technician',
        email: 'jane.cooper@example.com',
        role: 'Admin'
      }
    ]
  }
}
