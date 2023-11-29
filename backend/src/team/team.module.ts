import { Module } from '@nestjs/common'
import { AccountModule } from '@/account/account.module'
import { AssociationModule } from '@/association/association.module'
import { TeamLeagueModule } from '@/team-league/team-league.module'
import { AdminTeamController } from './admin-team.controller'
import { DeleteTeamServiceImpl } from './service/delete-team.service'
import { GetTeamServiceImpl } from './service/get-team.service'
import { RegisterTeamServiceImpl } from './service/register-team.service'
import { TeamServiceImpl } from './service/team.service'
import { UpdateTeamServiceImpl } from './service/update-team.service'
import { TeamController } from './team.controller'

@Module({
  imports: [TeamLeagueModule, AccountModule, AssociationModule],
  controllers: [TeamController, AdminTeamController],
  providers: [
    { provide: 'DeleteTeamService', useClass: DeleteTeamServiceImpl },
    { provide: 'RegisterTeamService', useClass: RegisterTeamServiceImpl },
    { provide: 'UpdateTeamService', useClass: UpdateTeamServiceImpl },
    { provide: 'GetTeamService', useClass: GetTeamServiceImpl },
    { provide: 'TeamService', useClass: TeamServiceImpl }
  ]
})
export class TeamModule {}
