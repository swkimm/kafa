// WithSubtitleTable.stories.ts
import type { Meta, StoryObj } from '@storybook/react'
import WithSubtitleTable from './WithSubtitleTable'

const meta = {
  title: 'Components/WithSubtitleTable',
  component: WithSubtitleTable,
  parameters: {},
  argTypes: {
    title: { control: 'text' },
    subTitle: { control: 'text' },
    data: {
      description:
        'Array of person objects to be displayed in the table With subtitle',
      control: false
    }
  },
  tags: ['autodocs']
} satisfies Meta<typeof WithSubtitleTable>

export default meta
type Story = StoryObj<typeof WithSubtitleTable>

export const Default: Story = {
  args: {
    title: '테이블',
    subTitle: '부제목',
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
