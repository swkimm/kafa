import { Controller, Get, Query } from '@nestjs/common'
import { Public } from '@/common/decorator/guard.decorator'
import { businessExceptionBinder } from '@/common/exception/business-exception.binder'
import { CalendarService } from './calendar.service'
import type { CalendarDTO, CalendarGameItem } from './dto/calendar.dto'
import { GameQueryDTO } from './dto/game-query.dto'

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Public()
  @Get('/games')
  async getCalendarGamesByDateRange(
    @Query() query: GameQueryDTO
  ): Promise<CalendarDTO<CalendarGameItem>[]> {
    try {
      return await this.calendarService.getCalendarGamesByDateRange(
        query.start,
        query.end
      )
    } catch (error) {
      businessExceptionBinder(error)
    }
  }
}
