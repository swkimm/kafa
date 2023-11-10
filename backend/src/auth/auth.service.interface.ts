import type { JwtVerifyOptions } from '@nestjs/jwt'
import type { Account, Role } from '@prisma/client'
import type { LoginUserDto } from './dto/login-user.dto'
import type { JwtObject, JwtTokens } from './interface/jwt.interface'

export interface AuthService {
  getUserRole(userId: number): Promise<{
    role: Role
  }>

  isValidUser(user: Account, password: string): Promise<boolean>

  issueJwtTokens(loginUserDto: LoginUserDto): Promise<JwtTokens>

  updateJwtTokens(refreshToken: string): Promise<JwtTokens>

  verifyJwtToken(token: string, options?: JwtVerifyOptions): Promise<JwtObject>

  isValidRefreshToken(refreshToken: string, userId: number): Promise<boolean>

  createJwtTokens(userId: number, username: string): Promise<JwtTokens>

  deleteRefreshToken(userId: number): Promise<void>
}
