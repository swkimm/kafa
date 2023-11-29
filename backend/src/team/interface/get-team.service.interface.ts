export interface GetTeamService<T, U> {
  getTeam(teamId: number): Promise<T>

  getTeams(page: number, limit?: number, option?: string): Promise<T[]>

  getAssociationTeams(associationId: number): Promise<T[]>

  getLeagueTeams(leagueId: number): Promise<T[]>

  getAccountRegisterTeamRequests(accountId: number): Promise<U[]>

  getRegisterTeamRequests(
    limit?: number,
    cursor?: number,
    option?: string
  ): Promise<U[]>
}
