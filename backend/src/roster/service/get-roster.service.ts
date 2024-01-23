import { Inject, Injectable } from '@nestjs/common'
import {
  BusinessException,
  EntityNotExistException,
  ParameterValidationException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { calculateOffset } from '@/common/pagination/calculate-offset'
import { PrismaService } from '@/prisma/prisma.service'
import { TeamLeagueService } from '@/team-league/abstract/team-league.service'
import { TeamService } from '@/team/abstract/team.service'
import {
  Prisma,
  RosterStatus,
  type RegisterTeamRequest,
  type Team,
  type TeamLeague
} from '@prisma/client'
import type {
  RosterWithAthleteDTO,
  RosterWithAthleteManyDTO
} from '../dto/roster-with-athlete.dto'
import type { GetRosterService } from '../interface/get-roster.service.interface'

@Injectable()
export class GetRosterServiceImpl implements GetRosterService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject('TeamLeagueService')
    private readonly teamLeagueService: TeamLeagueService<TeamLeague>,
    @Inject('TeamService')
    private readonly teamService: TeamService<
      Team,
      { result: string },
      RegisterTeamRequest
    >
  ) {}

  async getRoster(rosterId: number): Promise<RosterWithAthleteDTO> {
    try {
      return await this.prismaService.roster.findUniqueOrThrow({
        where: {
          id: rosterId
        },
        select: {
          id: true,
          name: true,
          globalName: true,
          profileImgUrl: true,
          rosterType: true,
          registerYear: true,
          status: true,
          Athlete: {
            select: {
              position: true,
              backNumber: true,
              weight: true,
              height: true
            }
          },
          Team: {
            select: {
              id: true,
              name: true,
              profileImgUrl: true
            }
          }
        }
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new EntityNotExistException('rosterId')
      }

      throw new UnexpectedException(error, error.stack)
    }
  }

  async getTeamRostersByLeagueId(
    teamId: number,
    leagueId: number
  ): Promise<RosterWithAthleteManyDTO[]> {
    try {
      await this.teamLeagueService.getTeamLeague(teamId, leagueId)
      return await this.prismaService.roster.findMany({
        where: {
          teamId,
          LeagueRoster: {
            some: {
              leagueId
            }
          }
        },
        select: {
          id: true,
          name: true,
          globalName: true,
          profileImgUrl: true,
          rosterType: true,
          registerYear: true,
          status: true,
          Athlete: {
            select: {
              position: true,
              backNumber: true
            }
          }
        },
        orderBy: {
          name: 'asc'
        }
      })
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }

      throw new UnexpectedException(error, error.stack)
    }
  }

  async getTeamRosters(
    teamId: number,
    page = 10,
    limit = 10,
    option = 'Enable'
  ): Promise<RosterWithAthleteManyDTO[]> {
    try {
      await this.teamService.getTeam(teamId)

      return await this.prismaService.roster.findMany({
        skip: calculateOffset(page, limit),
        take: limit,
        where: {
          teamId,
          status: this.transformRosterOption(option)
        },
        select: {
          id: true,
          name: true,
          globalName: true,
          profileImgUrl: true,
          rosterType: true,
          registerYear: true,
          status: true,
          Athlete: {
            select: {
              position: true,
              backNumber: true
            }
          }
        },
        orderBy: {
          name: 'asc'
        }
      })
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }
      throw new UnexpectedException(error, error.stack)
    }
  }

  async getTeamRostersBySearch(
    searchTerm: string,
    teamId: number,
    limit = 10
  ): Promise<RosterWithAthleteManyDTO[]> {
    try {
      await this.teamService.getTeam(teamId)

      return await this.prismaService.roster.findMany({
        take: limit,
        where: {
          teamId,
          name: {
            contains: searchTerm
          },
          status: {
            not: 'Verifying'
          }
        },
        select: {
          id: true,
          name: true,
          globalName: true,
          profileImgUrl: true,
          rosterType: true,
          registerYear: true,
          status: true,
          Athlete: {
            select: {
              position: true,
              backNumber: true
            }
          }
        },
        orderBy: {
          name: 'asc'
        }
      })
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }
      throw new UnexpectedException(error, error.stack)
    }
  }

  async getAccountRosters(accountId: number): Promise<RosterWithAthleteDTO[]> {
    try {
      return await this.prismaService.roster.findMany({
        where: {
          accountId,
          status: {
            not: 'Verifying'
          }
        },
        select: {
          id: true,
          name: true,
          globalName: true,
          profileImgUrl: true,
          rosterType: true,
          registerYear: true,
          status: true,
          Athlete: {
            select: {
              position: true,
              backNumber: true,
              weight: true,
              height: true
            }
          },
          Team: {
            select: {
              id: true,
              name: true,
              profileImgUrl: true
            }
          }
        }
      })
    } catch (error) {
      throw new UnexpectedException(error, error.stack)
    }
  }

  /**
   * 문자열을 RosterStatus Enum으로 변환합니다
   *
   * @param {string} option - 변환할 option 문자열
   * @returns {RosterStatus} 변환된 Enum RosterStatus
   * @throws {ParameterValidationException} RosterStatus에 없는 문자열을 전달할 경우 발생
   */
  private transformRosterOption(option: string): RosterStatus {
    try {
      return RosterStatus[option]
    } catch (error) {
      throw new ParameterValidationException(
        `유효하지 않은 옵션 항목 ${option}`
      )
    }
  }
}
