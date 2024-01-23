import {
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req
} from '@nestjs/common'
import { AuthenticatedRequest } from '@/common/class/authenticated-request.interface'
import { Public } from '@/common/decorator/guard.decorator'
import { Roles } from '@/common/decorator/roles.decorator'
import { businessExceptionBinder } from '@/common/exception/business-exception.binder'
import {
  Role,
  type League,
  type Sponser,
  type TeamLeague
} from '@prisma/client'
import { LeagueService } from './abstract/league.service'
import type { LeagueApplyStatusDTO } from './dto/league-apply-status.dto'
import type { LeagueWithAssociationDTO } from './dto/league-with-association.dto'
import type { RegisterLeagueAvaliabilityDTO } from './dto/register-league-availability.dto'

@Controller('leagues')
export class LeagueController {
  constructor(
    @Inject('LeagueService')
    private readonly leagueService: LeagueService<League, TeamLeague, Sponser>
  ) {}

  @Public()
  @Get('')
  async getLeagues(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number
  ): Promise<LeagueWithAssociationDTO[]> {
    try {
      return await this.leagueService.getLeagues(page, limit)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Public()
  @Get('years/:year')
  async getLeaguesByYear(
    @Param('year', ParseIntPipe) year: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number
  ): Promise<LeagueWithAssociationDTO[]> {
    try {
      return await this.leagueService.getLeaguesByYear(year, page, limit)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Public()
  @Get('teams/:teamId/years/:year')
  async getLeaguesByTeamAndYear(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Param('year', ParseIntPipe) year: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number
  ): Promise<LeagueWithAssociationDTO[]> {
    try {
      return await this.leagueService.getLeaguesByTeamAndYear(
        teamId,
        year,
        page,
        limit
      )
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Roles(Role.Manager)
  @Get('rosters/validation')
  async checkTeamRosterCertifications(
    @Req() req: AuthenticatedRequest
  ): Promise<RegisterLeagueAvaliabilityDTO> {
    try {
      return await this.leagueService.checkTeamRosterCertifications(req.user.id)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Roles(Role.Manager)
  @Get('joinable')
  async getJoinableLeagues(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number
  ): Promise<LeagueWithAssociationDTO[]> {
    try {
      return await this.leagueService.getJoinableLeagues(limit)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Roles(Role.Manager)
  @Get('requests')
  async getTeamJoinLeagueRequests(
    @Req() req: AuthenticatedRequest
  ): Promise<LeagueApplyStatusDTO[]> {
    try {
      return await this.leagueService.getTeamJoinLeagueRequests(req.user.id)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Public()
  @Get(':id')
  async getLeague(
    @Param('id', ParseIntPipe) leagueId: number
  ): Promise<League> {
    try {
      return await this.leagueService.getLeague(leagueId)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Public()
  @Get('associations/:associationId')
  async getLeaguesByAssociationId(
    @Param('associationId', ParseIntPipe) associationId: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', new ParseIntPipe({ optional: true }))
    limit?: number
  ): Promise<League[]> {
    try {
      return await this.leagueService.getLeaguesByAssociationId(
        associationId,
        page,
        limit
      )
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Public()
  @Get(':leagueId/sponsers')
  async getSponsersByLeagueId(
    @Param('leagueId', ParseIntPipe) leagueId: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number
  ): Promise<Sponser[]> {
    try {
      return await this.leagueService.getSponsersByLeagueId(
        leagueId,
        page,
        limit
      )
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Roles(Role.Manager)
  @Post(':leagueId/join')
  async requestJoinLeague(
    @Req() req: AuthenticatedRequest,
    @Param('leagueId', ParseIntPipe) leagueId: number
  ): Promise<TeamLeague> {
    try {
      return await this.leagueService.requestJoinLeague(leagueId, req.user.id)
    } catch (error) {
      console.log(error)
      businessExceptionBinder(error)
    }
  }

  @Roles(Role.Manager)
  @Post(':leagueId/join/retry')
  async retryJoinLeague(
    @Req() req: AuthenticatedRequest,
    @Param('leagueId', ParseIntPipe) leagueId: number
  ): Promise<TeamLeague> {
    try {
      return await this.leagueService.retryJoinLeague(leagueId, req.user.id)
    } catch (error) {
      console.log(error)
      businessExceptionBinder(error)
    }
  }
}
