import { RosterType } from '@/commons/interfaces/roster/roster'

export const printRosterType = (type: RosterType): string => {
  switch (type) {
    case RosterType.Athlete:
      return '선수'
    case RosterType.Staff:
      return '매니저'
    case RosterType.Coach:
      return '코치'
    case RosterType.HeadCoach:
      return '감독'
    default:
      return 'Error'
  }
}
