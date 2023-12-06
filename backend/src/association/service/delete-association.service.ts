import { Injectable } from '@nestjs/common'
import {
  EntityNotExistException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import { type Association, Prisma } from '@prisma/client'
import type { DeleteAssociationService } from '../interface/delete-association.service.interface'

@Injectable()
export class DeleteAssociationServiceImpl
  implements DeleteAssociationService<Association>
{
  constructor(private readonly prismaService: PrismaService) {}

  async deleteAssociation(associationId: number): Promise<Association> {
    try {
      return await this.prismaService.association.delete({
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
