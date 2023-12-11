import type { Association } from '@prisma/client'

/**
 * 협회 조회와 관련된 서비스 모음
 * @templage T - 'Association' 타입을 확장하는 제네릭 타입
 */
export interface GetAssociationService<T extends Association> {
  /**
   * 특정 협회 정보를 반환합니다.
   *
   * @param {number} associationId - 조회할 협회의 Id
   * @returns {Promise<T>} 조회한 협회 정보
   * @throws {EntityNotExistException} 존재하지 않는 협회의 Id 값을 전달한경우 발생
   */
  getAssociation(associationId: number): Promise<T>

  /**
   * 협회 목록을 불러옵니다.
   * offset based pagination을 적용해야 합니다.
   *
   * @param {number} page - 조회할 페이지
   * @param {number} [limit=10] - 한 번에 불러올 협회의 수
   * @returns {Promise<T[]>} 협회 목록
   */
  getAssociations(page: number, limit?: number): Promise<T[]>
}
