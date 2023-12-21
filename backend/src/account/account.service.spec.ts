import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Test, type TestingModule } from '@nestjs/testing'
import { emailUpdateVerificationCacheKey } from '@/common/cache/cache-keys'
import { EMAIL_VERIFICATION_PIN_EXPIRE_TIME } from '@/common/constant/time.constants'
import {
  CacheException,
  ConflictFoundException,
  EntityNotExistException,
  UnidentifiedException,
  UnverifiedException
} from '@/common/exception/business.exception'
import type { EmailService } from '@/email/email.service.interface'
import { PrismaService } from '@/prisma/prisma.service'
import { type Account, Role, AccountStatus, Prisma } from '@prisma/client'
import { hash } from 'argon2'
import type { Cache } from 'cache-manager'
import { expect } from 'chai'
import { describe } from 'mocha'
import * as sinon from 'sinon'
import { AccountServiceImpl } from './account.service'
import type { AccountService } from './account.service.interface'
import { AccountDTO } from './dto/account.dto'
import type { RegisterAccountDTO } from './dto/registerAccount.dto'
import type { UpdatePasswordDTO } from './dto/updatePassword.dto'

describe('AccountService', () => {
  let service: AccountService
  let cache: Cache

  const VALID_PASSWORD = 'password'

  const db = {
    account: {
      update: sinon.stub(),
      create: sinon.stub(),
      findUnique: sinon.stub(),
      findUniqueOrThrow: sinon.stub()
    }
  }

  const mockEmailAuthService = {
    verifyPin: sinon.stub(),
    registerPin: sinon.stub(),
    deletePin: sinon.stub()
  }

  const account: Account = {
    id: 1,
    status: AccountStatus.Enable,
    createdAt: new Date('2023-01-01'),
    lastLogin: new Date('2023-01-01'),
    password: VALID_PASSWORD,
    role: Role.User,
    username: 'user01',
    email: 'example@example.com',
    lastPasswordChanged: new Date('2023-01-01'),
    name: 'user01',
    profileImgUrl: undefined,
    deletedAt: undefined,
    teamId: undefined
  }

  const unverifiedAccount: Account = {
    id: 2,
    status: AccountStatus.Verifying,
    createdAt: new Date('2023-01-01'),
    lastLogin: new Date('2023-01-01'),
    password: VALID_PASSWORD,
    role: Role.User,
    username: 'user02',
    email: 'example2@example.com',
    lastPasswordChanged: new Date('2023-01-01'),
    name: 'user02',
    profileImgUrl: undefined,
    deletedAt: undefined,
    teamId: undefined
  }

  const mockEmailService: EmailService = {
    sendVerificationEmail: sinon.stub(),
    sendTeamRegisterMail: sinon.stub()
  }

  const mockAuthService = {
    isValidUser: sinon.stub()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: 'AccountService', useClass: AccountServiceImpl },
        { provide: 'EmailAuthService', useValue: mockEmailAuthService },
        { provide: PrismaService, useValue: db },
        {
          provide: CACHE_MANAGER,
          useFactory: () => ({
            set: () => [],
            get: () => [],
            del: () => []
          })
        },
        { provide: 'EmailService', useValue: mockEmailService },
        { provide: 'AuthService', useValue: mockAuthService }
      ]
    }).compile()

    service = module.get<AccountService>('AccountService')
    cache = module.get<Cache>(CACHE_MANAGER)

    sinon.reset()
  })

  afterEach(() => {
    sinon.reset()
  })

  it('should be defined', () => {
    expect(service).to.be.not.undefined
  })

  describe('getAccountRole', () => {
    it('should return accounts role', async () => {
      //given
      const accountId = account.id
      db.account.findUnique.resolves({
        role: account.role
      })

      //when
      const result = await service.getAccountRole(accountId)

      //then
      expect(result).to.deep.equal({
        role: account.role
      })
    })

    it('should throw exception when invalid accountId passed', async () => {
      //given
      const accountId = 0
      db.account.findUnique.resolves(null)

      //then
      await expect(service.getAccountRole(accountId)).to.be.rejectedWith(
        EntityNotExistException
      )
    })
  })

  describe('updateLastPasswordChanged', () => {
    it('should update updateLastPasswordChanged field', async () => {
      // given
      db.account.findUnique.resolves(account)
      db.account.update.resolves(account)

      // when
      await service.updateLastPasswordChanged(account.id)

      //then
      expect(db.account.update.calledOnce).to.be.true
    })

    it('should throw EntityNotExistException when invalid accountId passed', async () => {
      //given
      db.account.findUnique.resolves(null)

      //when
      await expect(
        service.updateLastPasswordChanged(account.id)
      ).to.be.rejectedWith(EntityNotExistException)
    })
  })

  describe('registerAccount', () => {
    it('should return registered account', async () => {
      //given
      db.account.findUnique.resolves(null)
      db.account.create.resolves(account)

      const accountDTO: RegisterAccountDTO = {
        username: account.username,
        email: account.email,
        name: account.name,
        password: account.password
      }

      //when
      const result = await service.registerAccount(accountDTO, Role.User)

      //then
      expect(result).to.be.deep.equal({
        id: account.id,
        name: account.name,
        email: account.email,
        profileImgUrl: account.profileImgUrl,
        role: Role.User,
        teamId: undefined
      })
      expect(
        db.account.create.calledWithMatch({
          email: account.email,
          password: await hash(VALID_PASSWORD),
          name: account.name,
          role: Role.User
        })
      )
      expect(db.account.create.calledOnce).to.be.true
    })

    it('should throw ConflictFoundException when duplicate email', async () => {
      //given
      db.account.findUnique.resolves(account)
      const accountDTO: RegisterAccountDTO = {
        username: account.username,
        email: account.email,
        name: account.name,
        password: account.password
      }

      //then
      await expect(
        service.registerAccount(accountDTO, Role.User)
      ).to.be.rejectedWith(ConflictFoundException)
    })

    it('should throw ConflictFoundException when duplicate username', async () => {
      //given
      db.account.findUnique.resolves(null).onFirstCall()
      db.account.findUnique.resolves(account).onSecondCall()

      const accountDTO: RegisterAccountDTO = {
        username: account.username,
        email: account.email,
        name: account.name,
        password: account.password
      }

      //then
      await expect(
        service.registerAccount(accountDTO, Role.User)
      ).to.be.rejectedWith(ConflictFoundException)
    })
  })

  describe('verifyEmail', () => {
    it('should return result: ok when valid pin code and account id passed', async () => {
      // given
      const returnValue = { result: 'ok' }
      mockEmailAuthService.verifyPin.resolves(true)
      mockEmailAuthService.deletePin.resolves(returnValue)
      db.account.update.resolves(account)
      db.account.findUnique.resolves(account)

      // when
      const result = await service.verifyEmail(account.id, '123456')

      // then
      expect(result).to.be.deep.equal(returnValue)
      expect(
        db.account.update.calledOnceWith({
          where: { id: account.id },
          data: { status: AccountStatus.Enable }
        })
      ).to.be.true
      expect(
        mockEmailAuthService.verifyPin.calledOnceWith(account.id, '123456')
      ).to.be.true
      expect(mockEmailAuthService.deletePin.calledOnceWith(account.id)).to.be
        .true
    })

    it('should throw EntityNotExistException when invalid accountId passed', async () => {
      // given
      db.account.findUnique.resolves(null)

      // then
      await expect(service.verifyEmail(account.id)).to.be.rejectedWith(
        EntityNotExistException
      )
    })

    it('should throw UnidentifiedException when invalid pin code passed', async () => {
      // given
      mockEmailAuthService.verifyPin.resolves(false)

      // then
      await expect(service.verifyEmail(account.id)).to.be.rejectedWith(
        UnidentifiedException
      )
    })
  })

  describe('verifyUpdateEmail', () => {
    it('should return result: ok when valid pin code and account id passed', async () => {
      // given
      const returnValue = { result: 'ok' }
      const pinCode = '123456'
      const email = 'example@change.com'
      const cacheGetSpy = sinon.stub(cache, 'get').resolves(email)
      const cacheDelSpy = sinon.stub(cache, 'del').resolves()
      mockEmailAuthService.verifyPin.resolves(true)
      mockEmailAuthService.deletePin.resolves(returnValue)

      // when
      const result = await service.verifyUpdateEmail(account.id, pinCode)

      // then
      expect(result).to.be.deep.equal(returnValue)
      expect(
        cacheGetSpy.calledOnceWith(emailUpdateVerificationCacheKey(account.id))
      ).to.be.true
      expect(
        cacheDelSpy.calledOnceWith(emailUpdateVerificationCacheKey(account.id))
      ).to.be.true
      expect(mockEmailAuthService.verifyPin.calledOnceWith(account.id, pinCode))
        .to.be.true
      expect(mockEmailAuthService.deletePin.calledOnceWith(account.id)).to.be
        .true
    })

    it('should throw UnidentifiedException when invalid pin code passed', async () => {
      // given
      const pinCode = '123456'
      mockEmailAuthService.verifyPin.resolves(false)

      //then
      await expect(
        service.verifyUpdateEmail(account.id, pinCode)
      ).to.be.rejectedWith(UnidentifiedException)
    })

    it('should throw CacheException when email value crashed', async () => {
      // given
      const pinCode = '123456'
      sinon.stub(cache, 'get').resolves(undefined)
      mockEmailAuthService.verifyPin.resolves(true)

      //then
      await expect(
        service.verifyUpdateEmail(account.id, pinCode)
      ).to.be.rejectedWith(CacheException)
    })

    it('should throw CacheException When Cache Manager Throws Exception', async () => {
      // given
      sinon.stub(cache, 'get').throws(Error('test'))
      mockEmailAuthService.verifyPin.resolves(true)

      // then
      await expect(
        service.verifyUpdateEmail(account.id, '123456')
      ).to.be.rejectedWith(CacheException)
    })

    it('should throw EntityNotExistException when invalid accountId passed', async () => {
      // given
      db.account.findUnique.resolves(null)

      // then
      await expect(service.verifyUpdateEmail(account.id)).to.be.rejectedWith(
        EntityNotExistException
      )
    })
  })

  describe('updateEmail', () => {
    it('should return result: ok when update email request succeed', async () => {
      // given
      const returnValue = { result: 'ok' }
      const email = 'test@change.com'
      const cacheSetSpy = sinon.stub(cache, 'set').resolves()
      mockEmailAuthService.registerPin.resolves(returnValue)

      // when
      const result = await service.updateEmail({ email }, account.id)

      //then
      expect(result).to.be.deep.equal(returnValue)
      expect(
        cacheSetSpy.calledOnceWith(
          emailUpdateVerificationCacheKey(account.id),
          email,
          EMAIL_VERIFICATION_PIN_EXPIRE_TIME
        )
      ).to.be.true
      expect(mockEmailAuthService.registerPin.calledOnceWith(account.id, email))
        .to.be.true
    })

    it('should throw CacheException when cache throws exception', async () => {
      // given
      const email = 'test@change.com'
      sinon.stub(cache, 'set').throws(Error('test'))

      // then
      await expect(
        service.updateEmail({ email }, account.id)
      ).to.be.rejectedWith(CacheException)
    })

    it('should throw EntityNotExistException when invalid accountId passed', async () => {
      // given
      const email = 'test@change.com'
      db.account.findUnique.resolves(null)

      // then
      await expect(
        service.updateEmail({ email }, account.id)
      ).to.be.rejectedWith(EntityNotExistException)
    })
  })

  describe('getAccountProfile', () => {
    it('should return account profile', async () => {
      // given
      db.account.findUnique.resolves(account)

      // when
      const result = await service.getAccountProfile(account.id)

      // then
      expect(result).to.be.deep.equal({
        id: account.id,
        name: account.name,
        email: account.email,
        profileImgUrl: account.profileImgUrl,
        role: account.role,
        teamId: undefined
      })
      expect(db.account.findUnique.calledTwice).to.be.true
      expect(
        db.account.findUnique.calledWith({
          where: {
            id: account.id
          }
        })
      ).to.be.true
    })

    it('should throw EntityNotExistException when invalid accountId passed', async () => {
      // given
      db.account.findUnique.resolves(null)

      // then
      await expect(service.getAccountProfile(account.id)).to.be.rejectedWith(
        EntityNotExistException
      )
    })
  })

  describe('updateAccountProfile', () => {
    it('should update account profile', async () => {
      // given
      const accountDTO = {
        name: 'test'
      }
      db.account.update.resolves(account)

      // when
      const result = await service.updateAccountProfile(accountDTO, account.id)

      // then
      expect(result).to.be.deep.equal({
        id: account.id,
        name: account.name,
        email: account.email,
        profileImgUrl: account.profileImgUrl,
        role: account.role,
        teamId: undefined
      })
      expect(
        db.account.update.calledOnceWith({
          where: { id: account.id },
          data: { ...accountDTO }
        })
      ).to.be.true
    })

    it('should throw EntityNotExistException when invalid accountId passed', async () => {
      // given
      const accountDTO = {
        name: 'test'
      }
      db.account.findUnique.resolves(null)

      // then
      await expect(
        service.updateAccountProfile(accountDTO, account.id)
      ).to.be.rejectedWith(EntityNotExistException)
    })
  })

  describe('withdrawAccount', () => {
    it('should update deleteAt field and return result', async () => {
      // given
      db.account.findUnique.resolves(account)
      db.account.update.resolves(account)

      // when
      const result = await service.withdrawAccount(account.id)

      // then
      expect(db.account.update.calledOnce).to.be.true
      expect(result).to.be.deep.equal({
        id: account.id,
        name: account.name,
        email: account.email,
        profileImgUrl: account.profileImgUrl,
        role: account.role,
        teamId: undefined
      })
    })

    it('should throw EntityNotExistException when invalid accountId passed', async () => {
      // given
      db.account.findUnique.resolves(null)

      // then
      await expect(service.withdrawAccount(account.id)).to.be.rejectedWith(
        EntityNotExistException
      )
    })
  })

  describe('requestUpdatePassword', () => {
    it('should return result: ok', async () => {
      // given
      const { email } = account
      db.account.findUnique.resolves({ email })
      mockEmailAuthService.registerPin.resolves()

      // when
      const result = await service.requestUpdatePassword(account.id)

      // then
      expect(result).to.be.deep.equal({ result: 'ok' })
      expect(
        db.account.findUnique.calledWith({
          where: {
            id: account.id
          },
          select: {
            email: true
          }
        })
      ).to.be.true
      expect(db.account.findUnique.calledTwice).to.be.true
      expect(mockEmailAuthService.registerPin.calledOnceWith(account.id, email))
        .to.be.true
    })

    it('should throw EntityNotExistException when invalid accountId passed', async () => {
      // given
      db.account.findUnique.resolves(null)

      // then
      await expect(
        service.requestUpdatePassword(account.id)
      ).to.be.rejectedWith(EntityNotExistException)
    })
  })

  describe('updatePassword', () => {
    it('should return result: ok', async () => {
      // given
      const accountDTO: UpdatePasswordDTO = {
        newPassword: 'new1234',
        oldPassword: account.password
      }
      db.account.findUnique.resolves(account)
      mockAuthService.isValidUser.resolves(true)

      // when
      const result = await service.updatePassword(accountDTO, account.id)

      // then
      expect(result).to.be.deep.equal({ result: 'ok' })
      expect(db.account.findUnique.calledTwice).to.be.true
      expect(
        db.account.findUnique.calledWith({
          where: {
            id: account.id
          }
        })
      ).to.be.true
      expect(
        db.account.update.calledWithMatch({
          where: {
            id: account.id
          }
        })
      ).to.be.true
      expect(db.account.update.calledOnce).to.be.true
      expect(
        mockAuthService.isValidUser.calledOnceWith(
          account,
          accountDTO.oldPassword
        )
      )
    })

    it('should throw UnidentifiedException when invalid old password passed', async () => {
      // given
      const accountDTO: UpdatePasswordDTO = {
        newPassword: 'new1234',
        oldPassword: account.password
      }
      db.account.findUnique.resolves(account)
      mockAuthService.isValidUser.resolves(false)

      // then
      await expect(
        service.updatePassword(accountDTO, account.id)
      ).to.be.rejectedWith(UnidentifiedException)
    })
  })

  describe('isVerifiedAccount', () => {
    it('should not throw exception when account is verified', async () => {
      // given
      db.account.findUnique.resolves(account)

      // then
      try {
        expect(service.isVerifiedAccount(account.id))
      } catch (error) {
        expect.fail()
      }
    })

    it('should throw UnverifiedException when invalid accountId passed', async () => {
      // given
      db.account.findUnique.resolves(null)

      // then
      await expect(service.isVerifiedAccount(account.id)).to.be.rejectedWith(
        UnverifiedException
      )
    })

    it('should throw UnverifiedException when account is unverified', async () => {
      // given
      db.account.findUnique.resolves(unverifiedAccount)

      // then
      await expect(service.isVerifiedAccount(account.id)).to.be.rejectedWith(
        UnverifiedException
      )
    })
  })

  describe('mappingManagerAccount', () => {
    it('should return AccountDTO', async () => {
      // given
      const teamId = 1
      const accountId = 1
      db.account.update.resolves(account)

      // when
      const result = await service.mappingManagerAccount(teamId, accountId)

      // then
      expect(result).to.be.deep.equal(new AccountDTO(account))
      expect(
        db.account.update.calledOnceWith({
          where: {
            id: accountId
          },
          data: {
            teamId
          }
        })
      ).to.be.true
    })

    it('should throw EntityNotExistException when invalid accountId passed', async () => {
      // given
      const teamId = 1
      const accountId = 1
      db.account.update.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P2025'
        })
      )

      // then
      await expect(
        service.mappingManagerAccount(accountId, teamId)
      ).to.be.rejectedWith(EntityNotExistException)
    })

    it('should throw EntityNotExistException when invalid teamId passed', async () => {
      // given
      const teamId = 1
      const accountId = 1
      db.account.update.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P2003'
        })
      )

      // then
      await expect(
        service.mappingManagerAccount(accountId, teamId)
      ).to.be.rejectedWith(EntityNotExistException)
    })
  })

  // describe('updatePassword', () => {
  //   it('should return result: ok', async () => {
  //     // given
  //     const returnValue = { result: 'ok' }
  //     const accountDTO: UpdatePasswordDTO = {
  //       password: '12345678',
  //       pin: '123456'
  //     }
  //     mockEmailAuthService.verifyPin.resolves(true)
  //     mockEmailAuthService.deletePin.resolves(returnValue)
  //     db.account.update.resolves()

  //     // when
  //     const result = await service.updatePassword(accountDTO, account.id)

  //     // then
  //     expect(result).to.be.deep.equal(returnValue)
  //     expect(
  //       mockEmailAuthService.verifyPin.calledOnceWith(
  //         account.id,
  //         accountDTO.pin
  //       )
  //     ).to.be.true
  //     expect(mockEmailAuthService.deletePin.calledOnceWith(account.id))
  //     expect(db.account.update.calledOnce).to.be.true
  //     expect(
  //       db.account.update.calledWithMatch({
  //         where: {
  //           id: account.id
  //         }
  //       })
  //     ).to.be.true
  //   })

  //   it('should return result: no when invalid pin passed', async () => {
  //     // given
  //     const returnValue = { result: 'no' }
  //     const accountDTO: UpdatePasswordDTO = {
  //       password: '12345678',
  //       pin: '123456'
  //     }
  //     mockEmailAuthService.verifyPin.resolves(false)

  //     // when
  //     const result = await service.updatePassword(accountDTO, account.id)

  //     // then
  //     expect(result).to.be.deep.equal(returnValue)
  //   })

  //   it('should throw EntityNotExistException when invalid accountId passed', async () => {
  //     // given
  //     const accountDTO: UpdatePasswordDTO = {
  //       password: '12345678',
  //       pin: '123456'
  //     }
  //     db.account.findUnique.resolves(null)

  //     // then
  //     await expect(
  //       service.updatePassword(accountDTO, account.id)
  //     ).to.be.rejectedWith(EntityNotExistException)
  //   })
  // })
})
