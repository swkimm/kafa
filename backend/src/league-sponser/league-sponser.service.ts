import { Injectable } from '@nestjs/common'
import {
  ConflictFoundException,
  EntityNotExistException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { calculateOffset } from '@/common/pagination/calculate-offset'
import { PrismaService } from '@/prisma/prisma.service'
import { Prisma, type LeagueSponser } from '@prisma/client'
import type { CreateLeagueSponserDTO } from './dto/create-league-sponser.dto'
import type { UpdateLeagueSponserDTO } from './dto/update-league-sponser.dto'
import type { LeagueSponserService } from './league-sponser.service.interface'

/**
 * 리그와 스폰서를 중계하는 서브 모듈 인터페이스 [LeagueSponserService] 구현체
 */
@Injectable()
export class LeagueSponserServiceImpl
  implements LeagueSponserService<LeagueSponser>
{
  constructor(private readonly prismaService: PrismaService) {}

  async getLeagueSponser(
    leagueId: number,
    sponserId: number
  ): Promise<LeagueSponser> {
    try {
      return await this.prismaService.leagueSponser.findUniqueOrThrow({
        where: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          leagueId_sponserId: {
            leagueId,
            sponserId
          }
        }
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new EntityNotExistException('leagueId and sponserId')
      }
      throw new UnexpectedException(error, error.stack)
    }
  }

  async getLeagueSponsersBySponserId(
    sponserId: number,
    page: number,
    limit = 10
  ): Promise<LeagueSponser[]> {
    try {
      return await this.prismaService.leagueSponser.findMany({
        skip: calculateOffset(page, limit),
        take: limit,
        where: {
          sponserId
        }
      })
    } catch (error) {
      throw new UnexpectedException(error, error.stack)
    }
  }

  async getLeagueSponsersByLeagueId(
    leagueId: number,
    page: number,
    limit = 10
  ): Promise<LeagueSponser[]> {
    try {
      return await this.prismaService.leagueSponser.findMany({
        skip: calculateOffset(page, limit),
        take: limit,
        where: {
          leagueId
        }
      })
    } catch (error) {
      throw new UnexpectedException(error, error.stack)
    }
  }

  async createLeagueSponser(
    leagueSponserDTO: CreateLeagueSponserDTO
  ): Promise<LeagueSponser> {
    try {
      return await this.prismaService.leagueSponser.create({
        data: {
          ...leagueSponserDTO
        }
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new EntityNotExistException('leagueId or sponserId')
        }
        if (error.code === 'P2002') {
          throw new ConflictFoundException('leagueId and sponserId')
        }
      }
      throw new UnexpectedException(error, error.stack)
    }
  }

  async updateLeagueSponser(
    leagueId: number,
    sponserId: number,
    leagueSponserDTO: UpdateLeagueSponserDTO
  ): Promise<LeagueSponser> {
    try {
      return await this.prismaService.leagueSponser.update({
        where: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          leagueId_sponserId: {
            leagueId,
            sponserId
          }
        },
        data: {
          ...leagueSponserDTO
        }
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003' || error.code === 'P2025') {
          throw new EntityNotExistException('leagueId or sponserId')
        }
        if (error.code === 'P2002') {
          throw new ConflictFoundException('leagueId and sponserId')
        }
      }
      throw new UnexpectedException(error, error.stack)
    }
  }

  async deleteLeagueSponser(
    leagueId: number,
    sponserId: number
  ): Promise<LeagueSponser> {
    try {
      return await this.prismaService.leagueSponser.delete({
        where: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          leagueId_sponserId: {
            leagueId,
            sponserId
          }
        }
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new EntityNotExistException('leagueId and sponserId')
      }
      throw new UnexpectedException(error, error.stack)
    }
  }
}
