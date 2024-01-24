export interface GetLeaguesWithYear {
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

export interface LeagueWithAssociation extends GetLeaguesWithYear {}
