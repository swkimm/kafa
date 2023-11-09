import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { AuthenticatedUser } from '@/common/class/authenticated-user.class'
import { ExtractJwt } from 'passport-jwt'
import { Strategy } from 'passport-jwt'
import type { JwtObject } from '../interface/jwt.interface'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET')
    })
  }

  async validate(payload: JwtObject): Promise<AuthenticatedUser> {
    return new AuthenticatedUser(payload.userId, payload.username)
  }
}
