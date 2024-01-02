import { Module } from '@nestjs/common'
import { AccountModule } from '@/account/account.module'
import { AssociationModule } from '@/association/association.module'
import { LeagueSponserModule } from '@/league-sponser/league-sponser.module'
import { RosterModule } from '@/roster/roster.module'
import { SponserModule } from '@/sponser/sponser.module'
import { TeamLeagueModule } from '@/team-league/team-league.module'
import { TeamModule } from '@/team/team.module'
import { AdminLeagueController } from './admin-league.controller'
import { LeagueController } from './league.controller'
import { CreateLeagueServiceImpl } from './service/create-league.service'
import { DeleteLeagueServiceImpl } from './service/delete-league.service'
import { GetLeagueServiceImpl } from './service/get-league.service'
import { JoinLeagueServiceImpl } from './service/join-league.service'
import { LeagueServiceImpl } from './service/league.service'
import { UpdateLeagueServiceImpl } from './service/update-league.service'

@Module({
  imports: [
    AssociationModule,
    LeagueSponserModule,
    SponserModule,
    TeamLeagueModule,
    TeamModule,
    AccountModule,
    RosterModule
  ],
  controllers: [LeagueController, AdminLeagueController],
  providers: [
    {
      provide: 'GetLeagueService',
      useClass: GetLeagueServiceImpl
    },
    {
      provide: 'UpdateLeagueService',
      useClass: UpdateLeagueServiceImpl
    },
    {
      provide: 'CreateLeagueService',
      useClass: CreateLeagueServiceImpl
    },
    {
      provide: 'DeleteLeagueService',
      useClass: DeleteLeagueServiceImpl
    },
    {
      provide: 'JoinLeagueService',
      useClass: JoinLeagueServiceImpl
    },
    {
      provide: 'LeagueService',
      useClass: LeagueServiceImpl
    }
  ],
  exports: [{ provide: 'LeagueService', useClass: LeagueServiceImpl }]
})
export class LeagueModule {}
