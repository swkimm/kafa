import { Test, type TestingModule } from '@nestjs/testing'
import {
  EntityNotExistException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import { Prisma, type Sponser } from '@prisma/client'
import { expect } from 'chai'
import * as sinon from 'sinon'
import type { DeleteSponserService } from '../interface/delete-sponser.service.interface'
import { DeleteSponserServiceImpl } from '../service/delete-sponser.service'

describe('DeleteSponserService', () => {
  const sponser: Sponser = {
    id: 1,
    name: 'sponser01',
    websiteUrl: '',
    profileImgUrl: ''
  }

  const db = {
    sponser: {
      delete: sinon.stub()
    }
  }

  let service: DeleteSponserService<Sponser>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PrismaService,
          useValue: db
        },
        {
          provide: 'DeleteSponserService',
          useClass: DeleteSponserServiceImpl
        }
      ]
    }).compile()

    service = module.get<DeleteSponserService<Sponser>>('DeleteSponserService')

    sinon.reset()
  })

  afterEach(() => {
    sinon.reset()
  })

  it('should be defined', () => {
    expect(service).not.to.be.undefined
  })

  describe('deleteSponser', () => {
    it('should return sponser', async () => {
      // given
      const sponserId = 1
      db.sponser.delete.resolves(sponser)

      // when
      const result = await service.deleteSponser(sponserId)

      // then
      expect(result).to.be.deep.equal(sponser)
      expect(
        db.sponser.delete.calledOnceWith({
          where: {
            id: sponserId
          }
        })
      ).to.be.true
    })

    it('should throw EntityNotExistException when invalid sponserId passed', async () => {
      // given
      const sponserId = 1
      db.sponser.delete.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P2025'
        })
      )

      // then
      await expect(service.deleteSponser(sponserId)).to.be.rejectedWith(
        EntityNotExistException
      )
    })

    it('should throw UnexpectedException when unexpected error occurs', async () => {
      // given
      const sponserId = 1
      db.sponser.delete.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P1001'
        })
      )

      // then
      await expect(service.deleteSponser(sponserId)).to.be.rejectedWith(
        UnexpectedException
      )
    })
  })
})
