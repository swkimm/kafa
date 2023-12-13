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
import type { Association } from '@prisma/client'
import { AssociationService } from './abstract/association.service'

@Controller('associations')
export class AssociationController {
  constructor(
    @Inject('AssociationService')
    private readonly associationService: AssociationService<Association>
  ) {}

  @Public()
  @Get(':id')
  async getAssociation(
    @Param('id', ParseIntPipe) associationId: number
  ): Promise<Association> {
    try {
      return await this.associationService.getAssociation(associationId)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Public()
  @Get()
  async getAssociations(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number
  ): Promise<Association[]> {
    try {
      return await this.associationService.getAssociations(page, limit)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }
}
