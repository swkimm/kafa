export interface RegisterTeamRequest {
  id: number
  accountId: number
  username: string
  data: {
    associationId: number
    name: string
    globalName: string
    homeTown: string
    initial: string
    establishedAt: Date
    color: string
    subColor?: string
  }
  createdAt: Date
  rejectReason: string
  status: TeamRequestStatus
}

export enum TeamRequestStatus {
  Approved = 'Approved',
  Rejected = 'Rejected',
  Received = 'Received'
}
