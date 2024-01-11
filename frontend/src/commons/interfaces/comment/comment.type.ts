export interface Comment {
  id: number
  content: string
  createdAt: Date
  Account: {
    id: number
    name: string
  }
}
