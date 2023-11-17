// DropdownSimple.stories.ts
import type { Meta, StoryObj } from '@storybook/react'
import DropdownSimple from './DropdownSimple'

const meta = {
  title: 'Components/Dropbox',
  component: DropdownSimple,
  parameters: {
    layout: 'centered',
    docs: {
      story: {
        inline: false,
        iframeHeight: 300
      }
    }
  },
  argTypes: {
    optionName: { control: 'text' }, // optionName은 text 타입의 컨트롤로 조정
    optionList: { control: 'object' }, // optionList는 object 타입의 컨트롤로 조정
    onSelect: { action: 'selected' } // onSelect는 액션 타입의 컨트롤로 조정
  },
  tags: ['autodocs']
} satisfies Meta<typeof DropdownSimple>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    optionName: 'Default',
    optionList: [
      { id: '1', name: 'Account settings' },
      { id: '2', name: 'Support' },
      { id: '3', name: 'License' },
      { id: '4', name: 'Sign out' }
    ]
  }
}
