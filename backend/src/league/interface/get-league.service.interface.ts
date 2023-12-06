import type { Sponser } from '@prisma/client'

export interface GetLeagueService<T, V extends Sponser> {
  getLeague(leagueId: number): Promise<T>
  getLeaguesByAssociationId(
    associationId: number,
    page: number,
    limit?: number
  ): Promise<T[]>
  getSponsersByLeagueId(
    leagueId: number,
    page: number,
    limit?: number
  ): Promise<V[]>
}
