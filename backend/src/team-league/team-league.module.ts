import { Module } from '@nestjs/common'
import { GetTeamLeagueServiceImpl } from './service/get-team-league.service'
import { RegisterTeamLeagueServiceImpl } from './service/register-team-league.service'
import { TeamLeagueServiceImpl } from './service/team-league.service'
import { UpdateTeamLeagueServiceImpl } from './service/update-team-league.service'

@Module({
  providers: [
    {
      provide: 'GetTeamLeagueService',
      useClass: GetTeamLeagueServiceImpl
    },
    {
      provide: 'RegisterTeamLeagueService',
      useClass: RegisterTeamLeagueServiceImpl
    },
    {
      provide: 'UpdateTeamLeagueService',
      useClass: UpdateTeamLeagueServiceImpl
    },
    {
      provide: 'TeamLeagueService',
      useClass: TeamLeagueServiceImpl
    }
  ],
  exports: [
    {
      provide: 'TeamLeagueService',
      useClass: TeamLeagueServiceImpl
    }
  ]
})
export class TeamLeagueModule {}
