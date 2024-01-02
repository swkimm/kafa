export interface Game {
  id: number
  leagueId: number
  startedAt: Date
  homeTeamId: number
  awayTeamId: number
  stadium: string
  result?: string | null
}
