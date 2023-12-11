import { Injectable } from '@nestjs/common'
import {
  EntityNotExistException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import { Prisma, type League } from '@prisma/client'
import type { DeleteLeagueService } from '../interface/delete-league.service.interface'

/**
 * 리그 삭제와 관련된 서비스 인터페이스 [DeleteLeagueService] 구현체
 */
@Injectable()
export class DeleteLeagueServiceImpl implements DeleteLeagueService<League> {
  constructor(private readonly prismaService: PrismaService) {}

  async deleteLeague(leagueId: number): Promise<League> {
    try {
      return await this.prismaService.league.delete({
        where: {
          id: leagueId
        }
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new EntityNotExistException('leagueId')
      }
      throw new UnexpectedException(error, error.stack)
    }
  }
}
