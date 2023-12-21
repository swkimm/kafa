import type { Sponser } from '@prisma/client'

/**
 * 스폰서 조회와 관련된 서비스 인터페이스
 * @template T - Sponser 타입을 확장하는 제네릭 타입
 */
export interface GetSponserService<T extends Sponser> {
  /**
   * 스폰서를 반환합니다.
   *
   * @param {number} sponserId - 조회할 스폰서 Id
   * @returns {T} 스폰서
   * @throws {EntityNotExistException} 존재하지 않는 스폰서의 Id를 전달한 경우 발생
   */
  getSponser(sponserId: number): Promise<T>

  /**
   * 스폰서 목록을 반환합니다.
   * offset based pagination
   *
   * @param {number} page - 페이지 번호
   * @param {number} limit - 한 번에 불러올 스폰서 수
   * @returns {T[]} 스폰서 목록
   */
  getSponsers(page: number, limit?: number): Promise<T[]>
}
