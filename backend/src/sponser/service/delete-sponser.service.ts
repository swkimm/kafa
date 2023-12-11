import { Injectable } from '@nestjs/common'
import {
  EntityNotExistException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import { Prisma, type Sponser } from '@prisma/client'
import type { DeleteSponserService } from '../interface/delete-sponser.service.interface'

/**
 * 스폰서 삭제와 관련된 서비스 인터페이스 [DeleteSponserService] 구현체
 */
@Injectable()
export class DeleteSponserServiceImpl implements DeleteSponserService<Sponser> {
  constructor(private readonly prismaService: PrismaService) {}

  async deleteSponser(sponserId: number): Promise<Sponser> {
    try {
      return await this.prismaService.sponser.delete({
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
}
