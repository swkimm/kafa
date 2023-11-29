export interface UpdateTeamService<T, U> {
  updateTeamProfile(teamDTO: Partial<T>, teamId: number): Promise<T>

  approveRegisterTeamRequest(requestId: number): Promise<T>

  rejectRegisterTeamRequest(requestId: number, reason: string): Promise<U>
}
