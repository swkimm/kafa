import type { TeamLeague } from '@prisma/client'

/**
 * 팀과 리그의 연결 정보를 조회하는 서비스 인터페이스
 * @template T - 'TeamLeague'를 확장하는 제네릭 타입
 */
export interface GetTeamLeagueService<T extends TeamLeague> {
  /**
   * 팀과 리그의 연결 정보를 반환합니다.
   *
   * @param {number} teamId - 연결 정보를 조회할 팀의 Id
   * @param {number} leagueId - 연결 정보를 조회할 리그의 Id
   * @returns {T} 팀과 리그의 연결 정보
   * @throws {EntityNotExistException} 해당하는 연결 정보가 없을 경우 발생
   */
  getTeamLeague(teamId: number, leagueId: number): Promise<T>

  /**
   * 특정 리그의 팀과 리그 연결 정보 목록을 반환합니다.
   *
   * @param {number} leagueId - 조회할 리그의 Id
   * @param {string} [option='Approved'] - 조회할 연결 정보의 리그 등록 승인 상태
   * @returns {Promise<T[]>} 해당 리그의 팀과 리그의 연결 정보 목록
   * @throws {EntityNotExistException} 존재하지 않는 리그의 Id를 전달한 경우 발생
   * @throws {ParamterValidationException} 유효하지 않은 옵션 값을 전달할 경우 발생
   */
  getTeamLeaguesByLeagueId(leagueId: number, option?: string): Promise<T[]>

  /**
   * 특정 팀의 팀과 리그 연결 정보 목록을 반환합니다.
   *
   * @param {number} teamId - 조회할 팀의 Ids
   * @param {string} [option='Approved'] - 조회할 연결 정보의 리그 등록 승인 상태
   * @returns {Promise<T[]>} 해당 팀의 팀과 리그의 연결 정보 목록
   * @throws {EntityNotExistException} 존재하지 않는 팀의 Id를 전달한 경우 발생
   * @throws {ParamterValidationException} 유효하지 않은 옵션 값을 전달할 경우 발생
   */
  getTeamLeaguesByTeamId(teamId: number, option?: string): Promise<T[]>
}
