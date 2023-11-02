// Footer.stories.ts
import { Meta, StoryObj } from '@storybook/react'
import Footer from './Footer'

const meta = {
  title: 'Components/Footer',
  component: Footer,
  parameters: {
    docs: {
      story: {
        inline: false,
        iframeHeight: 300,
        iframeWeight: 300
      }
    }
  },
  argTypes: {},
  tags: ['autodocs']
} satisfies Meta<typeof Footer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {}
}
