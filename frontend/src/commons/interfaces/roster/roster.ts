import type { RosterStatus } from './rosterStatus'

export enum RosterType {
  Athlete = 'Athlete',
  Staff = 'Staff',
  Coach = 'Coach',
  HeadCoach = 'HeadCoach'
}

export interface PositionType {
  offence?: string
  defense?: string
  special?: string
}

export interface AthleteInfo {
  position: PositionType
  backNumber: number
  weight: number
  height: number
}

export interface TeamInfo {
  id: number
  name: string
  profileImgUrl?: string
}

enum GenderType {
  Male,
  Female
}

export interface Roster {
  id: number
  name: string
  globalName: string
  profileImgUrl?: string
  rosterType: RosterType
  Athlete?: AthleteInfo
  registerYear: string
  birthday?: string
  gender?: GenderType
  certification?: string
  Team?: TeamInfo
  status: RosterStatus
}
