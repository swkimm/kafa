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
import { Public } from '@/common/decorator/guard.decorator'
import { businessExceptionBinder } from '@/common/exception/business-exception.binder'
import type { Sponser } from '@prisma/client'
import { SponserService } from './abstract/sponser.service'
import { CreateSponserDTO } from './dto/create-sponser.dto'
import { UpdateSponserDTO } from './dto/update-sponser.dto'

@Public()
@Controller('admin/sponsers')
export class AdminSponserController {
  constructor(
    @Inject('SponserService')
    private readonly sponserSerivce: SponserService<Sponser>
  ) {}

  @Post()
  async createSponser(@Body() sponserDTO: CreateSponserDTO): Promise<Sponser> {
    try {
      return await this.sponserSerivce.createSponser(sponserDTO)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Put(':sponserId')
  async updateSponser(
    @Param('sponserId', ParseIntPipe) sponserId: number,
    @Body() updateSponserDTO: UpdateSponserDTO
  ): Promise<Sponser> {
    try {
      return await this.sponserSerivce.updateSponser(
        sponserId,
        updateSponserDTO
      )
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Delete(':sponserId')
  async DeleteSponser(
    @Param('sponserId', ParseIntPipe) sponserId: number
  ): Promise<Sponser> {
    try {
      return await this.sponserSerivce.deleteSponser(sponserId)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }
}
