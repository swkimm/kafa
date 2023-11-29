import { Module } from '@nestjs/common'
import { AssociationServiceImpl } from './service/association.service'
import { GetAssociationServiceImpl } from './service/get-association.service'

@Module({
  providers: [
    {
      provide: 'GetAssociationService',
      useClass: GetAssociationServiceImpl
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
