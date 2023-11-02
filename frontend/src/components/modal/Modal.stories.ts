// Modal.stories.ts
import type { Meta, StoryObj } from '@storybook/react'
import Modal from './Modal'

const meta = {
  title: 'Components/Modal',
  component: Modal,
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
    primaryButtonName: { control: 'text' },
    secondaryButtonName: { control: 'text' }
  },
  tags: ['autodocs']
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

export const Simple: Story = {
  args: {
    title: '회원가입 완료',
    content: '로그인하여 더 많은 기능에 접근하세요.',
    primaryButtonName: '로그인하러 가기'
  }
}

export const TwoButton: Story = {
  args: {
    title: '회원가입 완료',
    content: '로그인하여 더 많은 기능에 접근하세요.',
    primaryButtonName: '로그인하러 가기',
    secondaryButtonName: '취소'
  }
}
