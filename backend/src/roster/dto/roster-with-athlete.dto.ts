import type { RosterStatus, RosterType } from '@prisma/client'
import type { JsonValue } from '@prisma/client/runtime/library'

export interface RosterDTO {
  id: number
  name: string
  globalName: string
  profileImgUrl: string
  rosterType: RosterType
  registerYear: Date
  status: RosterStatus
}

export interface RosterWithAthleteDTO extends RosterDTO {
  Athlete: {
    position: JsonValue
    backNumber: number
    weight: number
    height: number
  }
  Team: {
    id: number
    name: string
    profileImgUrl: string
  }
}

export interface RosterWithAthleteManyDTO extends RosterDTO {
  Athlete: {
    position: JsonValue
    backNumber: number
  }
}

export interface RosterWithAthleteSimpleDTO extends RosterWithAthleteManyDTO {}
