import type { Record } from '@prisma/client'
import type { CreateRecordDTO } from '../dto/create-record.dto'

/**
 * 경기 기록 생성과 관련된 서비스 인터페이스
 * @template T - 'Record'타입을 확장하는 제네릭 타입
 */
export interface CreateRecordService<T extends Record> {
  /**
   * 기록을 생성하고 생성된 기록을 반환합니다
   *
   * @param {number} rosterId - 기록 대상이 되는 로스터의 Id
   * @param {number} gameId - 기록 대상이 되는 경기의 Id
   * @param {CreateRecordDTO} recordDTO - 생성할 기록 정보가 담긴 객체
   * @returns {Promise<T>} 생성된 기록
   * @throws {EntityNotExistException} 존재하지 않는 로스터 또는 경기의 Id를 전달할 경우 발생
   * @throws {UnprocessableDataException} 해당 경기에 참여한 팀 또는 리그에 소속된 로스터가 아닌 로스터의 Id를 전달할 경우 발생
   */
  createRecord(
    rosterId: number,
    gameId: number,
    recordDTO: CreateRecordDTO
  ): Promise<T>
}
