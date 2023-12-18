import { Test, type TestingModule } from '@nestjs/testing'
import {
  EntityNotExistException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import { Prisma, type Score } from '@prisma/client'
import { expect } from 'chai'
import * as sinon from 'sinon'
import type { GetScoreService } from '../interface/get-scores.service.interface'
import { GetScoreServiceImpl } from '../service/get-score.service'

describe('GetScoreService', () => {
  const db = {
    score: {
      findUniqueOrThrow: sinon.stub()
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

  let service: GetScoreService<Score>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'GetScoreService',
          useClass: GetScoreServiceImpl
        },
        {
          provide: PrismaService,
          useValue: db
        }
      ]
    }).compile()

    service = module.get<GetScoreService<Score>>('GetScoreService')

    sinon.reset()
  })

  afterEach(() => {
    sinon.reset()
  })

  it('should be defined', () => {
    expect(service).not.to.be.undefined
  })

  describe('getScore', () => {
    it('should return Score', async () => {
      // given
      const gameId = 1
      db.score.findUniqueOrThrow.resolves(score)

      // when
      const result = await service.getScore(gameId)

      // then
      expect(result).to.be.deep.equal(score)
      expect(
        db.score.findUniqueOrThrow.calledOnceWith({
          where: {
            gameId
          }
        })
      ).to.be.true
    })

    it('should throw EntityNotExistException when invalid gamdId passed', async () => {
      // given
      const gameId = 1
      db.score.findUniqueOrThrow.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P2025'
        })
      )

      // then
      await expect(service.getScore(gameId)).to.be.rejectedWith(
        EntityNotExistException
      )
    })

    it('should throw UnexpectedException when unexpected error occurs', async () => {
      // given
      const gameId = 1
      db.score.findUniqueOrThrow.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P1001'
        })
      )

      // then
      await expect(service.getScore(gameId)).to.be.rejectedWith(
        UnexpectedException
      )
    })
  })
})
