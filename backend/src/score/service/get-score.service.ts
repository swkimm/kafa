import { Injectable } from '@nestjs/common'
import {
  EntityNotExistException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import { Prisma, type Score } from '@prisma/client'
import type { GetScoreService } from '../interface/get-scores.service.interface'

@Injectable()
export class GetScoreServiceImpl implements GetScoreService<Score> {
  constructor(private readonly prismaService: PrismaService) {}

  async getScore(gameId: number): Promise<Score> {
    try {
      return await this.prismaService.score.findUniqueOrThrow({
        where: {
          gameId
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
