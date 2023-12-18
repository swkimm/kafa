import { Inject, Injectable } from '@nestjs/common'
import {
  BusinessException,
  EntityNotExistException,
  ParameterValidationException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import type { Game } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import type { UpdateGameDTO } from '../dto/update-game.dto'
import { GetGameService } from '../interface/get-game.service.interface'
import type { UpdateGameService } from '../interface/update-game.service.interface'

@Injectable()
export class UpdateGameServiceImpl implements UpdateGameService<Game> {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject('GetGameService')
    private readonly getGameService: GetGameService<Game>
  ) {}

  async updateGame(gameId: number, gameDTO: UpdateGameDTO): Promise<Game> {
    try {
      await this.checkTeamId(gameId, gameDTO)

      return await this.prismaService.game.update({
        where: {
          id: gameId
        },
        data: { ...gameDTO }
      })
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new EntityNotExistException('teamId or leagueId')
      }
      throw new UnexpectedException(error, error.code)
    }
  }

  private async checkTeamId(
    gameId: number,
    gameDTO: UpdateGameDTO
  ): Promise<void> {
    const game = await this.getGameService.getGame(gameId)

    if (gameDTO.awayTeamId && gameDTO.homeTeamId) {
      if (gameDTO.homeTeamId === gameDTO.awayTeamId) {
        throw new ParameterValidationException(
          'homeTeamId and awayTeamId must not to be equal'
        )
      }
    }

    if (gameDTO.homeTeamId && !gameDTO.awayTeamId) {
      if (gameDTO.homeTeamId === game.awayTeamId) {
        throw new ParameterValidationException(
          'homeTeamId and awayTeamId must not to be equal'
        )
      }
    }

    if (!gameDTO.homeTeamId && gameDTO.awayTeamId) {
      if (gameDTO.awayTeamId === game.homeTeamId) {
        throw new ParameterValidationException(
          'homeTeamId and awayTeamId must not to be equal'
        )
      }
    }
  }
}
