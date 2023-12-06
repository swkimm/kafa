import type { Sponser } from '@prisma/client'

export abstract class LeagueService<T, V extends Sponser> {
  abstract getLeague(leagueId: number): Promise<T>
  abstract getLeaguesByAssociationId(
    associationId: number,
    page: number,
    limit?: number
  ): Promise<T[]>
  abstract getSponsersByLeagueId(
    leagueId: number,
    page: number,
    limit?: number
  ): Promise<V[]>
  abstract updateLeague(leagueId: number, leagueDTO: Partial<T>): Promise<T>
  abstract linkSponser(leagueId: number, sponserId: number): Promise<void>
  abstract unlinkSponser(leagueId: number, sponserId: number): Promise<void>
  abstract createLeague(leagueDTO: Partial<T>): Promise<T>
  abstract deleteLeague(leagueId: number): Promise<T>
}
