export interface UpdateLeagueService<T> {
  updateLeague(leagueId: number, leagueDTO: Partial<T>): Promise<T>
  linkSponser(leagueId: number, sponserId: number): Promise<void>
  unlinkSponser(leagueId: number, sponserId: number): Promise<void>
}
