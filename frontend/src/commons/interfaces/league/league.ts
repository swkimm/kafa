export interface League {
  id: number
  name: string
  startedAt: Date
  endedAt: Date
  associationId: number
}

export interface LeagueWithAssociation {
  id: number
  name: string
  startedAt: Date
  endedAt: Date
  Association: {
    id: number
    name: string
    profileImgUrl: string
  }
}
