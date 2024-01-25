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
import type { TeamLeagueRank } from '../dto/team-league-rank.dto'
import type { GetLeagueService } from '../interface/get-league.service.interface'

interface TeamGameResult {
  win: number
  lose: number
  draw: number
  team: Team
  rank: number
}

type TeamResults = {
  [teamId: number]: TeamGameResult
}

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

  async getLeagueRanking(leagueId: number): Promise<TeamLeagueRank[]> {
    try {
      const teamsInLeague = await this.prismaService.teamLeague.findMany({
        where: {
          leagueId: leagueId,
          applyStatus: 'Approved'
        },
        include: {
          Team: true
        }
      })

      if (teamsInLeague.length === 0) return []

      const teamResults: TeamResults = teamsInLeague.reduce(
        (acc, teamLeague) => {
          acc[teamLeague.teamId] = {
            win: 0,
            lose: 0,
            draw: 0,
            team: teamLeague.Team,
            rank: teamLeague.rank ?? 10000
          }
          return acc
        },
        {}
      )

      const gamesInLeague = await this.prismaService.game.findMany({
        where: {
          leagueId: leagueId
        }
      })

      gamesInLeague.forEach((game) => {
        if (game.result === 'HomeWin') {
          teamResults[game.homeTeamId].win++
          teamResults[game.awayTeamId].lose++
        } else if (game.result === 'AwayWin') {
          teamResults[game.homeTeamId].lose++
          teamResults[game.awayTeamId].win++
        } else if (game.result === 'Draw') {
          teamResults[game.homeTeamId].draw++
          teamResults[game.awayTeamId].draw++
        }
      })

      return Object.values(teamResults).map((result) => ({
        id: result.team.id,
        name: result.team.name,
        profileImgUrl: result.team.profileImgUrl,
        rank: result.rank,
        win: result.win,
        lose: result.lose,
        draw: result.draw
      }))
    } catch (error) {
      throw new UnexpectedException(error, error.stack)
    }
  }
}
