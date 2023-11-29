export interface DeleteTeamService<T> {
  deleteTeam(teamId: number): Promise<T>
}
