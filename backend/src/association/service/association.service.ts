import { Inject, Injectable } from '@nestjs/common'
import type { Association } from '@prisma/client'
import { AssociationService } from '../abstract/association.service'
import type { CreateAssociationDTO } from '../dto/create-association.dto'
import type { UpdateAssociationDTO } from '../dto/update-association.dto'
import { CreateAssociationService } from '../interface/create-association.service.interface'
import { DeleteAssociationService } from '../interface/delete-association.service.interface'
import { GetAssociationService } from '../interface/get-association.service.interface'
import { UpdateAssociationService } from '../interface/update-association.service.interface'

@Injectable()
export class AssociationServiceImpl extends AssociationService<Association> {
  constructor(
    @Inject('GetAssociationService')
    private readonly getAssociationService: GetAssociationService<Association>,
    @Inject('DeleteAssociationService')
    private readonly deleteAssociationService: DeleteAssociationService<Association>,
    @Inject('UpdateAssociationService')
    private readonly updateAssociationService: UpdateAssociationService<Association>,
    @Inject('CreateAssociationService')
    private readonly createAssociationService: CreateAssociationService<Association>
  ) {
    super()
  }

  async getAssociation(associationId: number): Promise<Association> {
    return await this.getAssociationService.getAssociation(associationId)
  }

  async getAssociations(page: number, limit = 10): Promise<Association[]> {
    return await this.getAssociationService.getAssociations(page, limit)
  }

  async createAssociation(
    associationDTO: CreateAssociationDTO
  ): Promise<Association> {
    return await this.createAssociationService.createAssociation(associationDTO)
  }

  async updateAssociation(
    associationId: number,
    associationDTO: UpdateAssociationDTO
  ): Promise<Association> {
    return await this.updateAssociationService.updateAssociation(
      associationId,
      associationDTO
    )
  }

  async deleteAssociation(associationId: number): Promise<Association> {
    return await this.deleteAssociationService.deleteAssociation(associationId)
  }
}
