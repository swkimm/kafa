import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UnprocessableEntityException
} from '@nestjs/common'
import { AuthenticatedRequest } from '@/common/class/authenticated-request.interface'
import {
  CLOUDFRONT_SIGNED_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_OPTIONS
} from '@/common/constant/time.constants'
import { Public } from '@/common/decorator/guard.decorator'
import { Roles } from '@/common/decorator/roles.decorator'
import { businessExceptionBinder } from '@/common/exception/business-exception.binder'
import {
  InvalidJwtTokenException,
  UnidentifiedException
} from '@/common/exception/business.exception'
import { Role } from '@prisma/client'
import { Request, Response } from 'express'
import { AuthService } from './auth.service.interface'
import { CloudFrontAuthService } from './cloudfront-auth.service.interface'
import { LoginUserDto } from './dto/login-user.dto'
import type { JwtTokens } from './interface/jwt.interface'

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AuthService') private readonly authService: AuthService,
    @Inject('CloudFrontAuthService')
    private readonly cloudFrontAuthService: CloudFrontAuthService
  ) {}

  setJwtResponse = (res: Response, jwtTokens: JwtTokens) => {
    res.setHeader('authorization', `Bearer ${jwtTokens.accessToken}`)
    res.cookie(
      'refresh_token',
      jwtTokens.refreshToken,
      REFRESH_TOKEN_COOKIE_OPTIONS
    )
  }

  @Public()
  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<void> {
    try {
      const jwtTokens = await this.authService.issueJwtTokens(loginUserDto)
      this.setJwtResponse(res, jwtTokens)
    } catch (error) {
      if (error instanceof UnidentifiedException) {
        throw new UnauthorizedException(error.message)
      }
      throw new InternalServerErrorException('Login failed')
    }
  }

  @Post('logout')
  async logout(
    @Req() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response
  ): Promise<void> {
    try {
      await this.authService.deleteRefreshToken(req.user.id)
      res.clearCookie('refresh_token', REFRESH_TOKEN_COOKIE_OPTIONS)
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }

  @Public()
  @Get('reissue')
  async reIssueJwtTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<void> {
    const refreshToken = req.cookies['refresh_token']
    if (!refreshToken) throw new BadRequestException('Invalid Token')
    try {
      const newJwtTokens = await this.authService.updateJwtTokens(refreshToken)
      this.setJwtResponse(res, newJwtTokens)
    } catch (error) {
      if (error instanceof InvalidJwtTokenException) {
        throw new UnprocessableEntityException(error.message)
      }
      throw new InternalServerErrorException('Failed to reissue tokens')
    }
  }

  @Get('certification')
  async getCertificaitonAccessToken(
    @Req() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response
  ) {
    try {
      const cookies = this.cloudFrontAuthService.issueCookies(
        `https://cdn.kafa.one/secret/account/${req.user.id}/certificaiton-file/*`
      )

      for (const cookieKey in cookies) {
        res.cookie(
          cookieKey,
          cookies[cookieKey],
          CLOUDFRONT_SIGNED_COOKIE_OPTIONS
        )
      }
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Roles(Role.Admin)
  @Get('certification/all')
  async getAllCertificaitonAccessToken(
    @Res({ passthrough: true }) res: Response
  ) {
    try {
      const cookies = this.cloudFrontAuthService.issueCookies(
        'https://cdn.kafa.one/secret/*'
      )

      for (const cookieKey in cookies) {
        res.cookie(
          cookieKey,
          cookies[cookieKey],
          CLOUDFRONT_SIGNED_COOKIE_OPTIONS
        )
      }
    } catch (error) {
      businessExceptionBinder(error)
    }
  }
}
