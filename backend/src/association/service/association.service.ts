import { Inject, Injectable } from '@nestjs/common'
import type { Association } from '@prisma/client'
import { AssociationService } from '../abstract/association.service'
import { GetAssociationService } from '../interface/get-association.service.interface'

@Injectable()
export class AssociationServiceImpl extends AssociationService<Association> {
  constructor(
    @Inject('GetAssociationService')
    private readonly getAssociationService: GetAssociationService<Association>
  ) {
    super()
  }

  async getAssociation(associationId: number): Promise<Association> {
    return await this.getAssociationService.getAssociation(associationId)
  }
}
