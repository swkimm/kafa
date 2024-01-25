export interface CalendarDTO<T> {
  thumbnail: string
  date: Date
  item?: T
}

export interface CalendarGameItem {
  id: number
  name: string
  leagueName: string
  stadium: string
  homeTeamName: string
  homeTeamProfileUrl?: string
  awayTeamName: string
  awayTeamProfileUrl?: string
}
