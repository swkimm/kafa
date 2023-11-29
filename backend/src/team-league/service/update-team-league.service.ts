import { Injectable } from '@nestjs/common'
import {
  BusinessException,
  EntityNotExistException,
  ParameterValidationException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import { Prisma, type TeamLeague } from '@prisma/client'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { UpdateTeamLeagueDTO } from '../dto/updateTeamLeague.dto'
import type { UpdateTeamLeagueService } from '../interface/update-team-league.service.interface'

@Injectable()
export class UpdateTeamLeagueServiceImpl
  implements UpdateTeamLeagueService<TeamLeague>
{
  constructor(private readonly prismaSerivce: PrismaService) {}

  async updateTeamLeague(
    teamLeagueDTO: UpdateTeamLeagueDTO
  ): Promise<TeamLeague> {
    try {
      await this.checkParameterType(teamLeagueDTO)
      const { teamId, leagueId, applyStatus } = teamLeagueDTO
      return await this.prismaSerivce.teamLeague.update({
        where: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          teamId_leagueId: {
            teamId,
            leagueId
          }
        },
        data: {
          applyStatus
        }
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new EntityNotExistException('teamId or leagueId')
      }
      if (error instanceof BusinessException) {
        throw error
      }
      throw new UnexpectedException(error)
    }
  }

  private async checkParameterType(
    teamLeagueDTO: UpdateTeamLeagueDTO
  ): Promise<void> {
    const target = plainToInstance(UpdateTeamLeagueDTO, teamLeagueDTO)
    const errors = await validate(target)

    if (errors.length > 0) {
      throw new ParameterValidationException(errors)
    }
  }
}
