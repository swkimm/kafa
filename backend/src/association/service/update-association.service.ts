import { Inject, Injectable } from '@nestjs/common'
import {
  BusinessException,
  EntityNotExistException,
  ParameterValidationException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import { Prisma, type Association } from '@prisma/client'
import type { UpdateAssociationDTO } from '../dto/update-association.dto'
import { GetAssociationService } from '../interface/get-association.service.interface'
import type { UpdateAssociationService } from '../interface/update-association.service.interface'

@Injectable()
export class UpdateAssociationServiceImpl
  implements UpdateAssociationService<Association>
{
  constructor(
    private readonly prismaService: PrismaService,
    @Inject('GetAssociationService')
    private readonly getAssociationService: GetAssociationService<Association>
  ) {}

  async updateAssociation(
    associationId: number,
    associationDTO: UpdateAssociationDTO
  ): Promise<Association> {
    try {
      const { parentId } = associationDTO

      if (parentId) {
        await this.checkParentAssociation(associationId, parentId)
      }

      return await this.prismaService.association.update({
        where: {
          id: associationId
        },
        data: {
          ...associationDTO
        }
      })
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new EntityNotExistException('parentId')
      }
      throw new UnexpectedException(error)
    }
  }

  private async checkParentAssociation(
    associationId: number,
    parentId: number
  ): Promise<void> {
    try {
      if (associationId === parentId) {
        throw new ParameterValidationException('parentId')
      }

      await this.getAssociationService.getAssociation(parentId)
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }
      throw new UnexpectedException(error)
    }
  }
}
