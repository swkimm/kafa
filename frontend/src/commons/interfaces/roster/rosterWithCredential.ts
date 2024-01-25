import type { Gender } from '../account/credential'
import type { RosterType } from './roster'
import type { RosterStatus } from './rosterStatus'

export interface RosterWithCredential {
  id: number
  name: string
  status: RosterStatus
  rosterType: RosterType
  profileImgUrl?: string
  RosterCredentials: {
    name: string
    birthday: string
    gender: Gender
  }
}
