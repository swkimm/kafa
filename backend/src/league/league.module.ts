import { Module } from '@nestjs/common'
import { AssociationModule } from '@/association/association.module'
import { LeagueSponserModule } from '@/league-sponser/league-sponser.module'
import { SponserModule } from '@/sponser/sponser.module'
import { AdminLeagueController } from './admin-league.controller'
import { LeagueController } from './league.controller'
import { CreateLeagueServiceImpl } from './service/create-league.service'
import { DeleteLeagueServiceImpl } from './service/delete-league.service'
import { GetLeagueServiceImpl } from './service/get-league.service'
import { LeagueServiceImpl } from './service/league.service'
import { UpdateLeagueServiceImpl } from './service/update-league.service'

@Module({
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
      provide: 'LeagueService',
      useClass: LeagueServiceImpl
    }
  ],
  imports: [AssociationModule, LeagueSponserModule, SponserModule]
})
export class LeagueModule {}
