import { Test, type TestingModule } from '@nestjs/testing'
import {
  EntityNotExistException,
  ParameterValidationException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import { type Game, GameResult, Prisma } from '@prisma/client'
import { expect } from 'chai'
import * as sinon from 'sinon'
import type { CreateGameDTO } from '../dto/create-game.dto'
import type { CreateGameService } from '../interface/create-game.service.interface'
import { CreateGameServiceImpl } from '../service/create-game.service'

describe('CreateGameService', () => {
  const db = {
    game: {
      create: sinon.stub()
    }
  }

  const game: Game = {
    id: 1,
    homeTeamId: 1,
    awayTeamId: 2,
    leagueId: 1,
    result: GameResult.HomeWin,
    stadium: 'seoul',
    startedAt: new Date('2023-01-01')
  }

  const gameDTO: CreateGameDTO = {
    homeTeamId: 1,
    awayTeamId: 2,
    leagueId: 1,
    result: GameResult.HomeWin,
    stadium: 'seoul',
    startedAt: new Date('2023-01-01')
  }

  const invalidGameDTO: CreateGameDTO = {
    homeTeamId: 1,
    awayTeamId: 1,
    leagueId: 1,
    result: GameResult.HomeWin,
    stadium: 'seoul',
    startedAt: new Date('2023-01-01')
  }

  let service: CreateGameService<Game>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'CreateGameService',
          useClass: CreateGameServiceImpl
        },
        {
          provide: PrismaService,
          useValue: db
        }
      ]
    }).compile()

    service = module.get<CreateGameService<Game>>('CreateGameService')

    sinon.reset()
  })

  afterEach(() => {
    sinon.reset()
  })

  it('should be defined', () => {
    expect(service).not.to.be.undefined
  })

  describe('createGame', () => {
    it('should return Game', async () => {
      // given
      db.game.create.resolves(game)

      // when
      const result = await service.createGame(gameDTO)

      // then
      expect(result).to.be.deep.equal(game)
      expect(
        db.game.create.calledOnceWith({
          data: {
            ...gameDTO
          }
        })
      ).to.be.true
    })

    it('should pass BusinessException', async () => {
      // then
      await expect(service.createGame(invalidGameDTO)).to.be.rejectedWith(
        ParameterValidationException
      )
    })

    it('should throw EntityNotExistException when invalid team or leagueId passed', async () => {
      // given
      db.game.create.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P2003'
        })
      )

      // then
      await expect(service.createGame(gameDTO)).to.be.rejectedWith(
        EntityNotExistException
      )
    })

    it('should throw UnexpectedException when unexpected error occurs', async () => {
      // given
      db.game.create.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P1001'
        })
      )

      // then
      await expect(service.createGame(gameDTO)).to.be.rejectedWith(
        UnexpectedException
      )
    })
  })
})
