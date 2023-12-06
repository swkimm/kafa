export interface CreateLeagueService<T> {
  createLeague(leagueDTO: Partial<T>): Promise<T>
}
