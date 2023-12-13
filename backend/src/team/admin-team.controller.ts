import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Put,
  Query
} from '@nestjs/common'
import { Roles } from '@/common/decorator/roles.decorator'
import { businessExceptionBinder } from '@/common/exception/business-exception.binder'
import { type RegisterTeamRequest, Role, type Team } from '@prisma/client'
import { TeamService } from './abstract/team.service'

@Roles(Role.Admin)
@Controller('admin/teams')
export class AdminTeamController {
  constructor(
    @Inject('TeamService')
    private readonly teamService: TeamService<
      Team,
      { result: string },
      RegisterTeamRequest
    >
  ) {}

  @Get('requests')
  async getRegisterTeamRequests(
    @Query('limit', ParseIntPipe) limit?: number,
    @Query('cursor', ParseIntPipe) cursor?: number,
    @Query('option') option?: 'Approved' | 'Rejected' | 'Received' | 'All'
  ): Promise<RegisterTeamRequest[]> {
    try {
      return await this.teamService.getRegisterTeamRequests(
        limit,
        cursor,
        option
      )
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Put('requests/:requestId/approve')
  async approveRegisterTeamRequest(
    @Param('requestId', ParseIntPipe) requestId: number
  ): Promise<Team> {
    try {
      return await this.teamService.approveRegisterTeamRequest(requestId)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Put('requests/:requestId/reject')
  async rejectReigsterTeamRequest(
    @Param('requestId', ParseIntPipe) requestId: number,
    @Body('reason') reason: string
  ): Promise<RegisterTeamRequest> {
    try {
      return await this.teamService.rejectRegisterTeamRequest(requestId, reason)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Delete(':id')
  async deleteTeam(
    @Param('id', ParseIntPipe) id: number
  ): Promise<{ result: string }> {
    try {
      return await this.teamService.deleteTeam(id)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }
}
