import { Test, type TestingModule } from '@nestjs/testing'
import {
  ConflictFoundException,
  EntityNotExistException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { calculateOffset } from '@/common/pagination/calculate-offset'
import { PrismaService } from '@/prisma/prisma.service'
import { Prisma, type LeagueSponser } from '@prisma/client'
import { expect } from 'chai'
import * as sinon from 'sinon'
import type { CreateLeagueSponserDTO } from '../dto/create-league-sponser.dto'
import type { UpdateLeagueSponserDTO } from '../dto/update-league-sponser.dto'
import { LeagueSponserServiceImpl } from '../league-sponser.service'
import type { LeagueSponserService } from '../league-sponser.service.interface'

describe('LeagueSponserService', () => {
  const db = {
    leagueSponser: {
      findUniqueOrThrow: sinon.stub(),
      findMany: sinon.stub(),
      update: sinon.stub(),
      delete: sinon.stub(),
      create: sinon.stub()
    }
  }

  const leagueSponsers: LeagueSponser[] = [
    {
      leagueId: 1,
      sponserId: 1
    },
    {
      leagueId: 1,
      sponserId: 2
    }
  ]

  let service: LeagueSponserService<LeagueSponser>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: 'LeagueSponserService', useClass: LeagueSponserServiceImpl },
        { provide: PrismaService, useValue: db }
      ]
    }).compile()

    service = module.get<LeagueSponserService<LeagueSponser>>(
      'LeagueSponserService'
    )

    sinon.reset()
  })

  afterEach(() => {
    sinon.reset()
  })

  it('should be defined', () => {
    expect(service).not.to.be.undefined
  })

  describe('getLeagueSponser', () => {
    it('should return association', async () => {
      // given
      const leagueId = 1
      const sponserId = 1
      db.leagueSponser.findUniqueOrThrow.resolves(leagueSponsers[0])

      // when
      const result = await service.getLeagueSponser(leagueId, sponserId)

      // then
      expect(result).to.be.deep.equal(leagueSponsers[0])
      expect(
        db.leagueSponser.findUniqueOrThrow.calledOnceWith({
          where: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            leagueId_sponserId: {
              leagueId,
              sponserId
            }
          }
        })
      ).to.be.true
    })

    it('should throw EntityNotExistException when invalid leagueId and sponserId', async () => {
      // given
      const leagueId = 1
      const sponserId = 1
      db.leagueSponser.findUniqueOrThrow.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P2025'
        })
      )

      // then
      await expect(
        service.getLeagueSponser(leagueId, sponserId)
      ).to.be.rejectedWith(EntityNotExistException)
    })

    it('should throw UnexpectedException when unexpected error occurs', async () => {
      // given
      const leagueId = 1
      const sponserId = 1
      db.leagueSponser.findUniqueOrThrow.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P1001'
        })
      )

      // then
      await expect(
        service.getLeagueSponser(leagueId, sponserId)
      ).to.be.rejectedWith(UnexpectedException)
    })
  })

  describe('getLeagueSponsersBySponserId', () => {
    it('should return leagueSponsers', async () => {
      // given
      const sponserId = 1
      const page = 1
      const limit = 10
      db.leagueSponser.findMany.resolves(leagueSponsers)

      // when
      const result = await service.getLeagueSponsersBySponserId(
        sponserId,
        page,
        limit
      )

      // then
      expect(result).to.be.deep.equal(leagueSponsers)
      expect(
        db.leagueSponser.findMany.calledOnceWith({
          skip: calculateOffset(page, limit),
          take: limit,
          where: {
            sponserId
          }
        })
      ).to.be.true
    })

    it('should throw UnexpectedException when unexpected error occurs', async () => {
      // given
      const sponserId = 1
      const page = 1
      const limit = 10
      db.leagueSponser.findMany.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P1001'
        })
      )

      // then
      expect(
        service.getLeagueSponsersBySponserId(sponserId, page, limit)
      ).to.be.rejectedWith(UnexpectedException)
    })
  })

  describe('getLeagueSponserByLeagueId', () => {
    it('should return leagueSponsers', async () => {
      // given
      const leagueId = 1
      const page = 1
      const limit = 10
      db.leagueSponser.findMany.resolves(leagueSponsers)

      // when
      const result = await service.getLeagueSponsersByLeagueId(
        leagueId,
        page,
        limit
      )

      // then
      expect(result).to.be.deep.equal(leagueSponsers)
      expect(
        db.leagueSponser.findMany.calledOnceWith({
          skip: calculateOffset(page, limit),
          take: limit,
          where: {
            leagueId
          }
        })
      ).to.be.true
    })

    it('should throw UnexpectedException when unexpected error occurs', async () => {
      // given
      const leagueId = 1
      const page = 1
      const limit = 10
      db.leagueSponser.findMany.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P1001'
        })
      )

      // then
      expect(
        service.getLeagueSponsersByLeagueId(leagueId, page, limit)
      ).to.be.rejectedWith(UnexpectedException)
    })
  })

  describe('createLeagueSponser', () => {
    it('should return leagueSponser', async () => {
      // given
      const leagueSponserDTO: CreateLeagueSponserDTO = {
        leagueId: 1,
        sponserId: 1
      }
      db.leagueSponser.create.resolves(leagueSponsers[0])

      // when
      const result = await service.createLeagueSponser(leagueSponserDTO)

      // then
      expect(result).to.be.deep.equal(leagueSponsers[0])
      expect(
        db.leagueSponser.create.calledOnceWith({
          data: {
            ...leagueSponserDTO
          }
        })
      ).to.be.true
    })

    it('should throw EntityNotExistException when invalid leagueId or sponserId passed', async () => {
      // given
      const leagueSponserDTO: CreateLeagueSponserDTO = {
        leagueId: 1,
        sponserId: 1
      }
      db.leagueSponser.create.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P2003'
        })
      )

      // then
      expect(service.createLeagueSponser(leagueSponserDTO)).to.be.rejectedWith(
        EntityNotExistException
      )
    })

    it('should throw ConflictFoundException when exist leagueId and sponserId passed', async () => {
      // given
      const leagueSponserDTO: CreateLeagueSponserDTO = {
        leagueId: 1,
        sponserId: 1
      }
      db.leagueSponser.create.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P2002'
        })
      )

      // then
      expect(service.createLeagueSponser(leagueSponserDTO)).to.be.rejectedWith(
        ConflictFoundException
      )
    })

    it('should throw UnexpectedException when unexpected error occurs', async () => {
      // given
      const leagueSponserDTO: CreateLeagueSponserDTO = {
        leagueId: 1,
        sponserId: 1
      }
      db.leagueSponser.create.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P1001'
        })
      )

      // then
      expect(service.createLeagueSponser(leagueSponserDTO)).to.be.rejectedWith(
        UnexpectedException
      )
    })
  })

  describe('updateLeagueSponser', () => {
    it('should return leagueSponser', async () => {
      const leagueSponserDTO: UpdateLeagueSponserDTO = {
        leagueId: 1,
        sponserId: 2
      }
      const leagueId = 1
      const sponserId = 1
      db.leagueSponser.update.resolves(leagueSponsers[0])

      // when
      const result = await service.updateLeagueSponser(
        leagueId,
        sponserId,
        leagueSponserDTO
      )

      // then
      expect(result).to.be.deep.equal(leagueSponsers[0])
      expect(
        db.leagueSponser.update.calledOnceWith({
          where: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            leagueId_sponserId: {
              leagueId,
              sponserId
            }
          },
          data: {
            ...leagueSponserDTO
          }
        })
      ).to.be.true
    })

    it('should throw EntityNotExistException when invalid leagueId and sponserId passed', async () => {
      // given
      const leagueSponserDTO: UpdateLeagueSponserDTO = {
        leagueId: 1,
        sponserId: 2
      }
      const leagueId = 1
      const sponserId = 1
      db.leagueSponser.update.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P2025'
        })
      )

      // then
      expect(
        service.updateLeagueSponser(leagueId, sponserId, leagueSponserDTO)
      ).to.be.rejectedWith(EntityNotExistException)
    })

    it('should throw EntityNotExistException when dto has exist leagueId and sponserId', async () => {
      // given
      const leagueSponserDTO: UpdateLeagueSponserDTO = {
        leagueId: 1,
        sponserId: 1
      }
      const leagueId = 1
      const sponserId = 1
      db.leagueSponser.update.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P2002'
        })
      )

      // then
      expect(
        service.updateLeagueSponser(leagueId, sponserId, leagueSponserDTO)
      ).to.be.rejectedWith(ConflictFoundException)
    })

    it('should throw UnexpectedException when unexpected error occurs', async () => {
      // given
      const leagueSponserDTO: UpdateLeagueSponserDTO = {
        leagueId: 1,
        sponserId: 1
      }
      const leagueId = 1
      const sponserId = 1
      db.leagueSponser.update.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: '1001'
        })
      )

      // then
      expect(
        service.updateLeagueSponser(leagueId, sponserId, leagueSponserDTO)
      ).to.be.rejectedWith(UnexpectedException)
    })
  })

  describe('createLeagueSponser', () => {})

  describe('deleteLeagueSponser', () => {
    it('should return leagueSponser', async () => {
      // given
      const leagueId = 1
      const sponserId = 1
      db.leagueSponser.delete.resolves(leagueSponsers[0])

      // when
      const result = await service.deleteLeagueSponser(leagueId, sponserId)

      // then
      expect(result).to.be.deep.equal(leagueSponsers[0])
      expect(
        db.leagueSponser.delete.calledOnceWith({
          where: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            leagueId_sponserId: {
              leagueId,
              sponserId
            }
          }
        })
      ).to.be.true
    })

    it('should throw EntityNotExistException when invalid leagueId and sponserId passed', async () => {
      // given
      const leagueId = 1
      const sponserId = 1
      db.leagueSponser.delete.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P2025'
        })
      )

      // then
      await expect(
        service.deleteLeagueSponser(leagueId, sponserId)
      ).to.be.rejectedWith(EntityNotExistException)
    })

    it('should throw UnexpectedException when unexpected error occurs', async () => {
      // given
      const leagueId = 1
      const sponserId = 1
      db.leagueSponser.delete.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P1001'
        })
      )

      // then
      await expect(
        service.deleteLeagueSponser(leagueId, sponserId)
      ).to.be.rejectedWith(UnexpectedException)
    })
  })
})
