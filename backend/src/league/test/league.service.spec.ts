import { Test, type TestingModule } from '@nestjs/testing'
import type { League, Sponser } from '@prisma/client'
import { expect } from 'chai'
import * as sinon from 'sinon'
import type { LeagueService } from '../abstract/league.service'
import type { CreateLeagueDTO } from '../dto/create-league.dto'
import type { UpdateLeagueDTO } from '../dto/update-league.dto'
import { LeagueServiceImpl } from '../service/league.service'

describe('LeagueService', () => {
  const leagues: League[] = [
    {
      id: 1,
      name: 'league01',
      associationId: 1,
      endedAt: new Date('2023-12-31'),
      startedAt: new Date('2023-01-01')
    },
    {
      id: 2,
      name: 'league02',
      associationId: 1,
      endedAt: new Date('2023-12-31'),
      startedAt: new Date('2023-01-01')
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

  const createLeagueDTO: CreateLeagueDTO = {
    name: 'league01',
    associationId: 1,
    endedAt: new Date('2023-12-31'),
    startedAt: new Date('2023-01-01')
  }

  const updateLeagueDTO: UpdateLeagueDTO = {
    startedAt: new Date('2023-01-01'),
    endedAt: new Date('2023-12-31')
  }

  const mockGetLeagueService = {
    getLeague: sinon.stub(),
    getLeaguesByAssociationId: sinon.stub(),
    getSponsersByLeagueId: sinon.stub()
  }

  const mockDeleteLeagueService = {
    deleteLeague: sinon.stub()
  }

  const mockUpdateLeagueService = {
    updateLeague: sinon.stub(),
    linkSponser: sinon.stub(),
    unlinkSponser: sinon.stub()
  }

  const mockCreateLeagueService = {
    createLeague: sinon.stub()
  }

  let service: LeagueService<League, Sponser>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'GetLeagueService',
          useValue: mockGetLeagueService
        },
        {
          provide: 'DeleteLeagueService',
          useValue: mockDeleteLeagueService
        },
        {
          provide: 'UpdateLeagueService',
          useValue: mockUpdateLeagueService
        },
        {
          provide: 'CreateLeagueService',
          useValue: mockCreateLeagueService
        },
        {
          provide: 'LeagueService',
          useClass: LeagueServiceImpl
        }
      ]
    }).compile()

    service = module.get<LeagueService<League, Sponser>>('LeagueService')

    sinon.stub()
  })

  afterEach(() => {
    sinon.stub()
  })

  it('should be defined', () => {
    expect(service).not.to.be.undefined
  })

  describe('getLeague', () => {
    it('should return league', async () => {
      // given
      const leagueId = 1
      mockGetLeagueService.getLeague.resolves(leagues[0])

      // when
      const result = await service.getLeague(leagueId)

      // then
      expect(result).to.be.deep.equal(leagues[0])
      expect(mockGetLeagueService.getLeague.calledOnceWith(leagueId)).to.be.true
    })
  })

  describe('getLeaguesByAssociationId', () => {
    it('should return leagues', async () => {
      // given
      const associationId = 1
      const page = 1
      const limit = 10
      mockGetLeagueService.getLeaguesByAssociationId.resolves(leagues)

      // when
      const result = await service.getLeaguesByAssociationId(
        associationId,
        page,
        limit
      )

      // then
      expect(result).to.be.deep.equal(leagues)
      expect(
        mockGetLeagueService.getLeaguesByAssociationId.calledOnceWith(
          associationId,
          page,
          limit
        )
      ).to.be.true
    })
  })

  describe('getSponsersByLeagueId', () => {
    it('should return sponsers', async () => {
      // given
      const leagueId = 1
      const page = 1
      const limit = 10
      mockGetLeagueService.getSponsersByLeagueId.resolves(sponsers)

      // when
      const result = await service.getSponsersByLeagueId(leagueId, page, limit)

      // then
      expect(result).to.be.deep.equal(sponsers)
      expect(
        mockGetLeagueService.getSponsersByLeagueId.calledOnceWith(
          leagueId,
          page,
          limit
        )
      ).to.be
    })
  })

  describe('createLeague', () => {
    it('should return league', async () => {
      // given
      mockCreateLeagueService.createLeague.resolves(leagues[0])

      // when
      const result = await service.createLeague(createLeagueDTO)

      // then
      expect(result).to.be.deep.equal(leagues[0])
      expect(
        mockCreateLeagueService.createLeague.calledOnceWith(createLeagueDTO)
      ).to.be.true
    })
  })

  describe('updateLeague', () => {
    it('should return league', async () => {
      // given
      const leagueId = 1
      mockUpdateLeagueService.updateLeague.resolves(leagues[0])

      // when
      const result = await service.updateLeague(leagueId, updateLeagueDTO)

      // then
      expect(result).to.be.deep.equal(leagues[0])
      expect(
        mockUpdateLeagueService.updateLeague.calledOnceWith(
          leagueId,
          updateLeagueDTO
        )
      ).to.be.true
    })
  })

  describe('linkSponser', () => {
    it('should update link', async () => {
      // given
      const leagueId = 1
      const sponserId = 1
      mockUpdateLeagueService.linkSponser.resolves()

      // when
      try {
        await service.linkSponser(leagueId, sponserId)
      } catch (error) {
        expect.fail()
      }

      // then
      expect(
        mockUpdateLeagueService.linkSponser.calledOnceWith(leagueId, sponserId)
      ).to.be.true
    })
  })

  describe('unlinkSponser', () => {
    it('should update link', async () => {
      // given
      const leagueId = 1
      const sponserId = 1
      mockUpdateLeagueService.unlinkSponser.resolves()

      // when
      try {
        await service.unlinkSponser(leagueId, sponserId)
      } catch (error) {
        expect.fail()
      }

      // then
      expect(
        mockUpdateLeagueService.unlinkSponser.calledOnceWith(
          leagueId,
          sponserId
        )
      ).to.be.true
    })
  })

  describe('deleteLeague', () => {
    it('should return league', async () => {
      // given
      const leagueId = 1
      mockDeleteLeagueService.deleteLeague.resolves(leagues[0])

      // when
      const result = await service.deleteLeague(leagueId)

      // then
      expect(result).to.be.deep.equal(leagues[0])
      expect(mockDeleteLeagueService.deleteLeague.calledOnceWith(leagueId)).to
        .be.true
    })
  })
})
