import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Test, type TestingModule } from '@nestjs/testing'
import { emailVerificationCacheKey } from '@/common/cache/cache-keys'
import {
  CacheException,
  EmptyParameterException
} from '@/common/exception/business.exception'
import { type Account, AccountStatus, Role } from '@prisma/client'
import type { Cache } from 'cache-manager'
import { expect } from 'chai'
import { describe } from 'mocha'
import * as sinon from 'sinon'
import { EmailAuthServiceImpl } from './email-auth.service'
import type { ThirdPartyAuthService } from './third-party-auth.service.interface'

describe('EmailAuthService', () => {
  let service: ThirdPartyAuthService
  let cache: Cache

  const VALID_PASSWORD = 'password'

  const account: Account = {
    id: 1,
    status: AccountStatus.Enable,
    createdAt: new Date(),
    lastLogin: new Date(),
    password: VALID_PASSWORD,
    birthday: new Date('2023-01-01'),
    role: Role.User,
    username: 'user01',
    email: 'example@example.com',
    lastPasswordChanged: new Date(),
    name: 'user01',
    profileImgUrl: undefined,
    deletedAt: undefined,
    teamId: 1
  }

  const emailServiceMock = {
    sendVerificationEmail: sinon.stub()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: 'EmailAuthService', useClass: EmailAuthServiceImpl },
        { provide: 'EmailService', useValue: emailServiceMock },
        {
          provide: CACHE_MANAGER,
          useFactory: () => ({
            set: () => [],
            get: () => [],
            del: () => []
          })
        }
      ]
    }).compile()

    service = module.get<ThirdPartyAuthService>('EmailAuthService')
    cache = module.get<Cache>(CACHE_MANAGER)

    sinon.reset()
  })

  afterEach(() => {
    sinon.reset()
  })

  it('should be defined', () => {
    expect(service).to.be.ok
  })

  describe('verifyPin', () => {
    it('should return true when pin is valid', async () => {
      // given
      const pin = '123456'
      const cacheGetSpy = sinon.stub(cache, 'get').resolves(pin)

      // when
      const result = await service.verifyPin(account.id, pin)

      // then
      expect(result).to.be.deep.equal(true)
      expect(cacheGetSpy.calledOnceWith(emailVerificationCacheKey(account.id)))
        .to.be.true
    })

    it('should throw CacheException when cache throws exception', async () => {
      // given
      const pin = '123456'
      sinon.stub(cache, 'get').throws(Error('test'))

      // then
      await expect(service.verifyPin(account.id, pin)).to.be.rejectedWith(
        CacheException
      )
    })

    it('should throw EmptyPrameterException when pin is not passed', async () => {
      // then
      await expect(service.verifyPin(account.id)).to.be.rejectedWith(
        EmptyParameterException
      )
    })
  })

  describe('registerPin', () => {
    it('should return result: ok', async () => {
      // given
      emailServiceMock.sendVerificationEmail.resolves()
      const cacheSetSpy = sinon.stub(cache, 'set').resolves()
      const email = 'test@example.com'

      // when
      const result = await service.registerPin(account.id, email)

      // then
      expect(result).to.be.deep.equal({ result: 'ok' })
      expect(emailServiceMock.sendVerificationEmail.calledOnceWith(email)).to.be
        .true
      expect(cacheSetSpy.calledOnceWith(emailVerificationCacheKey(account.id)))
        .to.be.true
    })

    it('should throw CacheException when cache throws exception', async () => {
      // given
      const email = 'test@example.com'
      sinon.stub(cache, 'set').rejects(Error('test'))

      // then
      await expect(service.registerPin(account.id, email)).to.be.rejectedWith(
        CacheException
      )
    })
  })

  describe('deletePin', () => {
    it('should return result: ok', async () => {
      // given
      const cacheDelSpy = sinon.stub(cache, 'del').resolves()

      // when
      const result = await service.deletePin(account.id)

      // then
      expect(result).to.be.deep.equal({ result: 'ok' })
      expect(cacheDelSpy.calledOnceWith(emailVerificationCacheKey(account.id)))
        .to.be.true
    })

    it('should throw CacheException when cache throws Exception', async () => {
      // given
      sinon.stub(cache, 'del').rejects(Error('test'))

      // then
      await expect(service.deletePin(account.id)).to.be.rejectedWith(
        CacheException
      )
    })
  })
})
