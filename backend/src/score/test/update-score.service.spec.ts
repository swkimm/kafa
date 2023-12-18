import { Test, type TestingModule } from '@nestjs/testing'
import {
  EntityNotExistException,
  ParameterValidationException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import { Prisma, type Score } from '@prisma/client'
import { expect } from 'chai'
import * as sinon from 'sinon'
import type { UpdateScoreDTO } from '../dto/update-score.dto'
import type { UpdateScoreService } from '../interface/update-score.service.interface'
import { UpdateScoreServiceImpl } from '../service/update-score.service'

describe('UpdateScoreService', () => {
  const db = {
    score: {
      update: sinon.stub()
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

  const scoreDTO: UpdateScoreDTO = {
    awayTeamQuarterScores: [0, 7, 0, 7],
    homeTeamQuarterScores: [0, 7, 0, 3],
    overtime: false
  }

  const invalidScoreDTO: UpdateScoreDTO = {
    awayTeamQuarterScores: [0, 7, 0, 7],
    homeTeamQuarterScores: [0, 7, 0, 7],
    overtime: true
  }

  const invalidScoreDTO2: UpdateScoreDTO = {
    awayTeamQuarterScores: [0, 7, 0, 7, 0],
    homeTeamQuarterScores: [0, 7, 0, 3, 0],
    overtime: false
  }

  const invalidScoreDTO3: UpdateScoreDTO = {
    awayTeamQuarterScores: [0, 7, 0, 7, 0, 5],
    homeTeamQuarterScores: [0, 7, 0, 3, 0],
    overtime: true
  }

  let service: UpdateScoreService<Score>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'UpdateScoreService',
          useClass: UpdateScoreServiceImpl
        },
        {
          provide: PrismaService,
          useValue: db
        }
      ]
    }).compile()

    service = module.get<UpdateScoreService<Score>>('UpdateScoreService')

    sinon.reset()
  })

  afterEach(() => {
    sinon.reset()
  })

  it('should be defined', () => {
    expect(service).not.to.be.undefined
  })

  describe('updateScore', () => {
    it('should return Score', async () => {
      // given
      const gameId = 1
      db.score.update.resolves(score)

      // when
      const result = await service.updateScore(gameId, scoreDTO)

      // then
      expect(result).to.be.deep.equal(score)
      expect(
        db.score.update.calledOnceWith({
          where: {
            gameId
          },
          data: {
            ...scoreDTO,
            homeTeamScore: 10,
            awayTeamScore: 14
          }
        })
      ).to.be.true
    })

    it('should pass ParameterValidationException when invalid dto passed [1]', async () => {
      // given
      const gameId = 1

      // then
      await expect(
        service.updateScore(gameId, invalidScoreDTO)
      ).to.be.rejectedWith(ParameterValidationException)
    })

    it('should pass ParameterValidationException when invalid dto passed [2]', async () => {
      // given
      const gameId = 1

      // then
      await expect(
        service.updateScore(gameId, invalidScoreDTO2)
      ).to.be.rejectedWith(ParameterValidationException)
    })

    it('should pass ParameterValidationException when invalid dto passed [3]', async () => {
      // given
      const gameId = 1

      // then
      await expect(
        service.updateScore(gameId, invalidScoreDTO3)
      ).to.be.rejectedWith(ParameterValidationException)
    })

    it('should throw EntityNotExistException when invalid gameId passed', async () => {
      // given
      const gameId = 1
      db.score.update.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P2025'
        })
      )

      // then
      await expect(service.updateScore(gameId, scoreDTO)).to.be.rejectedWith(
        EntityNotExistException
      )
    })

    it('should throw UnexpectedException when unexpected error occurs', async () => {
      // given
      const gameId = 1
      db.score.update.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P1001'
        })
      )

      // then
      await expect(service.updateScore(gameId, scoreDTO)).to.be.rejectedWith(
        UnexpectedException
      )
    })
  })
})
