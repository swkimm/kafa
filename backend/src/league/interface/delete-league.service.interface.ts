export interface DeleteLeagueService<T> {
  deleteLeague(leagueId: number): Promise<T>
}
