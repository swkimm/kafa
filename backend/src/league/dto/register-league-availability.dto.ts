import type { Position } from '@/roster/types/position.type'
import type { GenderType, RosterType } from '@prisma/client'
import type { RosterAccountCredentialStatus } from '../types/rosterAccountCredentialStatus.type'

/**
 * 팀의 로스터 유효성 정보를 담는 DTO 클래스
 */
export class RegisterLeagueAvaliabilityDTO {
  valid: boolean
  reasons: string[]
  rosters: RosterWithAvaliability[]

  constructor() {
    this.valid = true
    this.reasons = []
    this.rosters = []
  }
}

interface BasicRoster {
  name: string
  profileImgUrl: string
  rosterType: RosterType
  position?: Position
  backNumber?: number
}

/**
 * 로스터의 기본 정보와 유효성 정보를 담는 인터페이스
 */
export interface RosterWithAvaliability extends BasicRoster {
  avaliability: RosterAccountCredentialStatus
}

/**
 * 로스터의 기본 정보와 증명서 정보를 담는 인터페이스
 */
export interface RosterWithCredentialsAndCertifications extends BasicRoster {
  birthday?: Date
  gender?: GenderType
  certificationUrl?: string
}

/**
 * 로스터의 기본 정보와 증명서 정보 목록을 담는 DTO 클래스
 */
export class TeamRosterWithSensitiveInfoDTO {
  rejectReason?: string
  rosters: RosterWithCredentialsAndCertifications[]

  constructor() {
    this.rejectReason = null
    this.rosters = []
  }
}
