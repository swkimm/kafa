import { Injectable } from '@nestjs/common'
import {
  EntityNotExistException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { calculateOffset } from '@/common/pagination/calculate-offset'
import { PrismaService } from '@/prisma/prisma.service'
import { Prisma, type Sponser } from '@prisma/client'
import type { GetSponserService } from '../interface/get-sponser.service.interface'

/**
 * 스폰서 조회와 관련된 서비스 인터페이스 [GetSponserService] 구현체
 */
@Injectable()
export class GetSponserServiceImpl implements GetSponserService<Sponser> {
  constructor(private readonly prismaSerivce: PrismaService) {}

  async getSponser(sponserId: number): Promise<Sponser> {
    try {
      return await this.prismaSerivce.sponser.findUniqueOrThrow({
        where: {
          id: sponserId
        }
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new EntityNotExistException('sponserId')
      }
      throw new UnexpectedException(error, error.stack)
    }
  }

  async getSponsers(page: number, limit = 10): Promise<Sponser[]> {
    try {
      return await this.prismaSerivce.sponser.findMany({
        take: limit,
        skip: calculateOffset(page, limit),
        orderBy: {
          name: 'asc'
        }
      })
    } catch (error) {
      throw new UnexpectedException(error, error.stack)
    }
  }
}
