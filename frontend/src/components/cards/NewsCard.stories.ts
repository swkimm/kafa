// WideNews.stories.ts
import type { Meta, StoryObj } from '@storybook/react'
import NewsCard from './NewsCard'

const meta = {
  title: 'Components/NewsCard',
  component: NewsCard,
  parameters: {
    docs: {
      story: {
        inline: false,
        iframeHeight: 500
      }
    }
  },
  argTypes: {
    imageSrc: { control: 'text' },
    title: { control: 'text' },
    description: { control: 'text' },
    onClick: { action: 'clicked' }
  },
  tags: ['autodocs']
} satisfies Meta<typeof NewsCard>

export default meta
type Story = StoryObj<typeof NewsCard>

export const Default: Story = {
  args: {
    imageSrc: './logo/logo.png',
    title: '대학미식축구협회',
    description:
      '제 00회 전국대학미식축구 선수권대회 개회 및 지역별 조추첨 소개',
    variant: 'wide'
  }
}

export const Narrow: Story = {
  args: {
    imageSrc: '/logo/logo.png',
    title: '대학미식축구협회',
    description:
      '제 00회 전국대학미식축구 선수권대회 개회 및 지역별 조추첨 소개',
    variant: 'narrow'
  }
}
