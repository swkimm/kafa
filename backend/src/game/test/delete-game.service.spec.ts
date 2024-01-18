import { Test, type TestingModule } from '@nestjs/testing'
import {
  EntityNotExistException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import { type Game, GameResult, Prisma } from '@prisma/client'
import { expect } from 'chai'
import * as sinon from 'sinon'
import type { DeleteGameService } from '../interface/delete-game.service.interface'
import { DeleteGameServiceImpl } from '../service/delete-game.service'

describe('DeleteGameService', () => {
  const db = {
    game: {
      delete: sinon.stub()
    }
  }

  const game: Game = {
    id: 1,
    homeTeamId: 1,
    awayTeamId: 2,
    leagueId: 1,
    result: GameResult.HomeWin,
    stadium: 'seoul',
    startedAt: new Date('2023-01-01'),
    name: 'game01'
  }

  let service: DeleteGameService<Game>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'DeleteGameService',
          useClass: DeleteGameServiceImpl
        },
        {
          provide: PrismaService,
          useValue: db
        }
      ]
    }).compile()

    service = module.get<DeleteGameService<Game>>('DeleteGameService')

    sinon.reset()
  })

  afterEach(() => {
    sinon.reset()
  })

  it('should be defined', () => {
    expect(service).not.to.be.undefined
  })

  describe('deleteGame', () => {
    it('should return Game', async () => {
      // given
      const gameId = 1
      db.game.delete.resolves(game)

      // when
      const result = await service.deleteGame(gameId)

      // then
      expect(result).to.be.deep.equal(game)
      expect(
        db.game.delete.calledOnceWith({
          where: {
            id: gameId
          }
        })
      ).to.be.true
    })

    it('should throw EntityNotExistException when invalid gameId passed', async () => {
      // given
      const gameId = 1
      db.game.delete.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P2025'
        })
      )

      // then
      await expect(service.deleteGame(gameId)).to.be.rejectedWith(
        EntityNotExistException
      )
    })

    it('should throw UnexpectedException when unexpected error occurs', async () => {
      // given
      const gameId = 1
      db.game.delete.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P1001'
        })
      )

      // then
      await expect(service.deleteGame(gameId)).to.be.rejectedWith(
        UnexpectedException
      )
    })
  })
})
