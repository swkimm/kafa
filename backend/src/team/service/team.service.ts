import { Inject, Injectable } from '@nestjs/common'
import type { RegisterTeamRequest, Team } from '@prisma/client'
import { TeamService } from '../abstract/team.service'
import type { RegisterTeamRequestDTO } from '../dto/register-team-request.dto'
import type { TeamManyDTO } from '../dto/team-many.dto'
import type { UpdateTeamDTO } from '../dto/update-team.dto'
import { DeleteTeamService } from '../interface/delete-team.service.interface'
import { GetTeamService } from '../interface/get-team.service.interface'
import { RegisterTeamService } from '../interface/register-team.service.interface'
import { UpdateTeamService } from '../interface/update-team.service.interface'

@Injectable()
export class TeamServiceImpl extends TeamService<
  Team,
  { result: string },
  RegisterTeamRequest
> {
  constructor(
    @Inject('RegisterTeamService')
    private readonly registerTeamService: RegisterTeamService<
      Team,
      RegisterTeamRequest
    >,
    @Inject('DeleteTeamService')
    private readonly deleteTeamService: DeleteTeamService<{ result: string }>,
    @Inject('UpdateTeamService')
    private readonly updateTeamService: UpdateTeamService<
      Team,
      RegisterTeamRequest
    >,
    @Inject('GetTeamService')
    private readonly getTeamService: GetTeamService<Team, RegisterTeamRequest>
  ) {
    super()
  }

  async registerTeam(teamDTO: Partial<Team>): Promise<Team> {
    return await this.registerTeamService.registerTeam(teamDTO)
  }

  async createRegisterTeamRequest(
    requestTeamDTO: RegisterTeamRequestDTO
  ): Promise<RegisterTeamRequest> {
    return await this.registerTeamService.createRegisterTeamRequest(
      requestTeamDTO
    )
  }

  async approveRegisterTeamRequest(requestId: number): Promise<Team> {
    return await this.updateTeamService.approveRegisterTeamRequest(requestId)
  }

  async rejectRegisterTeamRequest(
    requestId: number,
    reason: string
  ): Promise<RegisterTeamRequest> {
    return await this.updateTeamService.rejectRegisterTeamRequest(
      requestId,
      reason
    )
  }

  async deleteTeam(teamId: number): Promise<{ result: string }> {
    return await this.deleteTeamService.deleteTeam(teamId)
  }

  async updateTeamProfile(
    teamDTO: UpdateTeamDTO,
    teamId: number
  ): Promise<Team> {
    return await this.updateTeamService.updateTeamProfile(teamDTO, teamId)
  }

  async getTeam(teamId: number): Promise<Team> {
    return await this.getTeamService.getTeam(teamId)
  }

  async getTeams(
    limit?: number,
    cursor?: number,
    option?: string
  ): Promise<TeamManyDTO[]> {
    const teams = await this.getTeamService.getTeams(limit, cursor, option)
    return teams.map((team) => {
      return {
        id: team.id,
        name: team.name,
        globalName: team.globalName,
        initial: team.initial,
        color: team.color,
        profileImgUrl: team.profileImgUrl
      }
    })
  }

  async getAssociationTeams(associationId: number): Promise<Team[]> {
    return await this.getTeamService.getAssociationTeams(associationId)
  }

  async getLeagueTeams(leagueId: number): Promise<Team[]> {
    return await this.getTeamService.getLeagueTeams(leagueId)
  }

  async getAccountRegisterTeamRequests(
    accountId: number
  ): Promise<RegisterTeamRequest[]> {
    return await this.getTeamService.getAccountRegisterTeamRequests(accountId)
  }

  async getRegisterTeamRequests(
    limit?: number,
    cursor?: number,
    option?: string
  ): Promise<RegisterTeamRequest[]> {
    return await this.getTeamService.getRegisterTeamRequests(
      limit,
      cursor,
      option
    )
  }
}
