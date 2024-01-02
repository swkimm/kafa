export interface LeagueWithAssociationDTO {
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
