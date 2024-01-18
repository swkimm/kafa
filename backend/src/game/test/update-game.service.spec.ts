import { Test, type TestingModule } from '@nestjs/testing'
import {
  EntityNotExistException,
  ParameterValidationException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import { GameResult, type Game, Prisma } from '@prisma/client'
import { expect } from 'chai'
import * as sinon from 'sinon'
import type { UpdateGameDTO } from '../dto/update-game.dto'
import type { UpdateGameService } from '../interface/update-game.service.interface'
import { UpdateGameServiceImpl } from '../service/update-game.service'

describe('UpdateGameService', () => {
  const db = {
    game: {
      update: sinon.stub()
    }
  }

  const mockGetGameService = {
    getGame: sinon.stub()
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

  const gameDTO: UpdateGameDTO = {
    homeTeamId: 1,
    awayTeamId: 2,
    leagueId: 1,
    result: GameResult.HomeWin,
    stadium: 'seoul',
    startedAt: new Date('2023-01-01')
  }

  const invalidGameDTO: UpdateGameDTO = {
    homeTeamId: 1,
    awayTeamId: 1,
    leagueId: 1,
    result: GameResult.HomeWin,
    stadium: 'seoul',
    startedAt: new Date('2023-01-01')
  }

  let service: UpdateGameService<Game>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'UpdateGameService',
          useClass: UpdateGameServiceImpl
        },
        {
          provide: PrismaService,
          useValue: db
        },
        {
          provide: 'GetGameService',
          useValue: mockGetGameService
        }
      ]
    }).compile()

    service = module.get<UpdateGameService<Game>>('UpdateGameService')

    sinon.reset()
  })

  afterEach(() => {
    sinon.reset()
  })

  it('should be defined', () => {
    expect(service).not.to.be.undefined
  })

  describe('updateGame', () => {
    it('should return Game', async () => {
      // given
      const gameId = 1
      mockGetGameService.getGame.resolves(game)
      db.game.update.resolves(game)

      // when
      const result = await service.updateGame(gameId, gameDTO)

      // then
      expect(result).to.be.deep.equal(game)
      expect(mockGetGameService.getGame.calledOnceWith(gameId)).to.be.true
      expect(
        db.game.update.calledOnceWith({
          where: {
            id: gameId
          },
          data: {
            ...gameDTO
          }
        })
      ).to.be.true
    })

    it('should pass ParameterValidationException[1]', async () => {
      // given
      const gameId = 1
      mockGetGameService.getGame.resolves(game)

      // then
      expect(service.updateGame(gameId, invalidGameDTO)).to.be.rejectedWith(
        ParameterValidationException
      )
    })

    it('should pass ParameterValidationException[2]', async () => {
      // given
      const gameId = 1
      mockGetGameService.getGame.resolves(game)

      // then
      expect(service.updateGame(gameId, { homeTeamId: 2 })).to.be.rejectedWith(
        ParameterValidationException
      )
    })

    it('should pass ParameterValidationException[3]', async () => {
      // given
      const gameId = 1
      mockGetGameService.getGame.resolves(game)

      // then
      expect(service.updateGame(gameId, { awayTeamId: 1 })).to.be.rejectedWith(
        ParameterValidationException
      )
    })

    it('should throw EntityNotExistException when invalid team or league id passed', async () => {
      // given
      const gameId = 1
      mockGetGameService.getGame.resolves(game)
      db.game.update.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P2003'
        })
      )

      // then
      await expect(service.updateGame(gameId, gameDTO)).to.be.rejectedWith(
        EntityNotExistException
      )
    })

    it('should throw UnexpectedException when unexpected error occurs', async () => {
      // given
      const gameId = 1
      mockGetGameService.getGame.resolves(game)
      db.game.update.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P1001'
        })
      )

      // then
      await expect(service.updateGame(gameId, gameDTO)).to.be.rejectedWith(
        UnexpectedException
      )
    })
  })
})
