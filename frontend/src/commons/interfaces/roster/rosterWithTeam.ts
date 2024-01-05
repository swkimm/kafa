import type { AthleteInfo, RosterType } from './roster'

// Interface for TeamInfo
export interface TeamInfo {
  id: number // 팀 식별자
  name: string // 팀 이름
  profileImgUrl?: string // 팀 프로필 이미지 주소 (optional)
}

// Main Roster Interface
export interface RosterWithTeam {
  id: number // 로스터 식별자
  name: string // 이름
  globalName: string // 영문 이름
  profileImgUrl?: string // 로스터 프로필 주소 (optional)
  rosterType: RosterType // 로스터 종류
  Athlete?: AthleteInfo // 선수 정보 (optional)
  Team: TeamInfo // 팀 정보
}
