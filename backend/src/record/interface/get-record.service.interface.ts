import type { RecordDTO } from '../dto/record.dto'

/**
 * 경기 기록 조회와 관련된 서비스 인터페이스
 */
export interface GetRecordService {
  /**
   * 경기 기록을 반환합니다
   *
   * @param {number} gameId - 조회할 경기의 Id
   * @returns {Promise<RecordDTO[]>} 경기 기록
   * @throws {EntityNotExistException} 존재하지 않는 경기의 Id를 전달할 경우 발생
   */
  getGameRecords(gameId: number): Promise<RecordDTO[]>

  /**
   * 리그의 경기 기록을 반환합니다
   *
   * @param {number} leagueId - 조회할 리그의 Id
   * @returns {Promise<RecordDTO[]>} 경기 기록
   * @throws {EntityNotExistException} 존재하지 않는 리그의 Id를 전달할 경우 발생
   */
  getLeagueRecords(leagueId: number): Promise<RecordDTO[]>

  /**
   * 개인의 경기 기록을 반환합니다
   *
   * @param {number} rosterId - 조회할 로스터의 Id
   * @returns {Promise<RecordDTO[]>} 경기 기록
   * @throws {EntityNotExistException} 존재하지 않는 로스터의 Id를 전달할 경우 발생
   * @throws {UnprocessableDataException} 선수 로스터가 아닌 로스터에 해당 요청을 보낼 경우 발생
   */
  getPersonalRecords(rosterId: number): Promise<RecordDTO[]>
}
