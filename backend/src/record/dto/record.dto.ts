import type { Prisma, RecordType } from '@prisma/client'

export interface RecordDTO {
  id: number
  type: RecordType
  score: number
  unit: string
  Game: {
    id: number
    homeTeam: {
      id: number
      name: string
      profileImgUrl: string
    }
    awayTeam: {
      id: number
      name: string
      profileImgUrl: string
    }
  }
  Athlete: {
    position: Prisma.JsonValue
    Roster: {
      id: number
      name: string
      profileImgUrl: string
      teamId: number
    }
  }
}
