import { Module } from '@nestjs/common'
import { AdminAssociationController } from './admin-association.controller'
import { AssociationController } from './association.controller'
import { AssociationServiceImpl } from './service/association.service'
import { CreateAssociationServiceImpl } from './service/create-association.service'
import { DeleteAssociationServiceImpl } from './service/delete-association.service'
import { GetAssociationServiceImpl } from './service/get-association.service'
import { UpdateAssociationServiceImpl } from './service/update-association.service'

@Module({
  controllers: [AssociationController, AdminAssociationController],
  providers: [
    {
      provide: 'GetAssociationService',
      useClass: GetAssociationServiceImpl
    },
    {
      provide: 'CreateAssociationService',
      useClass: CreateAssociationServiceImpl
    },
    {
      provide: 'UpdateAssociationService',
      useClass: UpdateAssociationServiceImpl
    },
    {
      provide: 'DeleteAssociationService',
      useClass: DeleteAssociationServiceImpl
    },
    {
      provide: 'AssociationService',
      useClass: AssociationServiceImpl
    }
  ],
  exports: [
    {
      provide: 'AssociationService',
      useClass: AssociationServiceImpl
    }
  ]
})
export class AssociationModule {}
