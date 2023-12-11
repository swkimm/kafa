import type { Sponser } from '@prisma/client'

/**
 * 스폰서 삭제와 관련된 서비스 인터페이스
 * @templage T - Sponser 타입을 확장하는 제네릭 타입
 */
export interface DeleteSponserService<T extends Sponser> {
  /**
   * 스폰서를 삭제하고 삭제된 스폰서를 반환합니다.
   *
   * @param {number} sponserId - 삭제할 스폰서 Id
   * @returns {T} 삭제된 스폰서
   * @throws {EntityNotExistException} 존재하지 않는 스폰서의 Id를 전달한 경우 발생
   */
  deleteSponser(sponserId: number): Promise<T>
}
