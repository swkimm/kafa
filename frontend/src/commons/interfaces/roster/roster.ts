export enum RosterType {
  Athlete,
  Staff,
  Coach,
  HeadCoach
}

export interface PositionType {
  offence?: string
  defense?: string
  special?: string
}

export interface AthleteInfo {
  position: PositionType
  backNumber: number
}

export interface Roster {
  id: number
  name: string
  globalName: string
  profileImgUrl?: string
  rosterType: RosterType
  Athlete?: AthleteInfo
}
