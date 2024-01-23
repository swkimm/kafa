import { RosterStatus } from '@/commons/interfaces/roster/rosterStatus'

export const printRosterStatus = (type: RosterStatus): string => {
  switch (type) {
    case RosterStatus.Enable:
      return '활성'
    case RosterStatus.Graduate:
      return '동문'
    case RosterStatus.Disable:
      return '비활성'
    default:
      return '등록중'
  }
}
