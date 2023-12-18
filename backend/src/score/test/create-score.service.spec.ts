import { Test, type TestingModule } from '@nestjs/testing'
import {
  ConflictFoundException,
  EntityNotExistException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import { Prisma, type Score } from '@prisma/client'
import { expect } from 'chai'
import * as sinon from 'sinon'
import type { CreateScoreDTO } from '../dto/create-score.dto'
import type { CreateScoreService } from '../interface/create-score.service.interface'
import { CreateScoreServiceImpl } from '../service/create-score.service'

describe('CreateScoreService', () => {
  const db = {
    score: {
      create: sinon.stub()
    }
  }

  const score: Score = {
    gameId: 1,
    homeTeamScore: 14,
    awayTeamScore: 3,
    homeTeamQuarterScores: [0, 7, 0, 7],
    awayTeamQuarterScores: [3, 0, 0, 0],
    overtime: false
  }

  const scoreDTO: CreateScoreDTO = {}

  let service: CreateScoreService<Score>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'CreateScoreService',
          useClass: CreateScoreServiceImpl
        },
        {
          provide: PrismaService,
          useValue: db
        }
      ]
    }).compile()

    service = module.get<CreateScoreService<Score>>('CreateScoreService')

    sinon.reset()
  })

  afterEach(() => {
    sinon.reset()
  })

  it('should be defined', () => {
    expect(service).not.to.be.undefined
  })

  describe('createScore', () => {
    it('should return Score', async () => {
      // given
      const gameId = 1
      db.score.create.resolves(score)

      // when
      const result = await service.createScore(gameId, scoreDTO)

      // then
      expect(result).to.be.deep.equal(score)
      expect(
        db.score.create.calledOnceWith({
          data: {
            gameId,
            ...scoreDTO
          }
        })
      ).to.be.true
    })

    it('should throw EntityNotExistException when invalid gameId passed', async () => {
      // given
      const gameId = 1
      db.score.create.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P2003'
        })
      )

      // then
      await expect(service.createScore(gameId, scoreDTO)).to.be.rejectedWith(
        EntityNotExistException
      )
    })

    it('should throw ConflictFoundException when duplicated gameId passed', async () => {
      // given
      const gameId = 1
      db.score.create.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P2002'
        })
      )

      // then
      await expect(service.createScore(gameId, scoreDTO)).to.be.rejectedWith(
        ConflictFoundException
      )
    })

    it('should throw UnexpectedException when unexpected error occurs', async () => {
      // given
      const gameId = 1
      db.score.create.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P1001'
        })
      )

      // then
      await expect(service.createScore(gameId, scoreDTO)).to.be.rejectedWith(
        UnexpectedException
      )
    })
  })
})
