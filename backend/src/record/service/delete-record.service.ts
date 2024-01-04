import { Injectable } from '@nestjs/common'
import {
  EntityNotExistException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import { Prisma, type Record } from '@prisma/client'
import type { DeleteRecordService } from '../interface/delete-record.service.interface'

@Injectable()
export class DeleteRecordServiceImpl implements DeleteRecordService<Record> {
  constructor(private readonly prismaService: PrismaService) {}

  async deleteRecord(recordId: number): Promise<Record> {
    try {
      return await this.prismaService.record.delete({
        where: {
          id: recordId
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
