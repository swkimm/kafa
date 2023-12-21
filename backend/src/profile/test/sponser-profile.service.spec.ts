import { Test, type TestingModule } from '@nestjs/testing'
import {
  EntityNotExistException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { expect } from 'chai'
import * as sinon from 'sinon'
import type { SponserProfileService } from '../interface/sponser-profile.service.interface'
import { SponserProfileServiceImpl } from '../service/sponser-profile.service'

describe('SponserProfileService', () => {
  const mockSponserService = {
    getSponser: sinon.stub(),
    updateSponser: sinon.stub()
  }

  const mockImageStorageService = {
    uploadObject: sinon.stub(),
    deleteObject: sinon.stub()
  }

  const dummyFile: Express.Multer.File = {
    fieldname: 'dummy',
    originalname: 'dummy.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    buffer: Buffer.from(''),
    size: 1024,
    stream: null,
    destination: 'uploads/',
    filename: 'dummy.jpg',
    path: 'uploads/dummy.jpg'
  }

  let service: SponserProfileService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'SponserProfileService',
          useClass: SponserProfileServiceImpl
        },
        {
          provide: 'SponserService',
          useValue: mockSponserService
        },
        {
          provide: 'ImageStorageService',
          useValue: mockImageStorageService
        }
      ]
    }).compile()

    service = module.get<SponserProfileService>('SponserProfileService')

    sinon.reset()
  })

  afterEach(() => {
    sinon.reset()
  })

  it('should be defined', () => {
    expect(service).not.to.be.undefined
  })

  describe('upsertProfile', () => {
    it('should return url [1]', async () => {
      // given
      const sponserId = 1
      mockSponserService.getSponser.resolves({ profileImgUrl: 'test' })
      mockImageStorageService.uploadObject.resolves({ url: 'test' })

      // when
      const result = await service.upsertProfile(dummyFile, sponserId)

      // then
      expect(result).to.be.deep.equal('test')
      expect(mockSponserService.getSponser.calledOnceWith(sponserId)).to.be.true
      expect(mockImageStorageService.deleteObject.calledOnceWith('test')).to.be
        .true
      expect(
        mockImageStorageService.uploadObject.calledOnceWith(
          dummyFile,
          `sponser/${sponserId}/profile`
        )
      ).to.be.true
      expect(
        mockSponserService.updateSponser.calledOnceWith(sponserId, {
          profileImgUrl: 'test'
        })
      ).to.be.true
    })

    it('should return url [2]', async () => {
      // given
      const sponserId = 1
      mockSponserService.getSponser.resolves({ profileImgUrl: undefined })
      mockImageStorageService.uploadObject.resolves({ url: 'test' })

      // when
      const result = await service.upsertProfile(dummyFile, sponserId)

      // then
      expect(result).to.be.deep.equal('test')
      expect(mockSponserService.getSponser.calledOnceWith(sponserId)).to.be.true
      expect(mockImageStorageService.deleteObject.notCalled).to.be.true
      expect(
        mockImageStorageService.uploadObject.calledOnceWith(
          dummyFile,
          `sponser/${sponserId}/profile`
        )
      ).to.be.true
      expect(
        mockSponserService.updateSponser.calledOnceWith(sponserId, {
          profileImgUrl: 'test'
        })
      ).to.be.true
    })

    it('should pass BusinessException', async () => {
      // given
      const sponserId = 1
      mockSponserService.getSponser.rejects(new EntityNotExistException('test'))

      // then
      await expect(
        service.upsertProfile(dummyFile, sponserId)
      ).to.be.rejectedWith(EntityNotExistException)
    })

    it('should throw UnexpectedException when unexpected error occurs', async () => {
      // given
      const sponserId = 1
      mockSponserService.getSponser.rejects(new Error('test'))

      // then
      await expect(
        service.upsertProfile(dummyFile, sponserId)
      ).to.be.rejectedWith(UnexpectedException)
    })
  })
})
