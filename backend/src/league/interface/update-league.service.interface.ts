import type { League } from '@prisma/client'
import type { UpdateLeagueDTO } from '../dto/update-league.dto'

/**
 * 리그 정보 수정과 관련된 서비스 모음
 * @templage T - 'League' 타입을 확장하는 제네릭 타입
 */
export interface UpdateLeagueService<T extends League> {
  /**
   * 리그 정보를 업데이트 하고 변경된 리그를 반환합니다.
   *
   * @param {number} leagueId - 정보를 변경할 리그의 Id
   * @param {Partial<T>} leagueDTO - 업데이트할 리그의 정보를 담은 객체
   * @returns {Promise<T>} 업데이트 리그 정보
   * @throws {EntityNotExistException} 존재하지 않는 리그 Id를 전달한 경우 발생
   * @throws {ParameterValidationException} 리그 시작 날짜와 종료 날짜를 잘못 전달한 경우 발생
   */
  updateLeague(leagueId: number, leagueDTO: UpdateLeagueDTO): Promise<T>

  /**
   * 리그에 스폰서를 연결 합니다.
   *
   * @param {number} leagueId - 스폰서를 연결할 리그의 Id
   * @param {number} sponserId - 연결할 스폰서의 Id
   * @returns {void}
   * @throws {EntityNotExistException} 존재하지않는 스폰서 Id 또는 리그의 Id를 전달한 경우
   * @throws {ConflictFoundException} 이미 연결되어있는 스폰서의 Id를 전달한 경우
   */
  linkSponser(leagueId: number, sponserId: number): Promise<void>

  /**
   * 리그에 연결된 스폰서를 연결 해제합니다.
   *
   * @param {number} leagueId - 스폰서를 연결할 리그의 Id
   * @param {number} sponserId - 연결할 스폰서의 Id
   * @returns {void}
   * @throws {EntityNotExistException} 존재하지않는 스폰서 Id 또는 리그의 Id를 전달한 경우
   */
  unlinkSponser(leagueId: number, sponserId: number): Promise<void>
}
