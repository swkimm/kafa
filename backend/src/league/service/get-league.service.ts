import { Inject, Injectable } from '@nestjs/common'
import { AssociationService } from '@/association/abstract/association.service'
import {
  BusinessException,
  EntityNotExistException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { calculateOffset } from '@/common/pagination/calculate-offset'
import { LeagueSponserService } from '@/league-sponser/league-sponser.service.interface'
import { PrismaService } from '@/prisma/prisma.service'
import { SponserService } from '@/sponser/abstract/sponser.service'
import { TeamService } from '@/team/abstract/team.service'
import {
  type League,
  Prisma,
  type Association,
  type Sponser,
  type LeagueSponser,
  type Team,
  type RegisterTeamRequest
} from '@prisma/client'
import type { LeagueWithAssociationDTO } from '../dto/league-with-association.dto'
import type { GetLeagueService } from '../interface/get-league.service.interface'

/**
 * 리그 조회와 관련된 서비스 인터페이스 [GetLeagueService] 구현체
 */
@Injectable()
export class GetLeagueServiceImpl implements GetLeagueService<League, Sponser> {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject('AssociationService')
    private readonly associationService: AssociationService<Association>,
    @Inject('LeagueSponserService')
    private readonly leagueSponserService: LeagueSponserService<LeagueSponser>,
    @Inject('SponserService')
    private readonly sponserService: SponserService<Sponser>,
    @Inject('TeamService')
    private readonly teamService: TeamService<
      Team,
      { result: string },
      RegisterTeamRequest
    >
  ) {}

  async getLeague(leagueId: number): Promise<League> {
    try {
      return await this.prismaService.league.findUniqueOrThrow({
        where: {
          id: leagueId
        }
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new EntityNotExistException('leagueId')
      }
      throw new UnexpectedException(error, error.stack)
    }
  }

  async getLeagues(
    page: number,
    limit = 10
  ): Promise<LeagueWithAssociationDTO[]> {
    try {
      return await this.prismaService.league.findMany({
        take: limit,
        skip: calculateOffset(page, limit),
        orderBy: {
          startedAt: 'desc'
        },
        include: {
          Association: {
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

  async getLeaguesByYear(
    year: number,
    page: number,
    limit = 10
  ): Promise<LeagueWithAssociationDTO[]> {
    try {
      return await this.prismaService.league.findMany({
        where: {
          startedYear: year
        },
        take: limit,
        skip: calculateOffset(page, limit),
        orderBy: {
          startedAt: 'desc'
        },
        include: {
          Association: {
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

  async getLeaguesByTeamAndYear(
    teamId: number,
    year: number,
    page: number,
    limit = 10
  ): Promise<LeagueWithAssociationDTO[]> {
    try {
      await this.teamService.getTeam(teamId)

      return await this.prismaService.league.findMany({
        where: {
          startedYear: year,
          TeamLeagues: {
            some: {
              teamId
            }
          }
        },
        take: limit,
        skip: calculateOffset(page, limit),
        orderBy: {
          startedAt: 'desc'
        },
        include: {
          Association: {
            select: {
              id: true,
              name: true,
              profileImgUrl: true
            }
          }
        }
      })
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }
      throw new UnexpectedException(error, error.stack)
    }
  }

  async getLeaguesByAssociationId(
    associationId: number,
    page: number,
    limit = 10
  ): Promise<League[]> {
    try {
      await this.associationService.getAssociation(associationId)

      return await this.prismaService.league.findMany({
        take: limit,
        skip: calculateOffset(page, limit),
        orderBy: {
          startedAt: 'desc'
        },
        where: {
          associationId
        }
      })
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }
      throw new UnexpectedException(error, error.stack)
    }
  }

  async getSponsersByLeagueId(
    leagueId: number,
    page: number,
    limit = 10
  ): Promise<Sponser[]> {
    try {
      await this.getLeague(leagueId)

      const leagueSponsers =
        await this.leagueSponserService.getLeagueSponsersByLeagueId(
          leagueId,
          page,
          limit
        )

      return Promise.all(
        leagueSponsers.map(async (leagueSponser) => {
          return await this.sponserService.getSponser(leagueSponser.sponserId)
        })
      )
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }
      throw new UnexpectedException(error, error.stack)
    }
  }
}
