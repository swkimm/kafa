import { Role } from '@/commons/interfaces/account/profile'

export const printRole = (role: Role): string => {
  switch (role) {
    case Role.User:
      return '일반 사용자'
    case Role.Manager:
      return '팀 매니저'
    case Role.Admin:
      return '관리자'
    default:
      return '권한 없음'
  }
}
