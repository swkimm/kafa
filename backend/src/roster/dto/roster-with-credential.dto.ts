import type { GenderType, RosterStatus, RosterType } from '@prisma/client'

export interface RosterWithCredentialDTO {
  id: number
  name: string
  status: RosterStatus
  rosterType: RosterType
  profileImgUrl?: string
  RosterCredentials: {
    name: string
    birthday: Date
    gender: GenderType
  }
}
