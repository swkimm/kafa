import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req
} from '@nestjs/common'
import { AuthenticatedRequest } from '@/common/class/authenticated-request.interface'
import { Public } from '@/common/decorator/guard.decorator'
import { Roles } from '@/common/decorator/roles.decorator'
import { businessExceptionBinder } from '@/common/exception/business-exception.binder'
import { Role, type RegisterTeamRequest, type Team } from '@prisma/client'
import { TeamService } from './abstract/team.service'
import { RegisterTeamRequestDTO } from './dto/register-team-request.dto'
import type { TeamManyDTO } from './dto/team-many.dto'
import { UpdateTeamDTO } from './dto/update-team.dto'

@Controller('teams')
export class TeamController {
  constructor(
    @Inject('TeamService')
    private readonly teamService: TeamService<
      Team,
      { result: string },
      RegisterTeamRequest
    >
  ) {}

  @Get('requests')
  async getAccountRegisterTeamRequests(
    @Req() req: AuthenticatedRequest
  ): Promise<RegisterTeamRequest[]> {
    try {
      return await this.teamService.getAccountRegisterTeamRequests(req.user.id)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Public()
  @Get()
  async getTeams(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('option') option?: string
  ): Promise<TeamManyDTO[]> {
    try {
      return await this.teamService.getTeams(page, limit, option)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Get('search')
  async getTeamsBySearch(
    @Query('term') searchTerm: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number
  ): Promise<TeamManyDTO[]> {
    try {
      return await this.teamService.getTeamsBySearch(searchTerm, limit)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Public()
  @Get(':id')
  async getTeam(@Param('id', ParseIntPipe) id: number): Promise<Team> {
    try {
      return await this.teamService.getTeam(id)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Public()
  @Get('leagues/:leagueId')
  async getTeamsByLeagueId(
    @Param('leagueId', ParseIntPipe) leagueId: number
  ): Promise<Team[]> {
    try {
      return await this.teamService.getLeagueTeams(leagueId)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Public()
  @Get('associations/:associationId')
  async getTeamsByAssociationId(
    @Param('associationId', ParseIntPipe) associationId: number
  ): Promise<Team[]> {
    try {
      return await this.teamService.getAssociationTeams(associationId)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Post('requests')
  async createRegisterTeamRequest(
    @Body() requestTeamDTO: RegisterTeamRequestDTO,
    @Req() req: AuthenticatedRequest
  ): Promise<RegisterTeamRequest> {
    try {
      requestTeamDTO.accountId = req.user.id
      return await this.teamService.createRegisterTeamRequest(requestTeamDTO)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Roles(Role.Manager)
  @Put('profile')
  async updateTeamProfile(
    @Body() updateTeamDTO: UpdateTeamDTO,
    @Req() req: AuthenticatedRequest
  ) {
    try {
      return await this.teamService.updateTeamProfile(
        updateTeamDTO,
        req.user.id
      )
    } catch (error) {
      businessExceptionBinder(error)
    }
  }
}
