import type { Roster } from '@prisma/client'
import type { UpdateRosterDTO } from '../dto/update-roster.dto'

/**
 * 로스터 업데이트와 관련된 서비스 인터페이스
 * @template T 'Roster' 타입을 확장하는 제네릭 타입
 */
export interface UpdateRosterService<T extends Roster> {
  /**
   * 로스터의 정보를 변경하고 변경된 로스터를 반환합니다.
   *
   * @param {number} rosterDTO - 변경할 로스터 정보가 담긴 객체
   * @param {number} rosterId - 변경할 로스터의 Id
   * @param {number} accountId - 변경을 요청하는 계정의 Id
   * @returns {Promise<T>} 변경된 로스터
   * @throws {EntityNotExistException} 존재하지 않는 로스터의 Id를 전달할 경우 발생
   * @throws {ForbiddenAccessException} 매니저 계정으로 요청시 다른 로스터에 해당 요청을 보낼 경우 발생
   * @throws {ParameterValidationException} 변경할 로스터 정보 객체에 유효하지 않은 값 또는 누락된 값이 있을 경우 발생
   */
  updateRoster(
    rosterDTO: UpdateRosterDTO,
    rosterId: number,
    accountId: number
  ): Promise<T>
}
