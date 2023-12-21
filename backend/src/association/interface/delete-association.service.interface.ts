/**
 * 협회 삭제외 관련된 서비스 모음
 * @template T - 'Association' 타입을 확장하는 제네릭 타입
 */
export interface DeleteAssociationService<T> {
  /**
   * 협회를 삭제하고 삭제된 협회의 정보를 반환합니다.
   *
   * @param {number} associationId - 삭제할 협회의 Id
   * @returns {Promise<T>} 삭제한 협회 정보
   * @throws {EntityNotExistException} 존재하지 않는 협회 Id를 전달할 경우 발생
   */
  deleteAssociation(associationId: number): Promise<T>
}
