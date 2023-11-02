// Notification.stories.ts
import type { Meta, StoryObj } from '@storybook/react'
import Notification from './Notification'

const meta = {
  title: 'Components/Notification',
  component: Notification,
  parameters: {
    docs: {
      story: {
        inline: false,
        iframeHeight: 300
      }
    }
  },
  argTypes: {
    title: { control: 'text' }
  },
  tags: ['autodocs']
} satisfies Meta<typeof Notification>

export default meta
type Story = StoryObj<typeof meta>

export const Simple: Story = {
  args: {
    title: 'Successfully saved',
    content: 'Anyone with a link can now view this file'
  }
}

export const OnlyTitle: Story = {
  args: {
    title: 'Successfully saved'
  }
}
