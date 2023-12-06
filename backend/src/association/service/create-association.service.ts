import { Inject, Injectable } from '@nestjs/common'
import {
  BusinessException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import type { Association } from '@prisma/client'
import type { CreateAssociationDTO } from '../dto/create-association.dto'
import type { CreateAssociationService } from '../interface/create-association.service.interface'
import { GetAssociationService } from '../interface/get-association.service.interface'

@Injectable()
export class CreateAssociationServiceImpl
  implements CreateAssociationService<Association>
{
  constructor(
    private readonly prismaService: PrismaService,
    @Inject('GetAssociationService')
    private readonly getAssociationService: GetAssociationService<Association>
  ) {}

  async createAssociation(
    associationDTO: CreateAssociationDTO
  ): Promise<Association> {
    try {
      const { parentId } = associationDTO

      if (parentId) {
        await this.getAssociationService.getAssociation(parentId)
      }

      return await this.prismaService.association.create({
        data: {
          ...associationDTO
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
