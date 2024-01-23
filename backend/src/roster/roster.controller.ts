import {
  Body,
  Controller,
  Delete,
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
import { Role, type Roster } from '@prisma/client'
import { RosterService } from './abstract/roster.service'
import { CreateRosterDTO, RequestRosterDTO } from './dto/create-roster.dto'
import type {
  RosterWithAthleteDTO,
  RosterWithAthleteManyDTO,
  RosterWithAthleteSimpleDTO
} from './dto/roster-with-athlete.dto'
import type { RosterWithCredentialDTO } from './dto/roster-with-credential.dto'
import { UpdateRosterDTO } from './dto/update-roster.dto'
import { RosterCredentialDTO } from './interface/roster-credential.dto'

@Controller('rosters')
export class RosterController {
  constructor(
    @Inject('RosterService')
    private readonly rosterService: RosterService<Roster>
  ) {}

  @Roles(Role.Manager)
  @Post('')
  async createRoster(
    @Body() rosterDTO: CreateRosterDTO,
    @Req() req: AuthenticatedRequest
  ): Promise<RosterWithCredentialDTO> {
    try {
      return await this.rosterService.createRoster(rosterDTO, req.user.id)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Get('account')
  async getAccountRosters(
    @Req() req: AuthenticatedRequest
  ): Promise<RosterWithAthleteDTO[]> {
    try {
      return await this.rosterService.getAccountRosters(req.user.id)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Get('connectable')
  async getConnectableRosters(
    @Req() req: AuthenticatedRequest
  ): Promise<RosterWithAthleteDTO[]> {
    try {
      return await this.rosterService.getConnectableRosters(req.user.id)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Roles(Role.Manager)
  @Get('unconnected')
  async getUnconnectedRosters(
    @Req() req: AuthenticatedRequest,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number
  ): Promise<RosterWithCredentialDTO[]> {
    try {
      return await this.rosterService.getUnconnectedRosters(
        req.user.id,
        page,
        limit
      )
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Roles(Role.Manager)
  @Get('requests')
  async getCreateRosterRequests(
    @Req() req: AuthenticatedRequest
  ): Promise<RosterWithAthleteDTO[]> {
    try {
      return await this.rosterService.getCreateRosterRequests(req.user.id)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Public()
  @Get(':rosterId')
  async getRoster(
    @Param('rosterId', ParseIntPipe) rosterId: number
  ): Promise<RosterWithAthleteDTO> {
    try {
      return await this.rosterService.getRoster(rosterId)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Roles(Role.Manager)
  @Put(':rosterId')
  async updateRoster(
    @Body() rosterDTO: UpdateRosterDTO,
    @Param('rosterId', ParseIntPipe) rosterId: number,
    @Req() req: AuthenticatedRequest
  ): Promise<RosterWithAthleteSimpleDTO> {
    try {
      return await this.rosterService.updateRoster(
        rosterDTO,
        rosterId,
        req.user.id
      )
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Roles(Role.Manager)
  @Put(':rosterId/credential')
  async updateRosterCredential(
    @Req() req: AuthenticatedRequest,
    @Param('rosterId', ParseIntPipe) rosterId: number,
    @Body() credential: RosterCredentialDTO
  ): Promise<RosterCredentialDTO> {
    try {
      return await this.rosterService.updateRosterCredential(
        req.user.id,
        rosterId,
        credential
      )
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Roles(Role.Manager)
  @Delete(':rosterId')
  async deleteRoster(
    @Param('rosterId', ParseIntPipe) rosterId: number,
    @Req() req: AuthenticatedRequest
  ): Promise<Roster> {
    try {
      return await this.rosterService.deleteRoster(rosterId, req.user.id)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Public()
  @Get('teams/:teamId')
  async getTeamRosters(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('option') option?: string
  ): Promise<RosterWithAthleteManyDTO[]> {
    try {
      return await this.rosterService.getTeamRosters(
        teamId,
        page,
        limit,
        option
      )
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Public()
  @Get('teams/:teamId/search')
  async getTeamRostersBySearch(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Query('term') searchTerm: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number
  ): Promise<RosterWithAthleteManyDTO[]> {
    try {
      return await this.rosterService.getTeamRostersBySearch(
        searchTerm,
        teamId,
        limit
      )
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Public()
  @Get('leagues/:leagueId/teams/:teamId')
  async getTeamRostersByLeagueId(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Param('leagueId', ParseIntPipe) leagueId: number
  ): Promise<RosterWithAthleteManyDTO[]> {
    try {
      return await this.rosterService.getTeamRostersByLeagueId(teamId, leagueId)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Post(':rosterId/connect')
  async connectRoster(
    @Param('rosterId', ParseIntPipe) rosterId: number,
    @Req() req: AuthenticatedRequest
  ): Promise<RosterWithAthleteDTO> {
    try {
      return await this.rosterService.connectRoster(req.user.id, rosterId)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Post('request')
  async requestCreateRoster(
    @Body() rosterDTO: RequestRosterDTO,
    @Req() req: AuthenticatedRequest
  ): Promise<string> {
    try {
      return await this.rosterService.requestCreateRoster(
        req.user.id,
        rosterDTO
      )
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Roles(Role.Manager)
  @Post(':rosterId/approve')
  async approveCreateRosterRequest(
    @Param('rosterId', ParseIntPipe) rosterId: number,
    @Req() req: AuthenticatedRequest
  ): Promise<string> {
    try {
      return await this.rosterService.approveCreateRosterRequest(
        rosterId,
        req.user.id
      )
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Roles(Role.Manager)
  @Post(':rosterId/reject')
  async rejectCreateRosterRequest(
    @Param('rosterId', ParseIntPipe) rosterId: number,
    @Req() req: AuthenticatedRequest
  ): Promise<string> {
    try {
      return await this.rosterService.rejectCreateRosterRequest(
        rosterId,
        req.user.id
      )
    } catch (error) {
      businessExceptionBinder(error)
    }
  }
}
