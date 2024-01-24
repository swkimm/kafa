export interface GameWithLeagueDTO {
  id: number
  name: string
  startedAt: Date
  stadium: string
  homeTeam: {
    id: number
    name: string
    profileImgUrl: string
  }
  awayTeam: {
    id: number
    name: string
    profileImgUrl: string
  }
  League: {
    id: number
    name: string
  }
  score: {
    homeTeamScore: number
    awayTeamScore: number
  }
}
