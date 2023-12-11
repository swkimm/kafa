import { Inject, Injectable } from '@nestjs/common'
import type { Association } from '@prisma/client'
import { AssociationService } from '../abstract/association.service'
import { CreateAssociationService } from '../interface/create-association.service.interface'
import { DeleteAssociationService } from '../interface/delete-association.service.interface'
import { GetAssociationService } from '../interface/get-association.service.interface'
import { UpdateAssociationService } from '../interface/update-association.service.interface'

/**
 * 협회 관련 비즈니스 로직을 모아주는 추상 클래스 [AssociationService] 구현체
 */
@Injectable()
export class AssociationServiceImpl extends AssociationService<Association> {
  constructor(
    @Inject('GetAssociationService')
    getAssociationService: GetAssociationService<Association>,
    @Inject('DeleteAssociationService')
    deleteAssociationService: DeleteAssociationService<Association>,
    @Inject('UpdateAssociationService')
    updateAssociationService: UpdateAssociationService<Association>,
    @Inject('CreateAssociationService')
    createAssociationService: CreateAssociationService<Association>
  ) {
    super(
      getAssociationService,
      createAssociationService,
      deleteAssociationService,
      updateAssociationService
    )
  }
}
