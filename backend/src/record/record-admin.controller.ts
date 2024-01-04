import {
  Body,
  Controller,
  Delete,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put
} from '@nestjs/common'
import { Roles } from '@/common/decorator/roles.decorator'
import { businessExceptionBinder } from '@/common/exception/business-exception.binder'
import { Role, type Record } from '@prisma/client'
import { RecordService } from './abstract/record.service'
import { CreateRecordDTO } from './dto/create-record.dto'
import { UpdateRecordDTO } from './dto/update-record.dto'

@Roles(Role.Admin)
@Controller('admin/records')
export class RecordAdminController {
  constructor(
    @Inject('RecordService')
    private readonly recordService: RecordService<Record>
  ) {}

  @Post('rosters/:rosterId/games/:gameId')
  async createRecord(
    @Param('rosterId', ParseIntPipe) rosterId: number,
    @Param('gameId', ParseIntPipe) gameId: number,
    @Body() recordDTO: CreateRecordDTO
  ): Promise<Record> {
    try {
      return await this.recordService.createRecord(rosterId, gameId, recordDTO)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Put(':recordId')
  async updateRecord(
    @Param('recordId', ParseIntPipe) recordId: number,
    @Body() recordDTO: UpdateRecordDTO
  ): Promise<Record> {
    try {
      return await this.recordService.updateRecord(recordId, recordDTO)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Delete(':recordId')
  async deleteRecord(
    @Param('recordId', ParseIntPipe) recordId: number
  ): Promise<Record> {
    try {
      return await this.recordService.deleteRecord(recordId)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }
}
