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

/**
 * 팀과 리그의 연결정보를 업데이트하는 서비스 인터페이스 [UpdateTeamLeagueService] 구현체
 */
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
      if (error instanceof BusinessException) {
        throw error
      }
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new EntityNotExistException('teamId or leagueId')
      }
      throw new UnexpectedException(error)
    }
  }

  /**
   * 업데이트할 팀과 리그의 연결정보를 담은 객체의 타입과 값을 검사하는 private 메서드
   *
   * @param {UpdateTeamLeagueDTO} teamLeagueDTO - 업데이트할 팀과 리그의 연결정보를 담은 객체
   * @throws {ParameterValidationException} 업데이트할 내용이 담긴 객체의 타입 또는 값이 부적절할 경우 발생
   */
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
