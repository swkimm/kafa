import { Inject, Injectable } from '@nestjs/common'
import {
  BusinessException,
  UnexpectedException,
  UnprocessableDataException
} from '@/common/exception/business.exception'
import { GameService } from '@/game/abstract/game.service'
import { PrismaService } from '@/prisma/prisma.service'
import { RosterService } from '@/roster/abstract/roster.service'
import { RosterType, type Game, type Roster } from '@prisma/client'
import type { RecordDTO } from '../dto/record.dto'
import type { GetRecordService } from '../interface/get-record.service.interface'

@Injectable()
export class GetRecordServiceImpl implements GetRecordService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject('GameService') private readonly gameService: GameService<Game>,
    @Inject('RosterService')
    private readonly rosterService: RosterService<Roster>
  ) {}

  async getGameRecords(gameId: number): Promise<RecordDTO[]> {
    try {
      await this.gameService.getGame(gameId)

      return await this.prismaService.record.findMany({
        where: {
          gameId
        },
        select: {
          id: true,
          type: true,
          score: true,
          unit: true,
          Game: {
            select: {
              id: true,
              homeTeam: {
                select: {
                  id: true,
                  name: true,
                  profileImgUrl: true
                }
              },
              awayTeam: {
                select: {
                  id: true,
                  name: true,
                  profileImgUrl: true
                }
              }
            }
          },
          Athlete: {
            select: {
              position: true,
              Roster: {
                select: {
                  id: true,
                  name: true,
                  profileImgUrl: true
                }
              }
            }
          }
        },
        orderBy: {
          Game: {
            startedAt: 'asc'
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

  async getLeagueRecords(leagueId: number): Promise<RecordDTO[]> {
    try {
      const games = await this.gameService.getGamesByLeagueId(leagueId)

      return await this.prismaService.record.findMany({
        where: {
          gameId: {
            in: games.map((game) => game.id)
          }
        },
        select: {
          id: true,
          type: true,
          score: true,
          unit: true,
          Game: {
            select: {
              id: true,
              homeTeam: {
                select: {
                  id: true,
                  name: true,
                  profileImgUrl: true
                }
              },
              awayTeam: {
                select: {
                  id: true,
                  name: true,
                  profileImgUrl: true
                }
              }
            }
          },
          Athlete: {
            select: {
              position: true,
              Roster: {
                select: {
                  id: true,
                  name: true,
                  profileImgUrl: true
                }
              }
            }
          }
        },
        orderBy: {
          Game: {
            startedAt: 'asc'
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

  async getPersonalRecords(rosterId: number): Promise<RecordDTO[]> {
    try {
      const roster = await this.rosterService.getRoster(rosterId)

      if (roster.rosterType !== RosterType.Athlete) {
        throw new UnprocessableDataException('선수 로스터가 아닙니다')
      }

      return await this.prismaService.record.findMany({
        where: {
          rosterId
        },
        select: {
          id: true,
          type: true,
          score: true,
          unit: true,
          Game: {
            select: {
              id: true,
              homeTeam: {
                select: {
                  id: true,
                  name: true,
                  profileImgUrl: true
                }
              },
              awayTeam: {
                select: {
                  id: true,
                  name: true,
                  profileImgUrl: true
                }
              }
            }
          },
          Athlete: {
            select: {
              position: true,
              Roster: {
                select: {
                  id: true,
                  name: true,
                  profileImgUrl: true
                }
              }
            }
          }
        },
        orderBy: {
          Game: {
            startedAt: 'asc'
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
}
