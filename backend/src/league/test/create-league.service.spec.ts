import { Test, type TestingModule } from '@nestjs/testing'
import {
  EntityNotExistException,
  ParameterValidationException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import { Prisma, type League } from '@prisma/client'
import { expect } from 'chai'
import { describe } from 'mocha'
import * as sinon from 'sinon'
import type { CreateLeagueDTO } from '../dto/create-league.dto'
import type { CreateLeagueService } from '../interface/create-league.service.interface'
import { CreateLeagueServiceImpl } from '../service/create-league.service'

describe('CreateLeagueService', () => {
  const league: League = {
    id: 1,
    name: 'league01',
    associationId: 1,
    endedAt: new Date('2023-12-31'),
    startedAt: new Date('2023-01-01'),
    startedYear: 2023
  }

  const createLeagueDTO: CreateLeagueDTO = {
    name: 'league02',
    associationId: 1,
    endedAt: new Date('2023-12-31'),
    startedAt: new Date('2023-01-01')
  }

  const invalidCreateLeagueDTO: CreateLeagueDTO = {
    name: 'league03',
    associationId: 1,
    endedAt: new Date('2023-01-01'),
    startedAt: new Date('2023-12-31')
  }

  const db = {
    league: {
      create: sinon.stub()
    }
  }

  const mockLeagueSponserService = {}
  const mockLeagueService = {}

  let service: CreateLeagueService<League>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'CreateLeagueService',
          useClass: CreateLeagueServiceImpl
        },
        {
          provide: PrismaService,
          useValue: db
        },
        {
          provide: 'LeagueSponserService',
          useValue: mockLeagueSponserService
        },
        {
          provide: 'SponserService',
          useValue: mockLeagueService
        }
      ]
    }).compile()

    service = module.get<CreateLeagueService<League>>('CreateLeagueService')

    sinon.stub()
  })

  afterEach(() => {
    sinon.stub()
  })

  it('should be defined', () => {
    expect(service).not.to.be.undefined
  })

  describe('createLeague', () => {
    it('should return league', async () => {
      // given
      db.league.create.resolves(league)

      // when
      const result = await service.createLeague(createLeagueDTO)

      // then
      expect(result).to.be.deep.equal(result)
      expect(
        db.league.create.calledOnceWith({
          data: {
            ...createLeagueDTO,
            startedYear: createLeagueDTO.startedAt.getFullYear()
          }
        })
      ).to.be.true
    })

    it('should throw ParameterValidationException when startedAt over endedAt', async () => {
      // then
      await expect(
        service.createLeague(invalidCreateLeagueDTO)
      ).to.be.rejectedWith(ParameterValidationException)
    })

    it('should throw EntityNotExistException when invalid associationId passed', async () => {
      // given
      db.league.create.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P2003'
        })
      )

      // then
      await expect(service.createLeague(createLeagueDTO)).to.be.rejectedWith(
        EntityNotExistException
      )
    })

    it('should throw UnexpectedException when unexpected error occurs', async () => {
      // given
      db.league.create.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P1001'
        })
      )

      // then
      await expect(service.createLeague(createLeagueDTO)).to.be.rejectedWith(
        UnexpectedException
      )
    })
  })
})
