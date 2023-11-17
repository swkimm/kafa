import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Test, type TestingModule } from '@nestjs/testing'
import { refreshTokenCacheKey } from '@/common/cache/cache-keys'
import { REFRESH_TOKEN_EXPIRE_TIME } from '@/common/constant/time.constants'
import {
  InvalidJwtTokenException,
  UnidentifiedException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import { type Account, Role, AccountStatus } from '@prisma/client'
import { hash } from 'argon2'
import type { Cache } from 'cache-manager'
import { expect } from 'chai'
import type Sinon from 'sinon'
import { stub } from 'sinon'
import { JwtAuthService } from './auth.service'
import type { AuthService } from './auth.service.interface'
import type { LoginUserDto } from './dto/login-user.dto'
import type { JwtObject } from './interface/jwt.interface'

describe('AuthService', () => {
  let service: AuthService
  let jwtService: JwtService
  let cache: Cache
  let createJwtTokenSpy: Sinon.SinonStub

  const ACCESS_TOKEN = 'access_token'
  const REFRESH_TOKEN = 'refresh_token'
  const VALID_PASSWORD = 'password'

  const user: Account = {
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
    deletedAt: undefined
  }

  const db = {
    account: {
      findUniqueOrThrow: stub(),
      findUnique: stub(),
      update: stub()
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: 'AuthService', useClass: JwtAuthService },
        ConfigService,
        { provide: PrismaService, useValue: db },
        {
          provide: JwtService,
          useFactory: () => ({
            signAsync: () => [],
            verifyAsync: () => []
          })
        },
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

    service = module.get<AuthService>('AuthService')
    jwtService = module.get<JwtService>(JwtService)
    cache = module.get<Cache>(CACHE_MANAGER)
  })

  it('should be defined', () => {
    expect(service).to.be.ok
  })

  describe('isValidUser', () => {
    it('should return true when password is correct', async () => {
      //given
      const validPassword = await hash(VALID_PASSWORD)
      user.password = validPassword

      //when
      const result = await service.isValidUser(user, VALID_PASSWORD)

      //then
      expect(result).to.be.true
    })

    it('should return true when password is correct', async () => {
      //given
      const validPassword = await hash(VALID_PASSWORD)
      const INVALID_PASSWORD = 'invalid-passowrd'
      user.password = validPassword

      //when
      const result = await service.isValidUser(user, INVALID_PASSWORD)

      //then
      expect(result).to.be.false
    })
  })

  describe('createJwtTokens', () => {
    it('should return jwtTokens', async () => {
      //given
      const cacheSpy = stub(cache, 'set').resolves()
      const signAsyncSpy = stub(jwtService, 'signAsync')
        .onFirstCall()
        .resolves(ACCESS_TOKEN)
        .onSecondCall()
        .resolves(REFRESH_TOKEN)

      //when
      const result = await service.createJwtTokens(user.id, user.username)

      //then
      expect(result).to.deep.equal({
        accessToken: ACCESS_TOKEN,
        refreshToken: REFRESH_TOKEN
      })
      expect(
        cacheSpy.calledOnceWith(
          refreshTokenCacheKey(user.id),
          REFRESH_TOKEN,
          REFRESH_TOKEN_EXPIRE_TIME * 1000
        )
      ).to.be.true
      expect(signAsyncSpy.calledTwice).to.be.true
    })
  })

  describe('issueJwtTokens', () => {
    it('should return jwtTokens when valid user information passed', async () => {
      //given
      const validPassword = await hash(VALID_PASSWORD)
      const loginUserDTO: LoginUserDto = {
        username: user.username,
        password: VALID_PASSWORD
      }

      user.password = validPassword
      db.account.findUnique.resolves(user)

      createJwtTokenSpy = stub(service, 'createJwtTokens').resolves({
        accessToken: ACCESS_TOKEN,
        refreshToken: REFRESH_TOKEN
      })

      //when
      const result = await service.issueJwtTokens(loginUserDTO)

      //then
      expect(result).to.deep.equal({
        accessToken: ACCESS_TOKEN,
        refreshToken: REFRESH_TOKEN
      })
      expect(createJwtTokenSpy.calledOnceWith(user.id, user.username)).to.be
        .true
    })
  })

  it('should throw UnidentifiedException when invalid password passed', async () => {
    //given
    const validPassword = await hash(VALID_PASSWORD)
    const INVALID_PASSWORD = 'invalid-passowrd'
    const loginUserDTO: LoginUserDto = {
      username: user.username,
      password: INVALID_PASSWORD
    }
    user.password = validPassword
    db.account.findUnique.resolves(user)

    //then
    await expect(service.issueJwtTokens(loginUserDTO)).to.be.rejectedWith(
      UnidentifiedException
    )
  })

  it('should throw UnidentifiedException when not exist user information ', async () => {
    //given
    const loginUserDTO: LoginUserDto = {
      username: user.username,
      password: VALID_PASSWORD
    }

    db.account.findUnique.resolves(undefined)

    //then
    await expect(service.issueJwtTokens(loginUserDTO)).to.be.rejectedWith(
      UnidentifiedException
    )
  })

  describe('updateJwtTokens', () => {
    it('should return updated jwtToken when valid refresh token passed', async () => {
      //given
      const isValidRefreshTokenSpy = stub(
        service,
        'isValidRefreshToken'
      ).resolves(true)
      const verifyJwtTokenSpy = stub(service, 'verifyJwtToken').resolves({
        userId: user.id,
        username: user.username,
        exp: undefined,
        iat: undefined,
        iss: undefined
      })
      const REISSUED_ACCESS_TOKEN = 'reissued-access-token'
      const REISSUED_REFRESH_TOKEN = 'reissued-refresh-token'

      createJwtTokenSpy = stub(service, 'createJwtTokens').resolves({
        accessToken: REISSUED_ACCESS_TOKEN,
        refreshToken: REISSUED_REFRESH_TOKEN
      })

      //when
      const result = await service.updateJwtTokens(REFRESH_TOKEN)

      expect(result).to.be.deep.equal({
        accessToken: REISSUED_ACCESS_TOKEN,
        refreshToken: REISSUED_REFRESH_TOKEN
      })
      expect(isValidRefreshTokenSpy.calledOnceWith(REFRESH_TOKEN, user.id)).to
        .be.true
      expect(verifyJwtTokenSpy.calledOnceWith(REFRESH_TOKEN)).to.be.true
    })

    it('should throw InvalidJwtTokenException when invalid refresh token passed', async () => {
      //given
      stub(service, 'verifyJwtToken').resolves({
        userId: user.id,
        username: user.username,
        exp: undefined,
        iat: undefined,
        iss: undefined
      })
      stub(service, 'isValidRefreshToken').resolves(false)

      //then
      await expect(service.updateJwtTokens(REFRESH_TOKEN)).to.be.rejectedWith(
        InvalidJwtTokenException
      )
    })
  })

  describe('verifyJwtToken', () => {
    it('should return JwtObject when valid token passed', async () => {
      //given
      const jwtObject: JwtObject = {
        userId: user.id,
        username: user.username,
        exp: undefined,
        iat: undefined,
        iss: undefined
      }
      const verifyAsyncSpy = stub(jwtService, 'verifyAsync').resolves(jwtObject)

      //when
      const result = await service.verifyJwtToken(REFRESH_TOKEN)

      //then
      expect(result).to.be.deep.equal(jwtObject)
      expect(verifyAsyncSpy.calledOnceWith(REFRESH_TOKEN)).to.be.true
    })

    it('should throw InvalidJwtTokenException when invalid token passed', async () => {
      //given
      stub(jwtService, 'verifyAsync').rejects()

      //then
      await expect(service.verifyJwtToken(REFRESH_TOKEN)).to.be.rejectedWith(
        InvalidJwtTokenException
      )
    })
  })

  describe('isValidRefreshToken', () => {
    it('should return true when refresh_token is valid', async () => {
      //given
      const cacheSpy = stub(cache, 'get').resolves(REFRESH_TOKEN)

      //when
      const result = await service.isValidRefreshToken(REFRESH_TOKEN, user.id)

      //then
      expect(result).to.be.true
      expect(cacheSpy.calledOnceWith(refreshTokenCacheKey(user.id))).to.be.true
    })

    it('should return false when refresh_token is invalid', async () => {
      //given
      const cacheSpy = stub(cache, 'get').resolves('another-token')

      //when
      const result = await service.isValidRefreshToken(REFRESH_TOKEN, user.id)

      //then
      expect(result).to.be.false
      expect(cacheSpy.calledOnceWith(refreshTokenCacheKey(user.id))).to.be.true
    })
  })

  describe('deleteRefreshToken', () => {
    it('should delete refresh_token in cache', async () => {
      //given
      const cacheSpy = stub(cache, 'del').resolves()

      //when
      await service.deleteRefreshToken(user.id)

      //then
      expect(cacheSpy.calledOnceWith(refreshTokenCacheKey(user.id)))
    })
  })
})
