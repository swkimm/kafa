/**
 * 팀 삭제와 관련된 서비스 인터페이스
 * @template T = '{ result: string }'을 확장하는 제네릭 타입
 */
export interface DeleteTeamService<T extends { result: string }> {
  /**
   * 팀을 삭제하고 삭제 결과를 반환합니다.
   * soft delete
   *
   * @param {number} teamId
   * @returns {Promise<T>} 팀 삭제 결과
   * @throws {EntityNotExistException} 존재하지 않는 팀 Id를 전달할 경우 발생
   */
  deleteTeam(teamId: number): Promise<T>
}
