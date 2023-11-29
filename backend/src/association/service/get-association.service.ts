import { Injectable } from '@nestjs/common'
import {
  EntityNotExistException,
  UnexpectedException
} from '@/common/exception/business.exception'
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
}
