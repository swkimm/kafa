import { Inject, Injectable } from '@nestjs/common'
import { AssociationService } from '@/association/abstract/association.service'
import {
  BusinessException,
  EntityNotExistException,
  ParameterValidationException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import { TeamLeagueService } from '@/team-league/abstract/team-league.service'
import {
  Prisma,
  type TeamLeague,
  type Team,
  type RegisterTeamRequest,
  type Association,
  TeamEnrollStatus,
  TeamStatus
} from '@prisma/client'
import type { TeamManyDTO } from '../dto/team-many.dto'
import type { GetTeamService } from '../interface/get-team.service.interface'

/**
 * 팀 조회와 관련된 서비스 인터페이스 [GetTeamService] 구현체
 */
@Injectable()
export class GetTeamServiceImpl
  implements GetTeamService<Team, RegisterTeamRequest>
{
  constructor(
    private readonly prismaService: PrismaService,
    @Inject('TeamLeagueService')
    private readonly teamLeagueService: TeamLeagueService<TeamLeague>,
    @Inject('AssociationService')
    private readonly associationService: AssociationService<Association>
  ) {}

  async getTeam(teamId: number): Promise<Team> {
    try {
      return await this.prismaService.team.findUniqueOrThrow({
        where: {
          id: teamId
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

  async getTeams(page: number, limit = 10, option?: string): Promise<Team[]> {
    try {
      this.checkTeamStatusParameters(option)

      const status = !option ? TeamStatus.Enabled : TeamStatus[option]

      const offset = (page - 1) * (limit || 10)

      return await this.prismaService.team.findMany({
        take: limit,
        skip: offset,
        orderBy: {
          name: 'asc'
        },
        where: {
          status
        }
      })
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }
      throw new UnexpectedException(error)
    }
  }

  async getTeamsBySearch(
    searchTerm: string,
    limit = 10
  ): Promise<TeamManyDTO[]> {
    try {
      return await this.prismaService.team.findMany({
        where: {
          OR: [
            {
              name: {
                contains: searchTerm
              }
            },
            {
              globalName: {
                contains: searchTerm
              }
            }
          ],
          status: 'Enabled'
        },
        take: limit,
        select: {
          id: true,
          name: true,
          globalName: true,
          initial: true,
          color: true,
          profileImgUrl: true
        },
        orderBy: {
          name: 'asc'
        }
      })
    } catch (error) {
      throw new UnexpectedException(error, error.stack)
    }
  }

  async getAssociationTeams(associationId: number): Promise<Team[]> {
    try {
      await this.associationService.getAssociation(associationId)

      return await this.prismaService.team.findMany({
        where: {
          associationId,
          status: 'Enabled'
        }
      })
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }
      throw new UnexpectedException(error)
    }
  }

  async getLeagueTeams(leagueId: number): Promise<Team[]> {
    try {
      const teamLeagues =
        await this.teamLeagueService.getTeamLeaguesByLeagueId(leagueId)

      const teams = teamLeagues.filter(
        (teamLeague) => teamLeague.applyStatus === 'Approved'
      )

      return await this.prismaService.team.findMany({
        where: {
          id: {
            in: teams.map((team) => team.teamId)
          }
        }
      })
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }
      throw new UnexpectedException(error)
    }
  }

  async getAccountRegisterTeamRequests(
    accountId: number
  ): Promise<RegisterTeamRequest[]> {
    try {
      return await this.prismaService.registerTeamRequest.findMany({
        where: {
          accountId
        }
      })
    } catch (error) {
      throw new UnexpectedException(error)
    }
  }

  async getRegisterTeamRequests(
    limit = 10,
    cursor?: number,
    option?: string
  ): Promise<RegisterTeamRequest[]> {
    try {
      this.checkTeamEnrollStatusParameters(option)
      const status = !option ? undefined : TeamEnrollStatus[option]
      return await this.prismaService.registerTeamRequest.findMany({
        take: limit,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          id: 'desc'
        },
        where: {
          status
        }
      })
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }
      throw new UnexpectedException(error)
    }
  }

  /**
   * 팀 등록 요청 상태 값이 유효한지 검사합니다.
   *
   * @param {string} target - 팀 등록 요청 상태
   * @returns {void}
   * @throws {ParameterValidationException} 잘못된 팀 등록 요청 상태를 전달할 경우 발생
   */
  private checkTeamEnrollStatusParameters(target: string): void {
    if (!target) {
      return
    }

    if (
      target !== 'Approved' &&
      target !== 'Rejected' &&
      target !== 'Received'
    ) {
      throw new ParameterValidationException(
        'option must be in "Approved", "Rejected", "Received"'
      )
    }
  }

  /**
   * 팀 상태 값이 유효한지 검사합니다.
   *
   * @param {string} target - 팀 상태
   * @returns {void}
   * @throws {ParameterValidationException} 잘못된 팀 상태를 전달할 경우 발생
   */
  private checkTeamStatusParameters(target: string): void {
    if (!target) {
      return
    }

    if (target !== 'Disabled') {
      throw new ParameterValidationException('option must be in "Disabled"')
    }
  }
}
