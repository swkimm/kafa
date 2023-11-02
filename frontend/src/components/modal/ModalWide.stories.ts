// ModalWide.stores.ts
import type { Meta, StoryObj } from '@storybook/react'
import ModalWide from './ModalWide'

const meta = {
  title: 'Components/ModalWide',
  component: ModalWide,
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
} satisfies Meta<typeof ModalWide>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: '회원가입 완료',
    content:
      '로그인하여 더 많은 기능에 접근하세요 1234567890 로그인하여 더 많은 기능에 접근하세요 1234567890 로그인하여 더 많은 기능에 접근하세요 1234567890',
    primaryButtonName: '로그인하기',
    secondaryButtonName: '뒤로가기'
  }
}
