import type { Roster } from '@prisma/client'
import type { CreateRosterDTO } from '../dto/create-roster.dto'

/**
 * 로스터 생성과 관련된 서비스 인터페이스
 * @template T 'Roster' 타입을 확장하는 제네릭 타입
 */
export interface CreateRosterService<T extends Roster> {
  /**
   * 로스터 및 선수 정보를 생성하고 생성된 로스터 정보를 반환합니다
   *
   * @param {CreateRosterDTO} rosterDTO - 생성할 로스터 정보가 담긴 객체
   * @param {number} accountId - 로스터 생성을 요청하는 계정의 Id
   * @returns {Promise<T>} 생성된 로스터 정보
   * @throws {ParameterValidationException} 로스터 정보 객체에 유효하지 않은 값이 있을 경우 발생
   * @throws {EntityNotExistException} 존재하지 않는 팀의 Id를 전달할 경우 발생
   * @throws {ForbiddenAccessException} 매니저 계정으로 요청시 현재 계정과 일치하지 않는 팀의 로스터를 생성하려는 경우 발생
   */
  createRoster(rosterDTO: CreateRosterDTO, accountId: number): Promise<T>
}
