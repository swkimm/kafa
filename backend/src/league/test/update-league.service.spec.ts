import { Test, type TestingModule } from '@nestjs/testing'
import {
  EntityNotExistException,
  ParameterValidationException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import { Prisma, type League } from '@prisma/client'
import { expect } from 'chai'
import * as sinon from 'sinon'
import type { UpdateLeagueDTO } from '../dto/update-league.dto'
import type { UpdateLeagueService } from '../interface/update-league.service.interface'
import { UpdateLeagueServiceImpl } from '../service/update-league.service'

describe('UpdateLeagueService', () => {
  const league: League = {
    id: 1,
    name: 'league01',
    associationId: 1,
    endedAt: new Date('2023-12-31'),
    startedAt: new Date('2023-01-01'),
    startedYear: 2023
  }

  const updateLeagueDTO: UpdateLeagueDTO = {
    startedAt: new Date('2023-01-01'),
    endedAt: new Date('2023-12-31')
  }

  const invalidUpdateLeagueDTO1: UpdateLeagueDTO = {
    startedAt: new Date('2024-12-31'),
    endedAt: new Date('2023-12-31')
  }

  const invalidUpdateLeagueDTO2: UpdateLeagueDTO = {
    startedAt: new Date('2024-12-31')
  }

  const invalidUpdateLeagueDTO3: UpdateLeagueDTO = {
    endedAt: new Date('2022-01-01')
  }

  const db = {
    league: {
      update: sinon.stub()
    }
  }

  const mockGetLeagueService = {
    getLeague: sinon.stub()
  }

  const mockLeagueSponserService = {
    createLeagueSponser: sinon.stub(),
    deleteLeagueSponser: sinon.stub()
  }

  let service: UpdateLeagueService<League>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'UpdateLeagueService',
          useClass: UpdateLeagueServiceImpl
        },
        { provide: 'GetLeagueService', useValue: mockGetLeagueService },
        {
          provide: PrismaService,
          useValue: db
        },
        {
          provide: 'LeagueSponserService',
          useValue: mockLeagueSponserService
        }
      ]
    }).compile()

    service = module.get<UpdateLeagueService<League>>('UpdateLeagueService')

    sinon.stub()
  })

  afterEach(() => {
    sinon.stub()
  })

  it('should be defined', () => {
    expect(service).not.to.be.undefined
  })

  describe('updateLeague', () => {
    it('should return league', async () => {
      // given
      const leagueId = 1
      db.league.update.resolves(league)
      mockGetLeagueService.getLeague.resolves(league)

      // when
      const result = await service.updateLeague(leagueId, updateLeagueDTO)

      // then
      expect(result).to.be.deep.equal(league)
      expect(
        db.league.update.calledOnceWith({
          where: {
            id: leagueId
          },
          data: {
            ...updateLeagueDTO,
            startedYear: updateLeagueDTO.startedAt.getFullYear()
          }
        })
      ).to.be.true
      expect(mockGetLeagueService.getLeague.calledOnceWith(leagueId)).to.be.true
    })

    it('should throw EntityNotExistException when invalid leagueId passed', async () => {
      // given
      const leagueId = 1
      db.league.update.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P2003'
        })
      )
      mockGetLeagueService.getLeague.resolves(league)

      // then
      await expect(
        service.updateLeague(leagueId, updateLeagueDTO)
      ).to.be.rejectedWith(EntityNotExistException)
    })

    it('should throw ParameterValidationException when startedAt over endedAt', async () => {
      // given
      const leagueId = 1
      mockGetLeagueService.getLeague.resolves(league)

      // then
      await expect(
        service.updateLeague(leagueId, invalidUpdateLeagueDTO1)
      ).to.be.rejectedWith(ParameterValidationException)
    })

    it('should throw ParameterValidationException when startedAt over endedAt', async () => {
      // given
      const leagueId = 1
      mockGetLeagueService.getLeague.resolves(league)

      // then
      await expect(
        service.updateLeague(leagueId, invalidUpdateLeagueDTO2)
      ).to.be.rejectedWith(ParameterValidationException)
    })

    it('should throw ParameterValidationException when startedAt over endedAt', async () => {
      // given
      const leagueId = 1
      mockGetLeagueService.getLeague.resolves(league)

      // then
      await expect(
        service.updateLeague(leagueId, invalidUpdateLeagueDTO3)
      ).to.be.rejectedWith(ParameterValidationException)
    })
  })

  describe('linkSponser', () => {
    it('should update league with paseed sponser', async () => {
      // given
      const leagueId = 1
      const sponserId = 1
      mockLeagueSponserService.createLeagueSponser.resolves()

      // when
      try {
        await service.linkSponser(leagueId, sponserId)
      } catch (error) {
        expect.fail()
      }

      // then
      expect(
        mockLeagueSponserService.createLeagueSponser.calledOnceWith({
          leagueId,
          sponserId
        })
      ).to.be.true
    })

    it('should pass BusinessException when instanceof BusinessException occurs', async () => {
      // given
      const leagueId = 1
      const sponserId = 1
      mockLeagueSponserService.createLeagueSponser.rejects(
        new EntityNotExistException('test')
      )

      // then
      await expect(service.linkSponser(leagueId, sponserId)).to.be.rejectedWith(
        EntityNotExistException
      )
    })
  })

  describe('unlinkSponser', () => {
    it('should delete leagueSponser', async () => {
      // given
      const leagueId = 1
      const sponserId = 1
      mockLeagueSponserService.deleteLeagueSponser.resolves()

      // when
      try {
        await service.unlinkSponser(leagueId, sponserId)
      } catch (error) {
        expect.fail()
      }

      // then
      expect(
        mockLeagueSponserService.deleteLeagueSponser.calledOnceWith(
          leagueId,
          sponserId
        )
      ).to.be.true
    })

    it('pass BusinessException when instanceof BusinessException occurs', async () => {
      // given
      const leagueId = 1
      const sponserId = 1
      mockLeagueSponserService.deleteLeagueSponser.rejects(
        new EntityNotExistException('test')
      )

      // then
      await expect(
        service.unlinkSponser(leagueId, sponserId)
      ).to.be.rejectedWith(EntityNotExistException)
    })
  })
})
