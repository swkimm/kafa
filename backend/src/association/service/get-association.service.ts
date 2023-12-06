import { Injectable } from '@nestjs/common'
import {
  BusinessException,
  EntityNotExistException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { calculateOffset } from '@/common/pagination/calculate-offset'
import { PrismaService } from '@/prisma/prisma.service'
import { Prisma, type Association } from '@prisma/client'
import type { GetAssociationService } from '../interface/get-association.service.interface'

@Injectable()
export class GetAssociationServiceImpl
  implements GetAssociationService<Association>
{
  constructor(private readonly prismaService: PrismaService) {}

  async getAssociation(associationId: number): Promise<Association> {
    try {
      return await this.prismaService.association.findUniqueOrThrow({
        where: {
          id: associationId
        }
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new EntityNotExistException('associationId')
      }
      throw new UnexpectedException(error)
    }
  }

  async getAssociations(page: number, limit = 10): Promise<Association[]> {
    try {
      return await this.prismaService.association.findMany({
        take: limit,
        skip: calculateOffset(page, limit),
        orderBy: {
          name: 'asc'
        }
      })
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }
      throw new UnexpectedException(error)
    }
  }
}
