import { Injectable } from '@nestjs/common'
import {
  EntityNotExistException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import { Prisma, type Record } from '@prisma/client'
import type { UpdateRecordDTO } from '../dto/update-record.dto'
import type { UpdateRecordService } from '../interface/update-record.service.interface'

@Injectable()
export class UpdateRecordServiceImpl implements UpdateRecordService<Record> {
  constructor(private readonly prismaService: PrismaService) {}

  async updateRecord(
    recordId: number,
    recordDTO: UpdateRecordDTO
  ): Promise<Record> {
    try {
      return await this.prismaService.record.update({
        where: {
          id: recordId
        },
        data: {
          ...recordDTO
        }
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new EntityNotExistException('기록이 존재하지 않습니다')
      }
      throw new UnexpectedException(error, error.stack)
    }
  }
}
