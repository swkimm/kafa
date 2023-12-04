// MultipleLineNarrowCard.storeis.ts
import type { Meta, StoryObj } from '@storybook/react'
import MultipleLineNarrowCard from './MultipleLineNarrowCard'

export interface NewsCardProps {
  imageSrc: string
  title: string
  description: string
  variant?: 'wide' | 'narrow'
  onClick?: () => void
}

const meta: Meta<typeof MultipleLineNarrowCard> = {
  title: 'Components/MultipleLineNarrowCard',
  component: MultipleLineNarrowCard,
  parameters: {},
  argTypes: {
    id: { control: 'number' },
    cardName: { control: 'text' },
    onClick: { control: 'action' }
  },
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof MultipleLineNarrowCard>

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
  },
  {
    imageSrc: 'path/to/image3.jpg',
    title: 'News Title 3',
    description: 'Description of the third news item.'
  },
  {
    imageSrc: 'path/to/image3.jpg',
    title: 'News Title 3',
    description: 'Description of the third news item.'
  },
  {
    imageSrc: 'path/to/image3.jpg',
    title: 'News Title 3',
    description: 'Description of the third news item.'
  },
  {
    imageSrc: 'path/to/image3.jpg',
    title: 'News Title 3',
    description: 'Description of the third news item.'
  }
]

export const Default: Story = {
  args: {
    id: 1,
    cardName: '예시 이름',
    newsCardPropsArray: exampleNewsCardProps
  }
}
