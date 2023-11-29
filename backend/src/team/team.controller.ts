import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Inject,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UnauthorizedException
} from '@nestjs/common'
import { AuthenticatedRequest } from '@/common/class/authenticated-request.interface'
import { Public } from '@/common/decorator/guard.decorator'
import {
  ConflictFoundException,
  EntityNotExistException,
  UnverifiedException
} from '@/common/exception/business.exception'
import type { RegisterTeamRequest, Team } from '@prisma/client'
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

  @Public()
  @Get(':id')
  async getTeam(@Param('id', ParseIntPipe) id: number): Promise<Team> {
    try {
      return await this.teamService.getTeam(id)
    } catch (error) {
      if (error instanceof EntityNotExistException) {
        throw new NotFoundException(error.message)
      }
      throw new InternalServerErrorException(error.message)
    }
  }

  @Public()
  @Get()
  async getTeams(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit?: number,
    @Query('option') option?: string
  ): Promise<TeamManyDTO[]> {
    return await this.teamService.getTeams(page, limit, option)
  }

  @Public()
  @Get('leagues/:leagueId')
  async getTeamsByLeagueId(
    @Param('leagueId', ParseIntPipe) leagueId: number
  ): Promise<Team[]> {
    try {
      return await this.teamService.getLeagueTeams(leagueId)
    } catch (error) {
      if (error instanceof EntityNotExistException) {
        throw new NotFoundException(error.message)
      }
      throw new InternalServerErrorException(error.message)
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
      throw new InternalServerErrorException(error.message)
    }
  }

  @Get('requests')
  async getAccountRegisterTeamRequests(
    @Req() req: AuthenticatedRequest
  ): Promise<RegisterTeamRequest[]> {
    try {
      return await this.teamService.getAccountRegisterTeamRequests(req.user.id)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
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
      if (error instanceof EntityNotExistException) {
        throw new NotFoundException(error.message)
      }
      if (error instanceof ConflictFoundException) {
        throw new ConflictException(error.message)
      }
      if (error instanceof UnverifiedException) {
        throw new UnauthorizedException(error.message)
      }
      throw new InternalServerErrorException(error.message)
    }
  }

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
      if (error instanceof EntityNotExistException) {
        throw new NotFoundException(error.message)
      }
      throw new InternalServerErrorException(error.message)
    }
  }

  @Delete(':id')
  async deleteTeam(
    @Param('id', ParseIntPipe) id: number
  ): Promise<{ result: string }> {
    try {
      return await this.teamService.deleteTeam(id)
    } catch (error) {
      if (error instanceof EntityNotExistException) {
        throw new NotFoundException(error.message)
      }
      throw new InternalServerErrorException(error.message)
    }
  }
}
