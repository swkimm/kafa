import type { Record } from '@prisma/client'
import type { UpdateRecordDTO } from '../dto/update-record.dto'

/**
 * 경기 기록 업데이트와 관련된 서비스 인터페이스
 * @template T - 'Record'타입을 확장하는 제네릭 타입
 */
export interface UpdateRecordService<T extends Record> {
  /**
   * 경기 기록을 수정하고 수정된 기록을 반환합니다
   *
   * @param recordId - 수정할 기록의 Id
   * @param recordDTO - 수정할 기록 정보가 담긴 객체
   * @returns {Promise<T>} 수정된 기록
   * @throws {EntityNotExistException} 존재하지 않는 기록의 Id를 전달할 경우 발생
   */
  updateRecord(recordId: number, recordDTO: UpdateRecordDTO): Promise<T>
}
