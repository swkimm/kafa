import { Controller, Get, Inject, Param, ParseIntPipe } from '@nestjs/common'
import { Public } from '@/common/decorator/guard.decorator'
import { businessExceptionBinder } from '@/common/exception/business-exception.binder'
import type { Record } from '@prisma/client'
import { RecordService } from './abstract/record.service'
import type { RecordDTO } from './dto/record.dto'

@Public()
@Controller('records')
export class RecordController {
  constructor(
    @Inject('RecordService')
    private readonly recordService: RecordService<Record>
  ) {}

  @Get('games/:gameId')
  async getGameRecords(
    @Param('gameId', ParseIntPipe) gameId: number
  ): Promise<RecordDTO[]> {
    try {
      return await this.recordService.getGameRecords(gameId)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Get('leagues/:leagueId')
  async getLeagueRecords(
    @Param('leagueId', ParseIntPipe) leagueId: number
  ): Promise<RecordDTO[]> {
    try {
      return await this.recordService.getLeagueRecords(leagueId)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Get('rosters/:rosterId')
  async getPersonalRecords(
    @Param('rosterId', ParseIntPipe) rosterId: number
  ): Promise<RecordDTO[]> {
    try {
      return await this.recordService.getPersonalRecords(rosterId)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }
}
