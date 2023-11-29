export interface RegisterTeamLeagueService<T> {
  registerTeamLeague(teamId: number, leagueId: number): Promise<T>
}
