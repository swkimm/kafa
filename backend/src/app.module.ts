import { MailerModule } from '@nestjs-modules/mailer'
import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_GUARD } from '@nestjs/core'
import { AccountModule } from './account/account.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AssociationModule } from './association/association.module'
import { AuthModule } from './auth/auth.module'
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard'
import { BoardModule } from './board/board.module'
import { CalendarModule } from './calendar/calendar.module'
import { CacheConfigService } from './common/cache/cache-config.service'
import { ExceptionsFilter } from './common/exception/exception.filter'
import { RolesGuard } from './common/guard/roles.guard'
import { EmailModule } from './email/email.module'
import { MailerConfigService } from './email/mailer-config.service'
import { GameModule } from './game/game.module'
import { LeagueSponserModule } from './league-sponser/league-sponser.module'
import { LeagueModule } from './league/league.module'
import { PrismaModule } from './prisma/prisma.module'
import { ProfileModule } from './profile/profile.module'
import { RecordModule } from './record/record.module'
import { RosterModule } from './roster/roster.module'
import { ScoreModule } from './score/score.module'
import { SponserModule } from './sponser/sponser.module'
import { StorageModule } from './storage/storage.module'
import { TeamLeagueModule } from './team-league/team-league.module'
import { TeamModule } from './team/team.module'

@Module({
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: ExceptionsFilter },
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
    }),
    TeamModule,
    TeamLeagueModule,
    AssociationModule,
    StorageModule,
    LeagueModule,
    SponserModule,
    LeagueSponserModule,
    GameModule,
    ScoreModule,
    ProfileModule,
    RosterModule,
    RecordModule,
    BoardModule,
    CalendarModule
  ]
})
export class AppModule {}
