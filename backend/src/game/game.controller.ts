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
import { ScoreService } from '@/score/abstract/score.service'
import type { Game, Score } from '@prisma/client'
import { GameService } from './abstract/game.service'
import type { GameWithLeagueDTO } from './dto/game-with-league.dto'

@Public()
@Controller('games')
export class GameController {
  constructor(
    @Inject('GameService') private readonly gameService: GameService<Game>,
    @Inject('ScoreService') private readonly scoreService: ScoreService<Score>
  ) {}

  @Get('')
  async getGames(
    @Query('cursor', new ParseIntPipe({ optional: true })) cursor?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number
  ): Promise<Game[]> {
    try {
      return await this.gameService.getGames(cursor, limit)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Get('currently-ended')
  async getCurrentlyEndedGames(): Promise<GameWithLeagueDTO[]> {
    try {
      return await this.gameService.getCurrentlyEndedGames()
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Get('upcomming')
  async getUpcommingGames(): Promise<GameWithLeagueDTO[]> {
    try {
      return await this.gameService.getUpcommingGames()
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Get('teams/:teamId')
  async getGamesByTeamId(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number
  ): Promise<GameWithLeagueDTO[]> {
    try {
      return await this.gameService.getGamesByTeamId(teamId, page, limit)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Get(':gameId')
  async getGame(@Param('gameId', ParseIntPipe) gameId: number): Promise<Game> {
    try {
      return await this.gameService.getGame(gameId)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Get('leagues/:leagueId')
  async getGamesByLeagueId(
    @Param('leagueId', ParseIntPipe) leagueId: number,
    @Query('cursor', new ParseIntPipe({ optional: true })) cursor?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number
  ): Promise<Game[]> {
    try {
      return await this.gameService.getGamesByLeagueId(leagueId, cursor, limit)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Get(':gameId/score')
  async getScore(
    @Param('gameId', ParseIntPipe) gameId: number
  ): Promise<Score> {
    try {
      return await this.scoreService.getScore(gameId)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }
}
