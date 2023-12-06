import { Injectable } from '@nestjs/common'
import {
  BusinessException,
  EntityNotExistException,
  ParameterValidationException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import { Prisma, type League } from '@prisma/client'
import type { CreateLeagueDTO } from '../dto/create-league.dto'
import type { CreateLeagueService } from '../interface/create-league.service.interface'

@Injectable()
export class CreateLeagueServiceImpl implements CreateLeagueService<League> {
  constructor(private readonly prismaService: PrismaService) {}

  async createLeague(leagueDTO: CreateLeagueDTO): Promise<League> {
    try {
      this.checkDate(leagueDTO)

      return await this.prismaService.league.create({
        data: {
          ...leagueDTO
        }
      })
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new EntityNotExistException('associationId')
      }
      throw new UnexpectedException(error, error.stack)
    }
  }

  private checkDate(leagueDTO: CreateLeagueDTO): void {
    if (leagueDTO.startedAt.getTime() > leagueDTO.endedAt.getTime()) {
      throw new ParameterValidationException('ended date')
    }
  }
}
