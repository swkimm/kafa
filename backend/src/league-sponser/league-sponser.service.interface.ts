export interface LeagueSponserService<T> {
  getLeagueSponser(leagueId: number, sponserId: number): Promise<T>
  getLeagueSponsersBySponserId(
    sponserId: number,
    page: number,
    limit?: number
  ): Promise<T[]>
  getLeagueSponsersByLeagueId(
    leagueId: number,
    page: number,
    limit?: number
  ): Promise<T[]>
  createLeagueSponser(leagueSponserDTO: Partial<T>): Promise<T>
  updateLeagueSponser(
    leagueId: number,
    sponserId: number,
    leagueSponserDTO: Partial<T>
  ): Promise<T>
  deleteLeagueSponser(leagueId: number, sponserId: number): Promise<T>
}
