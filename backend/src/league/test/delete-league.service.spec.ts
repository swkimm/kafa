import { Test, type TestingModule } from '@nestjs/testing'
import { EntityNotExistException } from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import { Prisma, type League } from '@prisma/client'
import { expect } from 'chai'
import * as sinon from 'sinon'
import type { DeleteLeagueService } from '../interface/delete-league.service.interface'
import { DeleteLeagueServiceImpl } from '../service/delete-league.service'

describe('DeleteLeagueService', () => {
  const league: League = {
    id: 1,
    name: 'league01',
    associationId: 1,
    endedAt: new Date('2023-12-31'),
    startedAt: new Date('2023-01-01'),
    startedYear: 2023
  }

  const db = {
    league: {
      delete: sinon.stub()
    }
  }

  let service: DeleteLeagueService<League>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'DeleteLeagueService',
          useClass: DeleteLeagueServiceImpl
        },
        {
          provide: PrismaService,
          useValue: db
        }
      ]
    }).compile()

    service = module.get<DeleteLeagueService<League>>('DeleteLeagueService')

    sinon.stub()
  })

  afterEach(() => {
    sinon.stub()
  })

  it('should be defined', () => {
    expect(service).not.to.be.undefined
  })

  describe('deleteLeague', () => {
    it('should return league', async () => {
      // given
      const leagueId = 1
      db.league.delete.resolves(league)

      // when
      const result = await service.deleteLeague(leagueId)

      // then
      expect(result).to.be.deep.equal(league)
      expect(
        db.league.delete.calledOnceWith({
          where: {
            id: leagueId
          }
        })
      ).to.be.true
    })

    it('should throw EntityNotExistException when invalid leagueId passed', async () => {
      // when
      const leagueId = 1
      db.league.delete.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P2025'
        })
      )

      // then
      expect(service.deleteLeague(leagueId)).to.be.rejectedWith(
        EntityNotExistException
      )
    })

    it('should throw UnexpectedException when unexpected error occurs', async () => {
      // when
      const leagueId = 1
      db.league.delete.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P1001'
        })
      )

      // then
      expect(service.deleteLeague(leagueId)).to.be.rejectedWith(
        EntityNotExistException
      )
    })
  })
})
