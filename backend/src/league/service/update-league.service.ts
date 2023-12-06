import { Inject } from '@nestjs/common'
import {
  BusinessException,
  EntityNotExistException,
  ParameterValidationException,
  UnexpectedException
} from '@/common/exception/business.exception'
import type { CreateLeagueSponserDTO } from '@/league-sponser/dto/create-league-sponser.dto'
import { LeagueSponserService } from '@/league-sponser/league-sponser.service.interface'
import { PrismaService } from '@/prisma/prisma.service'
import {
  Prisma,
  type League,
  type LeagueSponser,
  type Sponser
} from '@prisma/client'
import type { UpdateLeagueDTO } from '../dto/update-league.dto'
import { GetLeagueService } from '../interface/get-league.service.interface'
import type { UpdateLeagueService } from '../interface/update-league.service.interface'

export class UpdateLeagueServiceImpl implements UpdateLeagueService<League> {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject('GetLeagueService')
    private readonly getLeagueService: GetLeagueService<League, Sponser>,
    @Inject('LeagueSponserService')
    private readonly leagueSponserService: LeagueSponserService<LeagueSponser>
  ) {}

  async updateLeague(
    leagueId: number,
    leagueDTO: UpdateLeagueDTO
  ): Promise<League> {
    try {
      await this.checkDate(leagueId, leagueDTO)

      return await this.prismaService.league.update({
        where: {
          id: leagueId
        },
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

  async linkSponser(leagueId: number, sponserId: number): Promise<void> {
    try {
      const leagueSponserDTO: CreateLeagueSponserDTO = {
        leagueId,
        sponserId
      }
      await this.leagueSponserService.createLeagueSponser(leagueSponserDTO)
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }
      throw new UnexpectedException(error, error.stack)
    }
  }

  async unlinkSponser(leagueId: number, sponserId: number): Promise<void> {
    try {
      await this.leagueSponserService.deleteLeagueSponser(leagueId, sponserId)
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }
      throw new UnexpectedException(error, error.stack)
    }
  }

  private async checkDate(
    leagueId: number,
    leagueDTO: UpdateLeagueDTO
  ): Promise<void> {
    const origin = await this.getLeagueService.getLeague(leagueId)

    if (leagueDTO.startedAt && leagueDTO.endedAt) {
      if (leagueDTO.startedAt > leagueDTO.endedAt) {
        throw new ParameterValidationException('endedAt')
      } else {
        return
      }
    }

    if (leagueDTO.startedAt) {
      if (leagueDTO.startedAt > origin.endedAt) {
        throw new ParameterValidationException('startedAt')
      }
    }

    if (leagueDTO.endedAt) {
      if (origin.startedAt > leagueDTO.endedAt) {
        throw new ParameterValidationException('startedAt')
      }
    }
  }
}
