import { Test, type TestingModule } from '@nestjs/testing'
import {
  EntityNotExistException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { calculateOffset } from '@/common/pagination/calculate-offset'
import { PrismaService } from '@/prisma/prisma.service'
import {
  Prisma,
  type League,
  type Sponser,
  type LeagueSponser
} from '@prisma/client'
import { expect } from 'chai'
import * as sinon from 'sinon'
import type { GetLeagueService } from '../interface/get-league.service.interface'
import { GetLeagueServiceImpl } from '../service/get-league.service'

describe('GetLeagueService', () => {
  const leagues: League[] = [
    {
      id: 1,
      name: 'league01',
      associationId: 1,
      endedAt: new Date('2023-12-31'),
      startedAt: new Date('2023-01-01'),
      startedYear: 2023
    },
    {
      id: 2,
      name: 'league02',
      associationId: 1,
      endedAt: new Date('2023-12-31'),
      startedAt: new Date('2023-01-01'),
      startedYear: 2023
    }
  ]

  const sponsers: Sponser[] = [
    {
      id: 1,
      name: 'sponser01',
      profileImgUrl: '',
      websiteUrl: ''
    },
    {
      id: 2,
      name: 'sponser02',
      profileImgUrl: '',
      websiteUrl: ''
    },
    {
      id: 3,
      name: 'sponser03',
      profileImgUrl: '',
      websiteUrl: ''
    }
  ]

  const leagueSponsers: LeagueSponser[] = [
    {
      leagueId: 1,
      sponserId: 1
    },
    {
      leagueId: 1,
      sponserId: 2
    },
    {
      leagueId: 1,
      sponserId: 3
    }
  ]

  const db = {
    league: {
      findUniqueOrThrow: sinon.stub(),
      findMany: sinon.stub()
    }
  }

  const mockAssociationService = {
    getAssociation: sinon.stub()
  }

  const mockLeagueSponserService = {
    getLeagueSponsersByLeagueId: sinon.stub()
  }

  const mockSponserService = {
    getSponser: sinon.stub()
  }

  const mockTeamService = {
    getTeam: sinon.stub()
  }

  let service: GetLeagueService<League, Sponser>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'GetLeagueService',
          useClass: GetLeagueServiceImpl
        },
        {
          provide: PrismaService,
          useValue: db
        },
        {
          provide: 'AssociationService',
          useValue: mockAssociationService
        },
        {
          provide: 'LeagueSponserService',
          useValue: mockLeagueSponserService
        },
        {
          provide: 'TeamService',
          useValue: mockTeamService
        },
        {
          provide: 'SponserService',
          useValue: mockSponserService
        }
      ]
    }).compile()

    service = module.get<GetLeagueService<League, Sponser>>('GetLeagueService')

    sinon.reset()
  })

  afterEach(() => {
    sinon.reset()
  })

  it('should be defined', () => {
    expect(service).not.to.be.undefined
  })

  describe('getLeague', () => {
    it('should return league', async () => {
      // given
      const leagueId = 1
      db.league.findUniqueOrThrow.resolves(leagues[0])

      // when
      const result = await service.getLeague(leagueId)

      // then
      expect(result).to.be.deep.equal(leagues[0])
      expect(
        db.league.findUniqueOrThrow.calledOnceWith({
          where: {
            id: leagueId
          }
        })
      ).to.be.true
    })

    it('should throw EntityNotExistException when invalid leagueId passed', async () => {
      // given
      const leagueId = 1
      db.league.findUniqueOrThrow.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P2025'
        })
      )

      // then
      await expect(service.getLeague(leagueId)).to.be.rejectedWith(
        EntityNotExistException
      )
    })

    it('should throw UnexpectedException when unexpected error occurs', async () => {
      // given
      const leagueId = 1
      db.league.findUniqueOrThrow.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P1001'
        })
      )

      // then
      await expect(service.getLeague(leagueId)).to.be.rejectedWith(
        UnexpectedException
      )
    })
  })

  describe('getLeagues', () => {
    it('should return leagues', async () => {
      // given
      const page = 1
      const limit = 10
      db.league.findMany.resolves(leagues)

      // when
      const result = await service.getLeagues(page, limit)

      // then
      expect(result).to.be.deep.equal(leagues)
      expect(
        db.league.findMany.calledOnceWith({
          take: limit,
          skip: calculateOffset(page, limit),
          orderBy: {
            endedAt: 'desc'
          },
          include: {
            Association: {
              select: {
                id: true,
                name: true,
                profileImgUrl: true
              }
            }
          }
        })
      ).to.be.true
    })

    it('should throw UnexpectedException when unexpected error occurs', async () => {
      // given
      const page = 1
      const limit = 10
      db.league.findMany.rejects(new Error('test'))

      // then
      await expect(service.getLeagues(page, limit)).to.be.rejectedWith(
        UnexpectedException
      )
    })
  })

  describe('getLeaguesByAssociationId', () => {
    it('should return leagues', async () => {
      // given
      const associationId = 1
      const page = 1
      const limit = 10
      db.league.findMany.resolves(leagues)
      mockAssociationService.getAssociation.resolves()

      // when
      const result = await service.getLeaguesByAssociationId(
        associationId,
        page,
        limit
      )

      // then
      expect(result).to.be.deep.equal(leagues)
      expect(
        db.league.findMany.calledOnceWith({
          take: limit,
          skip: calculateOffset(page, limit),
          orderBy: {
            startedAt: 'desc'
          },
          where: {
            associationId
          }
        })
      ).to.be.true
      expect(
        mockAssociationService.getAssociation.calledOnceWith(associationId)
      ).to.be.true
    })

    it('should pass BusinessException when instanceof BusinessException passed', async () => {
      // given
      const associationId = 1
      const page = 1
      const limit = 10
      mockAssociationService.getAssociation.rejects(
        new EntityNotExistException('test')
      )

      // then
      await expect(
        service.getLeaguesByAssociationId(associationId, page, limit)
      ).to.be.rejectedWith(EntityNotExistException)
    })

    it('should throw UnexpectedException when unexpected error occurs', async () => {
      // given
      const associationId = 1
      const page = 1
      const limit = 10
      mockAssociationService.getAssociation.resolves()
      db.league.findMany.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P1001'
        })
      )

      // then
      await expect(
        service.getLeaguesByAssociationId(associationId, page, limit)
      ).to.be.rejectedWith(UnexpectedException)
    })
  })

  describe('getSponserByLeagueId', () => {
    it('should return sponsers', async () => {
      // given
      const leagueId = 1
      const page = 1
      const limit = 3
      db.league.findUniqueOrThrow.resolves()
      mockLeagueSponserService.getLeagueSponsersByLeagueId.resolves(
        leagueSponsers
      )
      mockSponserService.getSponser
        .onFirstCall()
        .resolves(sponsers[0])
        .onSecondCall()
        .resolves(sponsers[1])
        .onThirdCall()
        .resolves(sponsers[2])

      // when
      const result = await service.getSponsersByLeagueId(leagueId, page, limit)

      // then
      expect(result).to.be.deep.equal(sponsers)
      expect(
        mockLeagueSponserService.getLeagueSponsersByLeagueId.calledOnceWith(
          leagueId,
          page,
          limit
        )
      ).to.be.true
      expect(mockSponserService.getSponser.calledThrice).to.be.true
      expect(
        mockSponserService.getSponser.calledWithMatch(
          leagueSponsers[0].sponserId
        )
      ).to.be.true
      expect(
        mockSponserService.getSponser.calledWithMatch(
          leagueSponsers[1].sponserId
        )
      ).to.be.true
      expect(
        mockSponserService.getSponser.calledWithMatch(
          leagueSponsers[2].sponserId
        )
      ).to.be.true
    })

    it('should pass BusinessException when error instance of BusinessException occurs', async () => {
      // given
      const leagueId = 1
      const page = 1
      const limit = 3
      db.league.findUniqueOrThrow.resolves()
      mockLeagueSponserService.getLeagueSponsersByLeagueId.rejects(
        new EntityNotExistException('test')
      )

      // then
      await expect(
        service.getSponsersByLeagueId(leagueId, page, limit)
      ).to.be.rejectedWith(EntityNotExistException)
    })

    it('should throw UnexpectedException when unexpected error occurs', async () => {
      // given
      const leagueId = 1
      const page = 1
      const limit = 3
      mockLeagueSponserService.getLeagueSponsersByLeagueId.rejects(
        new Error('test')
      )

      // then
      await expect(
        service.getSponsersByLeagueId(leagueId, page, limit)
      ).to.be.rejectedWith(UnexpectedException)
    })
  })
})
