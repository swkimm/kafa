import { Inject, Injectable } from '@nestjs/common'
import type { Record } from '@prisma/client'
import { RecordService } from '../abstract/record.service'
import { CreateRecordService } from '../interface/create-record.service.interface'
import { DeleteRecordService } from '../interface/delete-record.service.interface'
import { GetRecordService } from '../interface/get-record.service.interface'
import { UpdateRecordService } from '../interface/update-record.service.interface'

@Injectable()
export class RecordServiceImpl extends RecordService<Record> {
  constructor(
    @Inject('GetRecordService') getRecordService: GetRecordService,
    @Inject('CreateRecordService')
    createRecordService: CreateRecordService<Record>,
    @Inject('UpdateRecordService')
    updateRecordService: UpdateRecordService<Record>,
    @Inject('DeleteRecordService')
    deleteRecordService: DeleteRecordService<Record>
  ) {
    super(
      getRecordService,
      createRecordService,
      updateRecordService,
      deleteRecordService
    )
  }
}
