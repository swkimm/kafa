import type { League } from '@prisma/client'

/**
 * 리그 삭제와 관련된 서비스 모음
 * @template T - 'League' 타입을 확장하는 제네릭 타입
 */
export interface DeleteLeagueService<T extends League> {
  /**
   * 특정 리그를 삭제하고 삭제된 리그 정보를 반환합니다.
   *
   * @param {number} leagueId - 삭제할 리그의 Id
   * @returns {T} 삭제된 리그 정보
   * @throws {EntityNotExistException} 존재하지 않는 리그의 Id를 전달할 경우 발생
   */
  deleteLeague(leagueId: number): Promise<T>
}
