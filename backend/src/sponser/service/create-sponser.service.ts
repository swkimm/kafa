import { Injectable } from '@nestjs/common'
import { UnexpectedException } from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import type { Sponser } from '@prisma/client'
import type { CreateSponserDTO } from '../dto/create-sponser.dto'
import type { CreateSponserService } from '../interface/create-sponser.service.interface'

@Injectable()
export class CreateSponserServiceImpl implements CreateSponserService<Sponser> {
  constructor(private readonly prismaService: PrismaService) {}

  async createSponser(sponserDTO: CreateSponserDTO): Promise<Sponser> {
    try {
      return await this.prismaService.sponser.create({
        data: sponserDTO
      })
    } catch (error) {
      throw new UnexpectedException(error, error.stack)
    }
  }
}
