import type { Roster } from '@prisma/client'

/**
 * 로스터 삭제와 관련된 서비스 인터페이스
 * @template T 'Roster' 타입을 확장하는 제네릭 타입
 */
export interface DeleteRosterService<T extends Roster> {
  /**
   * 로스터를 삭제하고 삭제된 로스터 정보를 반환합니다.
   * @param {number} rosterId - 삭제할 로스터의 Id
   * @param {number} accountId - 삭제를 요청하는 계정의 Id
   * @returns {Promise<T>} 삭제된 로스터 정보
   * @throws {EntityNotExistException} 존재하지 않는 로스터의 Id를 전달할 경우 발생
   * @throws {ForbiddenAccessException} 매니저 계정으로 자신의 팀이 아닌 다른 팀 로스터에 해당 요청을 보낼 경우 발생
   */
  deleteRoster(rosterId: number, accountId: number): Promise<T>
}
