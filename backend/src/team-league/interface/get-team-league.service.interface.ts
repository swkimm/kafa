export interface GetTeamLeagueService<T> {
  getTeamLeaguesByLeagueId(leagueId: number): Promise<T[]>
  getTeamLeaguesByTeamId(teamId: number): Promise<T[]>
}
