import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule, type JwtModuleOptions } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AccountModule } from '@/account/account.module'
import { AuthController } from './auth.controller'
import { JwtAuthService } from './auth.service'
import { JwtStrategy } from './strategy/jwt.strategy'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        const options: JwtModuleOptions = {
          secret: config.get('JWT_SECRET'),
          signOptions: {
            issuer: 'kafa.one'
          }
        }
        return options
      },
      inject: [ConfigService]
    }),
    AccountModule
  ],
  providers: [
    {
      provide: 'AuthService',
      useClass: JwtAuthService
    },
    JwtStrategy
  ],
  controllers: [AuthController],
  exports: [
    {
      provide: 'AuthService',
      useClass: JwtAuthService
    }
  ]
})
export class AuthModule {}
