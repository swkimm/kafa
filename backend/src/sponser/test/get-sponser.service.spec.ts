import { Test, type TestingModule } from '@nestjs/testing'
import {
  EntityNotExistException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { calculateOffset } from '@/common/pagination/calculate-offset'
import { PrismaService } from '@/prisma/prisma.service'
import { Prisma, type Sponser } from '@prisma/client'
import { expect } from 'chai'
import * as sinon from 'sinon'
import type { GetSponserService } from '../interface/get-sponser.service.interface'
import { GetSponserServiceImpl } from '../service/get-sponser.service'

describe('GetSponserService', () => {
  const sponsers: Sponser[] = [
    {
      id: 1,
      name: 'sponser01',
      websiteUrl: '',
      profileImgUrl: ''
    },
    {
      id: 2,
      name: 'sponser02',
      websiteUrl: '',
      profileImgUrl: ''
    }
  ]

  const db = {
    sponser: {
      findUniqueOrThrow: sinon.stub(),
      findMany: sinon.stub()
    }
  }

  let service: GetSponserService<Sponser>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PrismaService,
          useValue: db
        },
        {
          provide: 'GetSponserService',
          useClass: GetSponserServiceImpl
        }
      ]
    }).compile()

    service = module.get<GetSponserService<Sponser>>('GetSponserService')

    sinon.reset()
  })

  afterEach(() => {
    sinon.reset()
  })

  it('should be defined', () => {
    expect(service).not.to.be.undefined
  })

  it('should return sponser', async () => {
    // given
    const sponserId = 1
    db.sponser.findUniqueOrThrow.resolves(sponsers[0])

    // when
    const result = await service.getSponser(sponserId)

    // then
    expect(result).to.be.deep.equal(sponsers[0])
    expect(
      db.sponser.findUniqueOrThrow.calledOnceWith({
        where: {
          id: sponserId
        }
      })
    ).to.be.true
  })

  it('should throw EntityNotExistException when invalid sponserId passed', async () => {
    // given
    const sponserId = 1
    db.sponser.findUniqueOrThrow.rejects(
      new Prisma.PrismaClientKnownRequestError('test', {
        clientVersion: '1.0.0',
        code: 'P2025'
      })
    )

    // then
    await expect(service.getSponser(sponserId)).to.be.rejectedWith(
      EntityNotExistException
    )
  })

  it('should throw UnexpectedException when unexpected error occurs', async () => {
    // given
    const sponserId = 1
    db.sponser.findUniqueOrThrow.rejects(
      new Prisma.PrismaClientKnownRequestError('test', {
        clientVersion: '1.0.0',
        code: 'P1001'
      })
    )

    // then
    await expect(service.getSponser(sponserId)).to.be.rejectedWith(
      UnexpectedException
    )
  })

  describe('getSponsers', () => {
    it('should return sponsers', async () => {
      // given
      const page = 1
      const limit = 10
      db.sponser.findMany.resolves(sponsers)

      // when
      const result = await service.getSponsers(page, limit)

      // then
      expect(result).to.be.deep.equal(sponsers)
      expect(
        db.sponser.findMany.calledOnceWith({
          take: limit,
          skip: calculateOffset(page, limit),
          orderBy: {
            name: 'asc'
          }
        })
      ).to.be.true
    })

    it('should throw UnexpectedException when unexpected error occurs', async () => {
      // given
      const page = 1
      const limit = 10
      db.sponser.findMany.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P1001'
        })
      )

      // then
      await expect(service.getSponsers(page, limit)).to.be.rejectedWith(
        UnexpectedException
      )
    })
  })
})
