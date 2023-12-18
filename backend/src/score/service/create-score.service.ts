import { Injectable } from '@nestjs/common'
import {
  ConflictFoundException,
  EntityNotExistException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import { Prisma, type Score } from '@prisma/client'
import type { CreateScoreDTO } from '../dto/create-score.dto'
import type { CreateScoreService } from '../interface/create-score.service.interface'

@Injectable()
export class CreateScoreServiceImpl implements CreateScoreService<Score> {
  constructor(private readonly prismaService: PrismaService) {}

  async createScore(gameId: number, scoreDTO: CreateScoreDTO): Promise<Score> {
    try {
      return await this.prismaService.score.create({
        data: {
          gameId,
          ...scoreDTO
        }
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new EntityNotExistException('gameId')
        }
        if (error.code === 'P2002') {
          throw new ConflictFoundException('gameId')
        }
      }
      throw new UnexpectedException(error, error.stack)
    }
  }
}
