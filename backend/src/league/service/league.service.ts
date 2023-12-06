import { Inject, Injectable } from '@nestjs/common'
import type { League, Sponser } from '@prisma/client'
import { LeagueService } from '../abstract/league.service'
import type { CreateLeagueDTO } from '../dto/create-league.dto'
import type { UpdateLeagueDTO } from '../dto/update-league.dto'
import { CreateLeagueService } from '../interface/create-league.service.interface'
import { DeleteLeagueService } from '../interface/delete-league.service.interface'
import { GetLeagueService } from '../interface/get-league.service.interface'
import { UpdateLeagueService } from '../interface/update-league.service.interface'

@Injectable()
export class LeagueServiceImpl extends LeagueService<League, Sponser> {
  constructor(
    @Inject('CreateLeagueService')
    private readonly createLeagueService: CreateLeagueService<League>,
    @Inject('DeleteLeagueService')
    private readonly deleteLeagueService: DeleteLeagueService<League>,
    @Inject('UpdateLeagueService')
    private readonly updateLeagueService: UpdateLeagueService<League>,
    @Inject('GetLeagueService')
    private readonly getLeagueService: GetLeagueService<League, Sponser>
  ) {
    super()
  }

  async getLeague(leagueId: number): Promise<League> {
    return await this.getLeagueService.getLeague(leagueId)
  }

  async getLeaguesByAssociationId(
    associationId: number,
    page: number,
    limit?: number
  ): Promise<League[]> {
    return await this.getLeagueService.getLeaguesByAssociationId(
      associationId,
      page,
      limit
    )
  }

  async getSponsersByLeagueId(
    leagueId: number,
    page: number,
    limit?: number
  ): Promise<Sponser[]> {
    return await this.getLeagueService.getSponsersByLeagueId(
      leagueId,
      page,
      limit
    )
  }

  async updateLeague(
    leagueId: number,
    leagueDTO: UpdateLeagueDTO
  ): Promise<League> {
    return await this.updateLeagueService.updateLeague(leagueId, leagueDTO)
  }

  async linkSponser(leagueId: number, sponserId: number): Promise<void> {
    return await this.updateLeagueService.linkSponser(leagueId, sponserId)
  }

  async unlinkSponser(leagueId: number, sponserId: number): Promise<void> {
    return await this.updateLeagueService.unlinkSponser(leagueId, sponserId)
  }

  async createLeague(leagueDTO: CreateLeagueDTO): Promise<League> {
    return await this.createLeagueService.createLeague(leagueDTO)
  }

  async deleteLeague(leagueId: number): Promise<League> {
    return await this.deleteLeagueService.deleteLeague(leagueId)
  }
}
