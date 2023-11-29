import type { RegisterTeamRequestDTO } from '../dto/register-team-request.dto'
import type { TeamManyDTO } from '../dto/team-many.dto'

export abstract class TeamService<T, U, V> {
  abstract registerTeam(teamDTO: Partial<T>): Promise<T>

  abstract createRegisterTeamRequest(
    requestTeamDTO: RegisterTeamRequestDTO
  ): Promise<V>

  abstract deleteTeam(teamId: number): Promise<U>

  abstract updateTeamProfile(teamDTO: Partial<T>, teamId: number): Promise<T>

  abstract approveRegisterTeamRequest(requestId: number): Promise<T>

  abstract rejectRegisterTeamRequest(
    requestId: number,
    reason: string
  ): Promise<V>

  abstract getTeam(teamId: number): Promise<T>

  abstract getTeams(
    page: number,
    limit?: number,
    option?: string
  ): Promise<TeamManyDTO[]>

  abstract getAssociationTeams(associationId: number): Promise<T[]>

  abstract getLeagueTeams(leagueId: number): Promise<T[]>

  abstract getAccountRegisterTeamRequests(accountId: number): Promise<V[]>

  abstract getRegisterTeamRequests(
    limit?: number,
    cursor?: number,
    option?: string
  ): Promise<V[]>
}
