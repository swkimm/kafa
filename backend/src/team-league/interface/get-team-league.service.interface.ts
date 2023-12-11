import type { TeamLeague } from '@prisma/client'

/**
 * 팀과 리그의 연결 정보를 조회하는 서비스 인터페이스
 * @template T - 'TeamLeague'를 확장하는 제네릭 타입
 */
export interface GetTeamLeagueService<T extends TeamLeague> {
  /**
   * 특정 리그의 팀과 리그 연결 정보 목록을 반환합니다.
   *
   * @param {number} leagueId - 조회할 리그의 Id
   * @returns {Promise<T[]>} 해당 리그의 팀과 리그의 연결 정보 목록
   * @throws {EntityNotExistException} 존재하지 않는 리그의 Id를 전달한 경우 발생
   */
  getTeamLeaguesByLeagueId(leagueId: number): Promise<T[]>

  /**
   * 특정 팀의 팀과 리그 연결 정보 목록을 반환합니다.
   *
   * @param {number} teamId - 조회할 팀의 Id
   * @returns {Promise<T[]>} 해당 팀의 팀과 리그의 연결 정보 목록
   * @throws {EntityNotExistException} 존재하지 않는 팀의 Id를 전달한 경우 발생
   */
  getTeamLeaguesByTeamId(teamId: number): Promise<T[]>
}
