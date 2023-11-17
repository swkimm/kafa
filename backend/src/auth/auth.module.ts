import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule, type JwtModuleOptions } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { EmailModule } from '@/email/email.module'
import { AuthController } from './auth.controller'
import { JwtAuthService } from './auth.service'
import { EmailAuthServiceImpl } from './email-auth.service'
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
    EmailModule
  ],
  providers: [
    {
      provide: 'AuthService',
      useClass: JwtAuthService
    },
    { provide: 'EmailAuthService', useClass: EmailAuthServiceImpl },
    JwtStrategy
  ],
  controllers: [AuthController],
  exports: [
    {
      provide: 'AuthService',
      useClass: JwtAuthService
    },
    { provide: 'EmailAuthService', useClass: EmailAuthServiceImpl }
  ]
})
export class AuthModule {}
