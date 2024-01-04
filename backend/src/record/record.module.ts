import { Module } from '@nestjs/common'
import { GameModule } from '@/game/game.module'
import { RosterModule } from '@/roster/roster.module'
import { RecordAdminController } from './record-admin.controller'
import { RecordController } from './record.controller'
import { CreateRecordServiceImpl } from './service/create-record.service'
import { DeleteRecordServiceImpl } from './service/delete-record.service'
import { GetRecordServiceImpl } from './service/get-record.service'
import { RecordServiceImpl } from './service/record.service'
import { UpdateRecordServiceImpl } from './service/update-record.service'

@Module({
  imports: [GameModule, RosterModule],
  controllers: [RecordController, RecordAdminController],
  providers: [
    {
      provide: 'GetRecordService',
      useClass: GetRecordServiceImpl
    },
    {
      provide: 'CreateRecordService',
      useClass: CreateRecordServiceImpl
    },
    {
      provide: 'UpdateRecordService',
      useClass: UpdateRecordServiceImpl
    },
    {
      provide: 'DeleteRecordService',
      useClass: DeleteRecordServiceImpl
    },
    {
      provide: 'RecordService',
      useClass: RecordServiceImpl
    }
  ]
})
export class RecordModule {}
