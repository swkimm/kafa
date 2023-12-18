import { Injectable } from '@nestjs/common'
import {
  BusinessException,
  EntityNotExistException,
  ParameterValidationException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import { Prisma, type Game } from '@prisma/client'
import type { CreateGameDTO } from '../dto/create-game.dto'
import type { CreateGameService } from '../interface/create-game.service.interface'

@Injectable()
export class CreateGameServiceImpl implements CreateGameService<Game> {
  constructor(private readonly prismaService: PrismaService) {}

  async createGame(gameDTO: CreateGameDTO): Promise<Game> {
    try {
      this.checkTeamId(gameDTO.homeTeamId, gameDTO.awayTeamId)
      return await this.prismaService.game.create({
        data: {
          ...gameDTO
        }
      })
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new EntityNotExistException('team or league')
      }
      throw new UnexpectedException(error, error.stack)
    }
  }

  private checkTeamId(homeTeamId: number, awayTeamId: number): void {
    if (homeTeamId === awayTeamId) {
      throw new ParameterValidationException(
        'homeTeamId and awayTeamId must not to be equal'
      )
    }
  }
}
