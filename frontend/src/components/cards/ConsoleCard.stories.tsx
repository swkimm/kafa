import type { Meta, StoryObj } from '@storybook/react'
import ConsoleCard from './ConsoleCard'

const meta: Meta<typeof ConsoleCard> = {
  title: 'Components/ConsoleCard',
  component: ConsoleCard,
  argTypes: {
    title: {
      name: 'title',
      table: {
        category: 'Required',
        type: { summary: 'String' }
      },
      description: '카드에 표시될 제목',
      control: { type: 'text' }
    },
    subtitle: {
      name: 'subtitle',
      table: {
        category: 'Required',
        type: { summary: 'String' }
      },
      description: '카드에 표시될 부제목',
      control: { type: 'text' }
    },
    children: {
      name: 'children',
      description: '카드에 포함시킬 자식 컴포넌트',
      table: {
        category: 'Required',
        type: { summary: 'React.ReactNode' }
      },
      control: { type: null }
    },
    more: {
      name: 'more',
      description: '더보기 버튼 핸들러 함수',
      table: {
        category: 'Optional',
        type: { summary: '() => void' },
        defaultValue: { summary: 'undefined' }
      },
      control: { type: 'action' }
    }
  },
  tags: ['autodocs']
}

export default meta

type Story = StoryObj<typeof ConsoleCard>

const people = [
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member'
  },
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member'
  },
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member'
  }
]

const childrenExample: React.ReactNode = (
  <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Title
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Role
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {people.map((person) => (
              <tr key={person.email}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                  {person.name}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {person.title}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {person.email}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {person.role}
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <a href="#" className="text-indigo-600 hover:text-indigo-900">
                    Edit<span className="sr-only">, {person.name}</span>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)

export const Default: Story = {
  args: {
    title: '제목',
    subtitle: '이곳에 부제목이 표시됩니다',
    children: childrenExample,
    more: () => alert('more button clicked')
  }
}
