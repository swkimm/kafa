import { Inject, Injectable } from '@nestjs/common'
import type { TeamLeague } from '@prisma/client'
import { TeamLeagueService } from '../abstract/team-league.service'
import type { UpdateTeamLeagueDTO } from '../dto/updateTeamLeague.dto'
import { GetTeamLeagueService } from '../interface/get-team-league.service.interface'
import { RegisterTeamLeagueService } from '../interface/register-team-league.service.interface'
import { UpdateTeamLeagueService } from '../interface/update-team-league.service.interface'

@Injectable()
export class TeamLeagueServiceImpl extends TeamLeagueService<TeamLeague> {
  constructor(
    @Inject('GetTeamLeagueService')
    private readonly getTeamLeagueService: GetTeamLeagueService<TeamLeague>,
    @Inject('UpdateTeamLeagueService')
    private readonly updateTeamLeagueService: UpdateTeamLeagueService<TeamLeague>,
    @Inject('RegisterTeamLeagueService')
    private readonly registerTeamLeagueService: RegisterTeamLeagueService<TeamLeague>
  ) {
    super()
  }

  async getTeamLeaguesByLeagueId(leagueId: number): Promise<TeamLeague[]> {
    return await this.getTeamLeagueService.getTeamLeaguesByLeagueId(leagueId)
  }

  async getTeamLeaguesByTeamId(teamId: number): Promise<TeamLeague[]> {
    return await this.getTeamLeagueService.getTeamLeaguesByTeamId(teamId)
  }

  async registerTeamLeague(
    teamId: number,
    leagueId: number
  ): Promise<TeamLeague> {
    return await this.registerTeamLeagueService.registerTeamLeague(
      teamId,
      leagueId
    )
  }

  async updateTeamLeague(
    teamLeagueDTO: UpdateTeamLeagueDTO
  ): Promise<TeamLeague> {
    return await this.updateTeamLeagueService.updateTeamLeague(teamLeagueDTO)
  }
}
