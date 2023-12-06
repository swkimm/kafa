import { Test, type TestingModule } from '@nestjs/testing'
import {
  EntityNotExistException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import { Prisma, type Sponser } from '@prisma/client'
import { expect } from 'chai'
import * as sinon from 'sinon'
import type { UpdateSponserDTO } from '../dto/update-sponser.dto'
import type { UpdateSponserService } from '../interface/update-sponser.service.interface'
import { UpdateSponserServiceImpl } from '../service/update-sponser.service'

describe('UpdateSponserService', () => {
  const sponserDTO: UpdateSponserDTO = {
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
      update: sinon.stub()
    }
  }

  let service: UpdateSponserService<Sponser>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PrismaService,
          useValue: db
        },
        {
          provide: 'UpdateSponserService',
          useClass: UpdateSponserServiceImpl
        }
      ]
    }).compile()

    service = module.get<UpdateSponserService<Sponser>>('UpdateSponserService')

    sinon.reset()
  })

  afterEach(() => {
    sinon.reset()
  })

  it('should be defined', () => {
    expect(service).not.to.be.undefined
  })

  describe('updateSponser', () => {
    it('should return sponser', async () => {
      // given
      const sponserId = 1
      db.sponser.update.resolves(sponser)

      // when
      const result = await service.updateSponser(sponserId, sponserDTO)

      // then
      expect(result).to.be.deep.equal(sponser)
      expect(
        db.sponser.update.calledOnceWith({
          where: {
            id: sponserId
          },
          data: {
            ...sponserDTO
          }
        })
      ).to.be.true
    })

    it('should throw EntityNotExistException when invalid sponserId passed', async () => {
      // given
      const sponserId = 1
      db.sponser.update.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P2025'
        })
      )

      // then
      await expect(
        service.updateSponser(sponserId, sponserDTO)
      ).to.be.rejectedWith(EntityNotExistException)
    })

    it('should throw UnexpectedException when unexpected error occurs', async () => {
      // given
      const sponserId = 1
      db.sponser.update.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P1001'
        })
      )

      // then
      await expect(
        service.updateSponser(sponserId, sponserDTO)
      ).to.be.rejectedWith(UnexpectedException)
    })
  })
})
