import { Injectable } from '@nestjs/common'
import {
  BusinessException,
  EntityNotExistException,
  ParameterValidationException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import { Prisma, type Score } from '@prisma/client'
import type { UpdateScoreDTO } from '../dto/update-score.dto'
import type { UpdateScoreService } from '../interface/update-score.service.interface'

@Injectable()
export class UpdateScoreServiceImpl implements UpdateScoreService<Score> {
  constructor(private readonly prismaService: PrismaService) {}

  async updateScore(gameId: number, scoreDTO: UpdateScoreDTO): Promise<Score> {
    try {
      this.checkQuarterScore(scoreDTO)

      return await this.prismaService.score.update({
        where: {
          gameId
        },
        data: this.makeUpdateDTO(scoreDTO)
      })
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new EntityNotExistException('gameId')
      }
      throw new UnexpectedException(error, error.stack)
    }
  }

  private checkQuarterScore(scoreDTO: UpdateScoreDTO): void {
    if (
      scoreDTO.homeTeamQuarterScores.length !==
      scoreDTO.awayTeamQuarterScores.length
    ) {
      throw new ParameterValidationException('quater score length mismatch')
    }

    if (
      scoreDTO.homeTeamQuarterScores.length > 4 &&
      scoreDTO.awayTeamQuarterScores.length > 4
    ) {
      if (scoreDTO.overtime !== true) {
        throw new ParameterValidationException(
          'quarter score length is over 4 but overtime is false'
        )
      }
    }

    if (
      scoreDTO.homeTeamQuarterScores.length === 4 &&
      scoreDTO.awayTeamQuarterScores.length === 4
    ) {
      if (scoreDTO.overtime !== false) {
        throw new ParameterValidationException(
          'quarter score length is 4 but overtime is true'
        )
      }
    }
  }

  private makeUpdateDTO(scoreDTO: UpdateScoreDTO): UpdateScoreDTOWithTeamScore {
    const dto: UpdateScoreDTOWithTeamScore = {
      ...scoreDTO
    }

    if (scoreDTO.homeTeamQuarterScores) {
      dto.homeTeamScore = this.calculateScore(scoreDTO.homeTeamQuarterScores)
    }

    if (scoreDTO.awayTeamQuarterScores) {
      dto.awayTeamScore = this.calculateScore(scoreDTO.awayTeamQuarterScores)
    }

    return dto
  }

  private calculateScore(scoreArray: number[]): number {
    return scoreArray.reduce((prev, cur) => prev + cur, 0)
  }
}

interface UpdateScoreDTOWithTeamScore extends UpdateScoreDTO {
  homeTeamScore?: number
  awayTeamScore?: number
}
