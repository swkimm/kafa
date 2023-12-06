import { Test, type TestingModule } from '@nestjs/testing'
import { UnexpectedException } from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import { Prisma, type Sponser } from '@prisma/client'
import { expect } from 'chai'
import * as sinon from 'sinon'
import type { CreateSponserDTO } from '../dto/create-sponser.dto'
import type { CreateSponserService } from '../interface/create-sponser.service.interface'
import { CreateSponserServiceImpl } from '../service/create-sponser.service'

describe('CreateSponserService', () => {
  const sponserDTO: CreateSponserDTO = {
    name: 'sponser01',
    websiteUrl: '',
    profileImgUrl: ''
  }

  const sponser: Sponser = {
    id: 1,
    name: 'sponser01',
    websiteUrl: '',
    profileImgUrl: ''
  }

  const db = {
    sponser: {
      create: sinon.stub()
    }
  }

  let service: CreateSponserService<Sponser>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PrismaService,
          useValue: db
        },
        {
          provide: 'CreateSponserService',
          useClass: CreateSponserServiceImpl
        }
      ]
    }).compile()

    service = module.get<CreateSponserService<Sponser>>('CreateSponserService')

    sinon.reset()
  })

  afterEach(() => {
    sinon.reset()
  })

  it('should be defined', () => {
    expect(service).not.to.be.undefined
  })

  describe('createSponser', () => {
    it('should return sponser', async () => {
      // given
      db.sponser.create.resolves(sponser)

      // when
      const result = await service.createSponser(sponserDTO)

      // then
      expect(result).to.be.deep.equal(sponser)
      expect(
        db.sponser.create.calledOnceWith({
          data: sponserDTO
        })
      ).to.be.true
    })

    it('should throw UnexpectedException when unexpected error occurs', async () => {
      // given
      db.sponser.create.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P1001'
        })
      )

      // then
      await expect(service.createSponser(sponserDTO)).to.be.rejectedWith(
        UnexpectedException
      )
    })
  })
})
