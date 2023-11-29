import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Put,
  Query
} from '@nestjs/common'
import { Roles } from '@/common/decorator/roles.decorator'
import {
  ConflictFoundException,
  EntityNotExistException,
  ParameterValidationException
} from '@/common/exception/business.exception'
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
      if (error instanceof ParameterValidationException) {
        throw new BadRequestException(error.message)
      }
      throw new InternalServerErrorException(error.message)
    }
  }

  @Put('requests/:requestId/approve')
  async approveRegisterTeamRequest(
    @Param('requestId', ParseIntPipe) requestId: number
  ): Promise<Team> {
    try {
      return await this.teamService.approveRegisterTeamRequest(requestId)
    } catch (error) {
      if (error instanceof EntityNotExistException) {
        throw new NotFoundException(error.message)
      }
      if (error instanceof ConflictFoundException) {
        throw new ConflictException(error.message)
      }
      throw new InternalServerErrorException(error.message)
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
      if (error instanceof EntityNotExistException) {
        throw new NotFoundException(error.message)
      }
      throw new InternalServerErrorException(error.message)
    }
  }
}
