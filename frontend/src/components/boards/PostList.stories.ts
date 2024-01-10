import type { Meta, StoryObj } from '@storybook/react'
import PostList from './PostList'

const meta = {
  title: 'Components/PostList',
  component: PostList,
  tags: ['autodocs']
} satisfies Meta<typeof PostList>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onPostClick: (postId: number) => alert(`click post id=${postId}`),
    pagination: {
      currentPage: 1,
      totalPosts: 200,
      onNextClick: () => alert('next click'),
      onPreviousClick: () => alert('previous click')
    },
    posts: [
      {
        id: 1,
        title: '테스트용 글 입니다 1',
        createdAt: new Date(),
        Account: {
          id: 1,
          name: 'User01',
          profileImgUrl: ''
        },
        type: 'Normal'
      },
      {
        id: 2,
        title: '테스트용 글 입니다 2',
        createdAt: new Date(),
        Account: {
          id: 1,
          name: 'User01',
          profileImgUrl: ''
        },
        type: 'Normal'
      },
      {
        id: 3,
        title: '테스트용 글 입니다 3',
        createdAt: new Date(),
        Account: {
          id: 1,
          name: 'User01',
          profileImgUrl: ''
        },
        type: 'Normal'
      },
      {
        id: 4,
        title: '테스트용 글 입니다 4',
        createdAt: new Date(),
        Account: {
          id: 1,
          name: 'User01',
          profileImgUrl: ''
        },
        type: 'Normal'
      },
      {
        id: 5,
        title: '테스트용 글 입니다 5',
        createdAt: new Date(),
        Account: {
          id: 1,
          name: 'User01',
          profileImgUrl: ''
        },
        type: 'Normal'
      },
      {
        id: 6,
        title: '테스트용 글 입니다 6',
        createdAt: new Date(),
        Account: {
          id: 1,
          name: 'User01',
          profileImgUrl: ''
        },
        type: 'Normal'
      },
      {
        id: 7,
        title: '테스트용 글 입니다 7',
        createdAt: new Date(),
        Account: {
          id: 1,
          name: 'User01',
          profileImgUrl: ''
        },
        type: 'Normal'
      },
      {
        id: 8,
        title: '테스트용 글 입니다 8',
        createdAt: new Date(),
        Account: {
          id: 1,
          name: 'User01',
          profileImgUrl: ''
        },
        type: 'Normal'
      },
      {
        id: 9,
        title: '테스트용 글 입니다 9',
        createdAt: new Date(),
        Account: {
          id: 1,
          name: 'User01',
          profileImgUrl: ''
        },
        type: 'Normal'
      },
      {
        id: 10,
        title: '테스트용 글 입니다 10',
        createdAt: new Date(),
        Account: {
          id: 1,
          name: 'User01',
          profileImgUrl: ''
        },
        type: 'Normal'
      }
    ]
  }
}
