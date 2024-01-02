import { Inject, Injectable } from '@nestjs/common'
import {
  BusinessException,
  EntityNotExistException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { LeagueService } from '@/league/abstract/league.service'
import { PrismaService } from '@/prisma/prisma.service'
import {
  Prisma,
  type Game,
  type League,
  type Sponser,
  type TeamLeague
} from '@prisma/client'
import type { GetGameService } from '../interface/get-game.service.interface'

@Injectable()
export class GetGameServiceImpl implements GetGameService<Game> {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject('LeagueService')
    private readonly leagueService: LeagueService<League, TeamLeague, Sponser>
  ) {}

  async getGame(gameId: number): Promise<Game> {
    try {
      return await this.prismaService.game.findUniqueOrThrow({
        where: {
          id: gameId
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
}
