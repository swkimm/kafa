import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService, type JwtVerifyOptions } from '@nestjs/jwt'
import { refreshTokenCacheKey } from '@/common/cache/cache-keys'
import {
  ACCESS_TOKEN_EXPIRE_TIME,
  REFRESH_TOKEN_CACHE_EXIPRE_TIME,
  REFRESH_TOKEN_EXPIRE_TIME
} from '@/common/constant/time.constants'
import {
  InvalidJwtTokenException,
  UnidentifiedException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import type { Account } from '@prisma/client'
import { verify } from 'argon2'
import { Cache } from 'cache-manager'
import type { AuthService } from './auth.service.interface'
import type { LoginUserDto } from './dto/login-user.dto'
import type {
  JwtObject,
  JwtPayload,
  JwtTokens
} from './interface/jwt.interface'

@Injectable()
export class JwtAuthService implements AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) {}

  /**
   * Public Methods
   */

  async isValidUser(user: Account, password: string): Promise<boolean> {
    if (!user || !(await verify(user.password, password))) {
      return false
    }
    return true
  }

  async issueJwtTokens(loginUserDto: LoginUserDto): Promise<JwtTokens> {
    const account = await this.getAccountCredential(loginUserDto.username)
    if (!(await this.isValidUser(account, loginUserDto.password))) {
      throw new UnidentifiedException('username or password')
    }
    await this.updateLastLogin(account.id)

    return await this.createJwtTokens(account.id, account.username)
  }

  async updateJwtTokens(refreshToken: string): Promise<JwtTokens> {
    const { userId, username } = await this.verifyJwtToken(refreshToken)
    if (!(await this.isValidRefreshToken(refreshToken, userId))) {
      throw new InvalidJwtTokenException('Unidentified refresh token')
    }
    return await this.createJwtTokens(userId, username)
  }

  async verifyJwtToken(
    token: string,
    options: JwtVerifyOptions = {}
  ): Promise<JwtObject> {
    const jwtVerifyOptions = {
      secret: this.config.get('JWT_SECRET'),
      ...options
    }
    try {
      return await this.jwtService.verifyAsync(token, jwtVerifyOptions)
    } catch (error) {
      throw new InvalidJwtTokenException(error.message)
    }
  }

  async isValidRefreshToken(
    refreshToken: string,
    userId: number
  ): Promise<boolean> {
    const cachedRefreshToken = await this.cacheManager.get(
      refreshTokenCacheKey(userId)
    )
    if (cachedRefreshToken !== refreshToken) {
      return false
    }
    return true
  }

  async createJwtTokens(userId: number, username: string): Promise<JwtTokens> {
    const payload: JwtPayload = { userId, username }
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: ACCESS_TOKEN_EXPIRE_TIME
    })
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: REFRESH_TOKEN_EXPIRE_TIME
    })

    await this.cacheManager.set(
      refreshTokenCacheKey(userId),
      refreshToken,
      REFRESH_TOKEN_CACHE_EXIPRE_TIME
    )

    return { accessToken, refreshToken }
  }

  async deleteRefreshToken(userId: number): Promise<void> {
    return await this.cacheManager.del(refreshTokenCacheKey(userId))
  }

  /**
   * Private Methods
   */

  private async getAccountCredential(username: string): Promise<Account> {
    return await this.prismaService.account.findUnique({
      where: {
        username
      }
    })
  }

  private async updateLastLogin(accountId: number): Promise<void> {
    await this.prismaService.account.update({
      where: {
        id: accountId
      },
      data: {
        lastLogin: new Date()
      }
    })
  }
}
