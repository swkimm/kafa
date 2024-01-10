export interface BasicPost {
  id: number
  title: string
  createdAt: Date
  type: 'Notice' | 'Normal' | 'Secret'
  Account: {
    id: number
    name: string
    profileImgUrl: string
  }
}

export interface DetailPost extends BasicPost {
  content: string
  updatedAt: Date
}
