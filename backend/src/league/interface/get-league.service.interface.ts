import type { League, Sponser } from '@prisma/client'
import type { LeagueWithAssociationDTO } from '../dto/league-with-association.dto'

/**
 * 리그 정보 조회와 관련된 서비스 모음
 * @template T - 'League' 타입을 확장하는 제네릭 타입
 */
export interface GetLeagueService<T extends League, V extends Sponser> {
  /**
   * 리그 정보를 반환합니다.
   *
   * @param {number} leagueId
   * @returns {Promise<T>}
   * @throws {EntityNotExistException} 존재하지 않는 리그의 Id를 전달할 경우 발생
   */
  getLeague(leagueId: number): Promise<T>

  /**
   * 리그 목록을 반환합니다.
   *
   * @param {number} page 불러올 페이지
   * @param {number} [limit=10] 한 번에 불러올 리그 수
   * @returns {Promise<T[]>} 리그 목록
   */
  getLeagues(page: number, limit?: number): Promise<T[]>

  /**
   * 특정 연도의 리그 목록을 반환합니다.
   *
   * @param {number} year 조회할 연도
   * @param {number} page 조회할 페이지
   * @param {number} [limit=10] 한 번에 불러올 리그 수
   * @returns {LeagueWithAssociationDTO[]} 리그 목록
   */
  getLeaguesByYear(
    year: number,
    page: number,
    limit?: number
  ): Promise<LeagueWithAssociationDTO[]>

  /**
   * 특정 협회의 리그 목록을 반환합니다.
   *
   * @param {number} associationId 리그 목록을 조회할 협회의 Id
   * @param {number} page 불러올 페이지
   * @param {number} [limit=10] 페이지당 불러올 리그의 수
   * @returns {Promise<T[]>} 특정 협회의 리그 목록
   * @throws {EntityNotExistException} 존재하지 않는 협회의 Id를 전달할 경우 발생
   */
  getLeaguesByAssociationId(
    associationId: number,
    page: number,
    limit?: number
  ): Promise<T[]>

  /**
   * 특정 리그의 스폰서 목록을 반환합니다.
   *
   * @param {number} leagueId 스폰서 목록을 조회할 리그의 Id
   * @param {number} page 불러올 페이지
   * @param {number} [limit=10] 페이지당 불러올 리그의 수
   * @returns {V[]} 특정 리그의 스폰서 목록
   * @throws {EntityNotExistException} 존재하지 않는 리그의 Id를 전달할 경우 발생
   */
  getSponsersByLeagueId(
    leagueId: number,
    page: number,
    limit?: number
  ): Promise<V[]>
}
