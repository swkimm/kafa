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
import { ScoreService } from '@/score/abstract/score.service'
import { CreateScoreDTO } from '@/score/dto/create-score.dto'
import { UpdateScoreDTO } from '@/score/dto/update-score.dto'
import { Role, type Game, type Score } from '@prisma/client'
import { GameService } from './abstract/game.service'
import { CreateGameDTO } from './dto/create-game.dto'
import { UpdateGameDTO } from './dto/update-game.dto'

@Roles(Role.Admin)
@Controller('admin/games')
export class AdminGameController {
  constructor(
    @Inject('GameService') private readonly gameService: GameService<Game>,
    @Inject('ScoreService') private readonly scoreService: ScoreService<Score>
  ) {}

  @Post('')
  async createGame(@Body() gameDTO: CreateGameDTO): Promise<Game> {
    try {
      return await this.gameService.createGame(gameDTO)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Post(':gameId/score')
  async createScore(
    @Param('gameId', ParseIntPipe) gameId: number,
    @Body() scoreDTO: CreateScoreDTO
  ): Promise<Score> {
    try {
      return await this.scoreService.createScore(gameId, scoreDTO)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Put(':gameId')
  async updateGame(
    @Param('gameId', ParseIntPipe) gameId: number,
    @Body() gameDTO: UpdateGameDTO
  ): Promise<Game> {
    try {
      return await this.gameService.updateGame(gameId, gameDTO)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Put(':gameId/score')
  async updateScore(
    @Param('gameId', ParseIntPipe) gameId: number,
    @Body() scoreDTO: UpdateScoreDTO
  ): Promise<Score> {
    try {
      return await this.scoreService.updateScore(gameId, scoreDTO)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Delete(':gameId')
  async deleteGame(
    @Param('gameId', ParseIntPipe) gameId: number
  ): Promise<Game> {
    try {
      return await this.gameService.deleteGame(gameId)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }
}
