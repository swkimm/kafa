import { Injectable } from '@nestjs/common'
import {
  EntityNotExistException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import { Prisma, type Sponser } from '@prisma/client'
import type { UpdateSponserDTO } from '../dto/update-sponser.dto'
import type { UpdateSponserService } from '../interface/update-sponser.service.interface'

@Injectable()
export class UpdateSponserServiceImpl implements UpdateSponserService<Sponser> {
  constructor(private readonly prismaService: PrismaService) {}

  async updateSponser(sponserId: number, sponserDTO: UpdateSponserDTO) {
    try {
      return await this.prismaService.sponser.update({
        where: {
          id: sponserId
        },
        data: {
          ...sponserDTO
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
