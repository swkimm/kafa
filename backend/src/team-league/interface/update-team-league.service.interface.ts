import type { UpdateTeamLeagueDTO } from '../dto/updateTeamLeague.dto'

export interface UpdateTeamLeagueService<T> {
  updateTeamLeague(teamLeagueDTO: UpdateTeamLeagueDTO): Promise<T>
}
