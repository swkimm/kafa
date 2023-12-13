import {
  Body,
  Controller,
  Delete,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put
} from '@nestjs/common'
import { Roles } from '@/common/decorator/roles.decorator'
import { businessExceptionBinder } from '@/common/exception/business-exception.binder'
import { Role, type League, type Sponser } from '@prisma/client'
import { LeagueService } from './abstract/league.service'
import { CreateLeagueDTO } from './dto/create-league.dto'
import { UpdateLeagueDTO } from './dto/update-league.dto'

@Roles(Role.Admin)
@Controller('admin/leagues')
export class AdminLeagueController {
  constructor(
    @Inject('LeagueService')
    private readonly leagueService: LeagueService<League, Sponser>
  ) {}

  @Post('')
  async createLeague(@Body() leagueDTO: CreateLeagueDTO): Promise<League> {
    try {
      return await this.leagueService.createLeague(leagueDTO)
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

  @Delete(':leagueId/sponsers/:sponserId/link')
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
