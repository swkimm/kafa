import { Injectable } from '@nestjs/common'
import {
  EntityNotExistException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import { Prisma, type Game } from '@prisma/client'
import type { DeleteGameService } from '../interface/delete-game.service.interface'

@Injectable()
export class DeleteGameServiceImpl implements DeleteGameService<Game> {
  constructor(private readonly prismaService: PrismaService) {}

  async deleteGame(gameId: number): Promise<Game> {
    try {
      return await this.prismaService.game.delete({
        where: {
          id: gameId
        }
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new EntityNotExistException('gameId')
      }
      throw new UnexpectedException(error, error.stack)
    }
  }
}
