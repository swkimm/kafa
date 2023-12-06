import {
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Query
} from '@nestjs/common'
import { Public } from '@/common/decorator/guard.decorator'
import { businessExceptionBinder } from '@/common/exception/business-exception.binder'
import type { Sponser } from '@prisma/client'
import { SponserService } from './abstract/sponser.service'

@Controller('sponsers')
export class SponserController {
  constructor(
    @Inject('SponserService')
    private readonly sponserService: SponserService<Sponser>
  ) {}

  @Public()
  @Get()
  async getSponsers(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number
  ): Promise<Sponser[]> {
    try {
      return await this.sponserService.getSponsers(page, limit)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Public()
  @Get(':sponserId')
  async getSponser(
    @Param('sponserId', ParseIntPipe) sponserId: number
  ): Promise<Sponser> {
    try {
      return await this.sponserService.getSponser(sponserId)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }
}
