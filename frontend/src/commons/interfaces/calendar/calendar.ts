export interface CalendarItemBase {}

type DateString = string

export interface CalendarDTO<T extends CalendarItemBase> {
  thumbnail: string
  date: DateString
  item?: T
}

export interface CalendarGameItem extends CalendarItemBase {
  id: number
  name: string
  leagueName: string
  stadium: string
  homeTeamName: string
  homeTeamProfileUrl?: string
  awayTeamName: string
  awayTeamProfileUrl?: string
}
