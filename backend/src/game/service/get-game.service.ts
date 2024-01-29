import { Inject, Injectable } from '@nestjs/common'
import {
  BusinessException,
  EntityNotExistException,
  ParameterValidationException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { calculateOffset } from '@/common/pagination/calculate-offset'
import { LeagueService } from '@/league/abstract/league.service'
import { PrismaService } from '@/prisma/prisma.service'
import { GetTeamService } from '@/team/interface/get-team.service.interface'
import {
  Prisma,
  type Game,
  type League,
  type Sponser,
  type TeamLeague,
  type Team,
  type RegisterTeamRequest
} from '@prisma/client'
import type { GameManyDTO } from '../dto/game-many.dto'
import type { GameWithLeagueAndAssociationDTO } from '../dto/game-with-league-association.dto'
import type { GameWithLeagueDTO } from '../dto/game-with-league.dto'
import type { GetGameService } from '../interface/get-game.service.interface'

@Injectable()
export class GetGameServiceImpl implements GetGameService<Game> {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject('LeagueService')
    private readonly leagueService: LeagueService<League, TeamLeague, Sponser>,
    @Inject('TeamService')
    private readonly teamService: GetTeamService<Team, RegisterTeamRequest>
  ) {}

  async getGame(gameId: number): Promise<GameWithLeagueAndAssociationDTO> {
    try {
      return await this.prismaService.game.findUniqueOrThrow({
        where: {
          id: gameId
        },
        select: {
          id: true,
          name: true,
          startedAt: true,
          stadium: true,
          homeTeam: {
            select: {
              id: true,
              name: true,
              profileImgUrl: true,
              initial: true
            }
          },
          awayTeam: {
            select: {
              id: true,
              name: true,
              profileImgUrl: true,
              initial: true
            }
          },
          League: {
            select: {
              id: true,
              name: true,
              Association: {
                select: {
                  id: true,
                  name: true,
                  profileImgUrl: true
                }
              }
            }
          },
          score: {
            select: {
              homeTeamScore: true,
              awayTeamScore: true
            }
          }
        }
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new EntityNotExistException('gameId')
      }
      throw new UnexpectedException(error, error.stack)
    }
  }

  async getGames(cursor?: number, limit = 10): Promise<Game[]> {
    try {
      return await this.prismaService.game.findMany({
        take: limit,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { id: 'desc' }
      })
    } catch (error) {
      throw new UnexpectedException(error, error.stack)
    }
  }

  async getGamesByLeagueId(
    leagueId: number,
    cursor?: number,
    limit = 10
  ): Promise<Game[]> {
    try {
      await this.leagueService.getLeague(leagueId)

      return await this.prismaService.game.findMany({
        take: limit,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { id: 'desc' },
        where: {
          leagueId
        }
      })
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }
      throw new UnexpectedException(error, error.stack)
    }
  }

  async getGamesByTeamId(
    teamId: number,
    page: number,
    limit = 10
  ): Promise<GameWithLeagueDTO[]> {
    try {
      await this.teamService.getTeam(teamId)

      return await this.prismaService.game.findMany({
        take: limit,
        skip: calculateOffset(page, limit),
        where: {
          OR: [
            {
              awayTeamId: teamId
            },
            {
              homeTeamId: teamId
            }
          ]
        },
        orderBy: {
          startedAt: 'desc'
        },
        select: {
          id: true,
          name: true,
          startedAt: true,
          stadium: true,
          homeTeam: {
            select: {
              id: true,
              name: true,
              profileImgUrl: true,
              initial: true
            }
          },
          awayTeam: {
            select: {
              id: true,
              name: true,
              profileImgUrl: true,
              initial: true
            }
          },
          League: {
            select: {
              id: true,
              name: true
            }
          },
          score: {
            select: {
              homeTeamScore: true,
              awayTeamScore: true
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

  async getGamesByLeagueIdAndDate(
    leagueId: number,
    startDate: Date,
    endDate: Date
  ): Promise<GameWithLeagueAndAssociationDTO[]> {
    try {
      await this.leagueService.getLeague(leagueId)

      if (startDate >= endDate) {
        throw new ParameterValidationException(
          '시작날짜는 종료날짜보다 빨라야 합니다'
        )
      }

      return await this.prismaService.game.findMany({
        where: {
          AND: [
            {
              startedAt: {
                gte: startDate
              }
            },
            {
              startedAt: {
                lte: endDate
              }
            },
            {
              leagueId
            }
          ]
        },
        select: {
          id: true,
          name: true,
          startedAt: true,
          stadium: true,
          homeTeam: {
            select: {
              id: true,
              name: true,
              profileImgUrl: true,
              initial: true
            }
          },
          awayTeam: {
            select: {
              id: true,
              name: true,
              profileImgUrl: true,
              initial: true
            }
          },
          League: {
            select: {
              id: true,
              name: true,
              Association: {
                select: {
                  id: true,
                  name: true,
                  profileImgUrl: true
                }
              }
            }
          },
          score: {
            select: {
              homeTeamScore: true,
              awayTeamScore: true
            }
          }
        },
        orderBy: {
          startedAt: 'asc'
        }
      })
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }
      throw new UnexpectedException(error, error.stack)
    }
  }

  async getGamesByLeagueIdAndTeamId(
    leagueId: number,
    teamId: number
  ): Promise<GameManyDTO[]> {
    try {
      await this.teamService.getTeam(teamId)
      await this.leagueService.getLeague(leagueId)

      return await this.prismaService.game.findMany({
        where: {
          leagueId,
          OR: [
            {
              awayTeamId: teamId
            },
            {
              homeTeamId: teamId
            }
          ]
        },
        select: {
          id: true,
          name: true
        }
      })
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }
      throw new UnexpectedException(error, error.stack)
    }
  }

  async getCurrentlyEndedGames(): Promise<GameWithLeagueDTO[]> {
    try {
      return await this.prismaService.game.findMany({
        where: {
          startedAt: {
            lte: new Date(new Date().getTime() + 2 * 60 * 60 * 1000) // two hours
          }
        },
        take: 5,
        orderBy: {
          startedAt: 'desc'
        },
        select: {
          id: true,
          name: true,
          startedAt: true,
          stadium: true,
          homeTeam: {
            select: {
              id: true,
              name: true,
              profileImgUrl: true,
              initial: true
            }
          },
          awayTeam: {
            select: {
              id: true,
              name: true,
              profileImgUrl: true,
              initial: true
            }
          },
          League: {
            select: {
              id: true,
              name: true
            }
          },
          score: {
            select: {
              homeTeamScore: true,
              awayTeamScore: true
            }
          }
        }
      })
    } catch (error) {
      throw new UnexpectedException(error, error.stack)
    }
  }

  async getUpcommingGames(): Promise<GameWithLeagueDTO[]> {
    try {
      return await this.prismaService.game.findMany({
        where: {
          startedAt: {
            gte: new Date()
          }
        },
        take: 5,
        orderBy: {
          startedAt: 'asc'
        },
        select: {
          id: true,
          name: true,
          startedAt: true,
          stadium: true,
          homeTeam: {
            select: {
              id: true,
              name: true,
              profileImgUrl: true,
              initial: true
            }
          },
          awayTeam: {
            select: {
              id: true,
              name: true,
              profileImgUrl: true,
              initial: true
            }
          },
          League: {
            select: {
              id: true,
              name: true
            }
          },
          score: {
            select: {
              homeTeamScore: true,
              awayTeamScore: true
            }
          }
        }
      })
    } catch (error) {
      throw new UnexpectedException(error, error.stack)
    }
  }
}
