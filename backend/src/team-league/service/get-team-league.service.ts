import { Injectable } from '@nestjs/common'
import {
  EntityNotExistException,
  ParameterValidationException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import { LeagueApplyStatus, Prisma, type TeamLeague } from '@prisma/client'
import type { GetTeamLeagueService } from '../interface/get-team-league.service.interface'

/**
 * 팀과 리그의 연결 정보를 조회하는 서비스 인터페이스 [GetTeamLeagueService] 구현체
 */
@Injectable()
export class GetTeamLeagueServiceImpl
  implements GetTeamLeagueService<TeamLeague>
{
  constructor(private readonly prismaService: PrismaService) {}

  async getTeamLeaguesByLeagueId(
    leagueId: number,
    option = 'Approved'
  ): Promise<TeamLeague[]> {
    try {
      await this.checkLeagueId(leagueId)
      return await this.prismaService.teamLeague.findMany({
        where: {
          leagueId,
          applyStatus: this.transFormStatus(option)
        }
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new EntityNotExistException('leagueId')
      }
      throw new UnexpectedException(error)
    }
  }

  async getTeamLeaguesByTeamId(
    teamId: number,
    option = 'Approved'
  ): Promise<TeamLeague[]> {
    try {
      await this.checkTeamId(teamId)
      return await this.prismaService.teamLeague.findMany({
        where: {
          teamId,
          applyStatus: this.transFormStatus(option)
        }
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new EntityNotExistException('teamId')
      }
      throw new UnexpectedException(error)
    }
  }

  async getTeamLeague(teamId: number, leagueId: number): Promise<TeamLeague> {
    try {
      return await this.prismaService.teamLeague.findUniqueOrThrow({
        where: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          teamId_leagueId: {
            teamId,
            leagueId
          }
        }
      })
    } catch (error) {
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
   * 특정 Id를 가진 리그가 존재하는지 확인하는 private 메서드
   *
   * @param {number} leagueId
   * @returns {Promise<void>}
   * @throws {Prisma.PrismaClientKnownRequestError} 존재하지 않는 리그의 Id를 전달한 경우 발생 [P2025]
   */
  private async checkLeagueId(leagueId: number): Promise<void> {
    await this.prismaService.league.findUniqueOrThrow({
      where: {
        id: leagueId
      }
    })
  }

  /**
   * 특정 Id를 가진 팀이 존재하는지 확인하는 private 메서드
   *
   * @param {number} teamId
   * @returns {Promise<void>}
   * @throws {Prisma.PrismaClientKnownRequestError} 존재하지 않는 팀의 Id를 전달한 경우 발생 [P2025]
   */
  private async checkTeamId(teamId: number): Promise<void> {
    await this.prismaService.team.findUniqueOrThrow({
      where: {
        id: teamId
      }
    })
  }

  private transFormStatus(option: string): LeagueApplyStatus {
    try {
      return LeagueApplyStatus[option]
    } catch (error) {
      throw new ParameterValidationException(
        'option 프로퍼티에 유효하지 않은 값이 있습니다'
      )
    }
  }
}
