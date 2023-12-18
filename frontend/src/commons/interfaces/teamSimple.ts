export interface TeamSimple {
  id: number
  name: string
  globalName: string
  initial: string
  color: string
  profileImgUrl: string
  isWhite?: (color: string) => boolean
  onClick?: (id: number) => void
}
