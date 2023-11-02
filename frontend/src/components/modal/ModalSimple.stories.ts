// ModalSimple.stories.ts
import type { Meta, StoryObj } from '@storybook/react'
import ModalSimple from './ModalSimple'

const meta = {
  title: 'Components/ModalSimple',
  component: ModalSimple,
  parameters: {
    docs: {
      story: {
        inline: false,
        iframeHeight: 300
      }
    }
  },
  argTypes: {
    title: { control: 'text' },
    content: { control: 'text' },
    buttonName: { control: 'text' }
  },
  tags: ['autodocs']
} satisfies Meta<typeof ModalSimple>

export default meta
type Story = StoryObj<typeof meta>

export const Simple: Story = {
  args: {
    title: '회원가입 완료',
    content: '로그인하여 더 많은 기능에 접근하세요.',
    buttonName: '로그인하러 가기'
  }
}
