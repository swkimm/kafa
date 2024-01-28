import { Inject, Injectable } from '@nestjs/common'
import {
  BusinessException,
  UnexpectedException,
  UnprocessableDataException
} from '@/common/exception/business.exception'
import { GameService } from '@/game/abstract/game.service'
import { PrismaService } from '@/prisma/prisma.service'
import { RosterService } from '@/roster/abstract/roster.service'
import { RosterType, type Game, type Record, type Roster } from '@prisma/client'
import type { CreateRecordDTO } from '../dto/create-record.dto'
import type { CreateRecordService } from '../interface/create-record.service.interface'

@Injectable()
export class CreateRecordServiceImpl implements CreateRecordService<Record> {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject('GameService') private readonly gameService: GameService<Game>,
    @Inject('RosterService')
    private readonly rosterService: RosterService<Roster>
  ) {}

  async createRecord(
    rosterId: number,
    gameId: number,
    recordDTO: CreateRecordDTO
  ): Promise<Record> {
    try {
      await this.checkRosterId(rosterId, gameId)
      return await this.prismaService.record.create({
        data: {
          rosterId,
          gameId,
          ...recordDTO
        }
      })
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }
      throw new UnexpectedException(error, error.stack)
    }
  }

  private async checkRosterId(rosterId: number, gameId: number): Promise<void> {
    const game = await this.gameService.getGame(gameId)
    const roster = await this.rosterService.getRoster(rosterId)

    if (roster.rosterType !== RosterType.Athlete) {
      throw new UnprocessableDataException('선수 로스터가 아닙니다')
    }

    if (
      roster.Team.id !== game.homeTeam.id &&
      roster.Team.id !== game.awayTeam.id
    ) {
      throw new UnprocessableDataException(
        '해당 경기에 참여한 로스터가 아닙니다'
      )
    }

    const leagueRoster = await this.prismaService.leagueRoster.findUnique({
      where: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        leagueId_rosterId: {
          leagueId: game.League.id,
          rosterId
        }
      }
    })

    if (!leagueRoster) {
      throw new UnprocessableDataException(
        '해당 리그에 참여한 로스터가 아닙니다'
      )
    }
  }
}
