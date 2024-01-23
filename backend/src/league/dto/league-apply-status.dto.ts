import type { LeagueApplyStatus } from '@prisma/client'

export interface LeagueApplyStatusDTO {
  applyStatus: LeagueApplyStatus
  rejectReason: string
  Team: {
    id: number
    name: string
    profileImgUrl: string
  }
  League: {
    id: number
    name: string
  }
}
