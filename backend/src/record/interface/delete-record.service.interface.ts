import type { Record } from '@prisma/client'

/**
 * 경기 기록 삭제와 관련된 서비스 인터페이스
 * @template T 'Record'타입을 확장하는 제네릭 타입
 */
export interface DeleteRecordService<T extends Record> {
  /**
   * 경기 기록을 삭제하고 삭제된 기록을 반환합니다
   *
   * @param {number} recordId - 삭제할 기록의 Id
   * @returns {Promise<T>} 삭제된 기록
   * @throws {EntityNotExistException} 존재하지 않는 기록의 Id를 전달할 경우 발생
   */
  deleteRecord(recordId: number): Promise<T>
}
