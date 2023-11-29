import type { UpdateTeamLeagueDTO } from '../dto/updateTeamLeague.dto'
import type { GetTeamLeagueService } from '../interface/get-team-league.service.interface'
import type { RegisterTeamLeagueService } from '../interface/register-team-league.service.interface'
import type { UpdateTeamLeagueService } from '../interface/update-team-league.service.interface'

export abstract class TeamLeagueService<T>
  implements
    GetTeamLeagueService<T>,
    RegisterTeamLeagueService<T>,
    UpdateTeamLeagueService<T>
{
  abstract getTeamLeaguesByLeagueId(leagueId: number): Promise<T[]>

  abstract getTeamLeaguesByTeamId(teamId: number): Promise<T[]>

  abstract registerTeamLeague(teamId: number, leagueId: number): Promise<T>

  abstract updateTeamLeague(teamLeagueDTO: UpdateTeamLeagueDTO): Promise<T>
}
