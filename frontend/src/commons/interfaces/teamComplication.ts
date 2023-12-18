export interface TeamComplication {
  id: number
  name: string
  globalName: string
  hometown: string
  initial: string
  establisehdAt: Date
  color: string
  subColor?: string
  profileImgUrl?: string
  backgroundImgUrl?: string
  deletedAt?: Date
  status: string
  createdAt: Date
  isWhite?: (color: string) => boolean
  onClick?: () => void
}
