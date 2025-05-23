// MultipleLineCard.storeis.ts
import type { Meta, StoryObj } from '@storybook/react'
import MultipleLineCard from './MultipleLineCard'

export interface NewsCardProps {
  imageSrc: string
  title: string
  description: string
  variant?: 'wide' | 'narrow'
  onClick?: () => void
}

const meta: Meta<typeof MultipleLineCard> = {
  title: 'Components/MultipleLineCard',
  component: MultipleLineCard,
  parameters: {},
  argTypes: {
    id: { control: 'number' },
    cardName: { control: 'text' },
    onClick: { control: 'action' }
  },
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof MultipleLineCard>

const exampleNewsCardProps: NewsCardProps[] = [
  {
    imageSrc: 'path/to/image1.jpg',
    title: 'News Title 1',
    description: 'Description of the first news item.',
    variant: 'wide',
    onClick: () => console.log('Clicked News 1')
  },
  {
    imageSrc: 'path/to/image2.jpg',
    title: 'News Title 2',
    description: 'Description of the second news item.',
    variant: 'wide',
    onClick: () => console.log('Clicked News 2')
  },
  {
    imageSrc: 'path/to/image3.jpg',
    title: 'News Title 3',
    description: 'Description of the third news item.'
    // variant 및 onClick는 선택적이므로 여기서는 생략했습니다.
  },
  {
    imageSrc: 'path/to/image3.jpg',
    title: 'News Title 3',
    description: 'Description of the third news item.'
    // variant 및 onClick는 선택적이므로 여기서는 생략했습니다.
  },
  {
    imageSrc: 'path/to/image3.jpg',
    title: 'News Title 3',
    description: 'Description of the third news item.'
    // variant 및 onClick는 선택적이므로 여기서는 생략했습니다.
  },
  {
    imageSrc: 'path/to/image3.jpg',
    title: 'News Title 3',
    description: 'Description of the third news item.'
    // variant 및 onClick는 선택적이므로 여기서는 생략했습니다.
  },
  {
    imageSrc: 'path/to/image3.jpg',
    title: 'News Title 3',
    description: 'Description of the third news item.'
    // variant 및 onClick는 선택적이므로 여기서는 생략했습니다.
  }
  // 필요에 따라 더 많은 뉴스 카드 데이터를 추가할 수 있습니다.
]

export const Default: Story = {
  args: {
    id: 1,
    cardName: '예시 이름',
    newsCardPropsArray: exampleNewsCardProps
  }
}
