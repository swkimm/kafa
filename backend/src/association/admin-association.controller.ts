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
import { type Association, Role } from '@prisma/client'
import { AssociationService } from './abstract/association.service'
import { CreateAssociationDTO } from './dto/create-association.dto'
import { UpdateAssociationDTO } from './dto/update-association.dto'

@Roles(Role.Admin)
@Controller('admin/associations')
export class AdminAssociationController {
  constructor(
    @Inject('AssociationService')
    private readonly associationService: AssociationService<Association>
  ) {}

  @Post()
  async createAssociation(
    @Body() associationDTO: CreateAssociationDTO
  ): Promise<Association> {
    try {
      return await this.associationService.createAssociation(associationDTO)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Put(':id')
  async updateAssociation(
    @Param('id', ParseIntPipe) associationId: number,
    @Body() associationDTO: UpdateAssociationDTO
  ): Promise<Association> {
    try {
      return await this.associationService.updateAssociation(
        associationId,
        associationDTO
      )
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Delete(':id')
  async deleteAssociation(
    @Param('id', ParseIntPipe) associationId: number
  ): Promise<Association> {
    try {
      return await this.associationService.deleteAssociation(associationId)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }
}
