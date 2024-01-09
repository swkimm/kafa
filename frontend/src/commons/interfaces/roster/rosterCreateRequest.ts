import type { PositionType, RosterType } from './roster'

export interface RosterCreationRequest {
  globalName: string // 영문이름
  teamId: number // 팀 식별자
  registerYear: number // 입부년도
  rosterType: RosterType // 로스터 종류
  position?: PositionType // 포지션 (optional)
  height?: number // 키(cm) (optional)
  weight?: number // 몸무게(kg) (optional)
  backNumber: number // 등 번호
}
