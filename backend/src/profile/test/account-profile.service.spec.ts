import { Test, type TestingModule } from '@nestjs/testing'
import {
  EntityNotExistException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { expect } from 'chai'
import * as sinon from 'sinon'
import type { AccountProfileService } from '../interface/account-profile.service.interface'
import { AccountProfileServiceImpl } from '../service/account-profile.service'

describe('AccountProfileService', () => {
  const mockAccountService = {
    getAccountProfile: sinon.stub(),
    updateAccountProfile: sinon.stub()
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

  let service: AccountProfileService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'AccountProfileService',
          useClass: AccountProfileServiceImpl
        },
        {
          provide: 'AccountService',
          useValue: mockAccountService
        },
        {
          provide: 'ImageStorageService',
          useValue: mockImageStorageService
        }
      ]
    }).compile()

    service = module.get<AccountProfileService>('AccountProfileService')

    sinon.reset()
  })

  afterEach(() => {
    sinon.reset()
  })

  it('should be defined', () => {
    expect(service).not.to.be.undefined
  })

  describe('upsertProfile', () => {
    it('should return url', async () => {
      // given
      const accountId = 1
      mockImageStorageService.uploadObject.resolves({ url: 'test' })
      mockAccountService.getAccountProfile.resolves({ profileImgUrl: 'test' })

      // when
      const result = await service.upsertProfile(dummyFile, accountId)

      // then
      expect(result).to.be.deep.equal('test')
      expect(
        mockImageStorageService.uploadObject.calledOnceWith(
          dummyFile,
          `account/${accountId}/profile`
        )
      ).to.be.true
      expect(mockAccountService.getAccountProfile.calledOnceWith(accountId)).to
        .be.true
      expect(mockImageStorageService.deleteObject.calledOnceWith('test')).to.be
        .true
      expect(
        mockAccountService.updateAccountProfile.calledOnceWith(
          { profileImgUrl: 'test' },
          accountId
        )
      ).to.be.true
    })

    it('should return url', async () => {
      // given
      const accountId = 1
      mockImageStorageService.uploadObject.resolves({ url: 'test' })
      mockAccountService.getAccountProfile.resolves({
        profileImgUrl: undefined
      })

      // when
      const result = await service.upsertProfile(dummyFile, accountId)

      // then
      expect(result).to.be.deep.equal('test')
      expect(
        mockImageStorageService.uploadObject.calledOnceWith(
          dummyFile,
          `account/${accountId}/profile`
        )
      ).to.be.true
      expect(mockAccountService.getAccountProfile.calledOnceWith(accountId)).to
        .be.true
      expect(mockImageStorageService.deleteObject.notCalled).to.be.true
      expect(
        mockAccountService.updateAccountProfile.calledOnceWith(
          { profileImgUrl: 'test' },
          accountId
        )
      ).to.be.true
    })

    it('should pass BusinessException when error instanceof BusinessException occurs', async () => {
      // given
      const accountId = 1
      mockAccountService.getAccountProfile.rejects(
        new EntityNotExistException('test')
      )

      // then
      await expect(
        service.upsertProfile(dummyFile, accountId)
      ).to.be.rejectedWith(EntityNotExistException)
    })

    it('should throw UnexpectedException when unexpected error occurs', async () => {
      // given
      const accountId = 1
      mockAccountService.getAccountProfile.rejects(new Error('test'))

      // then
      await expect(
        service.upsertProfile(dummyFile, accountId)
      ).to.be.rejectedWith(UnexpectedException)
    })
  })
})
