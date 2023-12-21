import {
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Query
} from '@nestjs/common'
import { Public } from '@/common/decorator/guard.decorator'
import { businessExceptionBinder } from '@/common/exception/business-exception.binder'
import type { League, Sponser } from '@prisma/client'
import { LeagueService } from './abstract/league.service'

@Controller('leagues')
export class LeagueController {
  constructor(
    @Inject('LeagueService')
    private readonly leagueService: LeagueService<League, Sponser>
  ) {}

  @Public()
  @Get('')
  async getLeagues(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number
  ): Promise<League[]> {
    try {
      return await this.leagueService.getLeagues(page, limit)
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
}
