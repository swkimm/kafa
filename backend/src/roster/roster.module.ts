import { Module } from '@nestjs/common'
import { AccountModule } from '@/account/account.module'
import { TeamLeagueModule } from '@/team-league/team-league.module'
import { TeamModule } from '@/team/team.module'
import { RosterController } from './roster.controller'
import { ConnectRosterServiceImpl } from './service/connect-roster.service'
import { CreateRosterServiceImpl } from './service/create-roster.service'
import { DeleteRosterServiceImpl } from './service/delete-roster.service'
import { GetRosterServiceImpl } from './service/get-roster.service'
import { RosterServiceImpl } from './service/roster.service'
import { UpdateRosterServiceImpl } from './service/update-roster.service'

@Module({
  imports: [TeamLeagueModule, AccountModule, TeamModule],
  controllers: [RosterController],
  providers: [
    {
      provide: 'GetRosterService',
      useClass: GetRosterServiceImpl
    },
    {
      provide: 'CreateRosterService',
      useClass: CreateRosterServiceImpl
    },
    {
      provide: 'DeleteRosterService',
      useClass: DeleteRosterServiceImpl
    },
    {
      provide: 'UpdateRosterService',
      useClass: UpdateRosterServiceImpl
    },
    {
      provide: 'ConnectRosterService',
      useClass: ConnectRosterServiceImpl
    },
    {
      provide: 'RosterService',
      useClass: RosterServiceImpl
    }
  ],
  exports: [
    {
      provide: 'RosterService',
      useClass: RosterServiceImpl
    }
  ]
})
export class RosterModule {}
