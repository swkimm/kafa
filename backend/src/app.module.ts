import { MailerModule } from '@nestjs-modules/mailer'
import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { AccountModule } from './account/account.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard'
import { CacheConfigService } from './common/cache/cache-config.service'
import { RolesGuard } from './common/guard/roles.guard'
import { EmailModule } from './email/email.module'
import { MailerConfigService } from './email/mailer-config.service'
import { PrismaModule } from './prisma/prisma.module'

@Module({
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard }
  ],
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    CacheModule.registerAsync({
      isGlobal: true,
      useClass: CacheConfigService
    }),
    AuthModule,
    AccountModule,
    EmailModule,
    MailerModule.forRootAsync({
      useClass: MailerConfigService
    })
  ]
})
export class AppModule {}
