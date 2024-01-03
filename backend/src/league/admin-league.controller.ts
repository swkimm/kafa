import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put
} from '@nestjs/common'
import { Roles } from '@/common/decorator/roles.decorator'
import { businessExceptionBinder } from '@/common/exception/business-exception.binder'
import {
  Role,
  type League,
  type Sponser,
  type TeamLeague
} from '@prisma/client'
import { LeagueService } from './abstract/league.service'
import { CreateLeagueDTO } from './dto/create-league.dto'
import type { TeamRosterWithSensitiveInfoDTO } from './dto/register-league-availability.dto'
import { RejectReasonDTO } from './dto/reject-reason.dto'
import { UpdateLeagueDTO } from './dto/update-league.dto'

@Roles(Role.Admin)
@Controller('admin/leagues')
export class AdminLeagueController {
  constructor(
    @Inject('LeagueService')
    private readonly leagueService: LeagueService<League, TeamLeague, Sponser>
  ) {}

  @Get(':leagueId/requests')
  async getJoinLeagueRequests(
    @Param('leagueId', ParseIntPipe) leagueId: number
  ): Promise<TeamLeague[]> {
    try {
      return await this.leagueService.getJoinLeagueRequests(leagueId)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Get(':leagueId/teams/:teamId/request')
  async getJoinLeagueRequestInfo(
    @Param('leagueId', ParseIntPipe) leagueId: number,
    @Param('teamId', ParseIntPipe) teamId: number
  ): Promise<TeamRosterWithSensitiveInfoDTO> {
    try {
      return await this.leagueService.getLeagueJoinRequestWithRosterAndCredentials(
        teamId,
        leagueId
      )
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Post('')
  async createLeague(@Body() leagueDTO: CreateLeagueDTO): Promise<League> {
    try {
      return await this.leagueService.createLeague(leagueDTO)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Post(':leagueId/teams/:teamId/approve')
  async approveJoinLeague(
    @Param('leagueId', ParseIntPipe) leagueId: number,
    @Param('teamId', ParseIntPipe) teamId: number
  ): Promise<TeamLeague> {
    try {
      return await this.leagueService.approveRegisterLeague(teamId, leagueId)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Put(':leagueId/teams/:teamId/join')
  async rejectJoinLeague(
    @Param('leagueId', ParseIntPipe) leagueId: number,
    @Param('teamId', ParseIntPipe) teamId: number,
    @Body() leagueDTO: RejectReasonDTO
  ): Promise<TeamLeague> {
    try {
      return await this.leagueService.rejectRegisterLeague(
        teamId,
        leagueId,
        leagueDTO.reason,
        leagueDTO.type
      )
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Post(':leagueId/sponsers/:sponserId/link')
  async linkSponser(
    @Param('leagueId', ParseIntPipe) leagueId: number,
    @Param('sponserId', ParseIntPipe) sponserId: number
  ): Promise<void> {
    try {
      return await this.leagueService.linkSponser(leagueId, sponserId)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Post(':leagueId/sponsers/:sponserId/unlink')
  async unlinkSponser(
    @Param('leagueId', ParseIntPipe) leagueId: number,
    @Param('sponserId', ParseIntPipe) sponserId: number
  ): Promise<void> {
    try {
      return await this.leagueService.unlinkSponser(leagueId, sponserId)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Put(':leagueId')
  async updateLeague(
    @Body() leagueDTO: UpdateLeagueDTO,
    @Param('leagueId', ParseIntPipe) leagueId: number
  ): Promise<League> {
    try {
      return await this.leagueService.updateLeague(leagueId, leagueDTO)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Delete(':leagueId')
  async deleteLeague(
    @Param('leagueId', ParseIntPipe) leagueId: number
  ): Promise<League> {
    try {
      return await this.leagueService.deleteLeague(leagueId)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }
}
