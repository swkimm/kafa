export interface GetLeagues {
  id: number
  name: string
  startedAt: Date
  startedYear?: number
  endedAt: Date
  associationId: number
}

export interface ApplyLeagueInfo {
  applyStatus: LeagueApplyStatus
  rejectReason?: string
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

export enum LeagueApplyStatus {
  Approved = 'Approved',
  Rejected = 'Rejected',
  Received = 'Received',
  Hold = 'Hold'
}
