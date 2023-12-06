import { Module } from '@nestjs/common'
import { AdminSponserController } from './admin-sponser.controller'
import { CreateSponserServiceImpl } from './service/create-sponser.service'
import { DeleteSponserServiceImpl } from './service/delete-sponser.service'
import { GetSponserServiceImpl } from './service/get-sponser.service'
import { SponserServiceImpl } from './service/sponser.service'
import { UpdateSponserServiceImpl } from './service/update-sponser.service'
import { SponserController } from './sponser.controller'

@Module({
  controllers: [SponserController, AdminSponserController],
  providers: [
    {
      provide: 'SponserService',
      useClass: SponserServiceImpl
    },
    {
      provide: 'UpdateSponserService',
      useClass: UpdateSponserServiceImpl
    },
    {
      provide: 'CreateSponserService',
      useClass: CreateSponserServiceImpl
    },
    {
      provide: 'DeleteSponserService',
      useClass: DeleteSponserServiceImpl
    },
    {
      provide: 'GetSponserService',
      useClass: GetSponserServiceImpl
    }
  ],
  exports: [
    {
      provide: 'SponserService',
      useClass: SponserServiceImpl
    }
  ]
})
export class SponserModule {}
