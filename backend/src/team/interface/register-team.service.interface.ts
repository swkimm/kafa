import type { RegisterTeamRequestDTO } from '../dto/register-team-request.dto'

export interface RegisterTeamService<T, U> {
  registerTeam(teamDTO: Partial<T>): Promise<T>
  createRegisterTeamRequest(requestTeamDTO: RegisterTeamRequestDTO): Promise<U>
}
