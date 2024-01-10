import type { PostType } from '@prisma/client'

export class BasicPost {
  id: number
  title: string
  createdAt: Date
  type: PostType
  Account: {
    id: number
    name: string
    profileImgUrl: string
  }
}

export class DetailPost extends BasicPost {
  content: string
  updatedAt: Date
}
